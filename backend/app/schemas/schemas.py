from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.db.models import EntityType, EmployeeRole


class EntityBase(BaseModel):
    name: str
    type: EntityType
    logo_url: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None


class EntityCreate(EntityBase):
    pass


class EntityUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None


class EntityResponse(EntityBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    role: EmployeeRole = EmployeeRole.USER


class EmployeeCreate(EmployeeBase):
    entity_id: Optional[str] = None


class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[EmployeeRole] = None
    enabled: Optional[bool] = None


class EmployeeResponse(BaseModel):
    id: str
    full_name: str
    email: str
    entity_id: str
    role: EmployeeRole
    enabled: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class MagicLinkRequest(BaseModel):
    email: EmailStr
    base_url: str = Field(
        default="http://localhost:5173", description="Frontend base URL for magic link"
    )


class MagicLinkResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None


class MagicLinkVerify(BaseModel):
    token: str


class AuthSessionResponse(BaseModel):
    token: str
    user_id: str
    entity_id: str
    role: EmployeeRole
    expires_at: datetime


class CurrentUserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    role: EmployeeRole
    entity: EntityResponse


class LoginResponse(BaseModel):
    success: bool
    session: Optional[AuthSessionResponse] = None
    error: Optional[str] = None


class SuccessResponse(BaseModel):
    success: bool
    message: str


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
