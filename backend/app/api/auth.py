from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, get_db
from app.schemas.schemas import (
    MagicLinkRequest,
    MagicLinkResponse,
    MagicLinkVerify,
    LoginResponse,
    CurrentUserResponse,
    SuccessResponse,
    EntityResponse,
)
from app.services.auth_service import AuthService
from app.db.models import Employee

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/magic-link", response_model=MagicLinkResponse)
def request_magic_link(
    data: MagicLinkRequest, db: Session = Depends(get_db)
) -> MagicLinkResponse:
    result = AuthService.request_magic_link(db, data)

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=result["message"]
        )

    return MagicLinkResponse(
        success=True, message=result["message"], token=result.get("token")
    )


@router.post("/verify", response_model=LoginResponse)
def verify_magic_link(
    data: MagicLinkVerify, db: Session = Depends(get_db)
) -> LoginResponse:
    result = AuthService.verify_magic_link(db, data)

    if not result.success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.error or "Failed to verify magic link",
        )

    return result


@router.get("/session", response_model=CurrentUserResponse)
def get_current_session(
    current_user: Employee = Depends(get_current_user),
) -> CurrentUserResponse:
    return CurrentUserResponse(
        id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        role=current_user.role,
        entity=EntityResponse.model_validate(current_user.entity),
    )


@router.post("/logout", response_model=SuccessResponse)
def logout(
    authorization: str = Header(...), db: Session = Depends(get_db)
) -> SuccessResponse:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid authorization header",
        )

    success = AuthService.logout(db, token)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Session not found"
        )

    return SuccessResponse(success=True, message="Successfully logged out")
