from fastapi import APIRouter
from app.api.v1.endpoints import uv, protection, awareness

api_router = APIRouter()

api_router.include_router(uv.router, prefix="/uv", tags=["uv"])
api_router.include_router(protection.router, prefix="/protection", tags=["protection"])
api_router.include_router(awareness.router, prefix="/awareness", tags=["awareness"])
