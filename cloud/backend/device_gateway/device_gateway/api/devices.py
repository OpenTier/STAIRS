# Copyright (c) 2025 by OpenTier GmbH
# SPDX‑FileCopyrightText: 2025 OpenTier GmbH
# SPDX‑License‑Identifier: MIT

# This file is part of OpenTier.

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

from fastapi import APIRouter, HTTPException
from device_gateway.twin.twin_service import TwinService
from pydantic import BaseModel
import logging

# Create a new FastAPI router
router = APIRouter()

# Instantiate TwinService
twin_service = TwinService()

# Initialize logger
logger = logging.getLogger(__name__)


class DeviceProvisionRequest(BaseModel):
    entity_id: int
    entity_code: str


# Route to provision a new device
@router.post("/device")
async def provision_device(request: DeviceProvisionRequest):
    entity_id = request.entity_id
    entity_code = request.entity_code

    try:
        provisioned_id = await twin_service.provision_vehicle(entity_id, entity_code)

        # Handle the response and provide feedback
        if provisioned_id:
            return {
                "message": "Device provisioned successfully",
                "entity_id": entity_id,
            }
        else:
            logger.info(
                f"Device with entity_id {entity_id}"
                f" already exists or provisioning failed."
            )
            raise HTTPException(
                status_code=400, detail="Device already exists or provisioning failed."
            )

    except HTTPException as e:
        logger.error(f"HTTPException occurred while provisioning device: {str(e)}")
        raise e  # Re-raise the HTTPException to be handled by FastAPI

    except Exception as e:
        logger.error(
            f"Unexpected error while provisioning device "
            f"with entity_id {entity_id}: {str(e)}"
        )
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while provisioning the device.",
        )


@router.post("/device/{entity_id}/activate")
async def reprovision_device(entity_id: str):
    return {"entity_id": entity_id, "status": "activated"}


@router.post("/device/{entity_id}/deactivate")
async def deprovision_device(entity_id: str):
    return {"entity_id": entity_id, "status": "deactivated"}


# Routes to activate / deactivate a device
@router.get("/device/")
async def list_devices():
    devices = await twin_service.list_vehicles()
    return {"status": "Device added", "devices": devices}


# Route to lock the device
@router.post("/device/{entity_id}/lock")
async def lock_device(entity_id: int):
    result = await twin_service.lock_unlock_vehicle(entity_id, True)
    if result:
        return {"status": "Device locked successfully", "entity_id": entity_id}
    raise HTTPException(status_code=500, detail="Failed to lock device")


# Route to unlock the device
@router.post("/device/{entity_id}/unlock")
async def unlock_device(entity_id: int):
    result = await twin_service.lock_unlock_vehicle(entity_id, False)
    if result:
        return {"status": "Device unlocked successfully", "entity_id": entity_id}
    raise HTTPException(status_code=500, detail="Failed to unlock device")


# Route to turn the horn on/off
@router.post("/device/{entity_id}/horn")
async def horn_control(entity_id: int, on: bool):
    result = await twin_service.horn_turn_on_off(entity_id, on)
    if result:
        return {"status": f"Horn turned {'on' if on else 'off'} successfully"}
    raise HTTPException(status_code=500, detail="Failed to control the horn")


# Route to turn the lights on/off
@router.post("/device/{entity_id}/lights")
async def lights_control(entity_id: int, on: bool):
    result = await twin_service.lights_turn_on_off(entity_id, on)
    if result:
        return {"status": f"Lights turned {'on' if on else 'off'} successfully"}
    raise HTTPException(status_code=500, detail="Failed to control the lights")
