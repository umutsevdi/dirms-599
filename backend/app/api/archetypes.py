from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.api.deps import get_current_user, get_db
from app.db.models import Employee
from app.schemas.schemas import (
    IncidentArchetypeCreate,
    IncidentArchetypeUpdate,
    IncidentArchetypeResponse,
    InventoryArchetypeCreate,
    InventoryArchetypeUpdate,
    InventoryArchetypeResponse,
    UrgencyCalculationRequest,
    UrgencyCalculationResponse,
    SuccessResponse,
)
from app.services.archetype_service import ArchetypeService

router = APIRouter(prefix="/archetypes", tags=["Archetypes"])


# -------------------------------------------------------------------------
# List / Get
# -------------------------------------------------------------------------

@router.get("", response_model=list[dict])
def list_archetypes(
    category: Optional[str] = Query(None, description="incident, food, medical, shelter, clothing, equipment, hygiene, other"),
    source: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    results = []

    if category in (None, "incident"):
        incident_results = ArchetypeService.list_incident_archetypes(
            db, source=source, search=search
        )
        for a in incident_results:
            results.append({
                "type": "incident",
                "id": a.id,
                "name": a.name,
                "category": a.category,
                "source": a.source.value if a.source else a.source,
                "version": a.version,
                "parent_archetype_id": a.parent_archetype_id,
                "field_schema": a.field_schema or [],
            })

    if category in (None, "food", "medical", "shelter", "clothing", "equipment", "hygiene", "other"):
        inventory_results = ArchetypeService.list_inventory_archetypes(
            db, category=category if category in ("food", "medical", "shelter", "clothing", "equipment", "hygiene", "other") else None,
            source=source,
            search=search,
        )
        for a in inventory_results:
            results.append({
                "type": "inventory",
                "id": a.id,
                "name": a.name,
                "category": a.category,
                "source": a.source.value if a.source else a.source,
                "version": a.version,
                "parent_archetype_id": a.parent_archetype_id,
                "resolves_needs": a.resolves_needs or [],
                "target_demographics": a.target_demographics or [],
                "field_schema": a.field_schema or [],
            })

    return results


@router.get("/incident/{archetype_id}", response_model=IncidentArchetypeResponse)
def get_incident_archetype(
    archetype_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    archetype = ArchetypeService.get_incident_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident archetype not found",
        )
    return archetype


@router.get(
    "/inventory/{archetype_id}", response_model=InventoryArchetypeResponse
)
def get_inventory_archetype(
    archetype_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    archetype = ArchetypeService.get_inventory_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory archetype not found",
        )
    return archetype


# -------------------------------------------------------------------------
# Create
# -------------------------------------------------------------------------

@router.post(
    "/incident", response_model=IncidentArchetypeResponse, status_code=status.HTTP_201_CREATED
)
def create_incident_archetype(
    data: IncidentArchetypeCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    existing = ArchetypeService.get_incident_archetype(db, data.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Incident archetype '{data.id}' already exists",
        )

    archetype_data = data.model_dump()
    archetype_data["source"] = "user"

    try:
        archetype = ArchetypeService.create_incident_archetype(
            db, archetype_data, created_by=current_user.id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )

    return archetype


@router.post(
    "/inventory",
    response_model=InventoryArchetypeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_inventory_archetype(
    data: InventoryArchetypeCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    existing = ArchetypeService.get_inventory_archetype(db, data.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Inventory archetype '{data.id}' already exists",
        )

    archetype_data = data.model_dump()
    archetype_data["source"] = "user"

    try:
        archetype = ArchetypeService.create_inventory_archetype(
            db, archetype_data, created_by=current_user.id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )

    return archetype


# -------------------------------------------------------------------------
# Update
# -------------------------------------------------------------------------

@router.patch("/incident/{archetype_id}", response_model=IncidentArchetypeResponse)
def update_incident_archetype(
    archetype_id: str,
    data: IncidentArchetypeUpdate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    archetype = ArchetypeService.get_incident_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident archetype not found",
        )

    if archetype.source.value == "system":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="System archetypes cannot be modified. Duplicate instead.",
        )

    update_data = data.model_dump(exclude_unset=True)
    updated = ArchetypeService.update_incident_archetype(db, archetype_id, update_data)
    return updated


@router.patch("/inventory/{archetype_id}", response_model=InventoryArchetypeResponse)
def update_inventory_archetype(
    archetype_id: str,
    data: InventoryArchetypeUpdate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    archetype = ArchetypeService.get_inventory_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory archetype not found",
        )

    if archetype.source.value == "system":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="System archetypes cannot be modified. Duplicate instead.",
        )

    update_data = data.model_dump(exclude_unset=True)
    updated = ArchetypeService.update_inventory_archetype(db, archetype_id, update_data)
    return updated


# -------------------------------------------------------------------------
# Delete
# -------------------------------------------------------------------------

@router.delete("/incident/{archetype_id}", response_model=SuccessResponse)
def delete_incident_archetype(
    archetype_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    archetype = ArchetypeService.get_incident_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident archetype not found",
        )

    if archetype.source.value == "system":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="System archetypes cannot be deleted",
        )

    ArchetypeService.delete_incident_archetype(db, archetype_id)
    return SuccessResponse(success=True, message="Incident archetype deleted")


@router.delete("/inventory/{archetype_id}", response_model=SuccessResponse)
def delete_inventory_archetype(
    archetype_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    archetype = ArchetypeService.get_inventory_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory archetype not found",
        )

    if archetype.source.value == "system":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="System archetypes cannot be deleted",
        )

    ArchetypeService.delete_inventory_archetype(db, archetype_id)
    return SuccessResponse(success=True, message="Inventory archetype deleted")


