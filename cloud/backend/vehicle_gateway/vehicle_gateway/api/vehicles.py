from fastapi import APIRouter, HTTPException
from vehicle_gateway.twin.twin_service import TwinService
from enum import Enum
from pydantic import BaseModel
import logging

# Create a new FastAPI router
router = APIRouter()

# Instantiate TwinService
twin_service = TwinService()

# Initialize logger
logger = logging.getLogger(__name__)


class VehicleType(str, Enum):
    REAL = "real"
    SIMULATED = "simulated"


class VehicleProvisionRequest(BaseModel):
    type: VehicleType
    entity_id: int
    vin: str


# Route to provision a new vehicle
@router.post("/vehicle")
async def provision_vehicle(request: VehicleProvisionRequest):
    entity_id = request.entity_id
    type = request.type
    vin = request.vin

    try:
        simulated = type == VehicleType.SIMULATED
        # Call the provision_vehicle function from TwinService
        vehicle_id = await twin_service.provision_vehicle(entity_id, simulated, vin)

        # Handle the response and provide feedback
        if vehicle_id:
            return {
                "message": "Vehicle provisioned successfully",
                "entity_id": entity_id,
                "vehicle_id": vehicle_id,
            }
        else:
            logger.info(
                f"Vehicle with entity_id {entity_id}"
                f" already exists or provisioning failed."
            )
            raise HTTPException(
                status_code=400, detail="Vehicle already exists or provisioning failed."
            )

    except HTTPException as e:
        logger.error(f"HTTPException occurred while provisioning vehicle: {str(e)}")
        raise e  # Re-raise the HTTPException to be handled by FastAPI

    except Exception as e:
        logger.error(
            f"Unexpected error while provisioning vehicle "
            f"with entity_id {entity_id}: {str(e)}"
        )
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while provisioning the vehicle.",
        )


@router.post("/vehicle/{entity_id}/activate")
async def reprovision_vehicle(entity_id: str):
    return {"vehicle_id": entity_id, "status": "activated"}


@router.post("/vehicle/{entity_id}/deactivate")
async def deprovision_vehicle(entity_id: str):
    return {"vehicle_id": entity_id, "status": "deactivated"}


# Routes to activate / deactivate a vehicle
@router.get("/vehicles/")
async def list_vehicles():
    vehicles = await twin_service.list_vehicles()
    return {"status": "Vehicle added", "vehicles": vehicles}


# Route to lock the vehicle
@router.post("/vehicle/{entity_id}/lock")
async def lock_vehicle(entity_id: int):
    result = await twin_service.lock_unlock_vehicle(entity_id, True)
    if result:
        return {"status": "Vehicle locked successfully", "entity_id": entity_id}
    raise HTTPException(status_code=500, detail="Failed to lock vehicle")


# Route to unlock the vehicle
@router.post("/vehicle/{entity_id}/unlock")
async def unlock_vehicle(entity_id: int):
    # return {"status": "Vehicle unlocked successfully", "vehicle_id": vehicle_id}
    result = await twin_service.lock_unlock_vehicle(entity_id, False)
    if result:
        return {"status": "Vehicle unlocked successfully", "entity_id": entity_id}
    raise HTTPException(status_code=500, detail="Failed to unlock vehicle")


# Route to turn the horn on/off
@router.post("/vehicle/{entity_id}/horn")
async def horn_control(entity_id: int, on: bool):
    result = await twin_service.horn_turn_on_off(entity_id, on)
    if result:
        return {"status": f"Horn turned {'on' if on else 'off'} successfully"}
    raise HTTPException(status_code=500, detail="Failed to control the horn")


# Route to turn the lights on/off
@router.post("/vehicle/{entity_id}/lights")
async def lights_control(entity_id: int, on: bool):
    result = await twin_service.lights_turn_on_off(entity_id, on)
    if result:
        return {"status": f"Lights turned {'on' if on else 'off'} successfully"}
    raise HTTPException(status_code=500, detail="Failed to control the lights")
