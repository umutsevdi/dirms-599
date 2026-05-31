import { useState } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../auth/contexts/AuthContext";
import ArchetypeList from "../components/ArchetypeList";
import ArchetypeEditor from "../components/ArchetypeEditor";
import type { ArchetypeListEntry } from "../types/archetypes.types";

export default function ArchetypesPage() {
  const { isAdmin } = useAuth();
  const [selectedEntry, setSelectedEntry] = useState<ArchetypeListEntry | null>(null);

  if (selectedEntry) {
    return (
      <ArchetypeEditor
        entry={selectedEntry}
        onBack={() => setSelectedEntry(null)}
        isAdmin={isAdmin}
      />
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert("Yeni arketip oluşturma özelliği yakında eklenecek.")}
        >
          Yeni Arketip
        </Button>
      </Box>
      <ArchetypeList onSelect={setSelectedEntry} isAdmin={isAdmin} />
    </Box>
  );
}
