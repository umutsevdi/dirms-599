import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { layout } from "../theme";

// Dev tools imports - remove in production
import { mockAuthService } from "../services/mockAuthService";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import LoginIcon from "@mui/icons-material/Login";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sentToken, setSentToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  // Dev tools state - remove in production
  const [devLinkCopied, setDevLinkCopied] = useState(false);
  const testCredentials = mockAuthService.getTestCredentials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSentToken(null);

    const result = await login(email);

    if (result.success && result.token) {
      setSentToken(result.token);
    } else {
      setError(result.error || "Failed to send login link");
    }

    setIsLoading(false);
  };

  // Dev tools functions - remove in production
  const handleDevAutoFill = (emailAddress: string) => {
    setEmail(emailAddress);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(fakeEvent);
    }, 100);
  };

  const handleDevSimulateMagicLink = () => {
    if (!sentToken) return;
    window.location.href = `${window.location.origin}/auth/verify?token=${sentToken}`;
  };

  const copyDevLink = () => {
    if (!sentToken) return;
    const magicLinkUrl = `${window.location.origin}/auth/verify?token=${sentToken}`;
    navigator.clipboard.writeText(magicLinkUrl);
    setDevLinkCopied(true);
    setTimeout(() => setDevLinkCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 480,
          width: "100%",
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Disaster Management System
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Sign in with your email to access your organization account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {sentToken ? (
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Login link sent! Check your email.
            </Alert>

            <Button
              variant="text"
              onClick={() => {
                setSentToken(null);
                setEmail("");
              }}
              sx={{ mt: 2 }}
            >
              Use different email
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              {isLoading ? "Sending..." : "Send Login Link"}
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              We'll send a secure login link to your email.
              The link expires in 6 hours.
            </Typography>
          </form>
        )}
      </Paper>

      {/* Dev tools - remove in production */}
      <Box
        sx={{
          position: "fixed",
          bottom: layout.spacing.md,
          right: layout.spacing.md,
          maxWidth: layout.panel.infoBoardWidthCluster,
          zIndex: layout.zIndex.devTools,
        }}
      >
        <Card elevation={4} sx={{ bgcolor: "warning.light" }}>
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography variant="subtitle2" color="warning.dark" gutterBottom>
              🛠️ Development Tools
            </Typography>

            {sentToken ? (
              <>
                <Typography variant="caption" color="success.dark" sx={{ display: "block", mb: 1, fontWeight: 500 }}>
                  ✉️ Email sent! Now simulate clicking the link:
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<LoginIcon />}
                  onClick={handleDevSimulateMagicLink}
                  fullWidth
                  sx={{ mb: 2, fontSize: "0.875rem" }}
                >
                  Simulate Magic Link
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={copyDevLink}
                  fullWidth
                  sx={{ fontSize: "0.75rem", mb: 2 }}
                >
                  {devLinkCopied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<EmailIcon />}
                  onClick={() => {
                    setSentToken(null);
                    setEmail("");
                  }}
                  fullWidth
                  sx={{ fontSize: "0.75rem" }}
                >
                  Try Different Account
                </Button>
              </>
            ) : (
              <>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  Auto-fill Email & Submit:
                </Typography>
                <List dense sx={{ bgcolor: "background.paper", borderRadius: 1, mb: 2 }}>
                  {testCredentials.slice(0, 4).map((cred, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        cursor: "pointer",
                        py: 0.5,
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                      onClick={() => handleDevAutoFill(cred.email)}
                    >
                      <ListItemText
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontSize: "0.75rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                        primary={cred.email}
                        secondary={
                          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                            <Chip
                              label={cred.role}
                              size="small"
                              color={cred.role === "ADMIN" ? "primary" : "default"}
                              variant={cred.role === "ADMIN" ? "filled" : "outlined"}
                              sx={{ height: 16, fontSize: "0.625rem" }}
                            />
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: "0.625rem" }}>
                              {cred.entity}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={devLinkCopied}
        autoHideDuration={2000}
        message="Magic link copied to clipboard"
      />
    </Box>
  );
}
