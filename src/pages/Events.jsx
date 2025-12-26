import { useMemo } from "react";
import { useEvents } from "../hooks";
import { EventCard } from "../components/cards";

export default function Events() {
  const { events, loading, error } = useEvents();

  // Séparer événements à venir et passés
  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    return {
      upcoming: events.filter((e) => new Date(e.date) >= now),
      past: events.filter((e) => new Date(e.date) < now),
    };
  }, [events]);

  return (
    <div className="container">
      {/* En-tête */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Événements</h1>
        <p className="text-panda-400">
          Grillades, assemblées, sorties spéciales... Ne manquez rien !
        </p>
      </header>

      {/* État de chargement */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-panda-700 border-t-white" />
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="glass-panel p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Événements à venir */}
      {!loading && !error && (
        <>
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-bamboo-400" />
              À venir
            </h2>

            {upcoming.length === 0 ? (
              <div className="glass-panel p-8 text-center">
                <p className="text-panda-400">
                  Aucun événement prévu pour le moment. Restez connectés !
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>

          {/* Événements passés */}
          {past.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-panda-500" />
                Événements passés
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
