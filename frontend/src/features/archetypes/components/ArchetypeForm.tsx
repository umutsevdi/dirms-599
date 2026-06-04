import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
  Paper,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CodeIcon from "@mui/icons-material/Code";
import LinkIcon from "@mui/icons-material/Link";
import type {
  ArchetypeFieldSchema,
  ArchetypeUrgencyRule,
  UrgencyLevel,
} from "../types/archetypes.types";

type ArchetypeType = "incident" | "inventory" | "need";
type InventoryCategory = "food" | "medical" | "shelter" | "clothing" | "equipment" | "hygiene" | "other";

const INVENTORY_CATEGORIES: { value: InventoryCategory; label: string }[] = [
  { value: "food", label: "Gıda" },
  { value: "medical", label: "Tıbbi" },
  { value: "shelter", label: "Barınma" },
  { value: "clothing", label: "Giyim" },
  { value: "equipment", label: "Ekipman" },
  { value: "hygiene", label: "Hijyen" },
  { value: "other", label: "Diğer" },
];

const URGENCY_LEVELS: { value: UrgencyLevel; label: string }[] = [
  { value: "critical", label: "Kritik" },
  { value: "high", label: "Yüksek" },
  { value: "medium", label: "Orta" },
  { value: "low", label: "Düşük" },
];

const OPERATORS = ["<", ">", "=", "<=", ">="] as const;
const FIELD_TYPES = ["number", "text", "boolean"] as const;

export interface ArchetypeFormData {
  type: ArchetypeType;
  id: string;
  name: string;
  description: string;
  category: InventoryCategory;
  fieldSchema: ArchetypeFieldSchema[];
  urgencyRules: ArchetypeUrgencyRule[];
  defaultReportUrgency: UrgencyLevel;
  quantityUnit: string;
  resolvesNeeds: string[];
  targetDemographics: string[];
  parentArchetypeId?: string | null;
  icon?: string;
  color?: string;
}

interface InheritedKeys {
  fieldKeys: Set<string>;
  ruleKeys: Set<string>;
}

interface ArchetypeFormProps {
  initial?: ArchetypeFormData;
  parentArchetype?: { name: string; id: string } | null;
  inheritedKeys?: InheritedKeys | null;
  allArchetypes?: { id: string; name: string; type: string; category: string; parentArchetypeId?: string; fieldSchema?: { field: string }[] }[];
  childArchetypeIds?: Set<string>;
  knownFieldNames?: string[];
  knownNeeds?: string[];
  knownDemographics?: string[];
  readOnly?: boolean;
  showJson?: boolean;
  onSave: (data: ArchetypeFormData) => void;
  saveLabel?: string;
  saving?: boolean;
}

const emptyFieldSchema: ArchetypeFieldSchema = {
  field: "",
  label: "",
  type: "text",
  required: false,
  options: [],
};

const emptyUrgencyRule: ArchetypeUrgencyRule = {
  field: "",
  operator: "<",
  value: 0,
  setUrgency: "medium",
  message: "",
};

