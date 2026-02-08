import { useState } from "react";
import { createPortal } from "react-dom";
import { categoryLabels, categoryColors } from "../../data/rides";
import { ShareRideModal } from "../share";

/**
 * Formate une date en français
 * @param {string} dateStr - Date ISO
 * @returns {string}
 */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * Formate l'heure
 * @param {string} dateStr - Date ISO
 * @returns {string}
 */
function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("fr-CH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Carte pour afficher une sortie vélo
 * @param {Object} props
 * @param {import('../../types').Ride} props.ride - Données de la sortie
 * @param {boolean} [props.compact=false] - Affichage compact
 */
const defaultColors = {
  bg: "bg-panda-700/30",
  text: "text-panda-300",
  border: "border-panda-600/30",
};

export default function RideCard({ ride, compact = false }) {
  const [showShare, setShowShare] = useState(false);
  const colors = categoryColors[ride.category] || defaultColors;
  const categoryLabel = categoryLabels[ride.category] || ride.category || "Sortie";

  if (compact) {
    return (
      <article className="glass-panel flex items-center gap-4 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
            >
              {categoryLabel}
            </span>
            <span className="text-xs text-panda-400">{formatDate(ride.date)}</span>
          </div>
          <h3 className="font-semibold text-white truncate">{ride.title}</h3>
        </div>
        {(ride.distance || ride.elevation) && (
          <div className="text-right text-sm text-panda-400">
            {ride.distance && <div>{ride.distance} km</div>}
            {ride.elevation && <div>{ride.elevation} m D+</div>}
          </div>
        )}
      </article>
    );
  }

  return (
    <article className="glass-panel flex flex-col gap-4 p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}
          >
            {categoryLabel}
          </span>
        </div>
        <time className="text-sm text-panda-400" dateTime={ride.date}>
          {formatDate(ride.date)}
        </time>
      </header>

      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{ride.title}</h3>
        {ride.description && (
          <p className="text-sm text-panda-400 line-clamp-2">{ride.description}</p>
        )}
      </div>

      <div className="flex items-center gap-6 text-sm">
        {ride.category !== "tranquille" && (
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-panda-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-panda-200">{ride.time || formatTime(ride.date)}</span>
          </div>
        )}
        {ride.meetingPoint && (
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-panda-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-panda-200 truncate">{ride.meetingPoint}</span>
          </div>
        )}
      </div>

      <footer className="flex items-center justify-between border-t border-panda-700/30 pt-4 mt-auto">
        <div className="flex items-center gap-4 text-sm">
          {ride.distance && (
            <span className="text-panda-300">
              <strong className="text-white">{ride.distance}</strong> km
            </span>
          )}
          {ride.elevation && (
            <span className="text-panda-300">
              <strong className="text-white">{ride.elevation}</strong> m D+
            </span>
          )}
          {ride.participants > 0 && (
            <span className="text-panda-300">
              <strong className="text-white">{ride.participants}</strong> inscrits
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Bouton partage */}
          {!ride.isPast && (
            <button
              onClick={() => setShowShare(true)}
              className="inline-flex items-center gap-1.5 text-sm text-panda-400 hover:text-bamboo-400 transition"
              title="Partager"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          )}
          {ride.gpxUrl && (
            <a
              href={ride.gpxUrl}
              className="text-sm text-panda-400 hover:text-bamboo-400 transition"
              download
            >
              GPX
            </a>
          )}
          {ride.stravaUrl && (
            <a
              href={ride.stravaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#FC4C02] hover:text-[#E34402] transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
              Voir
            </a>
          )}
        </div>
      </footer>

      {/* Modal de partage */}
      {showShare && createPortal(
        <ShareRideModal ride={ride} onClose={() => setShowShare(false)} />,
        document.body
      )}
    </article>
  );
}
