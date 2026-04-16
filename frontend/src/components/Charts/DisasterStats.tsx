import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Box, Paper, Typography, useTheme } from "@mui/material";

interface DisasterStatsProps {
  data: {
    byType: { name: string; count: number }[];
    bySeverity: { name: string; count: number }[];
    byStatus: { name: string; count: number }[];
  };
}

const DisasterStats = ({ data }: DisasterStatsProps) => {
  const theme = useTheme();
  const totalIncidents = data.byType.reduce((sum, d) => sum + d.count, 0);
  const resolved =
    data.byStatus.find((s) => s.name.toLowerCase() === "resolved")?.count ?? 0;

  const severityColors = [
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Paper sx={{ p: 2, flex: 1, boxShadow: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Total Incidents
          </Typography>
          <Typography variant="h4">{totalIncidents}</Typography>
          <Typography variant="caption" color="text.secondary">
            Active disasters
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1, boxShadow: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Resolved
          </Typography>
          <Typography variant="h4">{resolved}</Typography>
          <Typography variant="caption" color="text.secondary">
            Completed
          </Typography>
        </Paper>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Disasters by Type
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.byType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            By Severity
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.bySeverity}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label
              >
                {data.bySeverity.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={severityColors[index % severityColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default DisasterStats;