# -------------------------------------------------------------------------
# Duplicate
# -------------------------------------------------------------------------

@router.post(
    "/incident/{archetype_id}/duplicate",
    response_model=IncidentArchetypeResponse,
    status_code=status.HTTP_201_CREATED,
)
def duplicate_incident_archetype(
    archetype_id: str,
    new_id: str = Query(..., description="ID for the new duplicate"),
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    existing = ArchetypeService.get_incident_archetype(db, new_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Archetype '{new_id}' already exists",
        )

    duplicated = ArchetypeService.duplicate_incident_archetype(
        db, archetype_id, new_id, created_by=current_user.id
    )
    if not duplicated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source archetype not found",
        )
    return duplicated


@router.post(
    "/inventory/{archetype_id}/duplicate",
    response_model=InventoryArchetypeResponse,
    status_code=status.HTTP_201_CREATED,
)
def duplicate_inventory_archetype(
    archetype_id: str,
    new_id: str = Query(..., description="ID for the new duplicate"),
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    existing = ArchetypeService.get_inventory_archetype(db, new_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Archetype '{new_id}' already exists",
        )

    duplicated = ArchetypeService.duplicate_inventory_archetype(
        db, archetype_id, new_id, created_by=current_user.id
    )
    if not duplicated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source archetype not found",
        )
    return duplicated


# -------------------------------------------------------------------------
# Urgency Calculation
# -------------------------------------------------------------------------

@router.post(
    "/incident/{archetype_id}/calculate-urgency",
    response_model=UrgencyCalculationResponse,
)
def calculate_incident_urgency(
    archetype_id: str,
    data: UrgencyCalculationRequest,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    archetype = ArchetypeService.get_incident_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident archetype not found",
        )

    result = ArchetypeService.calculate_urgency(
        urgency_rules=archetype.urgency_rules,
        values=data.values,
        default_urgency=archetype.default_report_urgency.value
        if archetype.default_report_urgency
        else None,
    )
    return result


@router.post(
    "/inventory/{archetype_id}/calculate-urgency",
    response_model=UrgencyCalculationResponse,
)
def calculate_inventory_urgency(
    archetype_id: str,
    data: UrgencyCalculationRequest,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    archetype = ArchetypeService.get_inventory_archetype(db, archetype_id)
    if not archetype:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory archetype not found",
        )

    result = ArchetypeService.calculate_urgency(
        urgency_rules=archetype.urgency_rules,
        values=data.values,
    )
    return result
