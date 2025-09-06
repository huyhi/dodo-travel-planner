from langchain_core.messages import AIMessage
from langchain_openai import ChatOpenAI
import json
import logging

from app.config import ModelConfig

logger = logging.getLogger(__name__)


class LangChainService:
    def __init__(self):
        logger.info(f"Initializing LangChainService with model: {ModelConfig.model_name}")
        logger.debug(f"ModelConfig API key configured: {bool(ModelConfig.api_key)}")

        self.model = ChatOpenAI(
            model=ModelConfig.model_name,
            api_key=ModelConfig.api_key,
            base_url=ModelConfig.base_url,
            temperature=ModelConfig.temperature,
            max_tokens=ModelConfig.max_tokens,
            streaming=True,
        )

    async def streaming_chat(self, prompt: str):
        try:
            async for chunk in self.model.astream(prompt):
                if isinstance(chunk, AIMessage) and chunk.content:
                    data = json.dumps({
                        "text": chunk.content
                    })
                    yield f"data: {data}\n\n"
            
            # 发送结束标记
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"


lang_chain_service = LangChainService()
