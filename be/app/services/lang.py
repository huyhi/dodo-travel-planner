from langchain_core.messages import AIMessage
from langchain_openai import ChatOpenAI

from app.config import ModelConfig


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

    async def streaming_chat(self, prompt: str):
        try:
            async for chunk in self.model.astream(prompt):
                if isinstance(chunk, AIMessage) and chunk.content:
                    print(f"Streaming chunk: {chunk.content}")
                    yield f"data: {chunk.content}\n\n"
            
            # 发送结束标记
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"


lang_chain_service = LangChainService()
