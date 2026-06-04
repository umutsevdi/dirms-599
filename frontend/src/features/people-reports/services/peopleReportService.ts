import type { PeopleReport, Need } from "../types/people-reports.types";
import type {
  ApiPeopleReportResponse,
  ApiPeopleReportCreate,
  ApiPeopleReportUpdate,
} from "../../../shared/api/types";
import * as peopleReportsApi from "../../../shared/api/peopleReports";

export function toApiCreate(report: PeopleReport): ApiPeopleReportCreate {
  return {
    reporter_name: report.reporter.name,
    reporter_phone: report.reporter.phoneNumber,
    reporter_contact_method: report.reporter.contactMethod,
    reporter_contact_details: report.reporter.contactDetails,
    location_lat: report.location.lat,
    location_lng: report.location.lng,
    location_address: report.location.address,
    counts_baby: report.counts.baby,
    counts_child: report.counts.child,
    counts_adult: report.counts.adult,
    counts_elderly: report.counts.elderly,
    counts_women: report.genderCounts.women,
    status_missing: report.statusCounts.missing,
    status_injured: report.statusCounts.injured,
    status_disabled: report.statusCounts.disabled,
    status_bedridden: report.statusCounts.bedridden,
    services_access: report.servicesAccess,
    chronic_diseases: report.statusCounts.chronicDisease,
    needs: report.needs.map((n) => ({ archetype_id: n.archetypeId, priority: n.priority })),
    details: report.details,
    timestamp: report.timestamp,
  };
}

export function toApiUpdate(report: PeopleReport): ApiPeopleReportUpdate {
  return {
    reporter_name: report.reporter.name,
    reporter_phone: report.reporter.phoneNumber,
    reporter_contact_method: report.reporter.contactMethod,
    reporter_contact_details: report.reporter.contactDetails,
    location_lat: report.location.lat,
    location_lng: report.location.lng,
    location_address: report.location.address,
    counts_baby: report.counts.baby,
    counts_child: report.counts.child,
    counts_adult: report.counts.adult,
    counts_elderly: report.counts.elderly,
    counts_women: report.genderCounts.women,
    status_missing: report.statusCounts.missing,
    status_injured: report.statusCounts.injured,
    status_disabled: report.statusCounts.disabled,
    status_bedridden: report.statusCounts.bedridden,
    services_access: report.servicesAccess,
    chronic_diseases: report.statusCounts.chronicDisease,
    needs: report.needs.map((n) => ({ archetype_id: n.archetypeId, priority: n.priority })),
    details: report.details,
    timestamp: report.timestamp,
  };
}

export function toFrontendReport(api: ApiPeopleReportResponse): PeopleReport {
  return {
    id: api.id,
    reporter: {
      name: api.reporter_name,
      phoneNumber: api.reporter_phone,
      contactMethod: api.reporter_contact_method,
      contactDetails: api.reporter_contact_details,
    },
    location: {
      lat: api.location_lat,
      lng: api.location_lng,
      address: api.location_address,
    },
    needs: (api.needs || []).map((n) => ({
      archetypeId: n.archetype_id,
      priority: n.priority,
    })),
    counts: {
      baby: api.counts_baby,
      child: api.counts_child,
      adult: api.counts_adult,
      elderly: api.counts_elderly,
    },
    genderCounts: { women: api.counts_women },
    servicesAccess: api.services_access,
    statusCounts: {
      missing: api.status_missing,
      injured: api.status_injured,
      disabled: api.status_disabled,
      bedridden: api.status_bedridden,
      chronicDisease: api.chronic_diseases,
    },
    details: api.details || "",
    timestamp: api.timestamp,
  };
}

export async function fetchPeopleReports(): Promise<PeopleReport[]> {
  const reports = await peopleReportsApi.listPeopleReports();
  return reports.map(toFrontendReport);
}

export async function savePeopleReport(report: PeopleReport): Promise<PeopleReport> {
  const isNew = !report.id.startsWith("rpt-");
  const apiData = isNew ? toApiCreate(report) : toApiUpdate(report);
  const result = isNew
    ? await peopleReportsApi.createPeopleReport(apiData as ApiPeopleReportCreate)
    : await peopleReportsApi.updatePeopleReport(report.id, apiData as ApiPeopleReportUpdate);
  return toFrontendReport(result);
}

export async function deletePeopleReportById(id: string): Promise<void> {
  await peopleReportsApi.deletePeopleReport(id);
}
