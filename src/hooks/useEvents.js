import { useState, useEffect, useMemo } from "react";
import { API } from "../lib/api";
import { eventsData } from "../data/events";

/**
 * Hook pour charger les événements
 * @returns {{ events: import('../types').Event[], loading: boolean, error: string | null }}
 */
export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEvents() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API}/api/events`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("API non disponible");

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.info("API events non disponible, utilisation des données mock");
        setEvents(eventsData);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();

    return () => controller.abort();
  }, []);

  // Trier par date (prochains d'abord)
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events]);

  return { events: sortedEvents, loading, error };
}

/**
 * Hook pour obtenir les prochains événements
 * @param {number} [limit=3] - Nombre d'événements à retourner
 * @returns {{ events: import('../types').Event[], loading: boolean, error: string | null }}
 */
export function useUpcomingEvents(limit = 3) {
  const { events, loading, error } = useEvents();

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((event) => new Date(event.date) >= now)
      .slice(0, limit);
  }, [events, limit]);

  return { events: upcomingEvents, loading, error };
}
