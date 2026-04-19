import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

interface DisasterTimerProps {
  disasters: { timestamp: string; type: string }[];
}

const DisasterTimer = ({ disasters }: DisasterTimerProps) => {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      if (disasters.length === 0) {
        setElapsed("");
        return;
      }

      const timestamps = disasters.map((d) => new Date(d.timestamp).getTime());
      const earliest = Math.min(...timestamps);
      const now = Date.now();
      const diff = now - earliest;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      let result = "";
      if (days > 0) result += `${days} gün `;
      if (hours > 0 || days > 0) result += `${hours} saat `;
      result += `${minutes} dakika`;

      setElapsed(result);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [disasters]);

  if (!elapsed) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "background.paper",
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: "error.main",
          letterSpacing: 1,
          fontSize: "0.875rem",
        }}
      >
        AFET
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: "monospace",
          fontWeight: 600,
          color: "text.primary",
          fontSize: "0.875rem",
        }}
      >
        {elapsed}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontSize: "0.75rem",
        }}
      >
        önce başladı
      </Typography>
    </Box>
  );
};

export default DisasterTimer;
