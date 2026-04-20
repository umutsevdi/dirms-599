from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlalchemy.orm import Session
from app.db.models import Employee, MagicLinkToken, AuthSession
from app.schemas.schemas import (
    MagicLinkRequest,
    MagicLinkVerify,
    LoginResponse,
    AuthSessionResponse,
)
from app.core.security import create_access_token, generate_magic_link_token
from app.core.email import send_magic_link_email
from app.core.config import get_settings

settings = get_settings()


class AuthService:
    @staticmethod
    def request_magic_link(db: Session, data: MagicLinkRequest) -> dict:
        employee = (
            db.query(Employee)
            .filter(Employee.email == data.email.lower(), Employee.enabled == True)
            .first()
        )

        if not employee:
            return {
                "success": False,
                "message": "No account found with this email",
                "token": None,
            }

        token_str = generate_magic_link_token()
        expires_at = datetime.now(timezone.utc) + timedelta(
            hours=settings.MAGIC_LINK_EXPIRE_HOURS
        )

        magic_token = MagicLinkToken(
            token=token_str,
            email=employee.email,
            employee_id=employee.id,
            expires_at=expires_at,
            used=False,
        )

        db.add(magic_token)
        db.commit()

        send_magic_link_email(employee.email, token_str, data.base_url)

        return {
            "success": True,
            "message": "Magic link sent to your email",
            "token": token_str,
        }

    @staticmethod
    def verify_magic_link(
        db: Session, data: MagicLinkVerify, base_url: str = ""
    ) -> LoginResponse:
        magic_token = (
            db.query(MagicLinkToken).filter(MagicLinkToken.token == data.token).first()
        )

        if not magic_token:
            return LoginResponse(success=False, error="Invalid or expired link")

        if magic_token.used:
            return LoginResponse(success=False, error="This link has already been used")

        if magic_token.expires_at < datetime.now(timezone.utc):
            return LoginResponse(
                success=False, error="Link has expired. Please request a new one."
            )

        employee = (
            db.query(Employee).filter(Employee.id == magic_token.employee_id).first()
        )

        if not employee:
            return LoginResponse(success=False, error="Employee not found")

        if not employee.enabled:
            return LoginResponse(success=False, error="Account has been disabled")

        magic_token.used = True

        employee.last_login_at = datetime.now(timezone.utc)

        session_token = create_access_token(
            {
                "user_id": employee.id,
                "entity_id": employee.entity_id,
                "role": employee.role.value,
            }
        )

        expires_at = datetime.now(timezone.utc) + timedelta(
            days=settings.ACCESS_TOKEN_EXPIRE_DAYS
        )

        auth_session = AuthSession(
            token=session_token,
            user_id=employee.id,
            entity_id=employee.entity_id,
            role=employee.role,
            expires_at=expires_at,
        )

        db.add(auth_session)
        db.commit()

        return LoginResponse(
            success=True,
            session=AuthSessionResponse(
                token=session_token,
                user_id=employee.id,
                entity_id=employee.entity_id,
                role=employee.role,
                expires_at=expires_at,
            ),
        )

    @staticmethod
    def get_current_session(db: Session, token: str) -> Optional[AuthSession]:
        session = (
            db.query(AuthSession)
            .filter(
                AuthSession.token == token,
                AuthSession.expires_at > datetime.now(timezone.utc),
            )
            .first()
        )

        return session

    @staticmethod
    def get_current_user(db: Session, token: str) -> Optional[Employee]:
        session = AuthService.get_current_session(db, token)
        if not session:
            return None

        return db.query(Employee).filter(Employee.id == session.user_id).first()

    @staticmethod
    def logout(db: Session, token: str) -> bool:
        session = db.query(AuthSession).filter(AuthSession.token == token).first()
        if session:
            db.delete(session)
            db.commit()
            return True
        return False

    @staticmethod
    def cleanup_expired_tokens(db: Session) -> int:
        now = datetime.now(timezone.utc)

        expired_tokens = (
            db.query(MagicLinkToken).filter(MagicLinkToken.expires_at < now).all()
        )

        for token in expired_tokens:
            db.delete(token)

        expired_sessions = (
            db.query(AuthSession).filter(AuthSession.expires_at < now).all()
        )

        for session in expired_sessions:
            db.delete(session)

        db.commit()

        return len(expired_tokens) + len(expired_sessions)
