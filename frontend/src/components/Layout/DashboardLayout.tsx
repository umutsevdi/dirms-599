import { useState, useRef, useCallback } from "react";
import { useNominatim } from "../../hooks/useNominatim";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Box,
  Badge,
  Avatar,
  Tabs,
  Tab,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DisasterMap from "../Map/DisasterMap";
import DisasterTable from "../Tables/DisasterTable";
import DisasterStats from "../Charts/DisasterStats";
import DisasterDialog from "../Dialogs/DisasterDialog";
import InventoryDialog from "../Dialogs/InventoryDialog";
import IncidentDialog from "../Dialogs/IncidentDialog";
import PeopleReportDialog from "../Dialogs/PeopleReportDialog";
import MapControls from "../Map/MapControls";
import MapInfoBoard from "../Map/MapInfoBoard";
import RightPanel from "../Map/RightPanel";
import DisasterTimer from "../Map/DisasterTimer";
import BottomPanel from "./BottomPanel";
import type {
  Coordinates,
  Disaster,
  MapMarker,
  InventoryItem,
  PeopleReport,
} from "../../types";

const theme = createTheme();

const sampleDisasters: Disaster[] = [
  {
    id: "1",
    type: "Earthquake",
    location: { lat: 38.4192, lng: 27.1287 },
    address: "Izmir, Turkey",
    severity: "critical",
    status: "active",
    timestamp: "2026-04-15T10:30:00Z",
    description: "Magnitude 5.8 earthquake reported in Izmir region.",
    affectedRadius: 5000,
  },
  {
    id: "2",
    type: "Flood",
    location: { lat: 41.0082, lng: 28.9784 },
    address: "Istanbul, Turkey",
    severity: "critical",
    status: "contained",
    timestamp: "2026-04-14T08:15:00Z",
    description: "Flash flooding in low-lying areas due to heavy rainfall.",
    affectedRadius: 2000,
  },
  {
    id: "3",
    type: "Wildfire",
    location: { lat: 36.8969, lng: 30.7133 },
    address: "Antalya, Turkey",
    severity: "moderate",
    status: "active",
    timestamp: "2026-04-13T14:45:00Z",
    description: "Forest fire spreading in mountainous region.",
    affectedRadius: 3000,
  },
  {
    id: "4",
    type: "Landslide",
    location: { lat: 40.7486, lng: 29.9243 },
    address: "Sakarya, Turkey",
    severity: "low",
    status: "resolved",
    timestamp: "2026-04-12T06:00:00Z",
    description: "Minor landslide on highway, road cleared.",
  },
];

const sampleInventory: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Water Bottles",
    quantity: 500,
    resolves: ["Water"],
  },
  {
    id: "inv-2",
    name: "First Aid Kits",
    quantity: 120,
    resolves: ["Medical"],
  },
  {
    id: "inv-3",
    name: "Baby Blankets",
    quantity: 300,
    resolves: ["Blankets", "Clothing"],
    group: "baby",
  },
  {
    id: "inv-4",
    name: "Food Rations",
    quantity: 800,
    resolves: ["Food"],
  },
  {
    id: "inv-5",
    name: "Baby Formula",
    quantity: 150,
    resolves: ["Food"],
    group: "baby",
  },
  {
    id: "inv-6",
    name: "Women's Hygiene Kits",
    quantity: 200,
    resolves: ["Medical", "Clothing"],
    group: "women",
  },
  {
    id: "inv-7",
    name: "Elderly Care Supplies",
    quantity: 100,
    resolves: ["Medical", "Shelter"],
    group: "elderly",
  },
  {
    id: "inv-8",
    name: "Emergency Generators",
    quantity: 15,
    resolves: ["Power", "Shelter"],
  },
];

