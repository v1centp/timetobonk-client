import { useState, useEffect } from "react";
import { API } from "../lib/api";

/**
 * Hook pour récupérer les stats du club Strava
 * @returns {{ stats: Object | null, activities: Array, loading: boolean, error: string | null }}
 */
export function useStravaClub() {
  const [data, setData] = useState({ stats: null, activities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStravaData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API}/api/strava/club/activities`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Strava API non disponible");
        }

        const result = await response.json();
        setData({
          stats: result.stats,
          activities: result.activities,
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        console.info("Strava non disponible:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStravaData();

    return () => controller.abort();
  }, []);

  return { ...data, loading, error };
}

/**
 * Hook pour récupérer les infos du club Strava
 * @returns {{ club: Object | null, loading: boolean, error: string | null }}
 */
export function useStravaClubInfo() {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchClubInfo() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API}/api/strava/club`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Strava API non disponible");
        }

        const result = await response.json();
        setClub(result);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.info("Strava club info non disponible:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchClubInfo();

    return () => controller.abort();
  }, []);

  return { club, loading, error };
}

/**
 * Hook pour récupérer les événements du club Strava
 * @param {number} limit - Nombre max d'événements à retourner
 * @returns {{ events: Array, loading: boolean, error: string | null }}
 */
export function useStravaEvents(limit = 10) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEvents() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API}/api/strava/club/events`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Strava events non disponible");
        }

        const result = await response.json();
        setEvents(result.slice(0, limit));
      } catch (err) {
        if (err.name === "AbortError") return;
        console.info("Strava events non disponible:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();

    return () => controller.abort();
  }, [limit]);

  return { events, loading, error };
}
