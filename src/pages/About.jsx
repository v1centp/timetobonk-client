import videoSrc from "../assets/video.MP4";

export default function About() {
  return (
    <div className="container">
      {/* En-tête */}
      <header className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-panda-500 mb-4">
          Notre histoire
        </p>
        <h1 className="text-4xl font-bold text-white mb-6">À propos</h1>
      </header>

      {/* La légende du Panda + Vidéo */}
      <section className="mb-16">
        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto items-center">
          {/* Vidéo story à gauche */}
          <div className="relative w-full max-w-[280px] flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
            <video
              src={videoSrc}
              className="w-full aspect-[9/16] object-cover"
              controls
              playsInline
              autoPlay
              muted
              loop
            />
          </div>

          {/* Texte à droite */}
          <article className="glass-panel p-8 md:p-10 flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🐼</span>
              <h2 className="text-2xl font-bold text-white">La légende du Panda</h2>
            </div>
            <div className="space-y-5 text-panda-300 leading-relaxed">
              <p>
                Panda Cycling, c'est un groupe de cyclistes amateurs basé à Lausanne.
                On roule pour se faire plaisir, prendre l'air, découvrir de
                nouvelles routes et finir parfois autour d'un verre ou de grillades.
              </p>
              <p>
                Il y a des sorties tranquilles, des sorties plus nerveuses, des
                Panda'ventures le weekend et quelques KOM à aller chercher pour le
                plaisir du challenge. Pas besoin d'être pro : il faut juste avoir
                envie de rouler et de rejoindre le mouvement.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
