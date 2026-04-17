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
    severity: "high",
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
    severity: "medium",
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
    type: "Water Bottles",
    location: { lat: 38.4192, lng: 27.1287 },
    status: "available",
    quantity: 500,
    assignedDisaster: "1",
  },
  {
    id: "inv-2",
    type: "First Aid Kits",
    location: { lat: 38.4192, lng: 27.1287 },
    status: "deployed",
    quantity: 120,
    assignedDisaster: "1",
  },
  {
    id: "inv-3",
    type: "Blankets",
    location: { lat: 41.0082, lng: 28.9784 },
    status: "available",
    quantity: 300,
    assignedDisaster: "2",
  },
  {
    id: "inv-4",
    type: "Food Rations",
    location: { lat: 41.0082, lng: 28.9784 },
    status: "deployed",
    quantity: 800,
    assignedDisaster: "2",
  },
  {
    id: "inv-5",
    type: "Generators",
    location: { lat: 36.8969, lng: 30.7133 },
    status: "available",
    quantity: 15,
  },
  {
    id: "inv-6",
    type: "Tents",
    location: { lat: 36.8969, lng: 30.7133 },
    status: "maintenance",
    quantity: 50,
  },
  {
    id: "inv-7",
    type: "Flashlights",
    location: { lat: 38.4192, lng: 27.1287 },
    status: "available",
    quantity: 200,
  },
  {
    id: "inv-8",
    type: "Medical Supplies",
    location: { lat: 40.7486, lng: 29.9243 },
    status: "deployed",
    quantity: 75,
    assignedDisaster: "4",
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
  const [leftPanelWidth, setLeftPanelWidth] = useState(DEFAULT_PANEL);
  const [rightPanelWidth, setRightPanelWidth] = useState(DEFAULT_PANEL);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addIncidentMode, setAddIncidentMode] = useState(false);
  const [addPeopleMode, setAddPeopleMode] = useState(false);
  const [selectedDisasterMarker, setSelectedDisasterMarker] =
    useState<MapMarker | null>(null);
  const [selectedPeopleReportId, setSelectedPeopleReportId] = useState<
    string | null
  >(null);

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
  const [pendingCoords, setPendingCoords] = useState<Coordinates | null>(null);
  const [pendingAddress, setPendingAddress] = useState("");

  const mapRef = useRef<{
    setView: (coords: Coordinates, zoom: number) => void;
  } | null>(null);

  const { reverseGeocode } = useNominatim();

  const disasterMarkers: MapMarker[] = sampleDisasters.map((d) => ({
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

  const circles = sampleDisasters
    .filter((d) => d.affectedRadius)
    .map((d) => ({
      center: d.location,
      radius: d.affectedRadius!,
      color:
        d.severity === "critical"
          ? "#ef4444"
          : d.severity === "high"
            ? "#f97316"
            : "#eab308",
    }));

  const statsData = {
    byType: [
      { name: "Earthquake", count: 1 },
      { name: "Flood", count: 1 },
      { name: "Wildfire", count: 1 },
      { name: "Landslide", count: 1 },
    ],
    bySeverity: [
      { name: "Critical", count: 1 },
      { name: "High", count: 1 },
      { name: "Medium", count: 1 },
      { name: "Low", count: 1 },
    ],
    byStatus: [
      { name: "Active", count: 2 },
      { name: "Contained", count: 1 },
      { name: "Resolved", count: 1 },
    ],
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
      setEditingInventoryItem(null);
      setInventoryDialog({ open: true, action: "add" });
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
      setSelectedPeopleReportId(null);
    } else if (marker.type === "people") {
      setSelectedPeopleReportId(marker.id);
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
      setSelectedPeopleReportId(report.id);
      setSelectedDisasterMarker(null);
      setMapCenter(report.location);
      setMapZoom(14);
      if (mapRef.current) {
        mapRef.current.setView(report.location, 14);
      }
    } else {
      setSelectedPeopleReportId(null);
    }
  };

  const handleSaveInventory = (item: InventoryItem) => {
    if (pendingCoords) {
      item.location = pendingCoords;
    }
    setInventoryItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? item : i));
      return [...prev, item];
    });
    setPendingCoords(null);
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
    ? (sampleDisasters.find((d) => d.id === selectedDisasterMarker.id) ?? null)
    : null;

  const selectedPeopleReport = selectedPeopleReportId
    ? (peopleReports.find((r) => r.id === selectedPeopleReportId) ?? null)
    : null;

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
          <DisasterTable
            disasters={sampleDisasters}
            onRowClick={handleRowClick}
          />
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
              disasters={sampleDisasters.map((d) => ({
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
                    peopleReport={selectedPeopleReport}
                    reports={selectedReportsFromDisaster}
                    onClose={() => {
                      setSelectedDisasterMarker(null);
                      setSelectedPeopleReportId(null);
                    }}
                  />
                </Box>
                <BottomPanel
                  inventoryItems={inventoryItems}
                  peopleReports={peopleReports}
                  onAddInventory={handleAddInventory}
                  onEditInventory={handleEditInventory}
                  onAddPeople={handleAddPeople}
                  onEditPeople={handleEditPeople}
                  onSelectPeople={handleSelectPeople}
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
                <RightPanel disasters={sampleDisasters} />
              </Box>
            </Box>
          </Box>
        </Box>

        <DisasterDialog
          disaster={selectedDisaster}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
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
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;
