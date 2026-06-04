import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import * as archetypeService from "../services/archetypeService";
import type { ArchetypeListEntry, ArchetypeSource } from "../types/archetypes.types";

interface ArchetypeListProps {
  onSelect: (entry: ArchetypeListEntry) => void;
  search: string;
  categoryFilter: string;
  sourceFilter: string;
}

export default function ArchetypeList({ onSelect, search, categoryFilter, sourceFilter }: ArchetypeListProps) {
  const [entries, setEntries] = useState<ArchetypeListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await archetypeService.fetchArchetypeList({
        category: categoryFilter || undefined,
        source: (sourceFilter as ArchetypeSource) || undefined,
        search: search || undefined,
      });
      setEntries(data);
    } catch (err: unknown) {
      const e = err as { detail?: string };
      setError(e.detail || "Arketipler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, sourceFilter, search]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleDuplicate = async (entry: ArchetypeListEntry) => {
    const newId = prompt("Yeni arketip ID'sini girin:");
    if (!newId) return;
    try {
      if (entry.type === "incident") {
        await archetypeService.duplicateIncidentArchetype(entry.id, newId);
      } else {
        await archetypeService.duplicateInventoryArchetype(entry.id, newId);
      }
      loadEntries();
    } catch (err: unknown) {
      const e = err as { detail?: string };
      alert(e.detail || "Arketip kopyalanamadı");
    }
  };

  const handleDelete = async (entry: ArchetypeListEntry) => {
    if (!confirm(`"${entry.name}" arketipini silmek istediğinize emin misiniz?`)) return;
    try {
      if (entry.type === "incident") {
        await archetypeService.deleteIncidentArchetype(entry.id);
      } else {
        await archetypeService.deleteInventoryArchetype(entry.id);
      }
      loadEntries();
    } catch (err: unknown) {
      const e = err as { detail?: string };
      alert(e.detail || "Arketip silinemedi");
    }
  };

  const nameMap = useMemo(() => {
    const map = new Map<string, string>();
    entries.forEach((e) => map.set(e.id, e.name));
    return map;
  }, [entries]);

  const filteredEntries = entries.filter((e) => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return e.type === "incident";
    if (activeTab === 2) return e.type === "inventory";
    return true;
  });

  const sourceColor: Record<ArchetypeSource, "default" | "primary" | "secondary"> = {
    system: "default",
    wikidata: "secondary",
    user: "primary",
  };

  if (loading) {
    return <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
        <Tab label="Tümü" />
        <Tab label="Olay" />
        <Tab label="Envanter" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tip</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Ad</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Üst Arketip</TableCell>
              <TableCell>Kaynak</TableCell>
              <TableCell>Versiyon</TableCell>
              <TableCell align="right">İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  Arketip bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry) => (
                <TableRow
                  key={entry.id}
                  hover
                  onClick={() => onSelect(entry)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>
                    <Chip
                      label={entry.type === "incident" ? "Olay" : "Envanter"}
                      size="small"
                      color={entry.type === "incident" ? "error" : "info"}
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                    {entry.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "medium" }}>{entry.name}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>
                    {entry.parentArchetypeId ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <LinkIcon fontSize="small" sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                          {nameMap.get(entry.parentArchetypeId) || entry.parentArchetypeId}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.disabled">—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={entry.source}
                      size="small"
                      color={sourceColor[entry.source]}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>v{entry.version}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => onSelect(entry)}>
                      Düzenle
                    </Button>
                    <Button size="small" startIcon={<ContentCopyIcon />} onClick={() => handleDuplicate(entry)}>
                      Kopyala
                    </Button>
                    {entry.source !== "system" && (
                      <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(entry)}>
                        Sil
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
