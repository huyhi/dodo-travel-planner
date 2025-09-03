from pydantic import BaseModel

#
# Http Request entities
#
class TravelChatRequest(BaseModel):
    from_place: str
    to_place: str
    from_date: str
    to_date: str
    people_num: int
    others: str

#
# Http Response entities
#
