import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";
import type { Disaster } from "../../types";

interface DisasterTableProps {
  disasters: Disaster[];
  onRowClick?: (disaster: Disaster) => void;
}

const DisasterTable = ({ disasters, onRowClick }: DisasterTableProps) => {
  const getSeverityColor = (
    severity: Disaster["severity"]
  ): "success" | "warning" | "error" => {
    const colors: Record<
      Disaster["severity"],
      "success" | "warning" | "error"
    > = {
      low: "success",
      medium: "warning",
      high: "error",
      critical: "error",
    };
    return colors[severity];
  };

  const getStatusColor = (
    status: Disaster["status"]
  ): "success" | "warning" | "error" => {
    const colors: Record<Disaster["status"], "success" | "warning" | "error"> =
      {
        active: "error",
        contained: "warning",
        resolved: "success",
      };
    return colors[status];
  };

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Severity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Time</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {disasters.map((disaster) => (
            <TableRow
              key={disaster.id}
              onClick={() => onRowClick?.(disaster)}
              sx={{ cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
            >
              <TableCell sx={{ fontWeight: "bold" }}>{disaster.type}</TableCell>
              <TableCell>{disaster.address}</TableCell>
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
              <TableCell>
                <Button size="small" variant="text">
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DisasterTable;
