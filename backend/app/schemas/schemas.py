from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.db.models import EntityType, EmployeeRole, ArchetypeSource, UrgencyLevel, InventoryStatus, IncidentSeverity, IncidentStatus


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


# ---------------------------------------------------------------------------
# Archetype Schemas
# ---------------------------------------------------------------------------

class FieldSchemaItem(BaseModel):
    field: str
    label: str
    type: str  # number, text, select, boolean
    required: bool = False
    options: Optional[list[str]] = None
    defaultValue: Optional[Any] = None


class UrgencyRuleItem(BaseModel):
    field: str
    operator: str  # <, >, =, <=, >=
    value: Any
    setUrgency: str  # critical, high, medium, low
    message: str


class ImplicationNeed(BaseModel):
    label: str
    priority: int
    defaultUrgency: str


class ImplicationDemographic(BaseModel):
    group: str
    count: Optional[int] = None


class ImplicationChronicDisease(BaseModel):
    name: str
    wikidataId: Optional[str] = None
    severity: str
    medicationNeeded: Optional[str] = None


class ImplicationStatusCounts(BaseModel):
    missing: Optional[int] = 0
    injured: Optional[int] = 0
    disabled: Optional[int] = 0
    bedridden: Optional[int] = 0


class ArchetypeImplications(BaseModel):
    needs: Optional[list[ImplicationNeed]] = None
    demographics: Optional[list[ImplicationDemographic]] = None
    chronic_diseases: Optional[list[ImplicationChronicDisease]] = None
    status_counts: Optional[ImplicationStatusCounts] = None


class IncidentArchetypeBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    category: str = "incident"
    source: ArchetypeSource = ArchetypeSource.SYSTEM
    field_schema: list[FieldSchemaItem] = []
    urgency_rules: list[UrgencyRuleItem] = []
    implications: dict[str, Any] = {}
    default_report_urgency: Optional[UrgencyLevel] = None
    wikidata_id: Optional[str] = None
    parent_archetype_id: Optional[str] = None


