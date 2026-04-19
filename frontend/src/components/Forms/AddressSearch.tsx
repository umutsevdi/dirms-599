import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Box,
} from "@mui/material";
import type { Coordinates } from "../../types";

interface AddressSearchProps {
  onSearch: (query: string) => void;
  onLocationSelect: (coords: Coordinates) => void;
}

const AddressSearch = ({ onSearch, onLocationSelect }: AddressSearchProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Search Location
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", gap: 1 }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Enter address or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
        </Box>
        <Divider sx={{ my: 2 }}>OR</Divider>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onLocationSelect({ lat: 39.9334, lng: 32.8597, address: "" })}
        >
          Use my location
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddressSearch;
