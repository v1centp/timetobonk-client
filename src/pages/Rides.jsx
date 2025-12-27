import { useSearchParams } from "react-router-dom";
import { useRides } from "../hooks";
import { RideCard } from "../components/cards";
import { RideCategoryTabs } from "../components/filters";

export default function Rides() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const { rides, pastRides, loading, error } = useRides(category);

  const handleCategoryChange = (newCategory) => {
    if (newCategory === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: newCategory });
    }
  };

  return (
    <div className="container">
      {/* En-tête */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sorties</h1>
        <p className="text-panda-400">
          Découvrez nos prochaines sorties et rejoignez-nous sur la route.
        </p>
      </header>

      {/* Planning hebdomadaire */}
      <section className="glass-panel p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Notre programme</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-panda-100/10 text-panda-100">
              <span className="text-sm font-bold">ME</span>
            </div>
            <div>
              <h3 className="font-medium text-white">Mercredi soir</h3>
              <p className="text-sm text-panda-400">
                Sortie <strong className="text-panda-100">pleine balle</strong> sur Zwift jusqu'au printemps, dehors dès la belle saison.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bamboo-500/20 text-bamboo-400">
              <span className="text-sm font-bold">VE</span>
            </div>
            <div>
              <h3 className="font-medium text-white">Vendredi 5h30</h3>
              <p className="text-sm text-panda-400">
                Sortie <strong className="text-bamboo-400">tranquille</strong> sur Zwift. Si écart dans les montées, on s'attend en haut.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bamboo-300/20 text-bamboo-300">
              <span className="text-sm font-bold">WE</span>
            </div>
            <div>
              <h3 className="font-medium text-white">Weekends</h3>
              <p className="text-sm text-panda-400">
                Sorties <strong className="text-bamboo-300">aventure</strong> dès la belle saison : cols, tours hors Lausanne. Annoncé ~1 mois à l'avance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <div className="mb-8">
        <RideCategoryTabs selected={category} onChange={handleCategoryChange} />
      </div>

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

      {/* Liste des prochaines sorties */}
      {!loading && !error && (
        <>
          <h2 className="text-xl font-semibold text-white mb-4">Prochaines sorties</h2>
          {rides.length === 0 ? (
            <div className="glass-panel p-8 text-center mb-8">
              <p className="text-panda-400 mb-4">
                Aucune sortie prévue pour le moment.
              </p>
              <button
                onClick={() => handleCategoryChange("all")}
                className="btn btn-ghost text-sm"
              >
                Voir toutes les catégories
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {rides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          )}

          {/* Sorties passées */}
          {pastRides.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-white mb-4">Sorties passées</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-70">
                {pastRides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Légende des catégories */}
      <footer className="mt-12 glass-panel p-6">
        <h2 className="text-sm font-semibold text-white mb-4">
          Les catégories de sorties
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <h3 className="text-bamboo-400 font-medium mb-1">Tranquille</h3>
            <p className="text-sm text-panda-400">
              Allure modérée, no drop. Si un écart se crée dans les montées, on s'attend en haut.
            </p>
          </div>
          <div>
            <h3 className="text-panda-100 font-medium mb-1">Course</h3>
            <p className="text-sm text-panda-400">
              Pleine balle. Rythme soutenu pour ceux qui veulent envoyer.
            </p>
          </div>
          <div>
            <h3 className="text-bamboo-300 font-medium mb-1">Aventure</h3>
            <p className="text-sm text-panda-400">
              Cols, tours, exploration. Des sorties spéciales hors de Lausanne.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
