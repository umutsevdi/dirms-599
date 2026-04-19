import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import ElderlyIcon from "@mui/icons-material/Elderly";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PhoneIcon from "@mui/icons-material/Phone";
import SmsIcon from "@mui/icons-material/Sms";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import ChatIcon from "@mui/icons-material/Chat";
import WomanIcon from "@mui/icons-material/Female";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import BoltIcon from "@mui/icons-material/Bolt";
import type { Disaster, PeopleReport } from "../../types";
import { layout, sizing, getAgeGroupChipStyles } from "../../theme";

interface MapInfoBoardProps {
  disaster: Disaster | null;
  peopleReports: PeopleReport[];
  reports: PeopleReport[];
  onClose: () => void;
}

const getContactIcon = (method: string) => {
  const lower = method.toLowerCase();
  if (lower.includes("sms"))
    return <SmsIcon fontSize="small" sx={{ color: "primary.main" }} />;
  if (lower.includes("whatsapp"))
    return <WhatsAppIcon fontSize="small" sx={{ color: "success.main" }} />;
  if (lower.includes("call"))
    return <CallIcon fontSize="small" sx={{ color: "info.main" }} />;
  if (lower.includes("freeform") || lower.includes("text"))
    return <ChatIcon fontSize="small" sx={{ color: "warning.main" }} />;
  return <PhoneIcon fontSize="small" sx={{ color: "text.secondary" }} />;
};

// Helper to determine aggregate service status from boolean reports
// Logic: If ANY unavailable → Partially, If ALL unavailable → Not Available, If ALL available → Available
const getAggregateServiceStatus = (
  statuses: (boolean | undefined)[]
): "available" | "partially" | "not-available" => {
  const normalized = statuses.map((s) => s ?? true);
  const allAvailable = normalized.every((s) => s === true);
  const allNotAvailable = normalized.every((s) => s === false);

  if (allAvailable) return "available";
  if (allNotAvailable) return "not-available";
  return "partially";
};

// Extended type for aggregated reports with string service status
type AggregatedPeopleReport = Omit<PeopleReport, "servicesAccess"> & {
  servicesAccess: {
    water: "available" | "partially" | "not-available";
    electricity: "available" | "partially" | "not-available";
  };
};

// Aggregate multiple reports into a single view
const aggregateReports = (reports: PeopleReport[]): AggregatedPeopleReport => {
  // For single report, convert boolean to aggregate string format
  if (reports.length === 1) {
    const report = reports[0];
    return {
      ...report,
      servicesAccess: {
        water: report.servicesAccess?.water ? "available" : "not-available",
        electricity: report.servicesAccess?.electricity
          ? "available"
          : "not-available",
      },
    } as AggregatedPeopleReport;
  }

  // Calculate average location
  const avgLat =
    reports.reduce((sum, r) => sum + r.location.lat, 0) / reports.length;
  const avgLng =
    reports.reduce((sum, r) => sum + r.location.lng, 0) / reports.length;

  // Collect all unique needs with lowest priority
  const allNeeds = reports.flatMap((r) => r.needs);
  const uniqueNeeds = Array.from(new Set(allNeeds.map((n) => n.label))).map(
    (label) => ({
      label,
      priority: Math.min(
        ...allNeeds.filter((n) => n.label === label).map((n) => n.priority)
      ),
    })
  );

  // Aggregate chronic diseases
  const chronicDiseaseAgg: Record<string, number> = {};
  reports.forEach((r) => {
    Object.entries(r.statusCounts?.chronicDisease || {}).forEach(
      ([disease, count]) => {
        chronicDiseaseAgg[disease] = (chronicDiseaseAgg[disease] || 0) + count;
      }
    );
  });

  return {
    id: `cluster-${Date.now()}`,
    reporter: {
      name: reports.map((r) => r.reporter.name).join(", "),
    },
    location: { lat: avgLat, lng: avgLng, address: "Multiple locations" },
    needs: uniqueNeeds,
    counts: {
      baby: reports.reduce((sum, r) => sum + r.counts.baby, 0),
      child: reports.reduce((sum, r) => sum + r.counts.child, 0),
      adult: reports.reduce((sum, r) => sum + r.counts.adult, 0),
      elderly: reports.reduce((sum, r) => sum + r.counts.elderly, 0),
    },
    genderCounts: {
      women: reports.reduce((sum, r) => sum + (r.genderCounts?.women || 0), 0),
    },
    statusCounts: {
      missing: reports.reduce(
        (sum, r) => sum + (r.statusCounts?.missing || 0),
        0
      ),
      injured: reports.reduce(
        (sum, r) => sum + (r.statusCounts?.injured || 0),
        0
      ),
      disabled: reports.reduce(
        (sum, r) => sum + (r.statusCounts?.disabled || 0),
        0
      ),
      bedridden: reports.reduce(
        (sum, r) => sum + (r.statusCounts?.bedridden || 0),
        0
      ),
      chronicDisease: chronicDiseaseAgg,
    },
    details: "", // Not used in aggregated view
    timestamp: new Date().toISOString(),
    disasterId: reports[0]?.disasterId || "",
    // For services access in clusters, determine aggregate status
    servicesAccess: {
      water: getAggregateServiceStatus(
        reports.map((r) => r.servicesAccess?.water ?? true)
      ),
      electricity: getAggregateServiceStatus(
        reports.map((r) => r.servicesAccess?.electricity ?? true)
      ),
    },
  };
};

