import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { categoryLabels, categoryColors } from "../../data/rides";
import pandaLogo from "../../assets/panda logo.png";

/**
 * Formate une date en français
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
 */
function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("fr-CH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const defaultColors = {
  bg: "bg-panda-700/30",
  text: "text-panda-300",
};

/**
 * Modal pour partager une sortie avec image générée
 */
export default function ShareRideModal({ ride, onClose }) {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const colors = categoryColors[ride.category] || defaultColors;
  const categoryLabel = categoryLabels[ride.category] || ride.category || "Sortie";

  const generateImage = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
      });
      setImageUrl(dataUrl);
    } catch (err) {
      console.error("Erreur génération image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.download = `panda-cycling-${ride.id}.png`;
    link.href = imageUrl;
    link.click();
  };

  const shareImage = async () => {
    if (!imageUrl) return;

    try {
      // Convertir dataUrl en blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `panda-cycling-${ride.id}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${ride.title} - Panda Cycling`,
          text: `Rejoins-nous pour ${ride.title} !`,
          files: [file],
        });
      } else {
        // Fallback: télécharger
        downloadImage();
      }
    } catch (err) {
      console.error("Erreur partage:", err);
      downloadImage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-panda-900 border border-panda-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-panda-700/50">
          <h2 className="text-lg font-semibold text-white">Partager la sortie</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-panda-800 text-panda-400 hover:text-white transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Card Preview */}
        <div className="p-4">
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-xl p-6"
            style={{
              background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
              width: "100%",
              minHeight: "400px",
            }}
          >
            {/* Gradient decoratif */}
            <div
              className="absolute top-0 right-0 w-64 h-64 opacity-30 blur-3xl"
              style={{
                background: ride.category === "course"
                  ? "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(34,197,94,0.4) 0%, transparent 70%)",
              }}
            />

            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={pandaLogo}
                alt="Panda Cycling"
                className="h-10 w-10 object-cover rounded-full"
                style={{ objectPosition: "center 40%" }}
              />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-panda-300">
                Panda Cycling
              </span>
            </div>

            {/* Catégorie */}
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${colors.bg} ${colors.text} mb-4`}
            >
              {categoryLabel}
            </span>

            {/* Titre */}
            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
              {ride.title}
            </h3>

            {/* Date & Heure */}
            <div className="flex items-center gap-3 text-panda-300 mb-4">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="capitalize">{formatDate(ride.date)}</span>
              </div>
              <span className="text-panda-600">|</span>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTime(ride.date)}</span>
              </div>
            </div>

            {/* Description */}
            {ride.description && (
              <p className="text-sm text-panda-400 mb-4">
                {ride.description}
              </p>
            )}

            {/* Lieu */}
            {ride.meetingPoint && (
              <div className="flex items-center gap-2 text-panda-400 mb-4">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{ride.meetingPoint}</span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              {ride.distance && (
                <div className="text-panda-300">
                  <span className="text-xl font-bold text-white">{ride.distance}</span> km
                </div>
              )}
              {ride.elevation && (
                <div className="text-panda-300">
                  <span className="text-xl font-bold text-white">{ride.elevation}</span> m D+
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-6 pt-4 border-t border-panda-700/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-bamboo-400 font-medium">
                  Rejoins-nous !
                </span>
                <div className="flex items-center gap-2 text-panda-500 text-xs">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                  </svg>
                  <span>strava.com/clubs/panda-cycling</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-panda-700/50">
          {!imageUrl ? (
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className="flex-1 btn-primary justify-center"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Génération...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Générer l'image
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={shareImage}
                className="flex-1 btn-primary justify-center"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Partager
              </button>
              <button
                onClick={downloadImage}
                className="btn-ghost justify-center"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
