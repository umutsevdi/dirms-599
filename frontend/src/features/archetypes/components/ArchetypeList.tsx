import { useState, useEffect, useCallback } from "react";
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
  TextField,
  Chip,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import * as archetypeService from "../services/archetypeService";
import type { ArchetypeListEntry, ArchetypeSource } from "../types/archetypes.types";

interface ArchetypeListProps {
  onSelect: (entry: ArchetypeListEntry) => void;
  isAdmin: boolean;
}

export default function ArchetypeList({ onSelect, isAdmin }: ArchetypeListProps) {
  const [entries, setEntries] = useState<ArchetypeListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
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
      setError(e.detail || "Failed to load archetypes");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, sourceFilter, search]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleDuplicate = async (entry: ArchetypeListEntry) => {
    const newId = prompt("Enter new archetype ID:");
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
      alert(e.detail || "Failed to duplicate archetype");
    }
  };

  const handleDelete = async (entry: ArchetypeListEntry) => {
    if (!confirm(`Delete archetype "${entry.name}"?`)) return;
    try {
      if (entry.type === "incident") {
        await archetypeService.deleteIncidentArchetype(entry.id);
      } else {
        await archetypeService.deleteInventoryArchetype(entry.id);
      }
      loadEntries();
    } catch (err: unknown) {
      const e = err as { detail?: string };
      alert(e.detail || "Failed to delete archetype");
    }
  };

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
      <Typography variant="h5" gutterBottom>Arketipler</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 200 }}
        />
        <FormControl size="small" sx={{ width: 150 }}>
          <InputLabel>Kategori</InputLabel>
          <Select
            value={categoryFilter}
            label="Kategori"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="incident">Olay</MenuItem>
            <MenuItem value="food">Gıda</MenuItem>
            <MenuItem value="medical">Tıbbi</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ width: 150 }}>
          <InputLabel>Kaynak</InputLabel>
          <Select
            value={sourceFilter}
            label="Kaynak"
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="system">Sistem</MenuItem>
            <MenuItem value="wikidata">Wikidata</MenuItem>
            <MenuItem value="user">Kullanıcı</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
              <TableCell>Kaynak</TableCell>
              <TableCell>Versiyon</TableCell>
              <TableCell align="right">İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
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
                    {entry.source !== "system" && isAdmin && (
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
