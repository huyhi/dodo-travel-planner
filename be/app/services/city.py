
import json
import json_repair
import logging
from app.promopt.extract_city import EXTRACT_CITY_PROMPT
from app.services.lang import lang_chain_service

logger = logging.getLogger(__name__)


async def get_city_code(city_name: str) -> str:
    """
    使用 LangChain 大模型将城市名称转换为 IATA 城市代码
    
    Args:
        city_name: 城市名称，如 "上海", "东京", "香港"
        
    Returns:
        str: IATA 城市代码，如 "SHA", "TYO", "HKG"，如果找不到则返回 None
    """
    prompt = EXTRACT_CITY_PROMPT.format(input=city_name)
    
    try:
        response_content = (await lang_chain_service.model.ainvoke(prompt)).content
        
        logger.info(f"获取城市代码响应: {response_content}")

        # 解析 JSON 响应
        try:
            # 使用 json_repair 来修复可能的 JSON 格式问题
            parsed_response = json_repair.loads(response_content)
            return parsed_response.get("code")
        except (json.JSONDecodeError, KeyError) as e:
            logger.error(f"JSON 解析错误: {e}, 原始响应: {response_content}")
            return None
            
    except Exception as e:
        logger.error(f"获取城市代码时发生错误: {e}")
        return None