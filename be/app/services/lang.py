import os
from langchain_core.messages import AIMessage
from langchain_openai import ChatOpenAI
import json
import logging
from ms_agent import LLMAgent
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from langchain_mcp_adapters.tools import load_mcp_tools
from langgraph.prebuilt import create_react_agent

from app.config import ModelConfig
from app.models.http_entity import TravelPlanRequest
from app.promopt.map_vis import MAP_VIS_PROMPT

logger = logging.getLogger(__name__)

class SseContentType:
    CHAT_TEXT = "chat_text"
    MAP_VIS = "map_vis"


async def lang_graph_map_vis_chat(prompt: str):
    async with streamablehttp_client(url=os.getenv("VIS_MCP_HTTP_API_KEY")) as (read, write, session_id):  
        async with ClientSession(read, write) as session:
            # 1 建立连接，初始化 session
            await session.initialize()

            # 2 获取该 MCP 服务中工具列表
            tools = await load_mcp_tools(session)
            logger.info(f"Available tools: {[tool.name for tool in tools]}") 

            # 3 构造一个 LangGraph agent 并调用工具
            agent = create_react_agent(
                ChatOpenAI(
                    model=ModelConfig.model_name,
                    api_key=ModelConfig.api_key,
                    base_url=ModelConfig.base_url,
                    temperature=ModelConfig.temperature,
                    max_tokens=ModelConfig.max_tokens,
                    streaming=True,
                ),
                tools,
            )

            chat_input = {
                "messages": [
                    {
                        "role": "user", "content": prompt
                    }
                ]
            }
            async for chunk in agent.astream(chat_input):
                agent_chunk = chunk.get('agent', {})
                if 'messages' in agent_chunk:
                    for item in agent_chunk['messages']:
                        if isinstance(item, AIMessage) and item.content:
                            data = json.dumps({
                                SseContentType.MAP_VIS: item.content
                            })
                            yield f"data: {data}\n\n"


class LangChainService:
    def __init__(self):
        self.model = ChatOpenAI(
            model=ModelConfig.model_name,
            api_key=ModelConfig.api_key,
            base_url=ModelConfig.base_url,
            temperature=ModelConfig.temperature,
            max_tokens=ModelConfig.max_tokens,
            streaming=True,
        )

        self.model_scope_agent = LLMAgent(
            mcp_config = {
                "mcpServers": {
                    "mcp-server-chart": {
                        "type": "streamable_http",
                        "url": os.getenv("VIS_MCP_HTTP_API_KEY")
                    }
                }
            }
        )

    async def streaming_chat(self, params: TravelPlanRequest, prompt: str):
        chat_all_content = ''

        try:
            async for chunk in self.model.astream(prompt):
                if isinstance(chunk, AIMessage) and chunk.content:
                    logger.info(f"line in chat: {chunk.content}")

                    data = json.dumps({
                        SseContentType.CHAT_TEXT: chunk.content
                    })
                    chat_all_content += chunk.content
                    yield f"data: {data}\n\n"

            logger.info(f"travel_plan_all_ai_resp: {chat_all_content}")

            yield "data: [CHAT_DONE]\n\n"

            # wait chat message done, 用上面的结果调用 MCP
            async for chunk in lang_graph_map_vis_chat(
                MAP_VIS_PROMPT.format(input=chat_all_content, destination=params.to_place),
            ):
                yield chunk

            # 发送结束标记
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"


lang_chain_service = LangChainService()
