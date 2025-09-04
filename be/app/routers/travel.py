"""
Travel Chat API Router
"""

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from app.promopt.travel_plan import TRAVEL_PLAN_PROMPT
from app.services.lang import lang_chain_service

router = APIRouter(
    prefix="/travel",
    tags=["travel"],
)

@router.get("/chat")
async def travel_chat(
    from_place: str = Query(..., description="出发地点"),
    to_place: str = Query(..., description="目的地"),
    from_date: str = Query(..., description="出发日期"),
    to_date: str = Query(..., description="返回日期"),
    people_num: int = Query(..., description="人数"),
    others: str = Query("", description="其他要求")
):
    prompt = TRAVEL_PLAN_PROMPT.format(
        from_place=from_place,
        to_place=to_place,
        from_date=from_date,
        to_date=to_date,
        people_num=people_num,
        others=others
    )

    """Stream chat response for travel planning"""
    return StreamingResponse(
        lang_chain_service.streaming_chat(prompt),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control",
            "X-Accel-Buffering": "no"  # 禁用nginx缓冲
        }
    )
