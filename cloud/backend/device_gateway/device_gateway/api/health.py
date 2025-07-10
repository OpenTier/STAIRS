from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def get_robot_status():
    return {"condition": "ok"}
