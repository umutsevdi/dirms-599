import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Link,
  Divider,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../../auth/contexts/AuthContext";
import { apiAuthService } from "../../auth/services/apiAuthService";
import { sizing } from "../../../theme";
import type { Entity, Employee, EmployeeRole } from "../../auth/types/auth.types";
import Header from "../../layout/components/Header";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutIcon from "@mui/icons-material/Logout";

export default function OrganizationSettings() {
  const { entity, user, isAdmin, logout, refreshUser } = useAuth();

  // Organization edit states
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [isSavingOrg, setIsSavingOrg] = useState(false);
  const [orgSuccess, setOrgSuccess] = useState<string | null>(null);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [editOrgForm, setEditOrgForm] = useState<Partial<Entity>>({
    name: entity?.name || "",
    logoUrl: entity?.logoUrl || "",
    description: entity?.description || "",
    website: entity?.website || "",
  });

  // Member management states
  const [members, setMembers] = useState<Employee[]>([]);
  const [memberSuccess, setMemberSuccess] = useState<string | null>(null);
  const [memberError, setMemberError] = useState<string | null>(null);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Employee | null>(null);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Form states
  const [newMember, setNewMember] = useState({
    fullName: "",
    email: "",
    role: "USER" as EmployeeRole,
  });
  const [editForm, setEditForm] = useState({
    fullName: "",
    role: "USER" as EmployeeRole,
    enabled: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadMembers();
    }
  }, [isAdmin]);

  if (!entity || !user) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">No organization information available</Alert>
      </Box>
    );
  }

  // Organization functions
  const handleOpenEditOrg = () => {
    setEditOrgForm({
      name: entity.name,
      logoUrl: entity.logoUrl || "",
      description: entity.description || "",
      website: entity.website || "",
    });
    setIsEditingOrg(true);
    setOrgError(null);
    setOrgSuccess(null);
  };

  const handleCloseEditOrg = () => {
    setIsEditingOrg(false);
    setOrgError(null);
  };

  const handleSaveOrg = async () => {
    setIsSavingOrg(true);
    setOrgError(null);

    const result = await apiAuthService.updateEntity(editOrgForm);

    if (result.success) {
      setOrgSuccess("Organization information updated successfully");
      refreshUser();
      setIsEditingOrg(false);
      setTimeout(() => setOrgSuccess(null), 3000);
    } else {
      setOrgError(result.error || "Failed to update organization");
    }

    setIsSavingOrg(false);
  };

  // Member functions
  const loadMembers = async () => {
    const entityMembers = await apiAuthService.getEntityEmployees();
    setMembers(entityMembers);
  };

  const handleOpenAdd = () => {
    setNewMember({ fullName: "", email: "", role: "USER" });
    setFormError(null);
    setIsAddDialogOpen(true);
  };

  const handleCloseAdd = () => {
    setIsAddDialogOpen(false);
    setFormError(null);
  };

  const handleOpenEdit = (member: Employee) => {
    setEditingMember(member);
    setEditForm({
      fullName: member.fullName,
      role: member.role,
      enabled: member.enabled,
    });
    setFormError(null);
    setIsEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
    setEditingMember(null);
    setFormError(null);
  };

  const handleAddMember = async () => {
    if (!newMember.fullName.trim() || !newMember.email.trim()) {
      setFormError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const result = await apiAuthService.addEmployee(newMember);

    if (result.success && result.employee) {
      const linkResult = await apiAuthService.requestMagicLink(
        newMember.email
      );
      if (linkResult.success && linkResult.token) {
        setInvitationToken(linkResult.token);
        setIsAddDialogOpen(false);
        setIsInviteDialogOpen(true);
        loadMembers();
        setMemberSuccess(`Member ${newMember.fullName} added successfully`);
      }
    } else {
      setFormError(result.error || "Failed to add member");
    }

    setIsSubmitting(false);
  };

  const handleEditMember = async () => {
    if (!editingMember) return;

    setIsSubmitting(true);
    setFormError(null);

    const result = await apiAuthService.editEmployee(
      editingMember.id,
      editForm
    );

    if (result.success) {
      loadMembers();
      handleCloseEdit();
      setMemberSuccess(`Member ${editForm.fullName} updated successfully`);
      setTimeout(() => setMemberSuccess(null), 3000);
    } else {
      setFormError(result.error || "Failed to update member");
    }

    setIsSubmitting(false);
  };

  const handleToggleEnabled = async (member: Employee) => {
    const result = await apiAuthService.editEmployee(member.id, {
      enabled: !member.enabled,
    });

    if (result.success) {
      loadMembers();
      setMemberSuccess(
        `Member ${member.fullName} ${!member.enabled ? "enabled" : "disabled"}`
      );
      setTimeout(() => setMemberSuccess(null), 3000);
    } else {
      setMemberError(result.error || "Failed to update member status");
    }
  };

  const copyInvitationLink = () => {
    if (!invitationToken) return;
    const link = `${window.location.origin}/auth/verify?token=${invitationToken}`;
    navigator.clipboard.writeText(link);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const getRoleIcon = (role: EmployeeRole) => {
    return role === "ADMIN" ? (
      <AdminPanelSettingsIcon fontSize="small" />
    ) : (
      <PersonIcon fontSize="small" />
    );
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckCircleIcon fontSize="small" color="success" />
    ) : (
      <BlockIcon fontSize="small" color="error" />
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      {/* Header */}
      <Header
        title="Kurum"
        showBackButton
        onBack={() => (window.location.href = "/")}
      />

      {/* Alerts */}
      <Box sx={{ px: 3, pt: 2 }}>
        {orgSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {orgSuccess}
          </Alert>
        )}
        {orgError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {orgError}
          </Alert>
        )}
        {memberSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {memberSuccess}
          </Alert>
        )}
        {memberError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {memberError}
          </Alert>
        )}
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          p: 3,
          overflow: "auto",
        }}
      >
        {/* Left Column - Organization Info */}
        <Box sx={{ flex: { xs: 1, md: "0 0 380px" } }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              height: "fit-content",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}
            >
              <Avatar
                src={entity.logoUrl}
                alt={entity.name}
                sx={{
                  width: sizing.avatar.lg,
                  height: sizing.avatar.lg,
                  fontSize: 32,
                }}
              >
                {entity.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" noWrap>
                  {entity.name}
                </Typography>
                {entity.website && (
                  <Link
                    href={entity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: "0.875rem",
                    }}
                  >
                    {entity.website.replace(/^https?:\/\//, "")}
                    <OpenInNewIcon sx={{ fontSize: 14 }} />
                  </Link>
                )}
              </Box>
              {isAdmin && (
                <Tooltip title="Düzenle">
                  <IconButton
                    onClick={handleOpenEditOrg}
                    size="small"
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {entity.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {entity.description}
              </Typography>
            )}

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block" }}
                >
                  Kurum Numarası
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}
                >
                  {entity.id}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 4 }}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                  >
                    Oluşturulma Tarihi
                  </Typography>
                  <Typography variant="body2">
                    {new Date(entity.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                  >
                    Güncellenme Tarihi
                  </Typography>
                  <Typography variant="body2">
                    {new Date(entity.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Your Account Card */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              mt: 3,
              height: "fit-content",
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Hesabınız
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName.replace(/ /g, "+")}`}
                alt={user.fullName}
                sx={{ width: sizing.avatar.md, height: sizing.avatar.md }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user.fullName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.875rem" }}
                >
                  {user.email}
                </Typography>
              </Box>
              <Chip
                icon={getRoleIcon(user.role)}
                label={user.role==="ADMIN"?"YÖNETİCİ":"ÜYE"}
                size="small"
                color={user.role === "ADMIN" ? "primary" : "default"}
                variant={user.role === "ADMIN" ? "filled" : "outlined"}
              />
            </Box>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              fullWidth
              size="small"
            >
              Çıkış Yap
            </Button>
          </Paper>
        </Box>

        {/* Right Column - Member Management */}
        {isAdmin && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                height: "fit-content",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 3,
                  py: 2,
                  borderBottom: 1,
                  borderColor: "divider",
                  bgcolor: "action.hover",
                }}
              >
                <Typography variant="subtitle1">Üyeler</Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAdd}
                >
                  Ekle
                </Button>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "action.hover" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Ad</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>E-Posta</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Durum</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Son Giriş</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Menü
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow
                        key={member.id}
                        sx={{
                          opacity: member.enabled ? 1 : 0.6,
                          bgcolor:
                            member.id === user?.id
                              ? "action.selected"
                              : "inherit",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {member.fullName}
                            {member.id === user?.id && (
                              <Chip
                                label="You"
                                size="small"
                                variant="outlined"
                                sx={{ height: 20 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {member.email}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getRoleIcon(member.role)}
                            label={member.role==="ADMIN"?"YÖNETİCİ":"ÜYE"}
                            size="small"
                            color={
                              member.role === "ADMIN" ? "primary" : "default"
                            }
                            variant={
                              member.role === "ADMIN" ? "filled" : "outlined"
                            }
                            sx={{ height: 24 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(member.enabled)}
                            label={member.enabled ? "Açık" : "Kapalı"}
                            size="small"
                            color={member.enabled ? "success" : "error"}
                            variant="outlined"
                            sx={{ height: 24 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                          {member.lastLoginAt
                            ? new Date(member.lastLoginAt).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(member)}
                              disabled={
                                member.id === user?.id &&
                                member.role === "ADMIN"
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={member.enabled ? "Disable" : "Enable"}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleToggleEnabled(member)}
                              color={member.enabled ? "error" : "success"}
                              disabled={member.id === user?.id}
                            >
                              {member.enabled ? (
                                <BlockIcon fontSize="small" />
                              ) : (
                                <CheckCircleIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {members.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Üye Bulunamadı
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}
      </Box>

      {/* Organization Edit Dialog */}
      <Dialog
        open={isEditingOrg}
        onClose={handleCloseEditOrg}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Kurumu Düzenle</DialogTitle>
        <DialogContent>
          {orgError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {orgError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Kurum Adı"
            value={editOrgForm.name}
            onChange={(e) =>
              setEditOrgForm({ ...editOrgForm, name: e.target.value })
            }
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="İkon URL"
            value={editOrgForm.logoUrl}
            onChange={(e) =>
              setEditOrgForm({ ...editOrgForm, logoUrl: e.target.value })
            }
            margin="normal"
            placeholder="https://example.com/logo.png"
            helperText="Kurumunuzun logo URL'ini giriniz"
          />

          <TextField
            fullWidth
            label="Website"
            value={editOrgForm.website}
            onChange={(e) =>
              setEditOrgForm({ ...editOrgForm, website: e.target.value })
            }
            margin="normal"
            placeholder="https://www.example.com"
          />

          <TextField
            fullWidth
            label="Açıklama"
            value={editOrgForm.description}
            onChange={(e) =>
              setEditOrgForm({ ...editOrgForm, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={4}
            placeholder="Describe your organization..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditOrg} disabled={isSavingOrg}>
            İptal Et
          </Button>
          <Button
            onClick={handleSaveOrg}
            variant="contained"
            disabled={isSavingOrg || !editOrgForm.name?.trim()}
          >
            {isSavingOrg ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={handleCloseAdd}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Yeni Üye Ekle</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Ad"
            value={newMember.fullName}
            onChange={(e) =>
              setNewMember({ ...newMember, fullName: e.target.value })
            }
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="E-Posta"
            type="email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={newMember.role}
              label="Role"
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  role: e.target.value as EmployeeRole,
                })
              }
            >
              <MenuItem value="USER">ÜYE</MenuItem>
              <MenuItem value="ADMIN">YÖNETİCİ (Diğer Üyeleri Yönetebilir)</MenuItem>
            </Select>
          </FormControl>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Kayıt linki e-posta adresine gönderilecektir. Kayıt linki 6 saat
            boyunca geçerlidir.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} disabled={isSubmitting}>
            İptal Et
          </Button>
          <Button
            onClick={handleAddMember}
            variant="contained"
            disabled={
              isSubmitting ||
              !newMember.fullName.trim() ||
              !newMember.email.trim()
            }
          >
            {isSubmitting ? "Ekleniyor..." : "Ekle"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Ad"
            value={editForm.fullName}
            onChange={(e) =>
              setEditForm({ ...editForm, fullName: e.target.value })
            }
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={editForm.role}
              label="Rol"
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  role: e.target.value as EmployeeRole,
                })
              }
            >
              <MenuItem value="USER">ÜYE</MenuItem>
              <MenuItem value="ADMIN">YÖNETİCİ (Diğer Üyeleri Yönetebilir)</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>Hesap Durumu:</Typography>
            <Switch
              checked={editForm.enabled}
              onChange={(e) =>
                setEditForm({ ...editForm, enabled: e.target.checked })
              }
            />
            <Chip
              label={editForm.enabled ? "Açık" : "Kapalı"}
              size="small"
              color={editForm.enabled ? "success" : "error"}
              variant="outlined"
            />
          </Box>

          {editingMember?.id === user?.id && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Şu anda kendi kullanıcını düzenliyorsun. Rol değişikliğine dikkat et!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={isSubmitting}>
            İptal Et
          </Button>
          <Button
            onClick={handleEditMember}
            variant="contained"
            disabled={isSubmitting || !editForm.fullName.trim()}
          >
            {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invitation Sent Dialog */}
      <Dialog
        open={isInviteDialogOpen}
        onClose={() => {
          setIsInviteDialogOpen(false);
          setInvitationToken(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Davet Gönderildi!</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Üye başarılı bir şekilde eklendi. Girilen e-posta adresine davet linki gönderildi.
          </Alert>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Development Mode - Magic Link:
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            In production, this link would be sent via email. For testing, you
            can copy or click the link below:
          </Typography>

          <Box
            sx={{
              p: 2,
              bgcolor: "action.hover",
              borderRadius: 1,
              wordBreak: "break-all",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              mb: 2,
            }}
          >
            {invitationToken &&
              `${window.location.origin}/auth/verify?token=${invitationToken}`}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<ContentCopyIcon />}
            onClick={copyInvitationLink}
            variant="outlined"
          >
            {copiedToClipboard ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            onClick={() => {
              setIsInviteDialogOpen(false);
              setInvitationToken(null);
            }}
            variant="contained"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copiedToClipboard}
        autoHideDuration={2000}
        message="Link copied to clipboard"
      />
    </Box>
  );
}
