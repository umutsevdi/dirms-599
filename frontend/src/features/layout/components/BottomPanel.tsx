import { useState, useMemo } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import type { Disaster } from "../../disasters/types/disasters.types";
import type { InventoryItem } from "../../inventory/types/inventory.types";
import type { PeopleReport } from "../../people-reports/types/people-reports.types";
import { getNeedName } from "../../../features/needs/services/needsService";

interface BottomPanelProps {
  disasters: Disaster[];
  inventoryItems: InventoryItem[];
  peopleReports: PeopleReport[];
  onAddInventory: () => void;
  onEditInventory: (item: InventoryItem) => void;
  onSelectInventory: (item: InventoryItem | null) => void;
  onAddPeople: () => void;
  onEditPeople: (report: PeopleReport) => void;
  onSelectPeople: (report: PeopleReport | null) => void;
  onSelectDisaster: (disaster: Disaster | null) => void;
  onAddDisaster?: () => void;
  onEditDisaster?: (disaster: Disaster) => void;
}

const BottomPanel = ({
  disasters,
  inventoryItems,
  peopleReports,
  onAddInventory,
  onEditInventory,
  onSelectInventory,
  onAddPeople,
  onEditPeople,
  onSelectPeople,
  onSelectDisaster,
  onAddDisaster,
  onEditDisaster,
}: BottomPanelProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [inventorySearch, setInventorySearch] = useState("");
  const [peopleSearch, setPeopleSearch] = useState("");
  const [disasterSearch, setDisasterSearch] = useState("");
  const [selectedPeopleId, setSelectedPeopleId] = useState<string | null>(null);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(
    null
  );
  const [selectedDisasterId, setSelectedDisasterId] = useState<string | null>(
    null
  );

  const filteredInventory = useMemo(() => {
    if (!inventorySearch) return inventoryItems;
    const q = inventorySearch.toLowerCase();
    return inventoryItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.resolves.some((r) => r.toLowerCase().includes(q)) ||
        (item.group && item.group.toLowerCase().includes(q))
    );
  }, [inventoryItems, inventorySearch]);

  const filteredPeople = useMemo(() => {
    if (!peopleSearch) return peopleReports;
    const q = peopleSearch.toLowerCase();
    return peopleReports.filter(
      (r) =>
        r.reporter.name.toLowerCase().includes(q) ||
        r.location.address.toLowerCase().includes(q) ||
        r.needs.some((n) => getNeedName(n.archetypeId).toLowerCase().includes(q))
    );
  }, [peopleReports, peopleSearch]);

  const filteredDisasters = useMemo(() => {
    if (!disasterSearch) return disasters;
    const q = disasterSearch.toLowerCase();
    return disasters.filter(
      (d) =>
        d.type.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q) ||
        d.severity.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
    );
  }, [disasters, disasterSearch]);

  const handleSelectPeopleRow = (report: PeopleReport) => {
    const newId = report.id === selectedPeopleId ? null : report.id;
    setSelectedPeopleId(newId);
    setSelectedInventoryId(null);
    setSelectedDisasterId(null);
    const selected = newId === report.id ? report : null;
    onSelectPeople(selected);
    onSelectDisaster(null);
  };

  const handleSelectInventoryRow = (item: InventoryItem) => {
    const newId = item.id === selectedInventoryId ? null : item.id;
    setSelectedInventoryId(newId);
    setSelectedPeopleId(null);
    setSelectedDisasterId(null);
    const selected = newId === item.id ? item : null;
    onSelectInventory(selected);
    onSelectPeople(null);
    onSelectDisaster(null);
  };

  const handleSelectDisasterRow = (disaster: Disaster) => {
    const newId = disaster.id === selectedDisasterId ? null : disaster.id;
    setSelectedDisasterId(newId);
    setSelectedPeopleId(null);
    setSelectedInventoryId(null);
    const selected = newId === disaster.id ? disaster : null;
    onSelectDisaster(selected);
    onSelectPeople(null);
  };

  const getSeverityColor = (
    severity: Disaster["severity"]
  ): "success" | "warning" | "error" => {
    const colors: Record<
      Disaster["severity"],
      "success" | "warning" | "error"
    > = {
      "düşük": "success",
      "orta": "warning",
      "kritik": "error",
    };
    return colors[severity];
  };

  const getStatusColor = (
    status: Disaster["status"]
  ): "success" | "warning" | "error" => {
    const colors: Record<Disaster["status"], "success" | "warning" | "error"> =
      {
        aktif: "error",
        "kontrol-altında": "warning",
        "çözüldü": "success",
      };
    return colors[status];
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ px: 2, pt: 1, flexShrink: 0 }}
      >
        <Tab label={`Raporlar (${peopleReports.length})`} />
        <Tab label={`Envanter (${inventoryItems.length})`} />
        <Tab label={`Hasarlar (${disasters.length})`} />
      </Tabs>

      <Box sx={{ flex: 1, overflow: "hidden", p: 2, pt: 1 }}>
        {/* People Tab */}
        {activeTab === 0 && (
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                flexShrink: 0,
              }}
            >
              <TextField
                size="small"
                placeholder="Rapor ara..."
                value={peopleSearch}
                onChange={(e) => setPeopleSearch(e.target.value)}
                sx={{ width: 256 }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={onAddPeople}
                  startIcon={<AddIcon />}
                >
                  Ekle
                </Button>
                {selectedPeopleId && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      const report = peopleReports.find(
                        (r) => r.id === selectedPeopleId
                      );
                      if (report) onEditPeople(report);
                    }}
                  >
                    Düzenle
                  </Button>
                )}
              </Box>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ flex: 1, overflow: "auto" }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Raporlayan</TableCell>
                    <TableCell>Konum</TableCell>
                    <TableCell>Toplam</TableCell>
                    <TableCell>Yaralı</TableCell>
                    <TableCell>Hasta</TableCell>
                    <TableCell>Bebek</TableCell>
                    <TableCell>Çocuk</TableCell>
                    <TableCell>Yaşlı</TableCell>
                    <TableCell>İhtiyaçlar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPeople.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        sx={{ textAlign: "center", color: "text.secondary" }}
                      >
                        Rapor bulunamadı
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPeople.map((report) => {
                      const isSelected = selectedPeopleId === report.id;
                      const total =
                        report.counts.baby +
                        report.counts.child +
                        report.counts.adult +
                        report.counts.elderly;
                      const sortedNeeds = [...report.needs].sort(
                        (a, b) => a.priority - b.priority
                      );
                      const chronicTotal = Object.values(
                        report.statusCounts?.chronicDisease || {}
                      ).reduce((sum, count) => sum + count, 0);
                      return (
                        <TableRow
                          key={report.id}
                          hover
                          selected={isSelected}
                          onClick={() => handleSelectPeopleRow(report)}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell sx={{ fontWeight: "medium" }}>
                            {report.reporter.name}
                          </TableCell>
                          <TableCell
                            sx={{
                              maxWidth: 180,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {report.location.address}
                          </TableCell>
                          <TableCell>{total}</TableCell>
                          <TableCell>{report.statusCounts.injured}</TableCell>
                          <TableCell>{chronicTotal}</TableCell>
                          <TableCell>{report.counts.baby}</TableCell>
                          <TableCell>{report.counts.child}</TableCell>
                          <TableCell>{report.counts.elderly}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {sortedNeeds.map((need) => (
                                <Chip
                                  key={need.archetypeId}
                                  label={getNeedName(need.archetypeId)}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 24 }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Inventory Tab */}
        {activeTab === 1 && (
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                flexShrink: 0,
              }}
            >
              <TextField
                size="small"
                placeholder="Envanter ara..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                sx={{ width: 256 }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={onAddInventory}
                  startIcon={<AddIcon />}
                >
                  Ekle
                </Button>
                {selectedInventoryId && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      const item = inventoryItems.find(
                        (i) => i.id === selectedInventoryId
                      );
                      if (item) onEditInventory(item);
                    }}
                  >
                    Düzenle
                  </Button>
                )}
              </Box>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ flex: 1, overflow: "auto" }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Tür</TableCell>
                    <TableCell>Miktar</TableCell>
                    <TableCell>Konum</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>İhtiyaç</TableCell>
                    <TableCell>Hedef Kitle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInventory.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{ textAlign: "center", color: "text.secondary" }}
                      >
                        Envanter bulunamadı
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventory.map((item) => {
                      const isSelected = selectedInventoryId === item.id;
                      const statusColors: Record<string, "success" | "warning" | "info" | "default"> = {
                        available: "success",
                        deployed: "warning",
                        reserved: "info",
                        expired: "default",
                      };
                      const statusLabels: Record<string, string> = {
                        available: "Mevcut",
                        deployed: "Dağıtıldı",
                        reserved: "Rezerve",
                        expired: "Süresi Doldu",
                      };
                      const loc = item.location;
                      const locationDisplay = loc
                        ? loc.address || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`
                        : "—";
                      return (
                        <TableRow
                          key={item.id}
                          hover
                          selected={isSelected}
                          onClick={() => handleSelectInventoryRow(item)}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell sx={{ fontWeight: "medium" }}>
                            {item.name}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell
                            sx={{
                              maxWidth: 180,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {locationDisplay}
                          </TableCell>
                          <TableCell>
                            {item.status ? (
                              <Chip
                                label={statusLabels[item.status] || item.status}
                                size="small"
                                color={statusColors[item.status] || "default"}
                              />
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {item.resolves.map((need) => (
                                <Chip
                                  key={need}
                                  label={need}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 24 }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {item.group ? (
                              <Chip
                                label={item.group}
                                size="small"
                                color="info"
                                sx={{ textTransform: "capitalize" }}
                              />
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Incidents Tab */}
        {activeTab === 2 && (
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                flexShrink: 0,
              }}
            >
              <TextField
                size="small"
                placeholder="Hasar Ara..."
                value={disasterSearch}
                onChange={(e) => setDisasterSearch(e.target.value)}
                sx={{ width: 256 }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                {onAddDisaster && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={onAddDisaster}
                    startIcon={<AddIcon />}
                  >
                    Ekle
                  </Button>
                )}
                {selectedDisasterId && onEditDisaster && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      const disaster = disasters.find(
                        (d) => d.id === selectedDisasterId
                      );
                      if (disaster) onEditDisaster(disaster);
                    }}
                  >
                    Düzenle
                  </Button>
                )}
              </Box>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ flex: 1, overflow: "auto" }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Hasar</TableCell>
                    <TableCell>Konum</TableCell>
                    <TableCell>Risk</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>Tarih</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDisasters.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        sx={{ textAlign: "center", color: "text.secondary" }}
                      >
                        No incidents
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDisasters.map((disaster) => {
                      const isSelected = selectedDisasterId === disaster.id;
                      return (
                        <TableRow
                          key={disaster.id}
                          hover
                          selected={isSelected}
                          onClick={() => handleSelectDisasterRow(disaster)}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell sx={{ fontWeight: "medium" }}>
                            {disaster.type}
                          </TableCell>
                          <TableCell
                            sx={{
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {disaster.address}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={disaster.severity}
                              size="small"
                              color={getSeverityColor(disaster.severity)}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={disaster.status}
                              size="small"
                              color={getStatusColor(disaster.status)}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(disaster.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BottomPanel;
