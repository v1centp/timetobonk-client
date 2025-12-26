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
    year: "numeric",
  });
}

/**
 * Carte pour afficher un événement
 * @param {Object} props
 * @param {import('../../types').Event} props.event - Données de l'événement
 */
export default function EventCard({ event }) {
  const isPast = new Date(event.date) < new Date();

  return (
    <article
      className={`glass-panel flex flex-col gap-4 p-5 ${
        isPast ? "opacity-60" : ""
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <time
          className="text-sm font-medium text-panda-200"
          dateTime={event.date}
        >
          {formatDate(event.date)}
        </time>
        {event.isRegistrationOpen && !isPast && (
          <span className="inline-flex items-center rounded-full bg-bamboo-500/20 px-2.5 py-1 text-xs font-medium text-bamboo-400 border border-bamboo-500/30">
            Inscriptions ouvertes
          </span>
        )}
        {isPast && (
          <span className="inline-flex items-center rounded-full bg-zinc-500/20 px-2.5 py-1 text-xs font-medium text-panda-400 border border-zinc-500/30">
            Passé
          </span>
        )}
      </header>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
        <p className="text-sm text-panda-400 line-clamp-3">{event.description}</p>
      </div>

      <div className="flex items-center gap-6 text-sm">
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
          <span className="text-panda-200">{event.time}</span>
        </div>
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
          <span className="text-panda-200">{event.location}</span>
        </div>
      </div>

      {event.registrationUrl && !isPast && (
        <footer className="mt-auto pt-4 border-t border-panda-700/30">
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full text-center"
          >
            S'inscrire
          </a>
        </footer>
      )}
    </article>
  );
}
