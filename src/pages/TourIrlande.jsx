import { useState, useEffect } from "react";
import { LIVETRACK_URL as FALLBACK_URL, DONATE_URL, STRAVA_ROUTE_URL, STRAVA_ROUTE_IMAGE } from "../data/tourIrlande.js";
import { API } from "../lib/api.js";

export default function TourIrlande() {
  const [livetrackUrl, setLivetrackUrl] = useState(FALLBACK_URL);

  useEffect(() => {
    fetch(`${API}/api/tour-irlande`)
      .then((r) => r.json())
      .then((data) => {
        if (data.livetrackUrl) setLivetrackUrl(data.livetrackUrl);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="container">
      <h1 className="text-3xl font-bold text-white mb-2">
        Tour d'Irlande
      </h1>
      <p className="text-panda-300 mb-8">
        27 février — 8 mars 2026
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="rounded-2xl border border-panda-700/50 bg-panda-800/40 p-3 sm:p-4 text-center">
          <p className="text-lg sm:text-2xl font-bold text-bamboo-400">2 000 km</p>
          <p className="text-[10px] sm:text-xs text-panda-400 mt-1">Distance</p>
        </div>
        <div className="rounded-2xl border border-panda-700/50 bg-panda-800/40 p-3 sm:p-4 text-center">
          <p className="text-lg sm:text-2xl font-bold text-bamboo-400">15 000 D+</p>
          <p className="text-[10px] sm:text-xs text-panda-400 mt-1">Dénivelé</p>
        </div>
        <div className="rounded-2xl border border-panda-700/50 bg-panda-800/40 p-3 sm:p-4 text-center">
          <p className="text-lg sm:text-2xl font-bold text-bamboo-400">10 jours</p>
          <p className="text-[10px] sm:text-xs text-panda-400 mt-1">Durée</p>
        </div>
      </div>

      {/* Présentation + Make-A-Wish */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="rounded-2xl border border-panda-700/50 bg-panda-800/40 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Le défi</h2>
          <p className="text-sm text-panda-300 leading-relaxed mb-4">
            JC s'est lancé un défi personnel : faire le tour de l'Irlande à vélo
            pour soutenir Make‑A‑Wish Ireland. Du 27 février au 8 mars, il parcourra
            environ 2 000 km à travers le pays. L'idée est simple : se dépasser
            physiquement tout en récoltant des fonds pour une association qui fait
            un travail incroyable pour les enfants et leurs familles en Irlande.
          </p>
          <p className="text-sm text-panda-400 leading-relaxed italic">
            JC has taken on a personal challenge: cycling around Ireland to support
            Make‑A‑Wish Ireland. From February 27 to March 8, he'll be riding
            approximately 2,000 km across the country. The idea is simple: push
            himself physically while raising funds for a charity that does incredible
            work for children and their families in Ireland.
          </p>
        </div>

        <div className="rounded-2xl border border-bamboo-500/20 bg-bamboo-500/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Make‑A‑Wish Ireland</h2>
          <p className="text-sm text-panda-300 leading-relaxed mb-4">
            Make‑A‑Wish Ireland a un objectif simple : exaucer les vœux d'enfants
            de 3 à 17 ans vivant avec une maladie grave. Chaque don, quel que soit
            le montant, aide à offrir un moment de magie à ces enfants.
          </p>
          <p className="text-sm text-panda-400 leading-relaxed italic mb-4">
            Make‑A‑Wish Ireland has one simple aim: granting the wishes of children
            aged 3 to 17 living with life‑threatening medical conditions. Every
            donation, no matter the amount, helps bring a moment of magic to these children.
          </p>
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            Faire un don / Donate
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Parcours complet */}
      <a
        href={STRAVA_ROUTE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 rounded-xl border border-panda-700/50 bg-panda-800/40 p-3 mb-6 transition hover:border-panda-600 hover:bg-panda-800/60"
      >
        <img
          src={STRAVA_ROUTE_IMAGE}
          alt="Carte du parcours"
          className="h-16 w-16 rounded-lg object-cover shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Parcours complet</p>
          <p className="text-xs text-panda-400">1 938 km — 15 987 m D+ — Voir sur Strava</p>
        </div>
        <svg className="w-4 h-4 text-panda-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
        </svg>
      </a>

      {/* LiveTrack */}
      <div className="rounded-2xl border border-panda-700/50 bg-panda-800/40 overflow-hidden">
        <div className="px-6 pt-6 pb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Suivi en direct / Live Tracking</h2>
          <a
            href={livetrackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-bamboo-400 hover:text-bamboo-300 transition"
          >
            Ouvrir dans Garmin &rarr;
          </a>
        </div>
        <iframe
          src={livetrackUrl}
          title="LiveTrack Garmin"
          className="w-full border-0"
          style={{ height: "500px" }}
          allow="geolocation"
        />
      </div>
    </section>
  );
}
