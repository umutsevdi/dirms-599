from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_current_admin_user, get_db
from app.db.models import Employee
from app.schemas.schemas import (
    PeopleReportCreate,
    PeopleReportUpdate,
    PeopleReportResponse,
    SuccessResponse,
)
from app.services.people_report_service import PeopleReportService

router = APIRouter(prefix="/people-reports", tags=["People Reports"])


@router.get("", response_model=list[PeopleReportResponse])
def list_people_reports(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    return PeopleReportService.list_reports(db)


@router.get("/{report_id}", response_model=PeopleReportResponse)
def get_people_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    report = PeopleReportService.get_report(db, report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="People report not found",
        )
    return report


@router.post("", response_model=PeopleReportResponse, status_code=status.HTTP_201_CREATED)
def create_people_report(
    data: PeopleReportCreate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    report = PeopleReportService.create_report(db, data.model_dump())
    return report


@router.patch("/{report_id}", response_model=PeopleReportResponse)
def update_people_report(
    report_id: str,
    data: PeopleReportUpdate,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user),
):
    updated = PeopleReportService.update_report(
        db, report_id, data.model_dump(exclude_unset=True)
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="People report not found",
        )
    return updated


@router.delete("/{report_id}", response_model=SuccessResponse)
def delete_people_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_admin_user),
):
    success = PeopleReportService.delete_report(db, report_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="People report not found",
        )
    return SuccessResponse(success=True, message="People report deleted")
