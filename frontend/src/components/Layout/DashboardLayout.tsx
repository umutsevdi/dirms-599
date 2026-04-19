import { useState, useRef, useCallback } from "react";
import { useNominatim } from "../../hooks/useNominatim";
import { useData } from "../../contexts/DataContext";
import { Box } from "@mui/material";
import { layout, colors } from "../../theme";
import { peopleReports as actualPeopleReports } from "../../data";
import DisasterMap from "../Map/DisasterMap";
import Header from "./Header";
import InventoryDialog from "../Dialogs/InventoryDialog";
import IncidentDialog from "../Dialogs/IncidentDialog";
import PeopleReportDialog from "../Dialogs/PeopleReportDialog";
import MapControls from "../Map/MapControls";
import MapInfoBoard from "../Map/MapInfoBoard";
import SidePanel from "../Map/SidePanel";
import BottomPanel from "./BottomPanel";
import type {
  Coordinates,
  Disaster,
  MapMarker,
  InventoryItem,
  PeopleReport,
} from "../../types";

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

// Use theme layout constants for panel sizing
const MIN_PANEL = layout.panel.minWidth;
const MAX_PANEL = layout.panel.maxWidth;
const DEFAULT_PANEL = layout.panel.defaultWidth;

const DashboardLayout = () => {
  const { disasters, setDisasters } = useData();
  const [mapCenter, setMapCenter] = useState<Coordinates>({
    lat: 39.9334,
    lng: 32.8597,
    address: "",
  });
  const [mapZoom, setMapZoom] = useState(6);
  const [inventoryItems, setInventoryItems] =
    useState<InventoryItem[]>(sampleInventory);
  const [peopleReports, setPeopleReports] =
    useState<PeopleReport[]>(actualPeopleReports);
  const [sidePanelWidth, setSidePanelWidth] = useState<number>(DEFAULT_PANEL);
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
  const [incidentDialog, setIncidentDialog] = useState<{
    open: boolean;
    action: "add" | "edit";
  }>({ open: false, action: "add" });
  const [editingDisaster, setEditingDisaster] = useState<Disaster | null>(null);
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
  }));

  const peopleMarkers: MapMarker[] = peopleReports.map((r) => ({
    id: r.id,
    position: r.location,
    type: "people",
  }));

  const circles = disasters
    .filter((d) => d.affectedRadius)
    .map((d) => ({
      center: d.location,
      radius: d.affectedRadius!,
      color:
        d.severity === "critical"
          ? colors.disaster.main
          : d.severity === "moderate"
            ? colors.warning.main
            : "#eab308", // Keeping yellow as it's not in our semantic palette
    }));

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
            address: "",
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

      setIncidentDialog({ open: true, action: "add" });
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

  const handleAddDisaster = () => {
    setEditingDisaster(null);
    setPendingCoords(null);
    setPendingAddress("");
    setIncidentDialog({ open: true, action: "add" });
  };

  const handleEditDisaster = (disaster: Disaster) => {
    setEditingDisaster(disaster);
    setPendingCoords(null);
    setPendingAddress("");
    setIncidentDialog({ open: true, action: "edit" });
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
      report.location = {
        ...pendingCoords,
        address: pendingAddress || pendingCoords.address || "",
      };
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
    setDisasters((prev) => {
      const existing = prev.find((d) => d.id === incident.id);
      if (existing)
        return prev.map((d) => (d.id === incident.id ? incident : d));
      return [...prev, incident];
    });
    setPendingCoords(null);
    setPendingAddress("");
    setEditingDisaster(null);
  };

  const handleSidePanelResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = sidePanelWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        setSidePanelWidth(
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
    [sidePanelWidth]
  );

  const selectedDisasterFromMarker = selectedDisasterMarker
    ? (disasters.find((d) => d.id === selectedDisasterMarker.id) ?? null)
    : null;

  // displayedPeopleReports is now the single source of truth for people report display

  const selectedReportsFromDisaster = selectedDisasterMarker
    ? peopleReports.filter((r) => r.disasterId === selectedDisasterMarker.id)
    : [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Header title="Disaster Management System" />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Side Panel */}
        <Box
          sx={{
            position: "relative",
            flexShrink: 0,
            width: sidePanelWidth,
            borderRight: 1,
            borderColor: "divider",
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
            onMouseDown={handleSidePanelResizeStart}
          />
          <SidePanel disasters={disasters} />
        </Box>

        {/* Center Area - 50/50 Map and Bottom Panel */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            p: 2,
            gap: 2,
          }}
        >
          {/* Map - 50% height */}
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

          {/* Bottom Panel - 50% height */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
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
              onAddDisaster={handleAddDisaster}
              onEditDisaster={handleEditDisaster}
            />
          </Box>
        </Box>
      </Box>

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
        action={incidentDialog.action}
        disaster={editingDisaster}
        isOpen={incidentDialog.open}
        onClose={() => {
          setIncidentDialog({ open: false, action: "add" });
          setPendingCoords(null);
          setPendingAddress("");
          setEditingDisaster(null);
        }}
        onSave={handleSaveIncident}
        initialLocation={pendingCoords}
        initialAddress={pendingAddress}
      />
    </Box>
  );
};

export default DashboardLayout;
