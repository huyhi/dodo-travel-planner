import os

current_dir = os.path.dirname(os.path.abspath(__file__))

aiq_workflow_config_path = os.path.join(os.path.dirname(current_dir), "aiq_workflow.yml")

class ModelConfig:
    model_name = "qwen-plus"
    api_key = os.getenv("DASHSCOPE_API_KEY")
    base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
    temperature = 0.7
    max_tokens = 4096
