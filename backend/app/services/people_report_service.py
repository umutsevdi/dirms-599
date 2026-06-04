from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy.orm import Session

from app.db.models import PeopleReport


class PeopleReportService:

    @staticmethod
    def list_reports(
        db: Session,
    ) -> list[PeopleReport]:
        return db.query(PeopleReport).order_by(PeopleReport.timestamp.desc()).all()

    @staticmethod
    def get_report(db: Session, report_id: str) -> Optional[PeopleReport]:
        return (
            db.query(PeopleReport)
            .filter(PeopleReport.id == report_id)
            .first()
        )

    @staticmethod
    def create_report(
        db: Session,
        data: dict[str, Any],
    ) -> PeopleReport:
        report = PeopleReport(**data)
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

    @staticmethod
    def update_report(
        db: Session,
        report_id: str,
        data: dict[str, Any],
    ) -> Optional[PeopleReport]:
        report = PeopleReportService.get_report(db, report_id)
        if not report:
            return None

        for field, value in data.items():
            if value is not None:
                setattr(report, field, value)

        report.updated_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(report)
        return report

    @staticmethod
    def delete_report(db: Session, report_id: str) -> bool:
        report = PeopleReportService.get_report(db, report_id)
        if not report:
            return False
        db.delete(report)
        db.commit()
        return True
