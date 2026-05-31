from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.api.deps import get_current_user, get_current_admin_user, get_db
from app.db.models import Employee
from app.schemas.schemas import (
    InventoryCreate,
    InventoryUpdate,
    InventoryResponse,
    SuccessResponse,
    UrgencyCalculationResponse,
)
from app.services.inventory_service import InventoryService

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("", response_model=list[InventoryResponse])
def list_inventory(
    status_filter: Optional[str] = Query(None, alias="status"),
    archetype_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    return InventoryService.list_inventory(
        db, status=status_filter, archetype_id=archetype_id
    )


@router.get("/{inventory_id}", response_model=InventoryResponse)
def get_inventory(
    inventory_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    inventory = InventoryService.get_inventory(db, inventory_id)
    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )
    return inventory


@router.post("", response_model=InventoryResponse, status_code=status.HTTP_201_CREATED)
def create_inventory(
    data: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    try:
        inventory = InventoryService.create_inventory(db, data.model_dump())
        return inventory
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.patch("/{inventory_id}", response_model=InventoryResponse)
def update_inventory(
    inventory_id: str,
    data: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    updated = InventoryService.update_inventory(
        db, inventory_id, data.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )
    return updated


@router.delete("/{inventory_id}", response_model=SuccessResponse)
def delete_inventory(
    inventory_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_admin_user),
):
    success = InventoryService.delete_inventory(db, inventory_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )
    return SuccessResponse(success=True, message="Inventory item deleted")


@router.get(
    "/{inventory_id}/calculate-urgency",
    response_model=UrgencyCalculationResponse,
)
def calculate_inventory_urgency(
    inventory_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    result = InventoryService.calculate_inventory_urgency(db, inventory_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )
    return result
