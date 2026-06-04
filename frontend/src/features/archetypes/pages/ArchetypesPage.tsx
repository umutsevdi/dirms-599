import { useState } from "react";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header from "../../layout/components/Header";
import ArchetypeList from "../components/ArchetypeList";
import ArchetypeEditor from "../components/ArchetypeEditor";
import type { ArchetypeListEntry, ArchetypeSource } from "../types/archetypes.types";

export default function ArchetypesPage() {
  const [editEntry, setEditEntry] = useState<ArchetypeListEntry | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Header
        title="Arketipler"
        showBackButton
        onBack={() => (window.location.href = "/")}
      />

      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Toolbar: Search + Filters + New Button */}
        <Box sx={{ display: "flex", gap: 2, p: 2, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
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
              <MenuItem value="shelter">Barınma</MenuItem>
              <MenuItem value="clothing">Giyim</MenuItem>
              <MenuItem value="equipment">Ekipman</MenuItem>
              <MenuItem value="hygiene">Hijyen</MenuItem>
              <MenuItem value="other">Diğer</MenuItem>
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

          <Box sx={{ flex: 1 }} />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
          >
            Yeni Arketip
          </Button>
        </Box>

        {/* List */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <ArchetypeList
            onSelect={setEditEntry}
            search={search}
            categoryFilter={categoryFilter}
            sourceFilter={sourceFilter}
          />
        </Box>
      </Box>

      {createOpen && (
        <ArchetypeEditor
          entry={null}
          mode="create"
          onClose={() => setCreateOpen(false)}
          onSaved={() => setCreateOpen(false)}
        />
      )}

      {editEntry && (
        <ArchetypeEditor
          entry={editEntry}
          mode="edit"
          onClose={() => setEditEntry(null)}
          onSaved={() => setEditEntry(null)}
        />
      )}
    </Box>
  );
}
