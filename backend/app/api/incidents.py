from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.api.deps import get_current_user, get_current_admin_user, get_db
from app.db.models import Employee
from app.schemas.schemas import (
    IncidentCreate,
    IncidentUpdate,
    IncidentResponse,
    SuccessResponse,
)
from app.services.incident_service import IncidentService

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.get("", response_model=list[IncidentResponse])
def list_incidents(
    status_filter: Optional[str] = Query(None, alias="status"),
    severity: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    return IncidentService.list_incidents(
        db, status=status_filter, severity=severity, search=search
    )


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    incident = IncidentService.get_incident(db, incident_id)
    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found",
        )
    return incident


@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_incident(
    data: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    incident = IncidentService.create_incident(db, data.model_dump())
    return incident


@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_incident(
    incident_id: str,
    data: IncidentUpdate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    updated = IncidentService.update_incident(
        db, incident_id, data.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found",
        )
    return updated


@router.delete("/{incident_id}", response_model=SuccessResponse)
def delete_incident(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_admin_user),
):
    success = IncidentService.delete_incident(db, incident_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found",
        )
    return SuccessResponse(success=True, message="Incident deleted")
