"""
Travel Chat API Router
"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.http_entity import TravelChatRequest
from app.promopt.travel_plan import TRAVEL_PLAN_PROMPT
from app.services.aiq import run_workflow_stream
from app.config import aiq_workflow_config_path

router = APIRouter(
    prefix="/travel",
    tags=["travel"],
)

@router.post("/chat")
async def travel_chat(request: TravelChatRequest):

    prompt = TRAVEL_PLAN_PROMPT.format(
        from_place=request.from_place,
        to_place=request.to_place,
        from_date=request.from_date,
        to_date=request.to_date,
        people_num=request.people_num,
        others=request.others
    )

    """Stream chat response for travel planning"""
    async def generate():
        async for chunk in run_workflow_stream(
            config_file=aiq_workflow_config_path,
            input_str=prompt
        ):
            yield chunk
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Content-Type-Options": "nosniff"
        }
    )