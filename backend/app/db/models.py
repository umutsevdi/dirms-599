import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Text, Float, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from .database import Base
import enum


class EntityType(str, enum.Enum):
    NGO = "NGO"
    UNIVERSITY = "University"
    COMPANY = "Company"
    GOVERNMENT = "Government"
    MEDIA = "Media"


class EmployeeRole(str, enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class Entity(Base):
    __tablename__ = "entities"

    id = Column(String, primary_key=True, default=lambda: f"ent-{uuid.uuid4().hex[:8]}")
    name = Column(String, nullable=False)
    type = Column(SQLEnum(EntityType), nullable=False)
    logo_url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    website = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    employees = relationship(
        "Employee", back_populates="entity", cascade="all, delete-orphan"
    )


class Employee(Base):
    __tablename__ = "employees"

    id = Column(String, primary_key=True, default=lambda: f"emp-{uuid.uuid4().hex[:8]}")
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    entity_id = Column(String, ForeignKey("entities.id"), nullable=False)
    role = Column(SQLEnum(EmployeeRole), nullable=False, default=EmployeeRole.USER)
    enabled = Column(Boolean, default=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    entity = relationship("Entity", back_populates="employees")
    magic_link_tokens = relationship(
        "MagicLinkToken", back_populates="employee", cascade="all, delete-orphan"
    )


class MagicLinkToken(Base):
    __tablename__ = "magic_link_tokens"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    token = Column(String, nullable=False, unique=True, index=True)
    email = Column(String, nullable=False)
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    employee = relationship("Employee", back_populates="magic_link_tokens")


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    id = Column(
        String, primary_key=True, default=lambda: f"session-{uuid.uuid4().hex[:8]}"
    )
    token = Column(String, nullable=False, unique=True, index=True)
    user_id = Column(String, ForeignKey("employees.id"), nullable=False)
    entity_id = Column(String, ForeignKey("entities.id"), nullable=False)
    role = Column(SQLEnum(EmployeeRole), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("Employee", foreign_keys=[user_id])
    entity = relationship("Entity", foreign_keys=[entity_id])


class ArchetypeSource(str, enum.Enum):
    SYSTEM = "system"
    WIKIDATA = "wikidata"
    USER = "user"


class UrgencyLevel(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class IncidentArchetype(Base):
    __tablename__ = "incident_archetypes"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False, default="incident")
    source = Column(SQLEnum(ArchetypeSource), nullable=False, default=ArchetypeSource.SYSTEM)

    field_schema = Column(JSONB, nullable=False, server_default="[]")
    urgency_rules = Column(JSONB, nullable=False, server_default="[]")
    implications = Column(JSONB, nullable=False, server_default="{}")
    default_report_urgency = Column(SQLEnum(UrgencyLevel), nullable=True)

    wikidata_id = Column(String, nullable=True)

    parent_archetype_id = Column(String, ForeignKey("incident_archetypes.id"), nullable=True)
    created_by = Column(String, ForeignKey("employees.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    version = Column(Integer, nullable=False, default=1)

    parent = relationship(
        "IncidentArchetype",
        remote_side=[id],
        foreign_keys=[parent_archetype_id],
        backref="children",
    )
    creator = relationship("Employee", foreign_keys=[created_by])


class InventoryArchetype(Base):
    __tablename__ = "inventory_archetypes"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False)
    source = Column(SQLEnum(ArchetypeSource), nullable=False, default=ArchetypeSource.SYSTEM)

    field_schema = Column(JSONB, nullable=False, server_default="[]")
    urgency_rules = Column(JSONB, nullable=False, server_default="[]")

    resolves_needs = Column(JSONB, nullable=False, server_default="[]")
    target_demographics = Column(JSONB, nullable=False, server_default="[]")
    physical_properties = Column(JSONB, nullable=True)
    quantity_unit = Column(String, nullable=False)

    food_properties = Column(JSONB, nullable=True)
    medical_properties = Column(JSONB, nullable=True)
    brand = Column(JSONB, nullable=True)
    learning = Column(JSONB, nullable=True)

    wikidata_id = Column(String, nullable=True)

    parent_archetype_id = Column(String, ForeignKey("inventory_archetypes.id"), nullable=True)
    created_by = Column(String, ForeignKey("employees.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    version = Column(Integer, nullable=False, default=1)

    parent = relationship(
        "InventoryArchetype",
        remote_side=[id],
        foreign_keys=[parent_archetype_id],
        backref="children",
    )
    creator = relationship("Employee", foreign_keys=[created_by])


class InventoryStatus(str, enum.Enum):
    AVAILABLE = "available"
    DEPLOYED = "deployed"
    RESERVED = "reserved"
    EXPIRED = "expired"


class IncidentSeverity(str, enum.Enum):
    LOW = "düşük"
    MEDIUM = "orta"
    CRITICAL = "kritik"


class IncidentStatus(str, enum.Enum):
    ACTIVE = "aktif"
    CONTAINED = "kontrol-altında"
    RESOLVED = "çözüldü"


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, default=lambda: f"d-{uuid.uuid4().hex[:8]}")
    type = Column(String, nullable=False)

    location_lat = Column(Float, nullable=False)
    location_lng = Column(Float, nullable=False)
    location_address = Column(String, nullable=False)

    severity = Column(SQLEnum(IncidentSeverity), nullable=False)
    status = Column(SQLEnum(IncidentStatus), nullable=False, default=IncidentStatus.ACTIVE)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    description = Column(Text, nullable=False)
    affected_radius = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(String, primary_key=True, default=lambda: f"inv-{uuid.uuid4().hex[:8]}")
    archetype_id = Column(String, ForeignKey("inventory_archetypes.id"), nullable=False)
    quantity = Column(Integer, nullable=False)

    location_lat = Column(Float, nullable=False)
    location_lng = Column(Float, nullable=False)
    location_address = Column(String, nullable=True)

    status = Column(SQLEnum(InventoryStatus), nullable=False, default=InventoryStatus.AVAILABLE)

    archetype_values = Column(JSONB, nullable=False, server_default="{}")

    disaster_id = Column(String, nullable=True)
    assigned_to = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    archetype = relationship("InventoryArchetype")
