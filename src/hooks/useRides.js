import { useState, useEffect, useMemo } from "react";
import { API } from "../lib/api";

/**
 * Hook pour charger les sorties vélo depuis l'API
 * @param {import('../types').RideCategory | 'all'} [category='all']
 * @returns {{ rides: import('../types').Ride[], pastRides: import('../types').Ride[], loading: boolean, error: string | null }}
 */
export function useRides(category = "all") {
  const [allRides, setAllRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRides() {
      setLoading(true);
      setError(null);

      try {
        const url = category === "all"
          ? `${API}/api/rides`
          : `${API}/api/rides?category=${category}`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("API non disponible");

        const data = await res.json();
        setAllRides(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.info("API rides non disponible:", err.message);
        setError(err.message);
        setAllRides([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRides();
    return () => controller.abort();
  }, [category]);

  const now = new Date();

  const rides = useMemo(
    () => allRides.filter((r) => new Date(r.date) >= now),
    [allRides]
  );

  const pastRides = useMemo(
    () => allRides.filter((r) => new Date(r.date) < now),
    [allRides]
  );

  return { rides, pastRides, loading, error };
}

/**
 * Hook pour obtenir les prochaines sorties
 * @param {number} [limit=3]
 */
export function useUpcomingRides(limit = 3) {
  const { rides, loading, error } = useRides("all");

  const limitedRides = useMemo(() => rides.slice(0, limit), [rides, limit]);

  return { rides: limitedRides, loading, error };
}
