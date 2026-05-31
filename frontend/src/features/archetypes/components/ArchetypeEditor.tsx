import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import * as archetypeService from "../services/archetypeService";
import type {
  IncidentArchetype,
  InventoryArchetype,
  ArchetypeListEntry,
} from "../types/archetypes.types";

interface ArchetypeEditorProps {
  entry: ArchetypeListEntry;
  onBack: () => void;
  isAdmin: boolean;
}

export default function ArchetypeEditor({ entry, onBack, isAdmin }: ArchetypeEditorProps) {
  const [incidentArchetype, setIncidentArchetype] = useState<IncidentArchetype | null>(null);
  const [inventoryArchetype, setInventoryArchetype] = useState<InventoryArchetype | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [testValues, setTestValues] = useState("{}");
  const [testResult, setTestResult] = useState<{ urgency: string; reason: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (entry.type === "incident") {
          const data = await archetypeService.fetchIncidentArchetype(entry.id);
          setIncidentArchetype(data);
          setJsonText(JSON.stringify(data, null, 2));
        } else {
          const data = await archetypeService.fetchInventoryArchetype(entry.id);
          setInventoryArchetype(data);
          setJsonText(JSON.stringify(data, null, 2));
        }
      } catch (err: unknown) {
        const e = err as { detail?: string };
        setError(e.detail || "Failed to load archetype");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [entry]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const parsed = JSON.parse(jsonText);

      if (entry.type === "incident" && incidentArchetype) {
        await archetypeService.updateIncidentArchetype(entry.id, parsed);
        setSuccess("Incident arketipi güncellendi");
      } else if (inventoryArchetype) {
        await archetypeService.updateInventoryArchetype(entry.id, parsed);
        setSuccess("Envanter arketipi güncellendi");
      }

      const refreshed = entry.type === "incident"
        ? await archetypeService.fetchIncidentArchetype(entry.id)
        : await archetypeService.fetchInventoryArchetype(entry.id);

      if (entry.type === "incident") {
        setIncidentArchetype(refreshed);
        setJsonText(JSON.stringify(refreshed, null, 2));
      } else {
        setInventoryArchetype(refreshed);
        setJsonText(JSON.stringify(refreshed, null, 2));
      }
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        setError("Geçersiz JSON: " + err.message);
      } else {
        const e = err as { detail?: string };
        setError(e.detail || "Failed to save archetype");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTestUrgency = async () => {
    try {
      setError(null);
      setTestResult(null);
      const values = JSON.parse(testValues);
      let result: { urgency: string; reason: string };

      if (entry.type === "incident") {
        result = await archetypeService.calculateIncidentUrgency(entry.id, values);
      } else {
        result = await archetypeService.calculateInventoryArchetypeUrgency(entry.id, values);
      }
      setTestResult(result);
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        setError("Geçersiz JSON: " + err.message);
      } else {
        const e = err as { detail?: string };
        setError(e.detail || "Failed to calculate urgency");
      }
    }
  };

  const isReadOnly = entry.source === "system" && !isAdmin;

  if (loading) {
    return <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>;
  }

  const urgencyColor = (urgency: string): "error" | "warning" | "info" | "success" => {
    switch (urgency) {
      case "critical": return "error";
      case "high": return "warning";
      case "medium": return "info";
      default: return "success";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack}>Geri</Button>
        <Typography variant="h5">{entry.name}</Typography>
        <Chip label={`v${entry.version}`} size="small" />
        <Chip label={entry.source} size="small" variant="outlined" />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
        <Tab label="JSON Düzenleyici" />
        <Tab label="Aciliyet Testi" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {isReadOnly && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Sistem arketipleri salt okunurdur. Düzenlemek için kopyalayın.
            </Alert>
          )}
          <TextField
            fullWidth
            multiline
            rows={30}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            disabled={isReadOnly}
            sx={{
              fontFamily: "monospace",
              fontSize: "0.85rem",
              "& .MuiInputBase-input": { fontFamily: "monospace" },
            }}
          />
          {!isReadOnly && (
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </Box>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>Aciliyet Hesaplama Testi</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Değerleri JSON formatında girin ve hesaplamayı test edin.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={testValues}
            onChange={(e) => setTestValues(e.target.value)}
            sx={{
              fontFamily: "monospace",
              fontSize: "0.85rem",
              mb: 2,
              "& .MuiInputBase-input": { fontFamily: "monospace" },
            }}
          />
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={handleTestUrgency}
          >
            Hesapla
          </Button>
          {testResult && (
            <Box sx={{ mt: 2 }}>
              <Chip
                label={testResult.urgency.toUpperCase()}
                color={urgencyColor(testResult.urgency)}
                sx={{ mr: 1 }}
              />
              <Typography variant="body2">{testResult.reason}</Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
