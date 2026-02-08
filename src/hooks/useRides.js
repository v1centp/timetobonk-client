import { useState, useEffect, useMemo } from "react";
import { API } from "../lib/api";
import { ridesData } from "../data/rides";

/**
 * Transforme un événement Strava en format ride
 */
function formatEvent(event) {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    category: event.category,
    description: event.description || "",
    location: event.location || null,
    distance: event.route?.distance ? Math.round(event.route.distance / 1000) : null,
    elevation: event.route?.elevation || null,
    meetingPoint: event.location || null,
    organizer: event.organizer || "Panda Cycling",
    participants: event.memberCount || 0,
    maxParticipants: null,
    stravaUrl: event.stravaUrl,
    isPast: event.isPast,
  };
}

/**
 * Transforme une sortie statique en format ride
 */
function formatStaticRide(ride) {
  const now = new Date();
  const rideDate = new Date(`${ride.date}T${ride.time || "00:00"}`);
  return {
    id: ride.id,
    title: ride.title,
    date: ride.date,
    category: ride.category,
    description: ride.description || "",
    location: ride.meetingPoint || null,
    distance: ride.distance || null,
    elevation: ride.elevation || null,
    meetingPoint: ride.meetingPoint || null,
    organizer: "Panda Cycling",
    participants: 0,
    maxParticipants: null,
    stravaUrl: null,
    isPast: rideDate < now,
  };
}

/**
 * Hook pour charger les sorties vélo depuis Strava
 * @param {import('../types').RideCategory | 'all'} [category='all'] - Filtrer par catégorie
 * @param {'upcoming' | 'past' | 'all'} [timeFilter='upcoming'] - Filtrer par temps
 * @returns {{ rides: import('../types').Ride[], pastRides: import('../types').Ride[], loading: boolean, error: string | null }}
 */
export function useRides(category = "all", timeFilter = "upcoming") {
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [pastRides, setPastRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRides() {
      setLoading(true);
      setError(null);

      // Préparer les sorties statiques
      const staticRides = ridesData.map(formatStaticRide);
      const staticUpcoming = staticRides.filter((r) => !r.isPast).sort((a, b) => new Date(a.date) - new Date(b.date));
      const staticPast = staticRides.filter((r) => r.isPast).sort((a, b) => new Date(b.date) - new Date(a.date));

      try {
        const res = await fetch(`${API}/api/strava/club/events`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Strava API non disponible");

        const { upcoming, past } = await res.json();

        const stravaUpcoming = upcoming.map(formatEvent);
        const stravaPast = past.map(formatEvent);

        // Fusionner : Strava + statiques (éviter doublons par titre+date)
        const stravaKeys = new Set([...stravaUpcoming, ...stravaPast].map((r) => `${r.title}::${r.date}`));
        const extraUpcoming = staticUpcoming.filter((r) => !stravaKeys.has(`${r.title}::${r.date}`));
        const extraPast = staticPast.filter((r) => !stravaKeys.has(`${r.title}::${r.date}`));

        setUpcomingRides(
          [...stravaUpcoming, ...extraUpcoming].sort((a, b) => new Date(a.date) - new Date(b.date))
        );
        setPastRides(
          [...stravaPast, ...extraPast].sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } catch (err) {
        if (err.name === "AbortError") return;
        console.info("Strava events non disponible:", err.message);
        setError(null);
        // Fallback sur les données statiques
        setUpcomingRides(staticUpcoming);
        setPastRides(staticPast);
      } finally {
        setLoading(false);
      }
    }

    fetchRides();

    return () => controller.abort();
  }, []);

  // Sélectionner les rides selon le filtre temps
  const allRides = useMemo(() => {
    if (timeFilter === "upcoming") return upcomingRides;
    if (timeFilter === "past") return pastRides;
    return [...upcomingRides, ...pastRides];
  }, [upcomingRides, pastRides, timeFilter]);

  // Filtrer par catégorie
  const filteredRides = useMemo(() => {
    if (category === "all") return allRides;
    return allRides.filter((ride) => ride.category === category);
  }, [allRides, category]);

  // Filtrer les pastRides par catégorie aussi
  const filteredPastRides = useMemo(() => {
    if (category === "all") return pastRides;
    return pastRides.filter((ride) => ride.category === category);
  }, [pastRides, category]);

  return { rides: filteredRides, pastRides: filteredPastRides, loading, error };
}

/**
 * Hook pour obtenir les prochaines sorties
 * @param {number} [limit=3] - Nombre de sorties à retourner
 * @returns {{ rides: import('../types').Ride[], loading: boolean, error: string | null }}
 */
export function useUpcomingRides(limit = 3) {
  const { rides, loading, error } = useRides("all", "upcoming");

  const limitedRides = useMemo(() => {
    return rides.slice(0, limit);
  }, [rides, limit]);

  return { rides: limitedRides, loading, error };
}
