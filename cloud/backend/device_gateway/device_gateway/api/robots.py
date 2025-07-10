from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import logging
from device_gateway.api.devices import twin_service

router = APIRouter()

logger = logging.getLogger(__name__)


class RobotProvisionRequest(BaseModel):
    robot_id: str


class RobotKickRequest(BaseModel):
    power: float = Field(..., ge=0.0, le=1.0)


class RobotControlRequest(BaseModel):
    dx: float = Field(..., description="X velocity (m/s)")
    dy: float = Field(..., description="Y velocity (m/s)")
    dturn: float = Field(..., description="Rotation speed (rad/s)")


class RobotLedsRequest(BaseModel):
    red: int = Field(..., ge=0, le=255)
    green: int = Field(..., ge=0, le=255)
    blue: int = Field(..., ge=0, le=255)


class RobotBeepRequest(BaseModel):
    frequency: int = Field(..., gt=0)
    duration: int = Field(..., gt=0)


@router.get("/robot/{robot_id}")
async def get_robot_status(robot_id: str):
    """Get robot status and provisioning info"""
    try:
        robot_state = await twin_service.get_robot_state(robot_id)

        if robot_state:
            battery = (
                robot_state.state.Powertrain.TractionBattery.StateOfCharge.Displayed
            )
            return {
                "robot_id": robot_id,
                "provisioned": True,
                "status": {
                    "battery": battery,
                    "is_running": robot_state.state.IsMoving,
                    "timestamp": robot_state.state.StartTime,
                },
            }
        else:
            return {"robot_id": robot_id, "provisioned": False}
    except Exception as e:
        logger.error(f"Error getting robot status: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to get robot status: {str(e)}"
        )


@router.post("/robot")
async def provision_robot(request: RobotProvisionRequest):
    """Provision a new robot"""
    try:
        success = await twin_service.provision_robot(request.robot_id)
        if success:
            return {
                "message": "Robot provisioned successfully",
                "robot_id": request.robot_id,
            }
        else:
            raise HTTPException(
                status_code=400, detail="Robot already exists or provisioning failed"
            )
    except Exception as e:
        logger.error(f"Error provisioning robot: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to provision robot: {str(e)}"
        )


@router.post("/robot/{robot_id}/kick")
async def robot_kick(robot_id: str, request: RobotKickRequest):
    """Send kick command to robot"""
    try:
        success = await twin_service.robot_kick(robot_id, request.power)
        if success:
            return {"status": "Kick command sent successfully"}
        else:
            raise HTTPException(
                status_code=400, detail="Invalid robot ID or kick parameters"
            )
    except Exception as e:
        logger.error(f"Error sending kick command: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to send kick command: {str(e)}"
        )


@router.post("/robot/{robot_id}/control")
async def robot_control(robot_id: str, request: RobotControlRequest):
    """Send movement control command to robot"""
    try:
        success = await twin_service.robot_control(
            robot_id, request.dx, request.dy, request.dturn
        )
        if success:
            return {"status": "Control command sent successfully"}
        else:
            raise HTTPException(
                status_code=400, detail="Invalid robot ID or control parameters"
            )
    except Exception as e:
        logger.error(f"Error sending control command: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to send control command: {str(e)}"
        )


@router.post("/robot/{robot_id}/leds")
async def robot_leds(robot_id: str, request: RobotLedsRequest):
    """Send LED control command to robot"""
    try:
        success = await twin_service.robot_leds(
            robot_id, request.red, request.green, request.blue
        )
        if success:
            return {"status": "LED command sent successfully"}
        else:
            raise HTTPException(
                status_code=400, detail="Invalid robot ID or LED parameters"
            )
    except Exception as e:
        logger.error(f"Error sending LED command: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to send LED command: {str(e)}"
        )


@router.post("/robot/{robot_id}/beep")
async def robot_beep(robot_id: str, request: RobotBeepRequest):
    """Send beep command to robot"""
    try:
        success = await twin_service.robot_beep(
            robot_id, request.frequency, request.duration
        )
        if success:
            return {"status": "Beep command sent successfully"}
        else:
            raise HTTPException(
                status_code=400, detail="Invalid robot ID or beep parameters"
            )
    except Exception as e:
        logger.error(f"Error sending beep command: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to send beep command: {str(e)}"
        )


@router.delete("/robot/{robot_id}")
async def unprovision_robot(robot_id: str):
    """Unprovision/delete a robot"""
    try:
        success = await twin_service.unprovision_robot(robot_id)
        if success:
            return {"message": f"Robot {robot_id} unprovisioned successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"Robot {robot_id} not found")
    except Exception as e:
        logger.error(f"Error unprovisioning robot: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to unprovision robot: {str(e)}"
        )
