import os
import logging
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))

aiq_workflow_config_path = os.path.join(os.path.dirname(current_dir), "aiq_workflow.yml")

# Configure logging
def setup_logging():
    """Set up logging configuration for the application"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('app.log', encoding='utf-8')
        ]
    )
    return logging.getLogger(__name__)


class ModelConfig:
    model_name = "qwen-plus"
    api_key = os.getenv("DASHSCOPE_API_KEY")
    base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
    temperature = 0.7
    max_tokens = 2048
