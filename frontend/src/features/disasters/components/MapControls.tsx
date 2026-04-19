import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNominatim } from "../../../shared/hooks/useNominatim";
import type { Coordinates } from "../../../shared/types/common.types";

interface MapControlsProps {
  onLocationSelect: (coords: Coordinates, zoom: number) => void;
  onMyLocation: () => void;
  onAddIncident: () => void;
  onAddPeople: () => void;
  isAddMode: boolean;
  isAddPeopleMode: boolean;
}

const MapControls = ({
  onLocationSelect,
  onMyLocation,
  onAddIncident,
  onAddPeople,
  isAddMode,
  isAddPeopleMode,
}: MapControlsProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { results, loading, search } = useNominatim();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(value);
      setIsOpen(true);
    }, 400);
  };

  const handleSelect = (address: string, location: Coordinates) => {
    setQuery(address.split(",")[0]);
    setIsOpen(false);
    onLocationSelect(location, 13);
  };

  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <Card sx={{ boxShadow: 3, width: 288 }}>
          <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Konum ara..."
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => results.length > 0 && setIsOpen(true)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <SearchIcon
                        sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                      />
                    ),
                    endAdornment: loading ? (
                      <CircularProgress size={16} />
                    ) : null,
                  },
                }}
              />
            </Box>

            {isOpen && results.length > 0 && (
              <List
                sx={{
                  mt: 1,
                  maxHeight: 192,
                  overflowY: "auto",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  p: 0,
                }}
              >
                {results.map((result, index) => (
                  <ListItem
                    key={index}
                    onClick={() => handleSelect(result.address, result)}
                    sx={{
                      cursor: "pointer",
                      px: 2,
                      py: 1,
                      borderBottom: 1,
                      borderColor: "divider",
                      "&:last-child": { borderBottom: "none" },
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemText
                      primary={result.address.split(",")[0]}
                      secondary={result.address}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {isOpen && results.length === 0 && query.length > 2 && !loading && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "center", fontSize: "0.875rem" }}
              >
                No results found
              </Typography>
            )}
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Tooltip title="Kendi konumuma yaklaş" placement="right">
            <IconButton
              onClick={onMyLocation}
              sx={{
                bgcolor: "background.paper",
                boxShadow: 3,
                width: 40,
                height: 40,
              }}
            >
              <MyLocationIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              isAddMode
                ? "Haritada bir noktaya tıklayarak hasar kaydı bırakın"
                : "Haritaya hasar kaydı ekle"
            }
            placement="right"
          >
            <IconButton
              onClick={onAddIncident}
              sx={{
                bgcolor: isAddMode ? "primary.main" : "background.paper",
                color: isAddMode ? "primary.contrastText" : "text.primary",
                boxShadow: 3,
                width: 40,
                height: 40,
                "&:hover": {
                  bgcolor: isAddMode ? "primary.dark" : "action.hover",
                },
              }}
            >
              {isAddMode ? <CloseIcon /> : <AddLocationIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              isAddPeopleMode
                ? "Haritada bir noktaya tıklayarak rapor ekle"
                : "Bir rapor ekle"
            }
            placement="right"
          >
            <IconButton
              onClick={onAddPeople}
              sx={{
                bgcolor: isAddPeopleMode ? "success.main" : "background.paper",
                color: isAddPeopleMode
                  ? "success.contrastText"
                  : "text.primary",
                boxShadow: 3,
                width: 40,
                height: 40,
                "&:hover": {
                  bgcolor: isAddPeopleMode ? "success.dark" : "action.hover",
                },
              }}
            >
              {isAddPeopleMode ? <CloseIcon /> : <PeopleIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default MapControls;
