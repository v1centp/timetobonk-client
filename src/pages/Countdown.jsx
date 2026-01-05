import { useState, useEffect, useRef } from "react";
import pandaLogo from "../assets/panda logo.png";

const TARGET_DATE = new Date("2026-01-01T00:00:00");

function calculateTimeLeft() {
  const now = new Date();
  const difference = TARGET_DATE - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateInstagramImage = async () => {
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
    const glowGradient = ctx.createRadialGradient(540, 200, 0, 540, 200, 600);
    glowGradient.addColorStop(0, "rgba(34, 197, 94, 0.15)");
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, canvas.width, 800);

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
    ctx.arc(540, 450, 120, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logo, 420, 330, 240, 240);
    ctx.restore();

    // Draw logo border
    ctx.beginPath();
    ctx.arc(540, 450, 125, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PANDA CYCLING", 540, 650);

    // Subtitle
    ctx.fillStyle = "#22c55e";
    ctx.font = "32px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("LANCEMENT 2026", 540, 710);

    // Countdown boxes
    const boxY = 900;
    const boxWidth = 200;
    const boxHeight = 180;
    const boxGap = 30;
    const startX = (canvas.width - (4 * boxWidth + 3 * boxGap)) / 2;

    const timeUnits = [
      { value: timeLeft.days, label: "JOURS" },
      { value: timeLeft.hours, label: "HEURES" },
      { value: timeLeft.minutes, label: "MINUTES" },
      { value: timeLeft.seconds, label: "SECONDES" },
    ];

    timeUnits.forEach((unit, index) => {
      const x = startX + index * (boxWidth + boxGap);

      // Box background
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.roundRect(x, boxY, boxWidth, boxHeight, 20);
      ctx.fill();

      // Box border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Number
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 72px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(unit.value).padStart(2, "0"), x + boxWidth / 2, boxY + 90);

      // Label
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "24px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(unit.label, x + boxWidth / 2, boxY + 140);
    });

    // Date
    ctx.fillStyle = "#71717a";
    ctx.font = "36px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("1er Janvier 2026", 540, 1200);

    // Website
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 40px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("panda-cycling.ch", 540, 1750);

    // Download the image
    const link = document.createElement("a");
    link.download = "panda-cycling-countdown.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    setGenerating(false);
  };

  const isLaunched = timeLeft.total <= 0;

  return (
    <section className="container py-10">
      <div className="mx-auto max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img
              src={pandaLogo}
              alt="Panda Cycling"
              className="h-32 w-32 rounded-full border-4 border-white/10 object-cover shadow-2xl"
              style={{ objectPosition: "center 40%" }}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-panda-950/50 to-transparent" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-4xl font-bold text-white sm:text-5xl">
          Panda Cycling
        </h1>
        <p className="mb-12 text-lg text-bamboo-400">Lancement 2026</p>

        {isLaunched ? (
          <div className="glass-panel border-bamboo-500/30 bg-bamboo-500/10 p-8">
            <p className="text-2xl font-bold text-bamboo-400">
              C'est parti ! Le site est lance !
            </p>
          </div>
        ) : (
          <>
            {/* Countdown */}
            <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: timeLeft.days, label: "Jours" },
                { value: timeLeft.hours, label: "Heures" },
                { value: timeLeft.minutes, label: "Minutes" },
                { value: timeLeft.seconds, label: "Secondes" },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="glass-panel flex flex-col items-center justify-center p-6"
                >
                  <span className="text-4xl font-bold text-white sm:text-5xl">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="mt-2 text-sm text-panda-400">{unit.label}</span>
                </div>
              ))}
            </div>

            {/* Target date */}
            <p className="mb-8 text-panda-400">
              1er Janvier 2026 à 00:00
            </p>
          </>
        )}

        {/* Share button */}
        <button
          type="button"
          onClick={generateInstagramImage}
          disabled={generating}
          className="btn-primary inline-flex items-center gap-3"
        >
          {generating ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generation...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
              Partager sur Instagram
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
