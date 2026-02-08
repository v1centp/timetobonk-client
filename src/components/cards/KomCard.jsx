import { useState } from "react";
import { createPortal } from "react-dom";
import { ShareSegmentModal } from "../share";

/**
 * Formate le mois en français
 * @param {string} monthStr - Format "YYYY-MM"
 * @returns {string}
 */
function formatMonth(monthStr) {
  const [year, month] = monthStr.split("-");
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString("fr-CH", { month: "long", year: "numeric" });
}

/**
 * Carte pour afficher le KOM du mois
 * @param {Object} props
 * @param {import('../../types').KomMonthly} props.kom - Données du KOM
 * @param {string} [props.detailsLink] - Si défini, affiche "Voir les détails" au lieu de "Voir sur Strava"
 */
export default function KomCard({ kom, detailsLink }) {
  const [showShare, setShowShare] = useState(false);

  return (
    <article className="glass-panel p-6">
      <header className="text-center">
        <p className="text-sm text-panda-400 uppercase tracking-wider mb-1">
          Segment du mois
        </p>
        <h3 className="text-xl font-bold text-white mb-2">{kom.monthLabel || formatMonth(kom.month)}</h3>
        <a
          href={kom.segmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg text-bamboo-400 hover:text-bamboo-300 transition font-medium"
        >
          {kom.segmentName}
        </a>
        <div className="flex items-center justify-center gap-4 mt-3 text-sm text-panda-400">
          <span>{(kom.segmentDistance / 1000).toFixed(1)} km</span>
          <span>•</span>
          <span>{Math.round(kom.segmentElevation)} m D+</span>
          {kom.averageGrade && (
            <>
              <span>•</span>
              <span>{kom.averageGrade.toFixed(1)}%</span>
            </>
          )}
        </div>
        {kom.city && (
          <p className="text-xs text-panda-500 mt-2">{kom.city}</p>
        )}
      </header>

      <footer className="mt-6 flex items-center justify-center gap-3">
        {detailsLink ? (
          <a href={detailsLink} className="btn-primary">
            Voir les détails
          </a>
        ) : (
          <a
            href={kom.segmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Voir sur Strava
          </a>
        )}
        <button
          onClick={() => setShowShare(true)}
          className="btn-ghost"
          title="Partager"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Partager
        </button>
      </footer>

      {/* Modal de partage */}
      {showShare && createPortal(
        <ShareSegmentModal segment={kom} onClose={() => setShowShare(false)} />,
        document.body
      )}
    </article>
  );
}