const samplePeopleReports: PeopleReport[] = [
  {
    id: "r-1",
    reporter: "Ahmet Yilmaz",
    location: { lat: 38.4192, lng: 27.1287 },
    address: "Konak, Izmir, Turkey",
    needs: [
      { label: "Water", priority: 1 },
      { label: "Medical", priority: 2 },
      { label: "Shelter", priority: 3 },
    ],
    counts: { baby: 2, child: 5, adult: 12, elderly: 3 },
    genderCounts: { women: 11 },
    statusCounts: { missing: 3, injured: 2 },
    details:
      "Multiple families trapped in collapsed buildings. Urgent medical assistance needed.",
    timestamp: "2026-04-15T11:00:00Z",
    disasterId: "1",
    phoneNumber: "+90 555 123 4567",
    contactMethod: "SMS",
  },
  {
    id: "r-2",
    reporter: "Fatma Kaya",
    location: { lat: 38.425, lng: 27.135 },
    address: "Bornova, Izmir, Turkey",
    needs: [
      { label: "Food", priority: 1 },
      { label: "Blankets", priority: 2 },
    ],
    counts: { baby: 1, child: 3, adult: 8, elderly: 4 },
    genderCounts: { women: 9 },
    statusCounts: { missing: 1, injured: 0 },
    details: "People gathered in open area. Need blankets and food supplies.",
    timestamp: "2026-04-15T11:30:00Z",
    disasterId: "1",
    phoneNumber: "+90 555 987 6543",
    contactMethod: "WhatsApp",
  },
  {
    id: "r-3",
    reporter: "Ali Ozturk",
    location: { lat: 41.0082, lng: 28.9784 },
    address: "Kadikoy, Istanbul, Turkey",
    needs: [
      { label: "Water", priority: 1 },
      { label: "Clothing", priority: 2 },
    ],
    counts: { baby: 0, child: 2, adult: 6, elderly: 1 },
    genderCounts: { women: 5 },
    statusCounts: { missing: 0, injured: 1 },
    details: "Flooded area, people evacuated to higher ground.",
    timestamp: "2026-04-14T09:00:00Z",
    disasterId: "2",
    phoneNumber: "+90 555 222 3344",
    contactMethod: "Call",
  },
  {
    id: "r-4",
    reporter: "Zeynep Arslan",
    location: { lat: 36.8969, lng: 30.7133 },
    address: "Konyaalti, Antalya, Turkey",
    needs: [
      { label: "Medical", priority: 1 },
      { label: "Water", priority: 2 },
    ],
    counts: { baby: 0, child: 1, adult: 4, elderly: 2 },
    genderCounts: { women: 4 },
    statusCounts: { missing: 0, injured: 3 },
    details: "Smoke inhalation cases reported. Need medical supplies urgently.",
    timestamp: "2026-04-13T15:00:00Z",
    disasterId: "3",
    contactMethod: "Other",
  },
  // Additional Istanbul area reports for clustering demo
  {
    id: "r-5",
    reporter: "Mehmet Demir",
    location: { lat: 41.015, lng: 28.985 },
    address: "Moda, Kadikoy, Istanbul, Turkey",
    needs: [
      { label: "Food", priority: 1 },
      { label: "Water", priority: 1 },
      { label: "Shelter", priority: 2 },
    ],
    counts: { baby: 1, child: 4, adult: 9, elderly: 2 },
    genderCounts: { women: 8 },
    statusCounts: { missing: 0, injured: 1 },
    details: "Neighborhood park gathering point. 3 families need assistance.",
    timestamp: "2026-04-14T10:30:00Z",
    disasterId: "2",
    phoneNumber: "+90 555 333 4455",
    contactMethod: "WhatsApp",
  },
  {
    id: "r-6",
    reporter: "Ayse Yildiz",
    location: { lat: 41.012, lng: 28.982 },
    address: "Osmanağa, Kadikoy, Istanbul, Turkey",
    needs: [
      { label: "Medical", priority: 1 },
      { label: "Blankets", priority: 2 },
    ],
    counts: { baby: 2, child: 3, adult: 7, elderly: 3 },
    genderCounts: { women: 7 },
    statusCounts: { missing: 1, injured: 2 },
    details:
      "School gymnasium shelter. Elderly residents need medical checkups.",
    timestamp: "2026-04-14T11:00:00Z",
    disasterId: "2",
    phoneNumber: "+90 555 444 5566",
    contactMethod: "SMS",
  },
  {
    id: "r-7",
    reporter: "Can Yilmaz",
    location: { lat: 41.005, lng: 28.975 },
    address: "Fenerbahce, Kadikoy, Istanbul, Turkey",
    needs: [
      { label: "Water", priority: 1 },
      { label: "Food", priority: 2 },
      { label: "Clothing", priority: 3 },
    ],
    counts: { baby: 0, child: 5, adult: 11, elderly: 1 },
    genderCounts: { women: 9 },
    statusCounts: { missing: 0, injured: 0 },
    details:
      "Sports stadium evacuation center. All ages present, stable condition.",
    timestamp: "2026-04-14T12:00:00Z",
    disasterId: "2",
    phoneNumber: "+90 555 555 6677",
    contactMethod: "Call",
  },
  {
    id: "r-8",
    reporter: "Elif Sahin",
    location: { lat: 41.018, lng: 28.99 },
    address: "Goztepe, Kadikoy, Istanbul, Turkey",
    needs: [
      { label: "Shelter", priority: 1 },
      { label: "Medical", priority: 2 },
      { label: "Water", priority: 2 },
    ],
    counts: { baby: 1, child: 2, adult: 5, elderly: 4 },
    genderCounts: { women: 6 },
    statusCounts: { missing: 2, injured: 1 },
    details:
      "Community center damaged. Families with elderly need urgent relocation.",
    timestamp: "2026-04-14T12:30:00Z",
    disasterId: "2",
    phoneNumber: "+90 555 666 7788",
    contactMethod: "WhatsApp",
  },
  {
    id: "r-9",
    reporter: "Burak Korkmaz",
    location: { lat: 41.022, lng: 28.995 },
    address: "Erenkoy, Kadikoy, Istanbul, Turkey",
    needs: [
      { label: "Food", priority: 1 },
      { label: "Water", priority: 1 },
    ],
    counts: { baby: 3, child: 6, adult: 8, elderly: 2 },
    genderCounts: { women: 10 },
    statusCounts: { missing: 0, injured: 3 },
    details: "Local mosque courtyard. Many children and infants need supplies.",
    timestamp: "2026-04-14T13:00:00Z",
    disasterId: "2",
    phoneNumber: "+90 555 777 8899",
    contactMethod: "SMS",
  },
  {
    id: "r-10",
    reporter: "Selin Aydin",
    location: { lat: 41.01, lng: 28.98 },
    address: "Kosuyolu, Kadikoy, Istanbul, Turkey",
    needs: [
      { label: "Medical", priority: 1 },
      { label: "Shelter", priority: 2 },
      { label: "Blankets", priority: 3 },
    ],
    counts: { baby: 1, child: 3, adult: 6, elderly: 2 },
    genderCounts: { women: 6 },
    statusCounts: { missing: 1, injured: 4 },
    details:
      "Hospital parking lot. Several injured patients discharged to make room.",
    timestamp: "2026-04-14T13:30:00Z",
    disasterId: "2",
    phoneNumber: "+90 555 888 9900",
    contactMethod: "Call",
  },
  {
    id: "r-11",
    reporter: "Emre Celik",
    location: { lat: 41.02, lng: 28.985 },
    address: "Suadiye, Kadikoy, Istanbul, Turkey",
    needs: [
      { label: "Water", priority: 1 },
      { label: "Food", priority: 2 },
      { label: "Clothing", priority: 2 },
    ],
    counts: { baby: 0, child: 4, adult: 10, elderly: 3 },
    genderCounts: { women: 9 },
    statusCounts: { missing: 0, injured: 0 },
    details: "Beach promenade area. Families displaced from nearby residences.",
    timestamp: "2026-04-14T14:00:00Z",
    disasterId: "2",
    phoneNumber: "+90 555 999 0011",
    contactMethod: "WhatsApp",
  },
  {
    id: "r-12",
    reporter: "Deniz Yildirim",
    location: { lat: 41.007, lng: 28.978 },
    address: "Caddebostan, Kadikoy, Istanbul, Turkey",
    needs: [
      { label: "Shelter", priority: 1 },
      { label: "Medical", priority: 1 },
      { label: "Blankets", priority: 2 },
    ],
    counts: { baby: 2, child: 7, adult: 12, elderly: 4 },
    genderCounts: { women: 13 },
    statusCounts: { missing: 3, injured: 5 },
    details:
      "Shopping mall parking structure. Multiple injuries from building collapse nearby.",
    timestamp: "2026-04-14T14:30:00Z",
    disasterId: "2",
    phoneNumber: "+90 555 000 1122",
    contactMethod: "SMS",
  },
];

