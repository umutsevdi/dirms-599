import { useState, useEffect, useCallback } from "react";
import type { PeopleReport } from "../types/people-reports.types";
import * as peopleReportService from "../services/peopleReportService";

interface UsePeopleReportsReturn {
  reports: PeopleReport[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  saveReport: (report: PeopleReport) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
}

export function usePeopleReports(): UsePeopleReportsReturn {
  const [reports, setReports] = useState<PeopleReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await peopleReportService.fetchPeopleReports();
      setReports(data);
    } catch (err: unknown) {
      const e = err as { detail?: string };
      setError(e.detail || "Failed to load people reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveReport = useCallback(async (report: PeopleReport) => {
    try {
      setError(null);
      const saved = await peopleReportService.savePeopleReport(report);
      setReports((prev) => {
        const existing = prev.find((r) => r.id === report.id);
        if (existing) {
          return prev.map((r) => (r.id === report.id ? saved : r));
        }
        return [...prev, saved];
      });
    } catch (err: unknown) {
      const e = err as { detail?: string };
      setError(e.detail || "Failed to save people report");
      throw err;
    }
  }, []);

  const deleteReport = useCallback(async (id: string) => {
    try {
      setError(null);
      await peopleReportService.deletePeopleReportById(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      const e = err as { detail?: string };
      setError(e.detail || "Failed to delete people report");
      throw err;
    }
  }, []);

  return { reports, loading, error, refresh, saveReport, deleteReport };
}
