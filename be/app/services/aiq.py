import asyncio
import logging
from typing import AsyncGenerator

from nat.runtime.loader import load_workflow
from nat.utils.type_utils import StrPath

logger = logging.getLogger(__name__)

async def run_workflow(config_file: StrPath, input_str: str) -> str:
    """Run workflow and return complete result"""
    async with load_workflow(config_file) as workflow:
        async with workflow.run(input_str) as runner:
            return await runner.result(to_type=str)

async def run_workflow_stream(config_file: StrPath, input_str: str) -> AsyncGenerator[str, None]:
    """Run workflow and yield streaming results"""
    async with load_workflow(config_file) as workflow:
        async with workflow.run(input_str) as runner:
            try:
                # result_stream is already an async generator that yields streaming results
                async for chunk in runner.result_stream(to_type=str):
                    yield chunk

            except ValueError as ve:
                # This happens when workflow doesn't support streaming output
                if "does not support streaming output" in str(ve):
                    logger.warning("Workflow doesn't support streaming, falling back to chunked result")
                    # Fallback to non-streaming result and chunk it
                    result = await runner.result(to_type=str)
                    # Split into smaller chunks for better streaming experience
                    chunk_size = 50  # characters per chunk
                    for i in range(0, len(result), chunk_size):
                        chunk = result[i:i + chunk_size]
                        yield chunk
                        # Small delay to simulate streaming
                        await asyncio.sleep(0.01)
                else:
                    logger.error(f"ValueError in workflow streaming: {str(ve)}")
                    yield f"ValueError: {str(ve)}"
            except Exception as e:
                logger.error(f"Exception in workflow streaming: {str(e)}")
                yield f"Error: {str(e)}"

# Example call 
# result = asyncio.run(
#     run_workflow(
#         config_file='./aiq_workflow_config.yml',
#         input_str='What is LangSmith?'
#     )
# )
# logger.info(f"Workflow result: {result}")
