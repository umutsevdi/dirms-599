import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Alert,
  Chip,
  CircularProgress,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";
import ArchetypeForm from "./ArchetypeForm";
import type { ArchetypeFormData, InheritedKeys } from "./ArchetypeForm";
import * as archetypeService from "../services/archetypeService";
import type {
  IncidentArchetype,
  InventoryArchetype,
  NeedsArchetype,
  ArchetypeListEntry,
} from "../types/archetypes.types";

interface ArchetypeEditorProps {
  entry: ArchetypeListEntry | null;
  mode: "create" | "edit";
  onClose: () => void;
  onSaved: () => void;
}

export default function ArchetypeEditor({ entry, mode, onClose, onSaved }: ArchetypeEditorProps) {
  const [incidentArchetype, setIncidentArchetype] = useState<IncidentArchetype | null>(null);
  const [inventoryArchetype, setInventoryArchetype] = useState<InventoryArchetype | null>(null);
  const [needsArchetype, setNeedsArchetype] = useState<NeedsArchetype | null>(null);
  const [parentArchetype, setParentArchetype] = useState<IncidentArchetype | InventoryArchetype | NeedsArchetype | null>(null);
  const [ancestorArchetypes, setAncestorArchetypes] = useState<(IncidentArchetype | InventoryArchetype | NeedsArchetype)[]>([]);
  const [allArchetypes, setAllArchetypes] = useState<ArchetypeListEntry[]>([]);
  const [childArchetypes, setChildArchetypes] = useState<ArchetypeListEntry[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
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

        const all = await archetypeService.fetchArchetypeList();
        setAllArchetypes(all);

        if (mode === "edit" && entry) {
          if (entry.type === "incident") {
            const data = await archetypeService.fetchIncidentArchetype(entry.id);
            setIncidentArchetype(data);
          } else if (entry.type === "inventory") {
            const data = await archetypeService.fetchInventoryArchetype(entry.id);
            setInventoryArchetype(data);
          } else {
            const data = await archetypeService.fetchNeedsArchetype(entry.id);
            setNeedsArchetype(data);
          }

          if (entry.parentArchetypeId) {
            const ancestors: (IncidentArchetype | InventoryArchetype | NeedsArchetype)[] = [];
            let currentParentId: string | null | undefined = entry.parentArchetypeId;
            while (currentParentId) {
              const parentEntry = all.find((a) => a.id === currentParentId);
              if (!parentEntry) break;
              const parent = await archetypeService.fetchParentArchetype(parentEntry);
              if (!parent) break;
              ancestors.push(parent);
              currentParentId = parent.parentArchetypeId;
            }
            setParentArchetype(ancestors[0] ?? null);
            setAncestorArchetypes(ancestors);
          }

          const children = await archetypeService.fetchChildArchetypes(entry);
          setChildArchetypes(children);
        }
      } catch (err: unknown) {
        const e = err as { detail?: string };
        setError(e.detail || "Arketip yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [entry, mode]);

  const inheritedKeys = useMemo((): InheritedKeys | null => {
    if (mode !== "edit" || !parentArchetype) return null;

    const currentArchetype = entry?.type === "incident" ? incidentArchetype : entry?.type === "inventory" ? inventoryArchetype : needsArchetype;
    if (!currentArchetype) return null;

    const parentFields = new Set(parentArchetype.fieldSchema.map((f) => f.field));
    const parentRules = new Set(
      parentArchetype.urgencyRules.map((r) => `${r.field}-${r.operator}-${r.value}`)
    );

    const currentFields = new Set(currentArchetype.fieldSchema.map((f) => f.field));
    const currentRules = new Set(
      currentArchetype.urgencyRules.map((r) => `${r.field}-${r.operator}-${r.value}`)
    );

    return {
      fieldKeys: parentFields,
      ruleKeys: parentRules,
    };
  }, [mode, entry, parentArchetype, incidentArchetype, inventoryArchetype, needsArchetype]);

  const { knownNeeds, knownDemographics, knownFieldNames } = useMemo(() => {
    const needs = new Set<string>();
    const demographics = new Set<string>();
    const fields = new Set<string>();

    allArchetypes.forEach((a) => {
      a.resolvesNeeds?.forEach((n) => needs.add(n));
      a.targetDemographics?.forEach((d) => demographics.add(d));
    });

    const current = entry?.type === "incident" ? incidentArchetype : entry?.type === "inventory" ? inventoryArchetype : needsArchetype;
    if (current) {
      current.fieldSchema.forEach((f) => { if (f.field) fields.add(f.field); });
    }

    const collectParentFields = (parent: IncidentArchetype | InventoryArchetype | NeedsArchetype | null) => {
      if (!parent) return;
      parent.fieldSchema.forEach((f) => { if (f.field) fields.add(f.field); });
    };

    if (parentArchetype) {
      collectParentFields(parentArchetype);
    }
    ancestorArchetypes.forEach(collectParentFields);

    return {
      knownNeeds: Array.from(needs).sort(),
      knownDemographics: Array.from(demographics).sort(),
      knownFieldNames: Array.from(fields).sort(),
    };
  }, [allArchetypes, entry, incidentArchetype, inventoryArchetype, parentArchetype, ancestorArchetypes]);

  const handleSave = useCallback(async (formData: ArchetypeFormData) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (mode === "create") {
        if (formData.type === "incident") {
          await archetypeService.createIncidentArchetype({
            id: formData.id,
            name: formData.name,
            description: formData.description || undefined,
            fieldSchema: formData.fieldSchema,
            urgencyRules: formData.urgencyRules,
            implications: {
              needs: [],
              demographics: [],
              chronic_diseases: [],
              status_counts: {},
            },
            defaultReportUrgency: formData.defaultReportUrgency,
            parentArchetypeId: formData.parentArchetypeId,
          });
        } else if (formData.type === "inventory") {
          await archetypeService.createInventoryArchetype({
            id: formData.id,
            name: formData.name,
            description: formData.description || undefined,
            category: formData.category,
            fieldSchema: formData.fieldSchema,
            urgencyRules: formData.urgencyRules,
            resolvesNeeds: formData.resolvesNeeds,
            targetDemographics: formData.targetDemographics,
            quantityUnit: formData.quantityUnit,
            parentArchetypeId: formData.parentArchetypeId,
          });
        } else {
          await archetypeService.createNeedsArchetype({
            id: formData.id,
            name: formData.name,
            description: formData.description || undefined,
            urgencyRules: formData.urgencyRules,
            icon: formData.icon || undefined,
            color: formData.color || undefined,
            parentArchetypeId: formData.parentArchetypeId,
          });
        }
        setSuccess("Arketip oluşturuldu");
      } else {
        if (!entry) return;

        if (entry.type === "incident") {
          await archetypeService.updateIncidentArchetype(entry.id, {
            name: formData.name,
            description: formData.description || undefined,
            fieldSchema: formData.fieldSchema,
            urgencyRules: formData.urgencyRules,
            implications: incidentArchetype?.implications ?? {},
            defaultReportUrgency: formData.defaultReportUrgency,
            parentArchetypeId: formData.parentArchetypeId,
          });
        } else if (entry.type === "inventory") {
          await archetypeService.updateInventoryArchetype(entry.id, {
            name: formData.name,
            description: formData.description || undefined,
            fieldSchema: formData.fieldSchema,
            urgencyRules: formData.urgencyRules,
            resolvesNeeds: formData.resolvesNeeds,
            targetDemographics: formData.targetDemographics,
            quantityUnit: formData.quantityUnit,
            parentArchetypeId: formData.parentArchetypeId,
          });
        } else {
          await archetypeService.updateNeedsArchetype(entry.id, {
            name: formData.name,
            description: formData.description || undefined,
            urgencyRules: formData.urgencyRules,
            icon: formData.icon || undefined,
            color: formData.color || undefined,
            parentArchetypeId: formData.parentArchetypeId,
          });
        }
        setSuccess("Arketip güncellendi");
      }

      onSaved();
    } catch (err: unknown) {
      const e = err as { detail?: string };
      setError(e.detail || (mode === "create" ? "Arketip oluşturulamadı" : "Arketip kaydedilemedi"));
    } finally {
      setSaving(false);
    }
  }, [mode, entry, incidentArchetype, onSaved]);

  const handleTestUrgency = async () => {
    if (!entry) return;
    try {
      setError(null);
      setTestResult(null);
      const values = JSON.parse(testValues);
      let result: { urgency: string; reason: string };

      if (entry.type === "incident") {
        result = await archetypeService.calculateIncidentUrgency(entry.id, values);
      } else if (entry.type === "inventory") {
        result = await archetypeService.calculateInventoryArchetypeUrgency(entry.id, values);
      } else {
        result = await archetypeService.calculateNeedsArchetypeUrgency(entry.id, values);
      }
      setTestResult(result);
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        setError("Geçersiz JSON: " + err.message);
      } else {
        const e = err as { detail?: string };
        setError(e.detail || "Aciliyet hesaplanamadı");
      }
    }
  };

  const isReadOnly = mode === "edit" && entry?.source === "system";

  const currentArchetype = mode === "edit"
    ? (entry?.type === "incident" ? incidentArchetype : entry?.type === "inventory" ? inventoryArchetype : needsArchetype)
    : null;

  const formData: ArchetypeFormData | undefined = useMemo(() => {
    if (mode === "create") {
      return {
        type: "incident",
        id: "",
        name: "",
        description: "",
        category: "food",
        fieldSchema: [],
        urgencyRules: [],
        defaultReportUrgency: "medium",
        quantityUnit: "adet",
        resolvesNeeds: [],
        targetDemographics: [],
        parentArchetypeId: null,
      };
    }

    if (!currentArchetype || !entry) return undefined;

    return {
      type: entry.type,
      id: currentArchetype.id,
      name: currentArchetype.name,
      description: currentArchetype.description ?? "",
      category: entry.type === "inventory" ? (currentArchetype as InventoryArchetype).category : "food",
      fieldSchema: currentArchetype.fieldSchema,
      urgencyRules: currentArchetype.urgencyRules,
      defaultReportUrgency: (currentArchetype as IncidentArchetype).defaultReportUrgency ?? "medium",
      quantityUnit: entry.type === "inventory" ? (currentArchetype as InventoryArchetype).quantityUnit : "adet",
      resolvesNeeds: entry.type === "inventory" ? (currentArchetype as InventoryArchetype).resolvesNeeds : [],
      targetDemographics: entry.type === "inventory" ? (currentArchetype as InventoryArchetype).targetDemographics : [],
      parentArchetypeId: currentArchetype.parentArchetypeId ?? null,
      icon: entry.type === "need" ? (currentArchetype as NeedsArchetype).icon : undefined,
      color: entry.type === "need" ? (currentArchetype as NeedsArchetype).color : undefined,
    };
  }, [mode, entry, currentArchetype]);

  const childArchetypeIds = useMemo(() => {
    return new Set(childArchetypes.map((c) => c.id));
  }, [childArchetypes]);

  const urgencyColor = (urgency: string): "error" | "warning" | "info" | "success" => {
    switch (urgency) {
      case "critical": return "error";
      case "high": return "warning";
      case "medium": return "info";
      default: return "success";
    }
  };

  if (loading) {
    return (
      <Dialog open maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  const showTabs = mode === "edit" && entry;

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { maxHeight: "90vh" } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          {mode === "edit" && (
            <IconButton edge="start" onClick={onClose} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6">
            {mode === "create" ? "Yeni Arketip Oluştur" : entry?.name}
          </Typography>
          {mode === "edit" && entry && (
            <>
              <Chip label={`v${entry.version}`} size="small" />
              <Chip label={entry.source} size="small" variant="outlined" />
            </>
          )}
        </Box>
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ overflow: "hidden" }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {showTabs && (
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
            <Tab label="Düzenle" />
            <Tab label="Aciliyet Testi" />
          </Tabs>
        )}

        {(!showTabs || activeTab === 0) && formData && (
          <Box sx={{ height: showTabs ? "55vh" : "60vh" }}>
            {isReadOnly && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Sistem arketipleri salt okunurdur. Düzenlemek için kopyalayın.
              </Alert>
            )}
            <ArchetypeForm
              initial={formData}
              parentArchetype={parentArchetype ? { name: parentArchetype.name, id: parentArchetype.id } : null}
              inheritedKeys={inheritedKeys}
              allArchetypes={allArchetypes}
              childArchetypeIds={childArchetypeIds}
              knownFieldNames={knownFieldNames}
              knownNeeds={knownNeeds}
              knownDemographics={knownDemographics}
              readOnly={isReadOnly}
              onSave={handleSave}
              saveLabel={mode === "create" ? "Oluştur" : "Kaydet"}
              saving={saving}
              showJson
            />
          </Box>
        )}

        {showTabs && activeTab === 1 && (
          <Paper sx={{ p: 3, height: "55vh", overflow: "auto" }}>
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

        {/* Children section */}
        {mode === "edit" && childArchetypes.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Çocuk Arketipler ({childArchetypes.length})
            </Typography>
            <List dense sx={{ maxHeight: 120, overflow: "auto" }}>
              {childArchetypes.map((child) => (
                <ListItem key={child.id} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <LinkIcon fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={child.name}
                    secondary={`${child.source} · v${child.version}`}
                    primaryTypographyProps={{ variant: "body2" }}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                  <Chip label={child.type === "incident" ? "Olay" : child.type === "inventory" ? "Envanter" : "İhtiyaç"} size="small" sx={{ ml: 1 }} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>
          {mode === "create" ? "İptal" : "Kapat"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