const MIN_PANEL = 200;
const MAX_PANEL = 600;
const DEFAULT_PANEL = 320;

const DashboardLayout = () => {
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [mapCenter, setMapCenter] = useState<Coordinates>({
    lat: 39.9334,
    lng: 32.8597,
  });
  const [mapZoom, setMapZoom] = useState(6);
  const [inventoryItems, setInventoryItems] =
    useState<InventoryItem[]>(sampleInventory);
  const [peopleReports, setPeopleReports] =
    useState<PeopleReport[]>(samplePeopleReports);
  const [disasters, setDisasters] = useState<Disaster[]>(sampleDisasters);
  const [leftPanelWidth, setLeftPanelWidth] = useState(DEFAULT_PANEL);
  const [rightPanelWidth, setRightPanelWidth] = useState(DEFAULT_PANEL);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addIncidentMode, setAddIncidentMode] = useState(false);
  const [addPeopleMode, setAddPeopleMode] = useState(false);
  const [selectedDisasterMarker, setSelectedDisasterMarker] =
    useState<MapMarker | null>(null);
  // Unified state for people reports display (single or cluster)
  const [displayedPeopleReports, setDisplayedPeopleReports] = useState<
    PeopleReport[]
  >([]);

  const [inventoryDialog, setInventoryDialog] = useState<{
    open: boolean;
    action: "add" | "edit";
  }>({ open: false, action: "add" });
  const [editingInventoryItem, setEditingInventoryItem] =
    useState<InventoryItem | null>(null);
  const [peopleDialog, setPeopleDialog] = useState<{
    open: boolean;
    action: "add" | "edit";
  }>({ open: false, action: "add" });
  const [editingPeopleReport, setEditingPeopleReport] =
    useState<PeopleReport | null>(null);
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<Coordinates | null>(null);
  const [pendingAddress, setPendingAddress] = useState("");

  const mapRef = useRef<{
    setView: (coords: Coordinates, zoom: number) => void;
  } | null>(null);

  const { reverseGeocode } = useNominatim();

  const disasterMarkers: MapMarker[] = disasters.map((d) => ({
    id: d.id,
    position: d.location,
    type: "disaster",
    popupContent: `<strong>${d.type}</strong><br/>${d.address}`,
  }));

  const peopleMarkers: MapMarker[] = peopleReports.map((r) => ({
    id: r.id,
    position: r.location,
    type: "people",
    popupContent: `<strong>${r.reporter}</strong><br/>${r.address}`,
  }));

  const circles = disasters
    .filter((d) => d.affectedRadius)
    .map((d) => ({
      center: d.location,
      radius: d.affectedRadius!,
      color:
        d.severity === "critical"
          ? "#ef4444"
          : d.severity === "moderate"
            ? "#f97316"
            : "#eab308",
    }));

  const statsData = {
    byType: disasters.reduce(
      (acc, d) => {
        const existing = acc.find((item) => item.name === d.type);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ name: d.type, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[]
    ),
    bySeverity: disasters.reduce(
      (acc, d) => {
        const severityName =
          d.severity.charAt(0).toUpperCase() + d.severity.slice(1);
        const existing = acc.find((item) => item.name === severityName);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ name: severityName, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[]
    ),
    byStatus: disasters.reduce(
      (acc, d) => {
        const statusName = d.status.charAt(0).toUpperCase() + d.status.slice(1);
        const existing = acc.find((item) => item.name === statusName);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ name: statusName, count: 1 });
        }
        return acc;
      },
      [] as { name: string; count: number }[]
    ),
  };

  const handleLocationSelect = (coords: Coordinates, zoom: number) => {
    setMapCenter(coords);
    setMapZoom(zoom);
    if (mapRef.current) {
      mapRef.current.setView(coords, zoom);
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: Coordinates = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setMapCenter(coords);
          setMapZoom(13);
          if (mapRef.current) {
            mapRef.current.setView(coords, 13);
          }
        },
        () => {
          console.warn("Geolocation not available");
        }
      );
    }
  };

  const handleToggleAddIncident = () => {
    setAddIncidentMode((prev) => !prev);
  };

  const handleToggleAddPeople = () => {
    setAddPeopleMode((prev) => !prev);
    if (addPeopleMode) {
      setPendingCoords(null);
      setPendingAddress("");
      setEditingPeopleReport(null);
    }
  };

  const handleMapClick = async (coords: Coordinates) => {
    if (addIncidentMode) {
      setPendingCoords(coords);

      // Fetch address from coordinates using reverse geocoding
      const address = await reverseGeocode(coords);
      setPendingAddress(address);

      setIncidentDialogOpen(true);
      setAddIncidentMode(false);
    } else if (addPeopleMode) {
      setPendingCoords(coords);
      setEditingPeopleReport(null);

      // Fetch address from coordinates using reverse geocoding
      const address = await reverseGeocode(coords);
      setPendingAddress(address);

      setPeopleDialog({ open: true, action: "add" });
      setAddPeopleMode(false);
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    if (marker.type === "disaster") {
      setSelectedDisasterMarker(marker);
      setDisplayedPeopleReports([]);
    } else if (marker.type === "people") {
      const report = peopleReports.find((r) => r.id === marker.id);
      if (report) {
        setDisplayedPeopleReports([report]);
      }
      setSelectedDisasterMarker(null);
    }
  };

  const handleRowClick = (disaster: Disaster) => {
    setSelectedDisaster(disaster);
    setIsDialogOpen(true);
  };

  const handleAddInventory = () => {
    setEditingInventoryItem(null);
    setPendingCoords(null);
    setInventoryDialog({ open: true, action: "add" });
  };

  const handleEditInventory = (item: InventoryItem) => {
    setEditingInventoryItem(item);
    setPendingCoords(null);
    setInventoryDialog({ open: true, action: "edit" });
  };

  const handleAddPeople = () => {
    setEditingPeopleReport(null);
    setPendingCoords(null);
    setPendingAddress("");
    setPeopleDialog({ open: true, action: "add" });
  };

  const handleEditPeople = (report: PeopleReport) => {
    setEditingPeopleReport(report);
    setPendingCoords(null);
    setPendingAddress("");
    setPeopleDialog({ open: true, action: "edit" });
  };

  const handleSelectPeople = (report: PeopleReport | null) => {
    if (report) {
      setDisplayedPeopleReports([report]);
      setSelectedDisasterMarker(null);
      setMapCenter(report.location);
      setMapZoom(14);
      if (mapRef.current) {
        mapRef.current.setView(report.location, 14);
      }
    } else {
      setDisplayedPeopleReports([]);
    }
  };

  const handleSelectDisaster = (disaster: Disaster | null) => {
    if (disaster) {
      setSelectedDisasterMarker({
        id: disaster.id,
        position: disaster.location,
        type: "disaster",
        popupContent: `<strong>${disaster.type}</strong><br/>${disaster.address}`,
      });
      setDisplayedPeopleReports([]);
      setMapCenter(disaster.location);
      setMapZoom(12);
      if (mapRef.current) {
        mapRef.current.setView(disaster.location, 12);
      }
    } else {
      setSelectedDisasterMarker(null);
    }
  };

  const handleClusterClick = (reports: PeopleReport[]) => {
    if (reports.length === 0) return;

    setDisplayedPeopleReports(reports);
    setSelectedDisasterMarker(null);
  };

  const handleSaveInventory = (item: InventoryItem) => {
    setInventoryItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? item : i));
      return [...prev, item];
    });
  };

  const handleSavePeople = (report: PeopleReport) => {
    if (pendingCoords) {
      report.location = pendingCoords;
    }
    if (pendingAddress) {
      report.address = pendingAddress;
    }
    setPeopleReports((prev) => {
      const existing = prev.find((r) => r.id === report.id);
      if (existing) return prev.map((r) => (r.id === report.id ? report : r));
      return [...prev, report];
    });
    setPendingCoords(null);
    setPendingAddress("");
  };

  const handleSaveIncident = (incident: Disaster) => {
    setDisasters((prev) => [...prev, incident]);
    setPendingCoords(null);
    setPendingAddress("");
  };

  const handleLeftResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = leftPanelWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        setLeftPanelWidth(
          Math.max(MIN_PANEL, Math.min(MAX_PANEL, startWidth + delta))
        );
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [leftPanelWidth]
  );

  const handleRightResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = rightPanelWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = startX - moveEvent.clientX;
        setRightPanelWidth(
          Math.max(MIN_PANEL, Math.min(MAX_PANEL, startWidth + delta))
        );
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [rightPanelWidth]
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const selectedDisasterFromMarker = selectedDisasterMarker
    ? (disasters.find((d) => d.id === selectedDisasterMarker.id) ?? null)
    : null;

  // displayedPeopleReports is now the single source of truth for people report display

  const selectedReportsFromDisaster = selectedDisasterMarker
    ? peopleReports.filter((r) => r.disasterId === selectedDisasterMarker.id)
    : [];

  const drawerContent = (
    <Box
      sx={{
        width: leftPanelWidth,
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 4,
          height: "100%",
          cursor: "col-resize",
          bgcolor: "action.hover",
          "&:hover": { bgcolor: "primary.main" },
          zIndex: 10,
        }}
        onMouseDown={handleLeftResizeStart}
      />
      <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
        Dashboard
      </Typography>
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="fullWidth"
      >
        <Tab label="Table" />
        <Tab label="Stats" />
      </Tabs>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {activeTab === 0 ? (
          <DisasterTable disasters={disasters} onRowClick={handleRowClick} />
        ) : (
          <DisasterStats data={statsData} />
        )}
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar sx={{ gap: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="a"
              sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
            >
              Disaster Management System
            </Typography>
            <DisasterTimer
              disasters={disasters.map((d) => ({
                timestamp: d.timestamp,
                type: d.type,
              }))}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton color="inherit">
                <Badge badgeContent={1} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Avatar
                src="https://api.dicebear.com/7.x/initials/svg?seed=DM"
                alt="User"
                sx={{ width: 32, height: 32 }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Box
            component="nav"
            sx={{ width: { md: leftPanelWidth }, flexShrink: { md: 0 } }}
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: leftPanelWidth,
                },
              }}
            >
              {drawerContent}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", md: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: leftPanelWidth,
                  borderRight: "1px solid",
                  borderColor: "divider",
                  top: 64,
                  height: "calc(100vh - 64px)",
                },
              }}
              open
            >
              {drawerContent}
            </Drawer>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                overflow: "hidden",
                p: 2,
                pb: 1,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    position: "relative",
                    minHeight: 0,
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <DisasterMap
                    center={mapCenter}
                    zoom={mapZoom}
                    markers={[...disasterMarkers, ...peopleMarkers]}
                    circles={circles}
                    peopleReports={peopleReports}
                    onMapClick={handleMapClick}
                    onMarkerClick={handleMarkerClick}
                    onClusterClick={handleClusterClick}
                    mapRef={mapRef}
                  />
                  <MapControls
                    onLocationSelect={handleLocationSelect}
                    onMyLocation={handleMyLocation}
                    onAddIncident={handleToggleAddIncident}
                    onAddPeople={handleToggleAddPeople}
                    isAddMode={addIncidentMode}
                    isAddPeopleMode={addPeopleMode}
                  />
                  <MapInfoBoard
                    disaster={selectedDisasterFromMarker}
                    peopleReports={displayedPeopleReports}
                    reports={selectedReportsFromDisaster}
                    onClose={() => {
                      setSelectedDisasterMarker(null);
                      setDisplayedPeopleReports([]);
                    }}
                  />
                </Box>
                <BottomPanel
                  disasters={disasters}
                  inventoryItems={inventoryItems}
                  peopleReports={peopleReports}
                  onAddInventory={handleAddInventory}
                  onEditInventory={handleEditInventory}
                  onAddPeople={handleAddPeople}
                  onEditPeople={handleEditPeople}
                  onSelectPeople={handleSelectPeople}
                  onSelectDisaster={handleSelectDisaster}
                />
              </Box>
              <Box
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  width: rightPanelWidth,
                  borderLeft: 1,
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 4,
                    height: "100%",
                    cursor: "col-resize",
                    bgcolor: "action.hover",
                    "&:hover": { bgcolor: "primary.main" },
                    zIndex: 10,
                  }}
                  onMouseDown={handleRightResizeStart}
                />
                <RightPanel disasters={disasters} />
              </Box>
            </Box>
          </Box>
        </Box>

        <DisasterDialog
          disaster={selectedDisaster}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          inventoryItems={inventoryItems}
        />

        <InventoryDialog
          action={inventoryDialog.action}
          item={editingInventoryItem}
          isOpen={inventoryDialog.open}
          onClose={() => {
            setInventoryDialog({ open: false, action: "add" });
            setEditingInventoryItem(null);
            setPendingCoords(null);
          }}
          onSave={handleSaveInventory}
        />

        <PeopleReportDialog
          report={editingPeopleReport}
          isOpen={peopleDialog.open}
          onClose={() => {
            setPeopleDialog({ open: false, action: "add" });
            setEditingPeopleReport(null);
            setPendingCoords(null);
            setPendingAddress("");
          }}
          onSave={handleSavePeople}
          initialLocation={pendingCoords}
          initialAddress={pendingAddress}
        />

        <IncidentDialog
          isOpen={incidentDialogOpen}
          onClose={() => {
            setIncidentDialogOpen(false);
            setPendingCoords(null);
            setPendingAddress("");
          }}
          onSave={handleSaveIncident}
          initialLocation={pendingCoords}
          initialAddress={pendingAddress}
        />
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;
