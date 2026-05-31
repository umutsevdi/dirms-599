from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy.orm import Session

from app.db.models import Inventory, InventoryStatus
from app.services.archetype_service import ArchetypeService


class InventoryService:

    @staticmethod
    def list_inventory(
        db: Session,
        status: Optional[str] = None,
        archetype_id: Optional[str] = None,
    ) -> list[Inventory]:
        query = db.query(Inventory)
        if status:
            query = query.filter(Inventory.status == status)
        if archetype_id:
            query = query.filter(Inventory.archetype_id == archetype_id)
        return query.order_by(Inventory.created_at.desc()).all()

    @staticmethod
    def get_inventory(db: Session, inventory_id: str) -> Optional[Inventory]:
        return (
            db.query(Inventory)
            .filter(Inventory.id == inventory_id)
            .first()
        )

    @staticmethod
    def create_inventory(
        db: Session,
        data: dict[str, Any],
    ) -> Inventory:
        archetype = ArchetypeService.get_inventory_archetype(
            db, data["archetype_id"]
        )
        if not archetype:
            raise ValueError(f"Archetype '{data['archetype_id']}' not found")

        inventory = Inventory(
            archetype_id=data["archetype_id"],
            quantity=data["quantity"],
            location_lat=data["location_lat"],
            location_lng=data["location_lng"],
            location_address=data.get("location_address"),
            status=data.get("status", InventoryStatus.AVAILABLE),
            archetype_values=data.get("archetype_values", {}),
            disaster_id=data.get("disaster_id"),
            assigned_to=data.get("assigned_to"),
            notes=data.get("notes"),
        )
        db.add(inventory)
        db.commit()
        db.refresh(inventory)
        return inventory

    @staticmethod
    def update_inventory(
        db: Session,
        inventory_id: str,
        data: dict[str, Any],
    ) -> Optional[Inventory]:
        inventory = InventoryService.get_inventory(db, inventory_id)
        if not inventory:
            return None

        for field, value in data.items():
            if value is not None:
                setattr(inventory, field, value)

        inventory.updated_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(inventory)
        return inventory

    @staticmethod
    def delete_inventory(db: Session, inventory_id: str) -> bool:
        inventory = InventoryService.get_inventory(db, inventory_id)
        if not inventory:
            return False
        db.delete(inventory)
        db.commit()
        return True

    @staticmethod
    def calculate_inventory_urgency(
        db: Session, inventory_id: str
    ) -> Optional[dict[str, str]]:
        inventory = InventoryService.get_inventory(db, inventory_id)
        if not inventory:
            return None

        archetype = ArchetypeService.get_inventory_archetype(
            db, inventory.archetype_id
        )
        if not archetype:
            return None

        return ArchetypeService.calculate_urgency(
            urgency_rules=archetype.urgency_rules,
            values=inventory.archetype_values,
        )
