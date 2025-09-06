from typing import Any
from pydantic import BaseModel

#
# Http Request entities
#
class TravelPlanRequest(BaseModel):
    from_place: str
    to_place: str
    from_date: str
    to_date: str
    people_num: int
    others: str

#
# Http Response entities
#
class BaseHttpResponse(BaseModel):
    code: int = 0
    message: str = ""
    data: Any = None
