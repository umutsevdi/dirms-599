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
import type { Disaster, PeopleReport } from "../../types";

interface MapInfoBoardProps {
  disaster: Disaster | null;
  peopleReport: PeopleReport | null;
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

const MapInfoBoard = ({
  disaster,
  peopleReport,
  reports,
  onClose,
}: MapInfoBoardProps) => {
  if (!disaster && !peopleReport) return null;

  if (peopleReport && !disaster) {
    const totalPeople =
      peopleReport.counts.baby +
      peopleReport.counts.child +
      peopleReport.counts.adult +
      peopleReport.counts.elderly;
    const genderBase = peopleReport.counts.adult + peopleReport.counts.elderly;
    const womenCount = peopleReport.genderCounts?.women ?? 0;
    const menCount = Math.max(0, genderBase - womenCount);
    const pctGender = (count: number) =>
      genderBase > 0 ? Math.round((count / genderBase) * 100) : 0;
    const sortedNeeds = [...peopleReport.needs].sort(
      (a, b) => a.priority - b.priority
    );

    return (
      <Card
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
          width: 340,
          maxHeight: "calc(100% - 32px)",
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
                People Report
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Reported by {peopleReport.reporter}
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
                {peopleReport.address} ({peopleReport.location.lat.toFixed(4)},{" "}
                {peopleReport.location.lng.toFixed(4)})
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {new Date(peopleReport.timestamp).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {(peopleReport.phoneNumber || peopleReport.contactMethod) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                flexWrap: "wrap",
              }}
            >
              {peopleReport.phoneNumber && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PhoneIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {peopleReport.phoneNumber}
                  </Typography>
                </Box>
              )}
              {peopleReport.phoneNumber && peopleReport.contactMethod && (
                <Typography variant="body2" color="text.secondary">
                  ·
                </Typography>
              )}
              {peopleReport.contactMethod && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {getContactIcon(peopleReport.contactMethod)}
                  <Typography variant="body2">
                    {peopleReport.contactMethod}
                  </Typography>
                </Box>
              )}
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
                label={peopleReport.counts.baby}
                size="small"
                sx={{
                  height: 20,
                  minWidth: 28,
                  bgcolor: "pink.50",
                  color: "pink.700",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon fontSize="small" sx={{ color: "info.main" }} />
              <Typography variant="caption" sx={{ flex: 1 }}>
                Children
              </Typography>
              <Chip
                label={peopleReport.counts.child}
                size="small"
                sx={{
                  height: 20,
                  minWidth: 28,
                  bgcolor: "info.50",
                  color: "info.700",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon fontSize="small" sx={{ color: "success.main" }} />
              <Typography variant="caption" sx={{ flex: 1 }}>
                Adults
              </Typography>
              <Chip
                label={peopleReport.counts.adult}
                size="small"
                sx={{
                  height: 20,
                  minWidth: 28,
                  bgcolor: "success.50",
                  color: "success.700",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ElderlyIcon fontSize="small" sx={{ color: "warning.main" }} />
              <Typography variant="caption" sx={{ flex: 1 }}>
                Elderly
              </Typography>
              <Chip
                label={peopleReport.counts.elderly}
                size="small"
                sx={{
                  height: 20,
                  minWidth: 28,
                  bgcolor: "warning.50",
                  color: "warning.700",
                }}
              />
            </Box>
          </Box>

          {(peopleReport.statusCounts.missing > 0 ||
            peopleReport.statusCounts.injured > 0 ||
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
              {peopleReport.statusCounts.missing > 0 && (
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
                        sx={{ fontSize: 14, color: "error.main" }}
                      />
                      <Typography variant="caption">Missing</Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "error.main" }}
                    >
                      {peopleReport.statusCounts.missing}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      totalPeople > 0
                        ? (peopleReport.statusCounts.missing / totalPeople) *
                          100
                        : 0
                    }
                    color="error"
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
                </Box>
              )}
              {peopleReport.statusCounts.injured > 0 && (
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
                        sx={{ fontSize: 14, color: "warning.main" }}
                      />
                      <Typography variant="caption">Injured</Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: "bold", color: "warning.main" }}
                    >
                      {peopleReport.statusCounts.injured}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      totalPeople > 0
                        ? (peopleReport.statusCounts.injured / totalPeople) *
                          100
                        : 0
                    }
                    color="warning"
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
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
                      <WomanIcon sx={{ fontSize: 14, color: "pink.main" }} />
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

          {peopleReport.details && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic", lineHeight: 1.5 }}
            >
              {peopleReport.details}
            </Typography>
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
        top: 16,
        right: 16,
        zIndex: 1000,
        width: 320,
        maxHeight: "calc(100% - 32px)",
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
                        sx={{ fontSize: 14, color: "error.main" }}
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
                        sx={{ fontSize: 14, color: "warning.main" }}
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
                    sx={{
                      height: 20,
                      minWidth: 28,
                      bgcolor: "pink.50",
                      color: "pink.700",
                    }}
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
                    sx={{
                      height: 20,
                      minWidth: 28,
                      bgcolor: "info.50",
                      color: "info.700",
                    }}
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
                    sx={{
                      height: 20,
                      minWidth: 28,
                      bgcolor: "success.50",
                      color: "success.700",
                    }}
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
                    sx={{
                      height: 20,
                      minWidth: 28,
                      bgcolor: "warning.50",
                      color: "warning.700",
                    }}
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
                            {r.reporter}
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
                          {r.address}
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
