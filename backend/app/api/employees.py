from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_current_admin_user, get_db
from app.schemas.schemas import (
    EmployeeResponse,
    EmployeeCreate,
    EmployeeUpdate,
    MagicLinkResponse,
)
from app.services.entity_service import EmployeeService
from app.services.auth_service import AuthService
from app.schemas.schemas import MagicLinkRequest
from app.db.models import Employee

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=List[EmployeeResponse])
def list_employees(
    current_user: Employee = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> List[Employee]:
    return EmployeeService.list_employees_by_entity(db, current_user.entity_id)


@router.post("", response_model=MagicLinkResponse)
def add_employee(
    data: EmployeeCreate,
    current_user: Employee = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> MagicLinkResponse:
    try:
        employee_data = data.model_dump()
        employee = EmployeeService.create_employee(
            db, employee_data, current_user.entity_id
        )

        magic_request = MagicLinkRequest(
            email=employee.email, base_url="http://localhost:5173"
        )
        result = AuthService.request_magic_link(db, magic_request)

        return MagicLinkResponse(
            success=True,
            message=f"Employee {
                employee.full_name
            } added successfully. Invitation email sent.",
            token=result.get("token"),
        )

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.patch("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: str,
    data: EmployeeUpdate,
    current_user: Employee = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> EmployeeResponse:
    try:
        updated = EmployeeService.update_employee(
            db, employee_id, data.model_dump(exclude_unset=True), current_user.id
        )

        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
            )

        return EmployeeResponse.model_validate(updated)

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{employee_id}/toggle", response_model=EmployeeResponse)
def toggle_employee_status(
    employee_id: str,
    current_user: Employee = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> EmployeeResponse:
    try:
        employee = EmployeeService.toggle_employee_enabled(
            db, employee_id, current_user.id
        )

        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
            )

        return EmployeeResponse.model_validate(employee)

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
