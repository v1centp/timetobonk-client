import { useState } from "react";
import { API } from "../lib/api.js";

export default function TourIrlandeAdmin() {
  const [pin, setPin] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/tour-irlande/livetrack`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, livetrackUrl: url }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "LiveTrack mis à jour !" });
        setPin("");
      } else {
        setStatus({ type: "error", message: data.error });
      }
    } catch {
      setStatus({ type: "error", message: "Erreur de connexion au serveur." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-2">
        LiveTrack Admin
      </h1>
      <p className="text-sm text-panda-400 mb-8">
        Colle ton nouveau lien Garmin LiveTrack ici.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-panda-300 mb-1.5">
            Lien LiveTrack
          </label>
          <input
            id="url"
            type="url"
            required
            placeholder="https://livetrack.garmin.com/session/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl border border-panda-700/50 bg-panda-800/60 px-4 py-3 text-sm text-white placeholder-panda-500 outline-none focus:border-bamboo-500/50 focus:ring-1 focus:ring-bamboo-500/30"
          />
        </div>

        <div>
          <label htmlFor="pin" className="block text-sm font-medium text-panda-300 mb-1.5">
            Code PIN
          </label>
          <input
            id="pin"
            type="password"
            required
            placeholder="••••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full rounded-xl border border-panda-700/50 bg-panda-800/60 px-4 py-3 text-sm text-white placeholder-panda-500 outline-none focus:border-bamboo-500/50 focus:ring-1 focus:ring-bamboo-500/30"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>

      {status && (
        <div
          className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-bamboo-500/30 bg-bamboo-500/10 text-bamboo-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {status.message}
        </div>
      )}
    </section>
  );
}
