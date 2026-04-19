import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Paper,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import BoltIcon from "@mui/icons-material/Bolt";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNominatim } from "../../hooks/useNominatim";
import type { Coordinates, PeopleReport, Need } from "../../types";

const NEED_OPTIONS = [
  "Water",
  "Food",
  "Medical",
  "Shelter",
  "Clothing",
  "Blankets",
  "Other",
];
const CONTACT_METHOD_OPTIONS = ["Phone Call", "SMS", "Other"];

interface PeopleReportDialogProps {
  report?: PeopleReport | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: PeopleReport) => void;
  initialLocation?: Coordinates | null;
  initialAddress?: string;
}

const PeopleReportDialog = ({
  report,
  isOpen,
  onClose,
  onSave,
  initialLocation,
  initialAddress,
}: PeopleReportDialogProps) => {
  const [reporter, setReporter] = useState<{
    name: string;
    phoneNumber?: string;
    contactMethod?: string;
    contactDetails?: string;
  }>({
    name: "",
    phoneNumber: "",
    contactMethod: "Phone Call",
    contactDetails: "",
  });
  const [locationQuery, setLocationQuery] = useState("");
  const [locationCoords, setLocationCoords] = useState<Coordinates | null>(
    null
  );
  const [needs, setNeeds] = useState<Need[]>([]);
  const [counts, setCounts] = useState({
    baby: 0,
    child: 0,
    adult: 0,
    elderly: 0,
  });
  const [genderCounts, setGenderCounts] = useState({ women: 0 });
  const [servicesAccess, setServicesAccess] = useState({
    water: true,
    electricity: true,
  });
  const [statusCounts, setStatusCounts] = useState({
    missing: 0,
    injured: 0,
    disabled: 0,
    bedridden: 0,
  });
  const [chronicDiseases, setChronicDiseases] = useState<
    Record<string, number>
  >({});
  const [newDiseaseName, setNewDiseaseName] = useState("");
  const [newDiseaseCount, setNewDiseaseCount] = useState(1);
  const [details, setDetails] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { results, loading, search } = useNominatim();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (report) {
      setReporter(report.reporter);
      setLocationQuery(report.location.address);
      setLocationCoords(report.location);
      setNeeds([...report.needs].sort((a, b) => a.priority - b.priority));
      setCounts({ ...report.counts });
      setGenderCounts({ women: report.genderCounts?.women || 0 });
      setServicesAccess({
        water: report.servicesAccess?.water ?? true,
        electricity: report.servicesAccess?.electricity ?? true,
      });
      setStatusCounts({
        missing: report.statusCounts?.missing || 0,
        injured: report.statusCounts?.injured || 0,
        disabled: report.statusCounts?.disabled || 0,
        bedridden: report.statusCounts?.bedridden || 0,
      });
      setChronicDiseases(report.statusCounts?.chronicDisease || {});
      setDetails(report.details);
    } else {
      setReporter({
        name: "",
        phoneNumber: "",
        contactMethod: "Phone Call",
        contactDetails: "",
      });
      setLocationQuery(initialAddress || "");
      setLocationCoords(initialLocation || null);
      setNeeds([]);
      setCounts({ baby: 0, child: 0, adult: 0, elderly: 0 });
      setGenderCounts({ women: 0 });
      setServicesAccess({ water: true, electricity: true });
      setStatusCounts({ missing: 0, injured: 0, disabled: 0, bedridden: 0 });
      setChronicDiseases({});
      setDetails("");
    }
    setShowSuggestions(false);
  }, [report, initialLocation, initialAddress, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationChange = (value: string) => {
    setLocationQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(value);
      setShowSuggestions(true);
    }, 400);
  };

  const handleSelectLocation = (location: Coordinates) => {
    setLocationQuery(location.address);
    setLocationCoords(location);
    setShowSuggestions(false);
  };

  const addNeed = (label: string) => {
    if (needs.some((n) => n.label === label)) return;
    const maxPriority =
      needs.length > 0 ? Math.max(...needs.map((n) => n.priority)) : 0;
    setNeeds((prev) => [...prev, { label, priority: maxPriority + 1 }]);
  };

  const removeNeed = (label: string) => {
    setNeeds((prev) => prev.filter((n) => n.label !== label));
  };

  const moveNeed = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === needs.length - 1) return;
    setNeeds((prev) => {
      const newNeeds = [...prev];
      const swapIdx = direction === "up" ? index - 1 : index + 1;
      const tempPriority = newNeeds[index].priority;
      newNeeds[index].priority = newNeeds[swapIdx].priority;
      newNeeds[swapIdx].priority = tempPriority;
      return newNeeds.sort((a, b) => a.priority - b.priority);
    });
  };

  // Chronic disease management functions
  const addChronicDisease = () => {
    const trimmedName = newDiseaseName.trim();
    if (!trimmedName || newDiseaseCount <= 0) return;
    setChronicDiseases((prev) => ({
      ...prev,
      [trimmedName]: newDiseaseCount,
    }));
    setNewDiseaseName("");
    setNewDiseaseCount(1);
  };

  const updateChronicDiseaseCount = (disease: string, count: number) => {
    if (count <= 0) {
      removeChronicDisease(disease);
      return;
    }
    setChronicDiseases((prev) => ({
      ...prev,
      [disease]: count,
    }));
  };

  const removeChronicDisease = (disease: string) => {
    setChronicDiseases((prev) => {
      const updated = { ...prev };
      delete updated[disease];
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporter.name || !locationCoords) return;

    const newReport: PeopleReport = {
      id: report?.id || `report-${Date.now()}`,
      reporter: {
        name: reporter.name,
        phoneNumber: reporter.phoneNumber || undefined,
        contactMethod: reporter.contactMethod || undefined,
        contactDetails: reporter.contactDetails || undefined,
      },
      location: {
        ...locationCoords,
        address: locationQuery,
      },
      needs,
      counts,
      genderCounts,
      servicesAccess,
      statusCounts: {
        ...statusCounts,
        chronicDisease: chronicDiseases,
      },
      details,
      timestamp: new Date().toISOString(),
      disasterId: report?.disasterId,
    };
    onSave(newReport);
    onClose();
  };

  const totalPeople =
    counts.baby + counts.child + counts.adult + counts.elderly;
  const adultElderlyTotal = counts.adult + counts.elderly;
  const derivedMen = Math.max(0, adultElderlyTotal - genderCounts.women);
  const sortedNeeds = [...needs].sort((a, b) => a.priority - b.priority);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{report ? "Edit" : "New"} Report</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
        >
          <TextField
            label="Reporter Name"
            value={reporter.name}
            onChange={(e) =>
              setReporter((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Who is reporting?"
            required
            fullWidth
          />

          <Box ref={wrapperRef} sx={{ position: "relative" }}>
            <TextField
              label="Location"
              value={locationQuery}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder="Search for a location..."
              required
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <LocationOnIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                  endAdornment: loading ? <CircularProgress size={16} /> : null,
                },
              }}
              onFocus={() => results.length > 0 && setShowSuggestions(true)}
            />
            {showSuggestions && results.length > 0 && (
              <List
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  maxHeight: 192,
                  overflowY: "auto",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  p: 0,
                  zIndex: 10,
                  boxShadow: 3,
                }}
              >
                {results.map((result, index) => (
                  <ListItem
                    key={index}
                    onClick={() => handleSelectLocation(result)}
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
          </Box>

          {/* Services Access Section */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5, display: "block" }}
            >
              Services Access
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <WaterDropIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
                <Typography variant="body2">Water:</Typography>
                <Switch
                  checked={servicesAccess.water}
                  onChange={(e) =>
                    setServicesAccess((prev) => ({
                      ...prev,
                      water: e.target.checked,
                    }))
                  }
                  size="small"
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BoltIcon fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="body2">Electric:</Typography>
                <Switch
                  checked={servicesAccess.electricity}
                  onChange={(e) =>
                    setServicesAccess((prev) => ({
                      ...prev,
                      electricity: e.target.checked,
                    }))
                  }
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Contact Information
            </Typography>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                label="Phone Number"
                value={reporter.phoneNumber}
                onChange={(e) =>
                  setReporter((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                placeholder="+90 555 123 4567"
                size="small"
                fullWidth
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Select
                  value={reporter.contactMethod}
                  onChange={(e) =>
                    setReporter((prev) => ({
                      ...prev,
                      contactMethod: e.target.value,
                    }))
                  }
                  displayEmpty
                  size="small"
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Select contact method
                  </MenuItem>
                  {CONTACT_METHOD_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {reporter.contactMethod === "Other" && (
                  <TextField
                    value={reporter.contactDetails}
                    onChange={(e) =>
                      setReporter((prev) => ({
                        ...prev,
                        contactDetails: e.target.value,
                      }))
                    }
                    placeholder="Specify contact method..."
                    size="small"
                    fullWidth
                  />
                )}
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              People Count ({totalPeople} total)
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 2,
              }}
            >
              {(["baby", "child", "adult", "elderly"] as const).map((group) => (
                <TextField
                  key={group}
                  label={group.charAt(0).toUpperCase() + group.slice(1)}
                  type="number"
                  value={counts[group]}
                  onChange={(e) =>
                    setCounts((prev) => ({
                      ...prev,
                      [group]: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  slotProps={{ htmlInput: { min: 0 } }}
                  size="small"
                  fullWidth
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Gender Count
            </Typography>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                label="Women"
                type="number"
                value={genderCounts.women}
                onChange={(e) =>
                  setGenderCounts({
                    women: Math.max(0, Number(e.target.value)),
                  })
                }
                slotProps={{ htmlInput: { min: 0 } }}
                size="small"
                fullWidth
              />
              <TextField
                label="Men"
                type="number"
                value={derivedMen}
                size="small"
                fullWidth
                disabled
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "inherit",
                    color: "text.secondary",
                  },
                }}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Needs
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {NEED_OPTIONS.map((need) => (
                <Chip
                  key={need}
                  label={need}
                  onClick={() => addNeed(need)}
                  color={
                    needs.some((n) => n.label === need) ? "primary" : "default"
                  }
                  variant={
                    needs.some((n) => n.label === need) ? "filled" : "outlined"
                  }
                  clickable
                  sx={{ userSelect: "none" }}
                />
              ))}
            </Box>

            {sortedNeeds.length > 0 && (
              <Paper variant="outlined" sx={{ p: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  Priority Order (top = highest priority)
                </Typography>
                {sortedNeeds.map((need, index) => (
                  <Box
                    key={need.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      py: 0.5,
                      borderBottom: index < sortedNeeds.length - 1 ? 1 : 0,
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        minWidth: 24,
                        fontWeight: "bold",
                        color: "primary.main",
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Chip
                      label={need.label}
                      size="small"
                      variant="outlined"
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => moveNeed(index, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => moveNeed(index, "down")}
                      disabled={index === sortedNeeds.length - 1}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => removeNeed(need.label)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Status
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 2,
              }}
            >
              <TextField
                label="Missing"
                type="number"
                value={statusCounts.missing}
                onChange={(e) =>
                  setStatusCounts((prev) => ({
                    ...prev,
                    missing: Math.max(0, Number(e.target.value)),
                  }))
                }
                slotProps={{ htmlInput: { min: 0 } }}
                size="small"
                fullWidth
              />
              <TextField
                label="Injured"
                type="number"
                value={statusCounts.injured}
                onChange={(e) =>
                  setStatusCounts((prev) => ({
                    ...prev,
                    injured: Math.max(0, Number(e.target.value)),
                  }))
                }
                slotProps={{ htmlInput: { min: 0 } }}
                size="small"
                fullWidth
              />
              <TextField
                label="Disabled"
                type="number"
                value={statusCounts.disabled}
                onChange={(e) =>
                  setStatusCounts((prev) => ({
                    ...prev,
                    disabled: Math.max(0, Number(e.target.value)),
                  }))
                }
                slotProps={{ htmlInput: { min: 0 } }}
                size="small"
                fullWidth
              />
              <TextField
                label="Bedridden"
                type="number"
                value={statusCounts.bedridden}
                onChange={(e) =>
                  setStatusCounts((prev) => ({
                    ...prev,
                    bedridden: Math.max(0, Number(e.target.value)),
                  }))
                }
                slotProps={{ htmlInput: { min: 0 } }}
                size="small"
                fullWidth
              />
            </Box>
          </Box>

          {/* Chronic Diseases Section */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Chronic Diseases (optional)
            </Typography>

            {/* Existing diseases list */}
            {Object.keys(chronicDiseases).length > 0 && (
              <Box sx={{ mb: 2 }}>
                {Object.entries(chronicDiseases).map(([disease, count]) => (
                  <Box
                    key={disease}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      p: 1,
                      bgcolor: "action.hover",
                      borderRadius: 1,
                    }}
                  >
                    <TextField
                      value={disease}
                      size="small"
                      disabled
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      type="number"
                      value={count}
                      onChange={(e) =>
                        updateChronicDiseaseCount(
                          disease,
                          Number(e.target.value)
                        )
                      }
                      slotProps={{ htmlInput: { min: 0 } }}
                      size="small"
                      sx={{ width: 80 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeChronicDisease(disease)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            {/* Add new disease */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                borderStyle: "dashed",
              }}
            >
              <TextField
                label="Disease name"
                value={newDiseaseName}
                onChange={(e) => setNewDiseaseName(e.target.value)}
                placeholder="e.g., Diabetes, Asthma..."
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Count"
                type="number"
                value={newDiseaseCount}
                onChange={(e) =>
                  setNewDiseaseCount(Math.max(1, Number(e.target.value)))
                }
                slotProps={{ htmlInput: { min: 1 } }}
                size="small"
                sx={{ width: 80 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={addChronicDisease}
                disabled={!newDiseaseName.trim()}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Box>

          <TextField
            label="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Additional information..."
            multiline
            rows={3}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!reporter.name || !locationCoords}
          >
            {report ? "Update" : "Submit"} Report
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PeopleReportDialog;
