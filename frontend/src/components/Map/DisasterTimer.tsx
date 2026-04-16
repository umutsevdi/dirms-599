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
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let result = "";
      if (days > 0) result += `${days}d `;
      if (hours > 0 || days > 0) result += `${hours}h `;
      result += `${minutes}m ${seconds}s`;

      setElapsed(result);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [disasters]);

  if (!elapsed) return null;

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 900, color: "error.main", letterSpacing: 2 }}
      >
        DISASTER
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontFamily: "monospace",
          color: "error.main",
          opacity: 0.8,
          display: "block",
          mt: 0.5,
        }}
      >
        {elapsed}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "text.disabled",
          display: "block",
          fontSize: "0.65rem",
          mt: 0.25,
        }}
      >
        since earliest event
      </Typography>
    </Box>
  );
};

export default DisasterTimer;
