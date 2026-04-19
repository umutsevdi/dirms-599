import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

export default function MagicLinkHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyMagicLink } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double-processing due to React StrictMode or re-renders
    if (hasProcessed.current) return;

    const token = searchParams.get("token");

    if (!token) {
      setError("Invalid login link. No token provided.");
      setIsProcessing(false);
      return;
    }

    const processMagicLink = async () => {
      hasProcessed.current = true;
      const result = await verifyMagicLink(token);

      if (result.success) {
        // Redirect to dashboard on successful login
        navigate("/", { replace: true });
      } else {
        setError(result.error || "Failed to verify login link");
        setIsProcessing(false);
      }
    };

    processMagicLink();
  }, [searchParams, verifyMagicLink, navigate]);

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
          textAlign: "center",
        }}
      >
        {isProcessing ? (
          <>
            <CircularProgress size={48} sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Kontrol ediliyor...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lütfen bekleyiniz
            </Typography>
          </>
        ) : error ? (
          <>
            <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
              {error}
            </Alert>
            <Typography variant="h6" gutterBottom>
              Giriş Başarısız Oldu
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Giriş linkinin süresi dolmuş veya link kullanılmış olabilir. Lütfen
              yeni bir link isteyiniz.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/login")}>
              Giriş Ekranına Dön
            </Button>
          </>
        ) : null}
      </Paper>
    </Box>
  );
}
