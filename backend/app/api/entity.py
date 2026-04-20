from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, get_current_admin_user, get_db
from app.schemas.schemas import EntityResponse, EntityUpdate
from app.services.entity_service import EntityService
from app.db.models import Employee

router = APIRouter(prefix="/entity", tags=["Entity"])


@router.get("", response_model=EntityResponse)
def get_current_entity(
    current_user: Employee = Depends(get_current_user),
) -> EntityResponse:
    return EntityResponse.model_validate(current_user.entity)


@router.patch("", response_model=EntityResponse)
def update_entity(
    data: EntityUpdate,
    current_user: Employee = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> EntityResponse:
    updated = EntityService.update_entity(db, current_user.entity_id, data)

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Entity not found"
        )

    return EntityResponse.model_validate(updated)