const MapInfoBoard = ({
  disaster,
  peopleReports,
  reports,
  onClose,
}: MapInfoBoardProps) => {
  if (!disaster && peopleReports.length === 0) return null;

  if (peopleReports.length > 0 && !disaster) {
    const isCluster = peopleReports.length > 1;
    const report = aggregateReports(peopleReports);

    const totalPeople =
      report.counts.baby +
      report.counts.child +
      report.counts.adult +
      report.counts.elderly;
    const genderBase = report.counts.adult + report.counts.elderly;
    const womenCount = report.genderCounts?.women ?? 0;
    const menCount = Math.max(0, genderBase - womenCount);
    const pctGender = (count: number) =>
      genderBase > 0 ? Math.round((count / genderBase) * 100) : 0;
    const sortedNeeds = [...report.needs].sort(
      (a, b) => a.priority - b.priority
    );

    // Single report for contact info
    const firstReport = peopleReports[0];

    return (
      <Card
        sx={{
          position: "absolute",
          top: layout.spacing.md,
          right: layout.spacing.md,
          zIndex: layout.zIndex.mapOverlay,
          width: isCluster
            ? layout.panel.infoBoardWidthCluster
            : layout.panel.infoBoardWidth,
          maxHeight: `calc(100% - ${layout.spacing.xl}px)`,
          overflow: "auto",
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Report
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {`Reported by ${report.reporter.name}`}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={onClose}
              sx={{ mt: -0.5, mr: -0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {report.location.address} ({report.location.lat.toFixed(4)},{" "}
                {report.location.lng.toFixed(4)})
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {new Date(report.timestamp).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {!isCluster &&
            (firstReport.reporter.phoneNumber ||
              firstReport.reporter.contactMethod) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  flexWrap: "wrap",
                }}
              >
                {firstReport.reporter.phoneNumber && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PhoneIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {firstReport.reporter.phoneNumber}
                    </Typography>
                  </Box>
                )}
                {firstReport.reporter.phoneNumber &&
                  firstReport.reporter.contactMethod && (
                    <Typography variant="body2" color="text.secondary">
                      ·
                    </Typography>
                  )}
                {firstReport.reporter.contactMethod && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {getContactIcon(firstReport.reporter.contactMethod)}
                    <Typography variant="body2">
                      {firstReport.reporter.contactMethod}
                    </Typography>
                  </Box>
                )}
                {firstReport.reporter.contactDetails && (
                  <Typography variant="body2" color="text.secondary">
                    ({firstReport.reporter.contactDetails})
                  </Typography>
                )}
              </Box>
            )}

          {/* Services Access */}
          {!isCluster && firstReport.servicesAccess && (
            <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                icon={<WaterDropIcon fontSize="small" />}
                label={`Water: ${firstReport.servicesAccess.water ? "Available" : "Not Available"}`}
                size="small"
                color={firstReport.servicesAccess.water ? "success" : "info"}
                variant={
                  firstReport.servicesAccess.water ? "filled" : "outlined"
                }
              />
              <Chip
                icon={<BoltIcon fontSize="small" />}
                label={`Electric: ${firstReport.servicesAccess.electricity ? "Available" : "Not Available"}`}
                size="small"
                color={
                  firstReport.servicesAccess.electricity ? "success" : "warning"
                }
                variant={
                  firstReport.servicesAccess.electricity ? "filled" : "outlined"
                }
              />
            </Box>
          )}
          {isCluster && report.servicesAccess && (
            <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                icon={<WaterDropIcon fontSize="small" />}
                label={`Water: ${
                  report.servicesAccess.water === "available"
                    ? "Available"
                    : report.servicesAccess.water === "partially"
                      ? "Partially"
                      : "Not Available"
                }`}
                size="small"
                color={
                  report.servicesAccess.water === "available"
                    ? "success"
                    : report.servicesAccess.water === "partially"
                      ? "info"
                      : "default"
                }
                variant={
                  report.servicesAccess.water === "available"
                    ? "filled"
                    : "outlined"
                }
              />
              <Chip
                icon={<BoltIcon fontSize="small" />}
                label={`Electric: ${
                  report.servicesAccess.electricity === "available"
                    ? "Available"
                    : report.servicesAccess.electricity === "partially"
                      ? "Partially"
                      : "Not Available"
                }`}
                size="small"
                color={
                  report.servicesAccess.electricity === "available"
                    ? "success"
                    : report.servicesAccess.electricity === "partially"
                      ? "warning"
                      : "default"
                }
                variant={
                  report.servicesAccess.electricity === "available"
                    ? "filled"
                    : "outlined"
                }
              />
            </Box>
          )}

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
            People ({totalPeople})
          </Typography>
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: 1,
              bgcolor: "action.hover",
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ChildCareIcon fontSize="small" sx={{ color: "pink.main" }} />
              <Typography variant="caption" sx={{ flex: 1 }}>
                Babies
              </Typography>
              <Chip
                label={report.counts.baby}
                size="small"
                sx={getAgeGroupChipStyles("baby")}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon fontSize="small" sx={{ color: "info.main" }} />
              <Typography variant="caption" sx={{ flex: 1 }}>
                Children
              </Typography>
              <Chip
                label={report.counts.child}
                size="small"
                sx={getAgeGroupChipStyles("child")}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon fontSize="small" sx={{ color: "success.main" }} />
              <Typography variant="caption" sx={{ flex: 1 }}>
                Adults
              </Typography>
              <Chip
                label={report.counts.adult}
                size="small"
                sx={getAgeGroupChipStyles("adult")}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ElderlyIcon fontSize="small" sx={{ color: "warning.main" }} />
              <Typography variant="caption" sx={{ flex: 1 }}>
                Elderly
              </Typography>
              <Chip
                label={report.counts.elderly}
                size="small"
                sx={getAgeGroupChipStyles("elderly")}
              />
            </Box>
          </Box>

          {(report.statusCounts.missing > 0 ||
            report.statusCounts.injured > 0 ||
            genderBase > 0) && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
                mb: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Status
              </Typography>
              {report.statusCounts.missing > 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <PersonSearchIcon
                        sx={{ fontSize: sizing.icon.xs, color: "error.main" }}
                      />
                      <Typography variant="caption">Missing</Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "error.main" }}
                    >
                      {report.statusCounts.missing}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      totalPeople > 0
                        ? (report.statusCounts.missing / totalPeople) * 100
                        : 0
                    }
                    color="error"
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
                </Box>
              )}
              {report.statusCounts.injured > 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <LocalHospitalIcon
                        sx={{ fontSize: sizing.icon.xs, color: "warning.main" }}
                      />
                      <Typography variant="caption">Injured</Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "warning.main" }}
                    >
                      {report.statusCounts.injured}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      totalPeople > 0
                        ? (report.statusCounts.injured / totalPeople) * 100
                        : 0
                    }
                    color="warning"
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
                </Box>
              )}
              {report.statusCounts.disabled > 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <LocalHospitalIcon
                        sx={{ fontSize: sizing.icon.xs, color: "info.main" }}
                      />
                      <Typography variant="caption">Disabled</Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "info.main" }}
                    >
                      {report.statusCounts.disabled}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      totalPeople > 0
                        ? (report.statusCounts.disabled / totalPeople) * 100
                        : 0
                    }
                    color="info"
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
                </Box>
              )}
              {report.statusCounts.bedridden > 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <LocalHospitalIcon
                        sx={{
                          fontSize: sizing.icon.xs,
                          color: "secondary.main",
                        }}
                      />
                      <Typography variant="caption">Bedridden</Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "secondary.main" }}
                    >
                      {report.statusCounts.bedridden}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      totalPeople > 0
                        ? (report.statusCounts.bedridden / totalPeople) * 100
                        : 0
                    }
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
                </Box>
              )}
              {Object.keys(report.statusCounts.chronicDisease || {}).length >
                0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    Chronic Diseases
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    {Object.entries(
                      report.statusCounts.chronicDisease || {}
                    ).map(([disease, count]) => (
                      <Chip
                        key={disease}
                        label={`${disease}: ${count}`}
                        size="small"
                        color="default"
                        sx={{ height: 20, fontSize: "0.75rem" }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              {genderBase > 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <WomanIcon
                        sx={{ fontSize: sizing.icon.xs, color: "pink.main" }}
                      />
                      <Typography variant="caption">Gender</Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "pink.main" }}
                    >
                      Women {womenCount} · Men {menCount}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pctGender(womenCount)}
                    color="error"
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
                </Box>
              )}
            </Box>
          )}

          {sortedNeeds.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Needs
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {sortedNeeds.map((need) => (
                  <Chip
                    key={need.label}
                    label={need.label}
                    size="small"
                    variant="outlined"
                    sx={{ height: 28 }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Descriptions Section */}
          {peopleReports.some((r) => r.details) && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                {isCluster ? "Reports" : "Details"}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {peopleReports.map(
                  (r, index) =>
                    r.details && (
                      <Typography
                        key={r.id || index}
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontStyle: "italic",
                          lineHeight: 1.5,
                          display: "block",
                        }}
                      >
                        {isCluster
                          ? `${r.reporter.name}: ${r.details}`
                          : r.details}
                      </Typography>
                    )
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!disaster) return null;

  const getSeverityColor = (
    severity: string
  ): "error" | "warning" | "success" | "info" => {
    const colors: Record<string, "error" | "warning" | "success" | "info"> = {
      critical: "error",
      high: "error",
      medium: "warning",
      low: "success",
    };
    return colors[severity];
  };

  const getStatusColor = (status: string): "error" | "warning" | "success" => {
    const colors: Record<string, "error" | "warning" | "success"> = {
      active: "error",
      contained: "warning",
      resolved: "success",
    };
    return colors[status];
  };

  const totalPeople = reports.reduce(
    (sum, r) =>
      sum + r.counts.baby + r.counts.child + r.counts.adult + r.counts.elderly,
    0
  );
  const totalMissing = reports.reduce(
    (sum, r) => sum + r.statusCounts.missing,
    0
  );
  const totalInjured = reports.reduce(
    (sum, r) => sum + r.statusCounts.injured,
    0
  );
  const ageGroups = {
    baby: reports.reduce((sum, r) => sum + r.counts.baby, 0),
    child: reports.reduce((sum, r) => sum + r.counts.child, 0),
    adult: reports.reduce((sum, r) => sum + r.counts.adult, 0),
    elderly: reports.reduce((sum, r) => sum + r.counts.elderly, 0),
  };

  const pct = (n: number) =>
    totalPeople > 0 ? Math.round((n / totalPeople) * 100) : 0;

  return (
    <Card
      sx={{
        position: "absolute",
        top: layout.spacing.md,
        right: layout.spacing.md,
        zIndex: layout.zIndex.mapOverlay,
        width: layout.panel.infoBoardWidth,
        maxHeight: `calc(100% - ${layout.spacing.xl}px)`,
        overflow: "auto",
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {disaster.type}
          </Typography>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ mt: -0.5, mr: -0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Chip
            label={disaster.severity}
            size="small"
            color={getSeverityColor(disaster.severity)}
          />
          <Chip
            label={disaster.status}
            size="small"
            color={getStatusColor(disaster.status)}
          />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1.5, lineHeight: 1.5 }}
        >
          {disaster.description}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2">{disaster.address}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {new Date(disaster.timestamp).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
            >
              {disaster.location.lat.toFixed(4)},{" "}
              {disaster.location.lng.toFixed(4)}
            </Typography>
          </Box>
          {disaster.affectedRadius && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Radius: {disaster.affectedRadius}m
              </Typography>
            </Box>
          )}
        </Box>

        {totalPeople > 0 && (
          <>
            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
            >
              <PeopleIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Affected People ({totalPeople})
              </Typography>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              Status
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
                mb: 2,
              }}
            >
              {totalMissing > 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <PersonSearchIcon
                        sx={{ fontSize: sizing.icon.xs, color: "error.main" }}
                      />
                      <Typography variant="caption">Missing</Typography>
                    </Box>
                    <Typography variant="caption">
                      {totalMissing} ({pct(totalMissing)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct(totalMissing)}
                    color="error"
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
                </Box>
              )}
              {totalInjured > 0 && (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <LocalHospitalIcon
                        sx={{ fontSize: sizing.icon.xs, color: "warning.main" }}
                      />
                      <Typography variant="caption">Injured</Typography>
                    </Box>
                    <Typography variant="caption">
                      {totalInjured} ({pct(totalInjured)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct(totalInjured)}
                    color="warning"
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
                </Box>
              )}
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.5 }}
            >
              Age Groups
            </Typography>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: "action.hover",
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                mb: 2,
              }}
            >
              {ageGroups.baby > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ChildCareIcon fontSize="small" sx={{ color: "pink.main" }} />
                  <Typography variant="caption" sx={{ flex: 1 }}>
                    Babies
                  </Typography>
                  <Chip
                    label={ageGroups.baby}
                    size="small"
                    sx={getAgeGroupChipStyles("baby")}
                  />
                </Box>
              )}
              {ageGroups.child > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SchoolIcon fontSize="small" sx={{ color: "info.main" }} />
                  <Typography variant="caption" sx={{ flex: 1 }}>
                    Children
                  </Typography>
                  <Chip
                    label={ageGroups.child}
                    size="small"
                    sx={getAgeGroupChipStyles("child")}
                  />
                </Box>
              )}
              {ageGroups.adult > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon fontSize="small" sx={{ color: "success.main" }} />
                  <Typography variant="caption" sx={{ flex: 1 }}>
                    Adults
                  </Typography>
                  <Chip
                    label={ageGroups.adult}
                    size="small"
                    sx={getAgeGroupChipStyles("adult")}
                  />
                </Box>
              )}
              {ageGroups.elderly > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ElderlyIcon
                    fontSize="small"
                    sx={{ color: "warning.main" }}
                  />
                  <Typography variant="caption" sx={{ flex: 1 }}>
                    Elderly
                  </Typography>
                  <Chip
                    label={ageGroups.elderly}
                    size="small"
                    sx={getAgeGroupChipStyles("elderly")}
                  />
                </Box>
              )}
            </Box>

            {reports.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  Reports ({reports.length})
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {reports.map((r) => {
                    const reportTotal =
                      r.counts.baby +
                      r.counts.child +
                      r.counts.adult +
                      r.counts.elderly;
                    const sortedNeeds = [...r.needs].sort(
                      (a, b) => a.priority - b.priority
                    );
                    return (
                      <Box
                        key={r.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          bgcolor: "action.hover",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold" }}
                          >
                            {r.reporter.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {reportTotal} people
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          {r.location.address}
                        </Typography>
                        {sortedNeeds.length > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mb: 0.5,
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
                        )}
                        {r.details && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              fontStyle: "italic",
                              lineHeight: 1.4,
                            }}
                          >
                            {r.details}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MapInfoBoard;
