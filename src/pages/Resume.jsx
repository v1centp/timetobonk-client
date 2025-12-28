import { useState, useRef, useEffect } from "react";
import pandaLogo from "../assets/panda logo.png";

export default function Resume() {
  const [generating, setGenerating] = useState(false);
  const [komData, setKomData] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch("/api/strava/kom/current")
      .then((r) => r.ok ? r.json() : null)
      .then(setKomData)
      .catch(() => null);
  }, []);

  const generateImage = async () => {
    setGenerating(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Instagram story dimensions (1080x1920)
    canvas.width = 1080;
    canvas.height = 1920;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0a0a0a");
    gradient.addColorStop(0.5, "#171717");
    gradient.addColorStop(1, "#0a0a0a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle green glow at top
    const glowGradient = ctx.createRadialGradient(540, 150, 0, 540, 150, 500);
    glowGradient.addColorStop(0, "rgba(34, 197, 94, 0.12)");
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, canvas.width, 600);

    // Load and draw panda logo
    const logo = new Image();
    logo.crossOrigin = "anonymous";

    await new Promise((resolve) => {
      logo.onload = resolve;
      logo.src = pandaLogo;
    });

    // Draw circular logo
    ctx.save();
    ctx.beginPath();
    ctx.arc(540, 180, 80, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logo, 460, 100, 160, 160);
    ctx.restore();

    // Draw logo border
    ctx.beginPath();
    ctx.arc(540, 180, 85, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PANDA CYCLING", 540, 320);

    // Subtitle
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "24px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Club cycliste amateur • Lausanne", 540, 360);

    // Intro
    ctx.fillStyle = "#e4e4e7";
    ctx.font = "26px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Le programme pour cette nouvelle année :", 540, 420);

    let currentY = 480;

    // Helper function to draw section
    const drawSection = (title, items, color = "#22c55e") => {
      // Section title
      ctx.fillStyle = color;
      ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(title, 80, currentY);
      currentY += 15;

      // Underline
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, currentY);
      ctx.lineTo(1000, currentY);
      ctx.stroke();
      currentY += 35;

      // Items
      ctx.fillStyle = "#e4e4e7";
      ctx.font = "24px -apple-system, BlinkMacSystemFont, sans-serif";
      items.forEach((item) => {
        ctx.fillText("• " + item, 100, currentY);
        currentY += 38;
      });

      currentY += 25;
    };

    // Sorties section
    drawSection("NOS SORTIES", [
      "Mercredi soir — \"Pleine balle\" (sortie rapide)",
      "Vendredi 5h30 — Sortie tranquille",
      "Sur Zwift l'hiver, sur route dès la belle saison",
      "Weekends — Aventures outdoor (cols, tours)",
    ]);

    // KOM section
    const komName = komData?.segmentName || "Segment du mois";
    const komCity = komData?.city || "";
    drawSection("KOM DU MOIS", [
      "Chaque mois, un segment Strava à attaquer",
      komName + (komCity ? ` (${komCity})` : ""),
      "strava.com/segments/" + (komData?.segmentId || ""),
    ], "#f59e0b");

    // Events section
    drawSection("ÉVÉNEMENTS", [
      "Grillades prévues cet été !",
      "Sorties aventure annoncées à l'avance",
    ], "#3b82f6");

    // Shop section
    drawSection("SHOP", [
      "Maillot cycliste Panda Edition",
      "Chaussettes, accessoires & goodies",
      "panda-cycling.ch/catalog",
    ], "#ec4899");

    // Links section
    currentY += 20;
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("NOUS REJOINDRE", 80, currentY);
    currentY += 15;

    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, currentY);
    ctx.lineTo(1000, currentY);
    ctx.stroke();
    currentY += 45;

    // Social links in a row
    const links = [
      { icon: "IG", label: "@panda_cycling", url: "instagram.com/panda_cycling" },
      { icon: "WA", label: "Groupe WhatsApp", url: "Lien dans la bio IG" },
      { icon: "ST", label: "Strava Club", url: "strava.com/clubs/panda-cycling" },
    ];

    const linkWidth = 280;
    const startX = (canvas.width - (links.length * linkWidth)) / 2;

    links.forEach((link, index) => {
      const x = startX + index * linkWidth + linkWidth / 2;

      // Circle background
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.arc(x, currentY, 35, 0, Math.PI * 2);
      ctx.fill();

      // Icon text
      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(link.icon, x, currentY + 7);

      // Label
      ctx.fillStyle = "#e4e4e7";
      ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(link.label, x, currentY + 65);

      // URL
      ctx.fillStyle = "#71717a";
      ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(link.url, x, currentY + 88);
    });

    currentY += 150;

    // Website
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 36px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("panda-cycling.ch", 540, currentY);

    // Bottom tagline
    ctx.fillStyle = "#52525b";
    ctx.font = "24px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("La légende continue de rouler", 540, 1850);

    // Download the image
    const link = document.createElement("a");
    link.download = "panda-cycling-resume.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    setGenerating(false);
  };

  return (
    <section className="container py-10">
      <div className="mx-auto max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src={pandaLogo}
            alt="Panda Cycling"
            className="h-24 w-24 rounded-full border-4 border-white/10 object-cover shadow-2xl"
            style={{ objectPosition: "center 40%" }}
          />
        </div>

        <h1 className="mb-2 text-3xl font-bold text-white">
          Résumé Panda Cycling
        </h1>
        <p className="mb-2 text-panda-400">
          Génère une image pour partager le club
        </p>
        <p className="mb-8 text-lg text-panda-300">
          Le programme pour cette nouvelle année :
        </p>

        {/* Preview sections */}
        <div className="mb-8 space-y-4 text-left">
          <div className="glass-panel p-4">
            <h3 className="mb-2 font-semibold text-bamboo-400">Sorties</h3>
            <ul className="space-y-1 text-sm text-panda-300">
              <li>• Mercredi soir — "Pleine balle" (sortie rapide)</li>
              <li>• Vendredi 5h30 — Sortie tranquille</li>
              <li>• Sur Zwift l'hiver, sur route dès la belle saison</li>
              <li>• Weekends — Aventures outdoor (cols, tours)</li>
            </ul>
          </div>

          <div className="glass-panel p-4">
            <h3 className="mb-2 font-semibold text-amber-400">KOM du mois</h3>
            <ul className="space-y-1 text-sm text-panda-300">
              <li>• Chaque mois, un segment Strava à attaquer</li>
              <li>• {komData?.segmentName || "Chargement..."} {komData?.city ? `(${komData.city})` : ""}</li>
              <li>• strava.com/segments/{komData?.segmentId || "..."}</li>
            </ul>
          </div>

          <div className="glass-panel p-4">
            <h3 className="mb-2 font-semibold text-blue-400">Événements</h3>
            <ul className="space-y-1 text-sm text-panda-300">
              <li>• Grillades prévues cet été !</li>
              <li>• Sorties aventure annoncées à l'avance</li>
            </ul>
          </div>

          <div className="glass-panel p-4">
            <h3 className="mb-2 font-semibold text-pink-400">Shop</h3>
            <ul className="space-y-1 text-sm text-panda-300">
              <li>• Maillot cycliste Panda Edition</li>
              <li>• Chaussettes, accessoires & goodies</li>
            </ul>
          </div>

          <div className="glass-panel p-4">
            <h3 className="mb-2 font-semibold text-bamboo-400">Liens</h3>
            <ul className="space-y-1 text-sm text-panda-300">
              <li>• Instagram: @panda_cycling</li>
              <li>• WhatsApp: lien dans la bio IG</li>
              <li>• Strava: strava.com/clubs/panda-cycling</li>
              <li>• Site: panda-cycling.ch</li>
            </ul>
          </div>
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={generateImage}
          disabled={generating}
          className="btn-primary inline-flex items-center gap-3"
        >
          {generating ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Génération...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Générer l'image
            </>
          )}
        </button>

        <p className="mt-4 text-sm text-panda-500">
          Télécharge une image optimisée pour Instagram Story
        </p>

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </section>
  );
}
