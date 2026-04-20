from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.models import Entity, Employee, EmployeeRole
from app.schemas.schemas import EntityCreate, EntityUpdate, EntityResponse


class EntityService:
    @staticmethod
    def get_entity(db: Session, entity_id: str) -> Optional[Entity]:
        return db.query(Entity).filter(Entity.id == entity_id).first()

    @staticmethod
    def create_entity(db: Session, data: EntityCreate) -> Entity:
        entity = Entity(
            name=data.name,
            type=data.type,
            logo_url=data.logo_url,
            description=data.description,
            website=data.website,
        )

        db.add(entity)
        db.commit()
        db.refresh(entity)

        return entity

    @staticmethod
    def update_entity(
        db: Session, entity_id: str, data: EntityUpdate
    ) -> Optional[Entity]:
        entity = db.query(Entity).filter(Entity.id == entity_id).first()
        if not entity:
            return None

        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(entity, field, value)

        entity.updated_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(entity)

        return entity

    @staticmethod
    def list_entities(db: Session, skip: int = 0, limit: int = 100) -> List[Entity]:
        return db.query(Entity).offset(skip).limit(limit).all()


class EmployeeService:
    @staticmethod
    def get_employee(db: Session, employee_id: str) -> Optional[Employee]:
        return db.query(Employee).filter(Employee.id == employee_id).first()

    @staticmethod
    def get_employee_by_email(db: Session, email: str) -> Optional[Employee]:
        return db.query(Employee).filter(Employee.email == email.lower()).first()

    @staticmethod
    def list_employees_by_entity(
        db: Session, entity_id: str, skip: int = 0, limit: int = 100
    ) -> List[Employee]:
        return (
            db.query(Employee)
            .filter(Employee.entity_id == entity_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def create_employee(db: Session, data: dict, entity_id: str) -> Employee:
        existing = EmployeeService.get_employee_by_email(db, data["email"])
        if existing:
            raise ValueError("An employee with this email already exists")

        employee = Employee(
            full_name=data["full_name"],
            email=data["email"].lower(),
            entity_id=entity_id,
            role=data.get("role", EmployeeRole.USER),
            enabled=True,
        )

        db.add(employee)
        db.commit()
        db.refresh(employee)

        return employee

    @staticmethod
    def update_employee(
        db: Session, employee_id: str, data: dict, current_user_id: str
    ) -> Optional[Employee]:
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            return None

        if (
            employee_id == current_user_id
            and "role" in data
            and data["role"] != EmployeeRole.ADMIN
        ):
            other_admins = (
                db.query(Employee)
                .filter(
                    Employee.entity_id == employee.entity_id,
                    Employee.role == EmployeeRole.ADMIN,
                    Employee.enabled == True,
                    Employee.id != employee_id,
                )
                .count()
            )

            if other_admins == 0:
                raise ValueError("Cannot demote yourself - you are the only admin")

        if "full_name" in data:
            employee.full_name = data["full_name"]
        if "role" in data:
            employee.role = data["role"]
        if "enabled" in data:
            employee.enabled = data["enabled"]

        db.commit()
        db.refresh(employee)

        return employee

    @staticmethod
    def toggle_employee_enabled(
        db: Session, employee_id: str, current_user_id: str
    ) -> Optional[Employee]:
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            return None

        if employee_id == current_user_id:
            raise ValueError("Cannot disable your own account")

        employee.enabled = not employee.enabled
        db.commit()
        db.refresh(employee)

        return employee
