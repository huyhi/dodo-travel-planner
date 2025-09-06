"""
Travel Chat API Router
"""

import asyncio
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from app.promopt.travel_plan import TRAVEL_PLAN_PROMPT
from app.services.flight import fetch_flight_info
from app.services.lang import lang_chain_service
from app.models.http_entity import BaseHttpResponse, TravelPlanRequest
from app.services.city import get_city_code


router = APIRouter(
    prefix="/travel",
    tags=["travel"],
)

@router.get("/chat")
async def travel_chat(params: TravelPlanRequest = Depends()):
    prompt = TRAVEL_PLAN_PROMPT.format(
        from_place=params.from_place,
        to_place=params.to_place,
        from_date=params.from_date,
        to_date=params.to_date,
        people_num=params.people_num,
        others=params.others
    )

    """Stream chat response for travel planning"""
    return StreamingResponse(
        lang_chain_service.streaming_chat(params, prompt),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control",
            "X-Accel-Buffering": "no"  # 禁用nginx缓冲
        }
    )

@router.get("/flight-search")
async def flight_search(params: TravelPlanRequest = Depends()):
    if True:
        return BaseHttpResponse(
            data=[]
        )
    
    # 并发请求两个城市代码
    from_place, to_place = await asyncio.gather(
        get_city_code(params.from_place),
        get_city_code(params.to_place)
    )

    if not from_place or not to_place:
        return BaseHttpResponse(
            code=400,
            message="Invalid city code",
        )

    flight_info = fetch_flight_info(
        from_place, 
        to_place,
        params.from_date,
        params.to_date
    )
    return BaseHttpResponse(
        data=flight_info
    )
