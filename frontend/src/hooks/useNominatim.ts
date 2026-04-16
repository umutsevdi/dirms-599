import { useState } from "react";
import type { GeocodeResult } from "../types";

export function useNominatim() {
  const [results, setResults] = useState<GeocodeResult[]>([]);
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
          address: item.display_name,
          location: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}
