import { useState, useMemo, useCallback, useRef } from "react";
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
import type { InventoryItem, PeopleReport } from "../../types";

interface BottomPanelProps {
  inventoryItems: InventoryItem[];
  peopleReports: PeopleReport[];
  onAddInventory: () => void;
  onEditInventory: (item: InventoryItem) => void;
  onAddPeople: () => void;
  onEditPeople: (report: PeopleReport) => void;
  onSelectPeople: (report: PeopleReport | null) => void;
  initialHeight?: number;
}

const BottomPanel = ({
  inventoryItems,
  peopleReports,
  onAddInventory,
  onEditInventory,
  onAddPeople,
  onEditPeople,
  onSelectPeople,
  initialHeight = 180,
}: BottomPanelProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [inventorySearch, setInventorySearch] = useState("");
  const [peopleSearch, setPeopleSearch] = useState("");
  const [selectedPeopleId, setSelectedPeopleId] = useState<string | null>(null);
  const [height, setHeight] = useState(initialHeight);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      const startY = e.clientY;
      const startHeight = height;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging.current) return;
        const delta = startY - moveEvent.clientY;
        const newHeight = Math.max(120, Math.min(500, startHeight + delta));
        setHeight(newHeight);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [height]
  );

  const filteredInventory = useMemo(() => {
    if (!inventorySearch) return inventoryItems;
    const q = inventorySearch.toLowerCase();
    return inventoryItems.filter(
      (item) =>
        item.type.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
    );
  }, [inventoryItems, inventorySearch]);

  const filteredPeople = useMemo(() => {
    if (!peopleSearch) return peopleReports;
    const q = peopleSearch.toLowerCase();
    return peopleReports.filter(
      (r) =>
        r.reporter.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.needs.some((n) => n.label.toLowerCase().includes(q))
    );
  }, [peopleReports, peopleSearch]);

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" => {
    const colors: Record<string, "success" | "warning" | "error" | "info"> = {
      available: "success",
      deployed: "warning",
      maintenance: "error",
    };
    return colors[status] || "default";
  };

  const handleSelectRow = (report: PeopleReport) => {
    const newId = report.id === selectedPeopleId ? null : report.id;
    setSelectedPeopleId(newId);
    const selected = newId === report.id ? report : null;
    onSelectPeople(selected);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        height,
      }}
    >
      <Box
        sx={{
          height: 4,
          cursor: "row-resize",
          bgcolor: "divider",
          "&:hover": { bgcolor: "primary.main" },
          transition: "background-color 0.2s",
        }}
        onMouseDown={handleMouseDown}
      />

      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ px: 2, pt: 1 }}
        >
          <Tab label={`Inventory (${inventoryItems.length})`} />
          <Tab label={`People (${peopleReports.length})`} />
        </Tabs>

        <Box
          sx={{
            p: 2,
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {activeTab === 0 && (
            <Box
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search inventory..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  sx={{ width: 256 }}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={onAddInventory}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={filteredInventory.length !== 1}
                    onClick={() =>
                      filteredInventory.length === 1 &&
                      onEditInventory(filteredInventory[0])
                    }
                  >
                    Edit
                  </Button>
                </Box>
              </Box>

              <TableContainer
                component={Paper}
                sx={{ flex: 1, overflow: "auto" }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInventory.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          sx={{ textAlign: "center", color: "text.secondary" }}
                        >
                          No inventory items
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell sx={{ fontWeight: "medium" }}>
                            {item.type}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <Chip
                              label={item.status}
                              size="small"
                              color={getStatusColor(item.status)}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {activeTab === 1 && (
            <Box
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search reports..."
                  value={peopleSearch}
                  onChange={(e) => setPeopleSearch(e.target.value)}
                  sx={{ width: 256 }}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={onAddPeople}
                  >
                    Add
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
                      Edit
                    </Button>
                  )}
                </Box>
              </Box>

              <TableContainer
                component={Paper}
                sx={{ flex: 1, overflow: "auto" }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Reporter</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Injured</TableCell>
                      <TableCell>Baby</TableCell>
                      <TableCell>Child</TableCell>
                      <TableCell>Elderly</TableCell>
                      <TableCell>Needs</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPeople.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          sx={{ textAlign: "center", color: "text.secondary" }}
                        >
                          No reports
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
                        return (
                          <TableRow
                            key={report.id}
                            hover
                            selected={isSelected}
                            onClick={() => handleSelectRow(report)}
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell sx={{ fontWeight: "medium" }}>
                              {report.reporter}
                            </TableCell>
                            <TableCell
                              sx={{
                                maxWidth: 180,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {report.address}
                            </TableCell>
                            <TableCell>{total}</TableCell>
                            <TableCell>{report.statusCounts.injured}</TableCell>
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
                                    key={need.label}
                                    label={need.label}
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
        </Box>
      </Box>
    </Box>
  );
};

export default BottomPanel;