export default function ArchetypeForm({
  initial,
  parentArchetype,
  inheritedKeys,
  allArchetypes = [],
  childArchetypeIds = new Set(),
  knownFieldNames = [],
  knownNeeds = [],
  knownDemographics = [],
  readOnly = false,
  showJson: showJsonInitial = false,
  onSave,
  saveLabel = "Kaydet",
  saving = false,
}: ArchetypeFormProps) {
  const [type, setType] = useState<ArchetypeType>(initial?.type ?? "incident");
  const [category, setCategory] = useState<InventoryCategory>(initial?.category ?? "food");
  const [id, setId] = useState(initial?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [parentArchetypeId, setParentArchetypeId] = useState(initial?.parentArchetypeId ?? "");
  const [fieldSchema, setFieldSchema] = useState<ArchetypeFieldSchema[]>(initial?.fieldSchema ?? []);
  const [urgencyRules, setUrgencyRules] = useState<ArchetypeUrgencyRule[]>(initial?.urgencyRules ?? []);
  const [defaultReportUrgency, setDefaultReportUrgency] = useState<UrgencyLevel>(initial?.defaultReportUrgency ?? "medium");
  const [quantityUnit, setQuantityUnit] = useState(initial?.quantityUnit ?? "adet");
  const [resolvesNeeds, setResolvesNeeds] = useState<string[]>(initial?.resolvesNeeds ?? []);
  const [targetDemographics, setTargetDemographics] = useState<string[]>(initial?.targetDemographics ?? []);
  const [needInput, setNeedInput] = useState("");
  const [demographicInput, setDemographicInput] = useState("");
  const [showJson, setShowJson] = useState(showJsonInitial);
  const [formTab, setFormTab] = useState(0);
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [color, setColor] = useState(initial?.color ?? "");

  const parentOptions = useMemo(() => {
    return allArchetypes
      .filter((a) => {
        if (a.type !== type) return false;
        if (childArchetypeIds.has(a.id)) return false;
        if (type === "inventory" && a.category !== category) return false;
        return true;
      })
      .map((a) => ({ id: a.id, name: a.name }));
  }, [allArchetypes, type, category, childArchetypeIds]);

  const dynamicFieldNames = useMemo(() => {
    const fields = new Set<string>(knownFieldNames);

    const collectFields = (parentId: string | null | undefined) => {
      if (!parentId) return;
      const parent = allArchetypes.find((a) => a.id === parentId);
      if (!parent) return;
      parent.fieldSchema?.forEach((f) => { if (f.field) fields.add(f.field); });
      collectFields(parent.parentArchetypeId);
    };
    collectFields(parentArchetypeId);

    return Array.from(fields).sort();
  }, [knownFieldNames, allArchetypes, parentArchetypeId]);

  const fieldTypeMap = useMemo(() => {
    const map = new Map<string, string>();
    fieldSchema.forEach((f) => { if (f.field) map.set(f.field, f.type); });

    const collectTypes = (parentId: string | null | undefined) => {
      if (!parentId) return;
      const parent = allArchetypes.find((a) => a.id === parentId);
      if (!parent) return;
      parent.fieldSchema?.forEach((f) => { if (f.field && !map.has(f.field)) map.set(f.field, f.type); });
      collectTypes(parent.parentArchetypeId);
    };
    collectTypes(parentArchetypeId);

    return map;
  }, [fieldSchema, allArchetypes, parentArchetypeId]);

  const getRuleOperators = (field: string): string[] => {
    const t = fieldTypeMap.get(field);
    if (t === "boolean") return ["="];
    if (t === "text") return ["=", "<", ">"];
    return OPERATORS as unknown as string[];
  };

  const getRuleValueType = (field: string): "number" | "text" | "boolean" => {
    return (fieldTypeMap.get(field) as "number" | "text" | "boolean") || "number";
  };

  const generateJson = useMemo(() => {
    const base = {
      id,
      name,
      description: description || undefined,
      parent_archetype_id: parentArchetypeId || undefined,
      field_schema: fieldSchema.map((f) => ({
        field: f.field,
        label: f.label,
        type: f.type,
        required: f.required,
        options: f.options && f.options.length > 0 ? f.options : undefined,
        defaultValue: f.defaultValue,
      })),
      urgency_rules: urgencyRules.map((r) => ({
        field: r.field,
        operator: r.operator,
        value: r.value,
        setUrgency: r.setUrgency,
        message: r.message,
      })),
    };

    if (type === "incident") {
      return {
        ...base,
        default_report_urgency: defaultReportUrgency,
        implications: {
          needs: [],
          demographics: [],
          chronic_diseases: [],
          status_counts: {},
        },
      };
    }

    if (type === "need") {
      return {
        ...base,
        icon: icon || undefined,
        color: color || undefined,
      };
    }

    return {
      ...base,
      category,
      resolves_needs: resolvesNeeds,
      target_demographics: targetDemographics,
      quantity_unit: quantityUnit,
    };
  }, [
    type,
    category,
    id,
    name,
    description,
    parentArchetypeId,
    fieldSchema,
    urgencyRules,
    defaultReportUrgency,
    quantityUnit,
    resolvesNeeds,
    targetDemographics,
    icon,
    color,
  ]);

  const isValid = id.trim() !== "" && name.trim() !== "";

  const handleSave = () => {
    onSave({
      type,
      id: id.trim(),
      name: name.trim(),
      description: description.trim(),
      category,
      fieldSchema,
      urgencyRules,
      defaultReportUrgency,
      quantityUnit,
      resolvesNeeds,
      targetDemographics,
      parentArchetypeId: parentArchetypeId || null,
      icon: icon || undefined,
      color: color || undefined,
    });
  };

  const addField = () => setFieldSchema([...fieldSchema, { ...emptyFieldSchema }]);
  const removeField = (idx: number) => setFieldSchema(fieldSchema.filter((_, i) => i !== idx));
  const updateField = (idx: number, key: keyof ArchetypeFieldSchema, value: unknown) =>
    setFieldSchema(fieldSchema.map((f, i) => (i === idx ? { ...f, [key]: value } : f)));

  const addRule = () => setUrgencyRules([...urgencyRules, { ...emptyUrgencyRule }]);
  const removeRule = (idx: number) => setUrgencyRules(urgencyRules.filter((_, i) => i !== idx));
  const updateRule = (idx: number, key: keyof ArchetypeUrgencyRule, value: unknown) =>
    setUrgencyRules(urgencyRules.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));

  const updateRuleField = (idx: number, fieldName: string) => {
    const newType = fieldTypeMap.get(fieldName) || "number";
    const validOps = getRuleOperators(fieldName);
    const currentRule = urgencyRules[idx];
    let newValue: unknown = currentRule?.value ?? 0;
    if (newType === "boolean") newValue = false;
    else if (newType === "number") newValue = 0;
    else newValue = "";

    setUrgencyRules(urgencyRules.map((r, i) => {
      if (i !== idx) return r;
      return {
        ...r,
        field: fieldName,
        operator: validOps.includes(r.operator) ? r.operator : validOps[0],
        value: newValue,
      };
    }));
  };

  const removeNeed = (idx: number) => setResolvesNeeds(resolvesNeeds.filter((_, i) => i !== idx));

  const removeDemographic = (idx: number) =>
    setTargetDemographics(targetDemographics.filter((_, i) => i !== idx));

  const getFieldOrigin = (fieldKey: string): "inherited" | "own" | "overridden" => {
    if (!inheritedKeys) return "own";
    if (inheritedKeys.fieldKeys.has(fieldKey)) return "inherited";
    return "own";
  };

  const getRuleOrigin = (rule: ArchetypeUrgencyRule): "inherited" | "own" | "overridden" => {
    if (!inheritedKeys) return "own";
    const ruleKey = `${rule.field}-${rule.operator}-${rule.value}`;
    if (inheritedKeys.ruleKeys.has(ruleKey)) return "inherited";
    return "own";
  };

  const OriginChip = ({ origin }: { origin: "inherited" | "own" | "overridden" }) => {
    if (origin === "own" || !inheritedKeys) return null;
    return (
      <Chip
        label={origin === "inherited" ? "Miras" : "Geçersiz Kılma"}
        size="small"
        color={origin === "inherited" ? "default" : "warning"}
        variant="outlined"
        sx={{ height: 18, fontSize: "0.65rem", mr: 0.5 }}
      />
    );
  };

  const inventoryTabOffset = type === "inventory" ? 1 : 0;
  const needsTabOffset = type === "need" ? 1 : 0;

  return (
    <Box sx={{ display: "flex", gap: 2, height: "100%", minHeight: 0 }}>
      {/* Form Section */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Type & Category */}
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexShrink: 0 }}>
          <FormControl fullWidth size="small" disabled={readOnly}>
            <InputLabel>Tip</InputLabel>
            <Select
              value={type}
              label="Tip"
              onChange={(e) => setType(e.target.value as ArchetypeType)}
            >
              <MenuItem value="incident">Olay</MenuItem>
              <MenuItem value="inventory">Envanter</MenuItem>
              <MenuItem value="need">İhtiyaç</MenuItem>
            </Select>
          </FormControl>

          {type === "inventory" && (
            <FormControl fullWidth size="small" disabled={readOnly}>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={category}
                label="Kategori"
                onChange={(e) => setCategory(e.target.value as InventoryCategory)}
              >
                {INVENTORY_CATEGORIES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Basic Info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2, flexShrink: 0 }}>
          <TextField
            size="small"
            label="ID"
            value={id}
            onChange={(e) => setId(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            helperText="Benzersiz tanımlayıcı (örn: deprem-2024)"
            required
            disabled={readOnly}
          />
          <TextField
            size="small"
            label="Ad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={readOnly}
          />
          <TextField
            size="small"
            label="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            disabled={readOnly}
          />
          {parentOptions.length > 0 && (
            <FormControl size="small" disabled={readOnly}>
              <InputLabel>Türetildiği Arketip</InputLabel>
              <Select
                value={parentArchetypeId}
                label="Türetildiği Arketip"
                onChange={(e) => setParentArchetypeId(e.target.value)}
              >
                <MenuItem value="">— Yok (kök arketip) —</MenuItem>
                {parentOptions.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {parentArchetype && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
              <LinkIcon fontSize="small" sx={{ fontSize: 16 }} />
              <Typography variant="caption">
                Türetildiği: <strong>{parentArchetype.name}</strong>
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 1, flexShrink: 0 }} />

        {/* Tabs */}
        <Tabs value={formTab} onChange={(_, v) => setFormTab(v)} sx={{ mb: 1, flexShrink: 0 }}>
          <Tab label="Alanlar" />
          <Tab label="Aciliyet Kuralları" />
          {type === "inventory" && <Tab label="Envanter Özellikleri" />}
          {type === "need" && <Tab label="Görünüm" />}
        </Tabs>

        {/* Scrollable content area */}
        <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
          {/* Field Schema */}
          {formTab === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 0.5 }}>
              {fieldSchema.map((f, idx) => {
                const origin = getFieldOrigin(f.field);
                const isInherited = origin === "inherited";
                return (
                  <Paper
                    key={idx}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      bgcolor: isInherited ? "action.hover" : "transparent",
                      borderLeft: isInherited ? "3px solid" : undefined,
                      borderColor: isInherited ? "text.disabled" : undefined,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                      <OriginChip origin={origin} />
                      <TextField
                        size="small"
                        label="Alan"
                        value={f.field}
                        onChange={(e) => updateField(idx, "field", e.target.value)}
                        sx={{ width: 120 }}
                        disabled={readOnly || isInherited}
                      />
                      <TextField
                        size="small"
                        label="Etiket"
                        value={f.label}
                        onChange={(e) => updateField(idx, "label", e.target.value)}
                        sx={{ flex: 1 }}
                        disabled={readOnly || isInherited}
                      />
                      <FormControl size="small" sx={{ width: 100 }} disabled={readOnly || isInherited}>
                        <InputLabel>Tip</InputLabel>
                        <Select
                          value={f.type}
                          label="Tip"
                          onChange={(e) => updateField(idx, "type", e.target.value)}
                        >
                          {FIELD_TYPES.map((t) => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={f.required}
                            onChange={(e) => updateField(idx, "required", e.target.checked)}
                            disabled={readOnly || isInherited}
                          />
                        }
                        label="Zorunlu"
                        sx={{ mr: 0 }}
                      />
                      {!readOnly && !isInherited && (
                        <IconButton size="small" onClick={() => removeField(idx)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Paper>
                );
              })}
              {!readOnly && (
                <Button size="small" startIcon={<AddIcon />} onClick={addField}>
                  Alan Ekle
                </Button>
              )}
            </Box>
          )}

          {/* Urgency Rules */}
          {formTab === 1 - inventoryTabOffset && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 0.5 }}>
              {urgencyRules.map((r, idx) => {
                const origin = getRuleOrigin(r);
                const isInherited = origin === "inherited";
                return (
                  <Paper
                    key={idx}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      bgcolor: isInherited ? "action.hover" : origin === "overridden" ? "warning.light" : "transparent",
                      borderLeft: isInherited ? "3px solid" : undefined,
                      borderColor: isInherited ? "text.disabled" : origin === "overridden" ? "warning.main" : undefined,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", flexWrap: "wrap" }}>
                      <OriginChip origin={origin} />
                      <Autocomplete
                        freeSolo
                        options={dynamicFieldNames}
                        value={r.field}
                        onChange={(_, newValue) => {
                          if (newValue !== null) {
                            const fieldName = typeof newValue === "string" ? newValue : newValue?.field || "";
                            updateRuleField(idx, fieldName);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label="Alan"
                            sx={{ width: 140 }}
                            disabled={readOnly || isInherited}
                          />
                        )}
                        sx={{ width: 140 }}
                      />
                      <FormControl size="small" sx={{ width: 70 }} disabled={readOnly || isInherited}>
                        <InputLabel>Op</InputLabel>
                        <Select
                          value={r.operator}
                          label="Op"
                          onChange={(e) => updateRule(idx, "operator", e.target.value)}
                        >
                          {getRuleOperators(r.field).map((op) => (
                            <MenuItem key={op} value={op}>{op}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {(() => {
                        const valType = getRuleValueType(r.field);
                        if (valType === "boolean") {
                          return (
                            <FormControl size="small" sx={{ width: 90 }} disabled={readOnly || isInherited}>
                              <InputLabel>Değer</InputLabel>
                              <Select
                                value={String(r.value)}
                                label="Değer"
                                onChange={(e) => updateRule(idx, "value", e.target.value === "true")}
                              >
                                <MenuItem value="true">True</MenuItem>
                                <MenuItem value="false">False</MenuItem>
                              </Select>
                            </FormControl>
                          );
                        }
                        if (valType === "text") {
                          return (
                            <TextField
                              size="small"
                              label="Değer"
                              value={r.value}
                              onChange={(e) => updateRule(idx, "value", e.target.value)}
                              sx={{ width: 100 }}
                              disabled={readOnly || isInherited}
                            />
                          );
                        }
                        return (
                          <TextField
                            size="small"
                            label="Değer"
                            type="number"
                            value={r.value}
                            onChange={(e) => updateRule(idx, "value", Number(e.target.value))}
                            sx={{ width: 80 }}
                            disabled={readOnly || isInherited}
                          />
                        );
                      })()}
                      <FormControl size="small" sx={{ width: 110 }} disabled={readOnly || isInherited}>
                        <InputLabel>Aciliyet</InputLabel>
                        <Select
                          value={r.setUrgency}
                          label="Aciliyet"
                          onChange={(e) => updateRule(idx, "setUrgency", e.target.value)}
                        >
                          {URGENCY_LEVELS.map((u) => (
                            <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        size="small"
                        label="Mesaj"
                        value={r.message}
                        onChange={(e) => updateRule(idx, "message", e.target.value)}
                        sx={{ flex: 1, minWidth: 150 }}
                        disabled={readOnly || isInherited}
                      />
                      {!readOnly && !isInherited && (
                        <IconButton size="small" onClick={() => removeRule(idx)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Paper>
                );
              })}
              {!readOnly && (
                <Button size="small" startIcon={<AddIcon />} onClick={addRule}>
                  Kural Ekle
                </Button>
              )}
              <Box sx={{ mt: 1 }}>
                <FormControl size="small" sx={{ width: 150 }}>
                  <InputLabel>Varsayılan Aciliyet</InputLabel>
                  <Select
                    value={defaultReportUrgency}
                    label="Varsayılan Aciliyet"
                    onChange={(e) => setDefaultReportUrgency(e.target.value as UrgencyLevel)}
                    disabled={readOnly}
                  >
                    {URGENCY_LEVELS.map((u) => (
                      <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}

          {/* Inventory Properties */}
          {type === "inventory" && formTab === 2 - inventoryTabOffset && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 0.5 }}>
              <TextField
                size="small"
                label="Birim"
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value)}
                helperText="Miktar birimi (örn: adet, kg, litre)"
                disabled={readOnly}
              />

              <Box>
                <Typography variant="subtitle2" gutterBottom>İhtiyaçları Çözer</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                  {resolvesNeeds.map((n, idx) => (
                    <Chip
                      key={idx}
                      label={n}
                      size="small"
                      onDelete={() => !readOnly && removeNeed(idx)}
                    />
                  ))}
                </Box>
                {!readOnly && (
                  <Autocomplete
                    freeSolo
                    options={knownNeeds.filter((n) => !resolvesNeeds.includes(n))}
                    inputValue={needInput}
                    onInputChange={(_, v) => setNeedInput(v)}
                    onChange={(_, newValue) => {
                      if (newValue && typeof newValue === "string" && newValue.trim()) {
                        const val = newValue.trim();
                        if (!resolvesNeeds.includes(val)) {
                          setResolvesNeeds([...resolvesNeeds, val]);
                        }
                        setNeedInput("");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="İhtiyaç seçin veya yazın..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && needInput.trim()) {
                            const val = needInput.trim();
                            if (!resolvesNeeds.includes(val)) {
                              setResolvesNeeds([...resolvesNeeds, val]);
                            }
                            setNeedInput("");
                          }
                        }}
                      />
                    )}
                  />
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>Hedef Kitle</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                  {targetDemographics.map((d, idx) => (
                    <Chip
                      key={idx}
                      label={d}
                      size="small"
                      onDelete={() => !readOnly && removeDemographic(idx)}
                    />
                  ))}
                </Box>
                {!readOnly && (
                  <Autocomplete
                    freeSolo
                    options={knownDemographics.filter((d) => !targetDemographics.includes(d))}
                    inputValue={demographicInput}
                    onInputChange={(_, v) => setDemographicInput(v)}
                    onChange={(_, newValue) => {
                      if (newValue && typeof newValue === "string" && newValue.trim()) {
                        const val = newValue.trim();
                        if (!targetDemographics.includes(val)) {
                          setTargetDemographics([...targetDemographics, val]);
                        }
                        setDemographicInput("");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Grup seçin veya yazın..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && demographicInput.trim()) {
                            const val = demographicInput.trim();
                            if (!targetDemographics.includes(val)) {
                              setTargetDemographics([...targetDemographics, val]);
                            }
                            setDemographicInput("");
                          }
                        }}
                      />
                    )}
                  />
                )}
              </Box>
            </Box>
          )}

          {/* Needs Appearance */}
          {type === "need" && formTab === 2 - needsTabOffset && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 0.5 }}>
              <TextField
                size="small"
                label="İkon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                helperText="MUI ikon adı (örn: WaterDrop, Restaurant)"
                disabled={readOnly}
              />
              <TextField
                size="small"
                label="Renk"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                helperText="Hex renk kodu (örn: #2196F3)"
                disabled={readOnly}
              />
            </Box>
          )}
        </Box>

        {/* Save bar */}
        <Box sx={{ display: "flex", gap: 1, mt: 2, flexShrink: 0, alignItems: "center" }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showJson}
                onChange={(e) => setShowJson(e.target.checked)}
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CodeIcon fontSize="small" />
                JSON
              </Box>
            }
            sx={{ mr: "auto" }}
          />
          {!readOnly && (
            <Button
              variant="contained"
              disabled={!isValid || saving}
              onClick={handleSave}
            >
              {saving ? "Kaydediliyor..." : saveLabel}
            </Button>
          )}
        </Box>
      </Box>

      {/* JSON Preview */}
      <Collapse in={showJson} orientation="horizontal">
        <Paper
          variant="outlined"
          sx={{
            width: 380,
            p: 2,
            overflow: "auto",
            maxHeight: "100%",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            JSON
          </Typography>
          <Box
            component="pre"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.75rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              m: 0,
            }}
          >
            {JSON.stringify(generateJson, null, 2)}
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
}
