from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.models import Incident


class IncidentService:

    @staticmethod
    def list_incidents(
        db: Session,
        status: Optional[str] = None,
        severity: Optional[str] = None,
        search: Optional[str] = None,
    ) -> list[Incident]:
        query = db.query(Incident)
        if status:
            query = query.filter(Incident.status == status)
        if severity:
            query = query.filter(Incident.severity == severity)
        if search:
            query = query.filter(
                or_(
                    Incident.type.ilike(f"%{search}%"),
                    Incident.location_address.ilike(f"%{search}%"),
                    Incident.description.ilike(f"%{search}%"),
                )
            )
        return query.order_by(Incident.timestamp.desc()).all()

    @staticmethod
    def get_incident(db: Session, incident_id: str) -> Optional[Incident]:
        return (
            db.query(Incident)
            .filter(Incident.id == incident_id)
            .first()
        )

    @staticmethod
    def create_incident(
        db: Session,
        data: dict,
    ) -> Incident:
        incident = Incident(
            archetype_id=data.get("archetype_id"),
            type=data["type"],
            location_lat=data["location_lat"],
            location_lng=data["location_lng"],
            location_address=data["location_address"],
            severity=data["severity"],
            status=data.get("status", "aktif"),
            timestamp=data["timestamp"],
            description=data["description"],
            affected_radius=data.get("affected_radius"),
            archetype_values=data.get("archetype_values", {}),
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        return incident

    @staticmethod
    def update_incident(
        db: Session,
        incident_id: str,
        data: dict,
    ) -> Optional[Incident]:
        incident = IncidentService.get_incident(db, incident_id)
        if not incident:
            return None

        for field, value in data.items():
            if value is not None:
                setattr(incident, field, value)

        incident.updated_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(incident)
        return incident

    @staticmethod
    def delete_incident(db: Session, incident_id: str) -> bool:
        incident = IncidentService.get_incident(db, incident_id)
        if not incident:
            return False
        db.delete(incident)
        db.commit()
        return True