class IncidentArchetypeCreate(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    field_schema: list[FieldSchemaItem] = []
    urgency_rules: list[UrgencyRuleItem] = []
    implications: dict[str, Any] = {}
    default_report_urgency: Optional[UrgencyLevel] = None
    wikidata_id: Optional[str] = None
    parent_archetype_id: Optional[str] = None


class IncidentArchetypeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    field_schema: Optional[list[FieldSchemaItem]] = None
    urgency_rules: Optional[list[UrgencyRuleItem]] = None
    implications: Optional[dict[str, Any]] = None
    default_report_urgency: Optional[UrgencyLevel] = None
    parent_archetype_id: Optional[str] = None


class IncidentArchetypeResponse(IncidentArchetypeBase):
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    version: int

    model_config = ConfigDict(from_attributes=True)


class InventoryArchetypeBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    category: str  # food, medical
    source: ArchetypeSource = ArchetypeSource.SYSTEM
    field_schema: list[FieldSchemaItem] = []
    urgency_rules: list[UrgencyRuleItem] = []
    resolves_needs: list[str] = []
    target_demographics: list[str] = []
    physical_properties: Optional[dict[str, Any]] = None
    quantity_unit: str
    food_properties: Optional[dict[str, Any]] = None
    medical_properties: Optional[dict[str, Any]] = None
    brand: Optional[dict[str, Any]] = None
    learning: Optional[dict[str, Any]] = None
    wikidata_id: Optional[str] = None
    parent_archetype_id: Optional[str] = None


class InventoryArchetypeCreate(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    category: str  # food, medical
    field_schema: list[FieldSchemaItem] = []
    urgency_rules: list[UrgencyRuleItem] = []
    resolves_needs: list[str] = []
    target_demographics: list[str] = []
    physical_properties: Optional[dict[str, Any]] = None
    quantity_unit: str
    food_properties: Optional[dict[str, Any]] = None
    medical_properties: Optional[dict[str, Any]] = None
    brand: Optional[dict[str, Any]] = None
    learning: Optional[dict[str, Any]] = None
    wikidata_id: Optional[str] = None
    parent_archetype_id: Optional[str] = None


class InventoryArchetypeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    field_schema: Optional[list[FieldSchemaItem]] = None
    urgency_rules: Optional[list[UrgencyRuleItem]] = None
    resolves_needs: Optional[list[str]] = None
    target_demographics: Optional[list[str]] = None
    physical_properties: Optional[dict[str, Any]] = None
    quantity_unit: Optional[str] = None
    food_properties: Optional[dict[str, Any]] = None
    medical_properties: Optional[dict[str, Any]] = None
    brand: Optional[dict[str, Any]] = None
    learning: Optional[dict[str, Any]] = None
    parent_archetype_id: Optional[str] = None


class InventoryArchetypeResponse(InventoryArchetypeBase):
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    version: int

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Inventory Schemas
# ---------------------------------------------------------------------------

class InventoryBase(BaseModel):
    archetype_id: str
    quantity: int
    location_lat: float
    location_lng: float
    location_address: Optional[str] = None
    status: InventoryStatus = InventoryStatus.AVAILABLE
    archetype_values: dict[str, Any] = {}
    disaster_id: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None


class InventoryCreate(BaseModel):
    archetype_id: str
    quantity: int
    location_lat: float
    location_lng: float
    location_address: Optional[str] = None
    status: InventoryStatus = InventoryStatus.AVAILABLE
    archetype_values: dict[str, Any] = {}
    disaster_id: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None


class InventoryUpdate(BaseModel):
    quantity: Optional[int] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    location_address: Optional[str] = None
    status: Optional[InventoryStatus] = None
    archetype_values: Optional[dict[str, Any]] = None
    disaster_id: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None


class InventoryResponse(BaseModel):
    id: str
    archetype_id: str
    quantity: int
    location_lat: float
    location_lng: float
    location_address: Optional[str] = None
    status: InventoryStatus
    archetype_values: dict[str, Any] = {}
    disaster_id: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Urgency Calculation Schemas
# ---------------------------------------------------------------------------

class UrgencyCalculationRequest(BaseModel):
    values: dict[str, Any]


class UrgencyCalculationResponse(BaseModel):
    urgency: str
    reason: str


# ---------------------------------------------------------------------------
# Incident Schemas
# ---------------------------------------------------------------------------

class IncidentBase(BaseModel):
    archetype_id: Optional[str] = None
    type: str
    location_lat: float
    location_lng: float
    location_address: str
    severity: IncidentSeverity
    status: IncidentStatus = IncidentStatus.ACTIVE
    timestamp: datetime
    description: str
    affected_radius: Optional[int] = None
    archetype_values: dict[str, Any] = {}


class IncidentCreate(IncidentBase):
    pass


class IncidentUpdate(BaseModel):
    archetype_id: Optional[str] = None
    type: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    location_address: Optional[str] = None
    severity: Optional[IncidentSeverity] = None
    status: Optional[IncidentStatus] = None
    description: Optional[str] = None
    affected_radius: Optional[int] = None
    archetype_values: Optional[dict[str, Any]] = None


class IncidentResponse(IncidentBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Needs Archetype Schemas
# ---------------------------------------------------------------------------

class NeedsArchetypeBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    category: str = "need"
    source: ArchetypeSource = ArchetypeSource.SYSTEM
    urgency_rules: list[UrgencyRuleItem] = []
    icon: Optional[str] = None
    color: Optional[str] = None
    wikidata_id: Optional[str] = None
    parent_archetype_id: Optional[str] = None


class NeedsArchetypeCreate(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    urgency_rules: list[UrgencyRuleItem] = []
    icon: Optional[str] = None
    color: Optional[str] = None
    wikidata_id: Optional[str] = None
    parent_archetype_id: Optional[str] = None


class NeedsArchetypeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    urgency_rules: Optional[list[UrgencyRuleItem]] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    parent_archetype_id: Optional[str] = None


class NeedsArchetypeResponse(NeedsArchetypeBase):
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    version: int
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# People Report Schemas
# ---------------------------------------------------------------------------

class PeopleReportBase(BaseModel):
    reporter_name: str
    reporter_phone: Optional[str] = None
    reporter_contact_method: Optional[str] = None
    reporter_contact_details: Optional[str] = None
    location_lat: float
    location_lng: float
    location_address: str
    counts_baby: int = 0
    counts_child: int = 0
    counts_adult: int = 0
    counts_elderly: int = 0
    counts_women: int = 0
    status_missing: int = 0
    status_injured: int = 0
    status_disabled: int = 0
    status_bedridden: int = 0
    services_access: dict[str, Any] = {"water": True, "electricity": True}
    chronic_diseases: dict[str, int] = {}
    needs: list[dict[str, Any]] = []
    details: Optional[str] = None
    timestamp: datetime


class PeopleReportCreate(PeopleReportBase):
    pass


class PeopleReportUpdate(BaseModel):
    reporter_name: Optional[str] = None
    reporter_phone: Optional[str] = None
    reporter_contact_method: Optional[str] = None
    reporter_contact_details: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    location_address: Optional[str] = None
    counts_baby: Optional[int] = None
    counts_child: Optional[int] = None
    counts_adult: Optional[int] = None
    counts_elderly: Optional[int] = None
    counts_women: Optional[int] = None
    status_missing: Optional[int] = None
    status_injured: Optional[int] = None
    status_disabled: Optional[int] = None
    status_bedridden: Optional[int] = None
    services_access: Optional[dict[str, Any]] = None
    chronic_diseases: Optional[dict[str, int]] = None
    needs: Optional[list[dict[str, Any]]] = None
    details: Optional[str] = None
    timestamp: Optional[datetime] = None


class PeopleReportResponse(PeopleReportBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
