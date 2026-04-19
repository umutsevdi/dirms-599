import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useState, type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { sizing } from "../../theme";
import BusinessIcon from "@mui/icons-material/Business";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DisasterTimer from "../Map/DisasterTimer";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  children?: ReactNode;
}

export default function Header({
  title = "Disaster Management System",
  showBackButton = false,
  onBack,
  children,
}: HeaderProps) {
  const { user, entity, logout } = useAuth();
  const { disasters } = useData();
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    window.location.href = "/login";
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        {/* Left Section: Back Button + Title + Timer */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {showBackButton && (
            <Tooltip title="Back">
              <IconButton edge="start" color="inherit" onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Page Title */}
          <Typography variant="h6">
            {title}
          </Typography>

          {/* Disaster Timer - right of title */}
          <DisasterTimer
            disasters={disasters.map((d) => ({
              timestamp: d.timestamp,
              type: d.type,
            }))}
          />
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right Section: Org Chip + User */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {entity && (
            <Chip
              icon={<BusinessIcon />}
              label={entity.name}
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => window.location.href = "/organization"}
              sx={{
                display: { xs: "none", sm: "flex" },
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                },
              }}
            />
          )}

          {children}

          {user && (
            <>
              <Tooltip title={user.fullName}>
                <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName.replace(/ /g, "+")}`}
                    alt={user.fullName}
                    sx={{ width: sizing.avatar.sm, height: sizing.avatar.sm }}
                  />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                onClick={handleUserMenuClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      minWidth: 220,
                      "& .MuiAvatar-root": {
                        width: sizing.avatar.sm,
                        height: sizing.avatar.sm,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" noWrap>
                    {user.fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </Box>

                <Divider />

                <MenuItem onClick={() => window.location.href = "/organization"}>
                  <ListItemIcon>
                    <BusinessIcon fontSize="small" />
                  </ListItemIcon>
                  Organization Settings
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
