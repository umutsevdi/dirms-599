import { useState } from "react";
import type { Coordinates } from "../types";

export function useNominatim() {
  const [results, setResults] = useState<Coordinates[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        format: "json",
        limit: "5",
        addressdetails: "1",
        countrycodes: "tr",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params}`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );

      if (!response.ok) throw new Error("Geocoding request failed");

      const data = await response.json();
      setResults(
        data.map((item: any) => ({
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          address: item.display_name,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (coords: Coordinates) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        lat: coords.lat.toString(),
        lon: coords.lng.toString(),
        format: "json",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params}`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );

      if (!response.ok) throw new Error("Reverse geocoding failed");

      const data = await response.json();
      return data.display_name || "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return "";
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search, reverseGeocode };
}
