import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import type { Disaster } from "../../types";

interface SidePanelProps {
  disasters: Disaster[];
}

const SidePanel = ({ disasters }: SidePanelProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const getSeverityColor = (
    severity: string
  ): "error" | "warning" | "info" | "success" => {
    const colors: Record<string, "error" | "warning" | "info" | "success"> = {
      "kritik": "error",
      "yüksek": "warning",
      "orta": "info",
      "düşük": "success",
    };
    return colors[severity] || "default";
  };

  const getStatusColor = (status: string): "error" | "warning" | "success" => {
    const colors: Record<string, "error" | "warning" | "success"> = {
      "aktif": "error",
      "kontrol-altında": "warning",
      "çözüldü": "success",
    };
    return colors[status] || "default";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mx: 2, mt: 2 }}
      >
        <Tab label="Haberler" />
        <Tab label="Bilgilendirme" />
      </Tabs>

      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {activeTab === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {disasters.map((disaster) => (
              <Card key={disaster.id} variant="outlined">
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {disaster.type}
                    </Typography>
                    <Chip
                      label={disaster.status}
                      size="small"
                      color={getStatusColor(disaster.status)}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    {disaster.address}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1, lineHeight: 1.4 }}
                  >
                    {disaster.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Chip
                      label={disaster.severity.toUpperCase()}
                      size="small"
                      color={getSeverityColor(disaster.severity)}
                      sx={{ fontSize: "0.65rem", height: 20 }}
                    />
                    <Typography variant="caption" color="text.disabled">
                      {new Date(disaster.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography variant="body2" color="text.disabled">
              Yakında...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SidePanel;
