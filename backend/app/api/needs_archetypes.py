from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.api.deps import get_current_user, get_current_admin_user, get_db
from app.db.models import Employee
from app.schemas.schemas import (
    NeedsArchetypeCreate,
    NeedsArchetypeUpdate,
    NeedsArchetypeResponse,
    UrgencyCalculationRequest,
    UrgencyCalculationResponse,
    SuccessResponse,
)
from app.services.archetype_service import ArchetypeService

router = APIRouter(prefix="/archetypes/needs", tags=["Needs Archetypes"])


@router.get("", response_model=list[NeedsArchetypeResponse])
def list_needs_archetypes(
    source: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    return ArchetypeService.list_needs_archetypes(
        db, source=source, search=search
    )


@router.get("/{archetype_id}", response_model=NeedsArchetypeResponse)
def get_needs_archetype(
    archetype_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    archetype = ArchetypeService.get_needs_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Needs archetype not found",
        )
    return archetype


@router.post(
    "", response_model=NeedsArchetypeResponse, status_code=status.HTTP_201_CREATED
)
def create_needs_archetype(
    data: NeedsArchetypeCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_admin_user),
):
    existing = ArchetypeService.get_needs_archetype(db, data.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Needs archetype '{data.id}' already exists",
        )

    archetype_data = data.model_dump()
    archetype_data["source"] = "user"

    try:
        archetype = ArchetypeService.create_needs_archetype(
            db, archetype_data, created_by=current_user.id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )

    return archetype


@router.patch("/{archetype_id}", response_model=NeedsArchetypeResponse)
def update_needs_archetype(
    archetype_id: str,
    data: NeedsArchetypeUpdate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_admin_user),
):
    archetype = ArchetypeService.get_needs_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Needs archetype not found",
        )

    if archetype.source.value == "system":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="System archetypes cannot be modified. Duplicate instead.",
        )

    update_data = data.model_dump(exclude_unset=True)
    updated = ArchetypeService.update_needs_archetype(db, archetype_id, update_data)
    return updated


@router.delete("/{archetype_id}", response_model=SuccessResponse)
def delete_needs_archetype(
    archetype_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_admin_user),
):
    archetype = ArchetypeService.get_needs_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Needs archetype not found",
        )

    if archetype.source.value == "system":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="System archetypes cannot be deleted",
        )

    ArchetypeService.delete_needs_archetype(db, archetype_id)
    return SuccessResponse(success=True, message="Needs archetype deleted")


@router.post(
    "/{archetype_id}/duplicate",
    response_model=NeedsArchetypeResponse,
    status_code=status.HTTP_201_CREATED,
)
def duplicate_needs_archetype(
    archetype_id: str,
    new_id: str = Query(..., description="ID for the new duplicate"),
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    existing = ArchetypeService.get_needs_archetype(db, new_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Archetype '{new_id}' already exists",
        )

    duplicated = ArchetypeService.duplicate_needs_archetype(
        db, archetype_id, new_id, created_by=current_user.id
    )
    if not duplicated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source archetype not found",
        )
    return duplicated


@router.post(
    "/{archetype_id}/calculate-urgency",
    response_model=UrgencyCalculationResponse,
)
def calculate_needs_archetype_urgency(
    archetype_id: str,
    data: UrgencyCalculationRequest,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    archetype = ArchetypeService.get_needs_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Needs archetype not found",
        )

    result = ArchetypeService.calculate_urgency(
        urgency_rules=archetype.urgency_rules,
        values=data.values,
    )
    return result
