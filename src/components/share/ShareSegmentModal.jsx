import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import pandaLogo from "../../assets/panda logo.png";

/**
 * Formate le mois en français
 */
function formatMonth(monthStr) {
  const [year, month] = monthStr.split("-");
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString("fr-CH", { month: "long", year: "numeric" });
}

/**
 * Modal pour partager le segment du mois avec image générée
 */
export default function ShareSegmentModal({ segment, onClose }) {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

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
    link.download = `panda-cycling-segment-${segment.month}.png`;
    link.href = imageUrl;
    link.click();
  };

  const shareImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `panda-cycling-segment-${segment.month}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Segment du mois - Panda Cycling`,
          text: `Défi du mois : ${segment.segmentName} !`,
          files: [file],
        });
      } else {
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
          <h2 className="text-lg font-semibold text-white">Partager le segment</h2>
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
              minHeight: "350px",
            }}
          >
            {/* Gradient decoratif */}
            <div
              className="absolute top-0 right-0 w-64 h-64 opacity-30 blur-3xl"
              style={{
                background: "radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)",
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

            {/* Badge */}
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-amber-500/20 text-amber-400 mb-4">
              Segment du mois
            </span>

            {/* Mois */}
            <p className="text-panda-400 text-sm mb-1 capitalize">
              {formatMonth(segment.month)}
            </p>

            {/* Nom du segment */}
            <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
              {segment.segmentName}
            </h3>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="text-panda-300">
                <span className="text-xl font-bold text-white">
                  {(segment.segmentDistance / 1000).toFixed(1)}
                </span> km
              </div>
              <div className="text-panda-300">
                <span className="text-xl font-bold text-white">
                  {Math.round(segment.segmentElevation)}
                </span> m D+
              </div>
              {segment.averageGrade && (
                <div className="text-panda-300">
                  <span className="text-xl font-bold text-white">
                    {segment.averageGrade.toFixed(1)}
                  </span>%
                </div>
              )}
            </div>

            {/* Lieu */}
            {segment.city && (
              <div className="flex items-center gap-2 text-panda-400 mb-4">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{segment.city}</span>
              </div>
            )}

            {/* Lien Strava */}
            <div className="mt-6 pt-4 border-t border-panda-700/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-bamboo-400 font-medium">
                  À toi de jouer !
                </span>
                <div className="flex items-center gap-2 text-[#FC4C02] text-xs">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                  </svg>
                  <span>strava.com/segments/{segment.segmentId}</span>
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
