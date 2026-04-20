from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import get_db
from app.services.auth_service import AuthService
from app.db.models import Employee, EmployeeRole


def get_current_user(
    authorization: Optional[str] = Header(None), db: Session = Depends(get_db)
) -> Employee:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not authorization:
        raise credentials_exception

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise credentials_exception

    user = AuthService.get_current_user(db, token)
    if not user:
        raise credentials_exception

    if not user.enabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Account has been disabled"
        )

    return user


def get_current_admin_user(
    current_user: Employee = Depends(get_current_user),
) -> Employee:
    if current_user.role != EmployeeRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can perform this action",
        )
    return current_user
