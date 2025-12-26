import { useState, useEffect } from "react";
import { API } from "../lib/api";
import { currentKom, komHistory } from "../data/kom";

/**
 * Hook pour charger le KOM du mois en cours
 * @returns {{ kom: import('../types').KomMonthly | null, loading: boolean, error: string | null }}
 */
export function useCurrentKom() {
  const [kom, setKom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchKom() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API}/api/kom/current`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("API non disponible");

        const data = await res.json();
        setKom(data);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.info("API KOM non disponible, utilisation des données mock");
        setKom(currentKom);
      } finally {
        setLoading(false);
      }
    }

    fetchKom();

    return () => controller.abort();
  }, []);

  return { kom, loading, error };
}

/**
 * Hook pour charger l'historique des KOM
 * @returns {{ history: import('../types').KomMonthly[], loading: boolean, error: string | null }}
 */
export function useKomHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHistory() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API}/api/kom/history`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("API non disponible");

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.info("API KOM history non disponible, utilisation des données mock");
        setHistory(komHistory);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();

    return () => controller.abort();
  }, []);

  return { history, loading, error };
}
