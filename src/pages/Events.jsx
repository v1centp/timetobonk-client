import { useEvents } from "../hooks";
import { EventCard } from "../components/cards";

export default function Events() {
  const { events, loading, error } = useEvents();

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
        <div className="glass-panel p-8 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Liste des événements */}
      {!loading && !error && (
        <>
          {events.length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <p className="text-panda-400">
                Rien pour l'instant, mais des grillades se profilent pour cet été.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
