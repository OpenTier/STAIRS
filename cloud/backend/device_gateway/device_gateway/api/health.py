from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def get_status():
    return {"condition": "ok"}
