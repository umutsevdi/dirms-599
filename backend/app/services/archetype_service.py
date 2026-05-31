from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.models import (
    IncidentArchetype,
    InventoryArchetype,
    ArchetypeSource,
)


class ArchetypeService:

    # -------------------------------------------------------------------------
    # Incident Archetype CRUD
    # -------------------------------------------------------------------------

    @staticmethod
    def list_incident_archetypes(
        db: Session,
        source: Optional[str] = None,
        search: Optional[str] = None,
    ) -> list[IncidentArchetype]:
        query = db.query(IncidentArchetype)
        if source:
            query = query.filter(IncidentArchetype.source == source)
        if search:
            query = query.filter(
                or_(
                    IncidentArchetype.name.ilike(f"%{search}%"),
                    IncidentArchetype.description.ilike(f"%{search}%"),
                    IncidentArchetype.id.ilike(f"%{search}%"),
                )
            )
        return query.order_by(IncidentArchetype.name).all()

    @staticmethod
    def get_incident_archetype(
        db: Session, archetype_id: str
    ) -> Optional[IncidentArchetype]:
        return (
            db.query(IncidentArchetype)
            .filter(IncidentArchetype.id == archetype_id)
            .first()
        )

    @staticmethod
    def create_incident_archetype(
        db: Session,
        data: dict[str, Any],
        created_by: Optional[str] = None,
    ) -> IncidentArchetype:
        archetype = IncidentArchetype(
            id=data["id"],
            name=data["name"],
            description=data.get("description"),
            source=data.get("source", ArchetypeSource.USER),
            field_schema=data.get("field_schema", []),
            urgency_rules=data.get("urgency_rules", []),
            implications=data.get("implications", {}),
            default_report_urgency=data.get("default_report_urgency"),
            wikidata_id=data.get("wikidata_id"),
            parent_archetype_id=data.get("parent_archetype_id"),
            created_by=created_by,
        )
        db.add(archetype)
        db.commit()
        db.refresh(archetype)
        return archetype

    @staticmethod
    def update_incident_archetype(
        db: Session,
        archetype_id: str,
        data: dict[str, Any],
    ) -> Optional[IncidentArchetype]:
        archetype = ArchetypeService.get_incident_archetype(db, archetype_id)
        if not archetype:
            return None

        for field, value in data.items():
            if value is not None:
                setattr(archetype, field, value)

        archetype.updated_at = datetime.now(timezone.utc)
        archetype.version += 1

        db.commit()
        db.refresh(archetype)
        return archetype

    @staticmethod
    def delete_incident_archetype(
        db: Session, archetype_id: str
    ) -> bool:
        archetype = ArchetypeService.get_incident_archetype(db, archetype_id)
        if not archetype:
            return False
        db.delete(archetype)
        db.commit()
        return True

    @staticmethod
    def duplicate_incident_archetype(
        db: Session,
        archetype_id: str,
        new_id: str,
        created_by: Optional[str] = None,
    ) -> Optional[IncidentArchetype]:
        original = ArchetypeService.get_incident_archetype(db, archetype_id)
        if not original:
            return None

        data = {
            "id": new_id,
            "name": f"{original.name} (Copy)",
            "description": original.description,
            "source": ArchetypeSource.USER,
            "field_schema": original.field_schema,
            "urgency_rules": original.urgency_rules,
            "implications": original.implications,
            "default_report_urgency": original.default_report_urgency,
            "wikidata_id": original.wikidata_id,
            "parent_archetype_id": archetype_id,
        }
        return ArchetypeService.create_incident_archetype(db, data, created_by)

    # -------------------------------------------------------------------------
    # Inventory Archetype CRUD
    # -------------------------------------------------------------------------

    @staticmethod
    def list_inventory_archetypes(
        db: Session,
        category: Optional[str] = None,
        source: Optional[str] = None,
        search: Optional[str] = None,
    ) -> list[InventoryArchetype]:
        query = db.query(InventoryArchetype)
        if category:
            query = query.filter(InventoryArchetype.category == category)
        if source:
            query = query.filter(InventoryArchetype.source == source)
        if search:
            query = query.filter(
                or_(
                    InventoryArchetype.name.ilike(f"%{search}%"),
                    InventoryArchetype.description.ilike(f"%{search}%"),
                    InventoryArchetype.id.ilike(f"%{search}%"),
                )
            )
        return query.order_by(InventoryArchetype.name).all()

    @staticmethod
    def get_inventory_archetype(
        db: Session, archetype_id: str
    ) -> Optional[InventoryArchetype]:
        return (
            db.query(InventoryArchetype)
            .filter(InventoryArchetype.id == archetype_id)
            .first()
        )

    @staticmethod
    def create_inventory_archetype(
        db: Session,
        data: dict[str, Any],
        created_by: Optional[str] = None,
    ) -> InventoryArchetype:
        archetype = InventoryArchetype(
            id=data["id"],
            name=data["name"],
            description=data.get("description"),
            category=data["category"],
            source=data.get("source", ArchetypeSource.USER),
            field_schema=data.get("field_schema", []),
            urgency_rules=data.get("urgency_rules", []),
            resolves_needs=data.get("resolves_needs", []),
            target_demographics=data.get("target_demographics", []),
            physical_properties=data.get("physical_properties"),
            quantity_unit=data["quantity_unit"],
            food_properties=data.get("food_properties"),
            medical_properties=data.get("medical_properties"),
            brand=data.get("brand"),
            learning=data.get("learning"),
            wikidata_id=data.get("wikidata_id"),
            parent_archetype_id=data.get("parent_archetype_id"),
            created_by=created_by,
        )
        db.add(archetype)
        db.commit()
        db.refresh(archetype)
        return archetype

    @staticmethod
    def update_inventory_archetype(
        db: Session,
        archetype_id: str,
        data: dict[str, Any],
    ) -> Optional[InventoryArchetype]:
        archetype = ArchetypeService.get_inventory_archetype(db, archetype_id)
        if not archetype:
            return None

        for field, value in data.items():
            if value is not None:
                setattr(archetype, field, value)

        archetype.updated_at = datetime.now(timezone.utc)
        archetype.version += 1

        db.commit()
        db.refresh(archetype)
        return archetype

    @staticmethod
    def delete_inventory_archetype(
        db: Session, archetype_id: str
    ) -> bool:
        archetype = ArchetypeService.get_inventory_archetype(db, archetype_id)
        if not archetype:
            return False
        db.delete(archetype)
        db.commit()
        return True

    @staticmethod
    def duplicate_inventory_archetype(
        db: Session,
        archetype_id: str,
        new_id: str,
        created_by: Optional[str] = None,
    ) -> Optional[InventoryArchetype]:
        original = ArchetypeService.get_inventory_archetype(db, archetype_id)
        if not original:
            return None

        data = {
            "id": new_id,
            "name": f"{original.name} (Copy)",
            "description": original.description,
            "category": original.category,
            "source": ArchetypeSource.USER,
            "field_schema": original.field_schema,
            "urgency_rules": original.urgency_rules,
            "resolves_needs": original.resolves_needs,
            "target_demographics": original.target_demographics,
            "physical_properties": original.physical_properties,
            "quantity_unit": original.quantity_unit,
            "food_properties": original.food_properties,
            "medical_properties": original.medical_properties,
            "brand": original.brand,
            "learning": original.learning,
            "wikidata_id": original.wikidata_id,
            "parent_archetype_id": archetype_id,
        }
        return ArchetypeService.create_inventory_archetype(db, data, created_by)

    # -------------------------------------------------------------------------
    # Urgency Calculation
    # -------------------------------------------------------------------------

    @staticmethod
    def calculate_urgency(
        urgency_rules: list[dict[str, Any]],
        values: dict[str, Any],
        default_urgency: Optional[str] = None,
    ) -> dict[str, str]:
        for rule in urgency_rules:
            field = rule.get("field")
            operator = rule.get("operator")
            rule_value = rule.get("value")
            set_urgency = rule.get("setUrgency")
            message = rule.get("message", "")

            if field not in values:
                continue

            actual_value = values[field]

            if ArchetypeService._evaluate_operator(actual_value, operator, rule_value):
                return {
                    "urgency": set_urgency,
                    "reason": message,
                }

        return {
            "urgency": default_urgency or "medium",
            "reason": "Default urgency",
        }

    @staticmethod
    def _evaluate_operator(
        actual: Any, operator: str, expected: Any
    ) -> bool:
        try:
            if operator == "<":
                return actual < expected
            elif operator == ">":
                return actual > expected
            elif operator == "=":
                return actual == expected
            elif operator == "<=":
                return actual <= expected
            elif operator == ">=":
                return actual >= expected
        except TypeError:
            return False
        return False

    # -------------------------------------------------------------------------
    # Override / Parent Detection
    # -------------------------------------------------------------------------

    @staticmethod
    def is_override(archetype: IncidentArchetype | InventoryArchetype) -> bool:
        return archetype.parent_archetype_id is not None

    @staticmethod
    def get_base_incident_archetype(
        db: Session, archetype: IncidentArchetype
    ) -> IncidentArchetype:
        while archetype.parent_archetype_id:
            parent = (
                db.query(IncidentArchetype)
                .filter(IncidentArchetype.id == archetype.parent_archetype_id)
                .first()
            )
            if not parent:
                break
            archetype = parent
        return archetype

    @staticmethod
    def get_base_inventory_archetype(
        db: Session, archetype: InventoryArchetype
    ) -> InventoryArchetype:
        while archetype.parent_archetype_id:
            parent = (
                db.query(InventoryArchetype)
                .filter(InventoryArchetype.id == archetype.parent_archetype_id)
                .first()
            )
            if not parent:
                break
            archetype = parent
        return archetype

    @staticmethod
    def get_overrides_incident(
        db: Session, archetype_id: str
    ) -> list[IncidentArchetype]:
        archetype = ArchetypeService.get_incident_archetype(db, archetype_id)
        if not archetype:
            return []
        return archetype.children or []

    @staticmethod
    def get_overrides_inventory(
        db: Session, archetype_id: str
    ) -> list[InventoryArchetype]:
        archetype = ArchetypeService.get_inventory_archetype(db, archetype_id)
        if not archetype:
            return []
        return archetype.children or []

    # -------------------------------------------------------------------------
    # First-to-Enter Hook (placeholder for Wikidata integration)
    # -------------------------------------------------------------------------

    @staticmethod
    def find_archetype_by_name_incident(
        db: Session, name: str
    ) -> Optional[IncidentArchetype]:
        return (
            db.query(IncidentArchetype)
            .filter(IncidentArchetype.name.ilike(name))
            .first()
        )

    @staticmethod
    def find_archetype_by_name_inventory(
        db: Session, name: str
    ) -> Optional[InventoryArchetype]:
        return (
            db.query(InventoryArchetype)
            .filter(InventoryArchetype.name.ilike(name))
            .first()
        )
