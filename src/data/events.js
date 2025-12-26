/**
 * Données mock pour les événements
 * @type {import('../types').Event[]}
 */
export const eventsData = [
  {
    id: "event-001",
    title: "Fondue du Nouvel An",
    date: "2026-01-04",
    time: "19:00",
    location: "Chalet du club, Montreux",
    description: "Fondue conviviale pour bien démarrer l'année ! Apportez votre bonne humeur. Fromage et boissons fournis par le club.",
    isRegistrationOpen: true,
    registrationUrl: "https://chat.whatsapp.com/H1RW0OpgOfH7TXJ8OKGA0n",
  },
  {
    id: "event-002",
    title: "Assemblée générale",
    date: "2026-02-15",
    time: "19:00",
    location: "Salle communale, Pully",
    description: "Assemblée générale annuelle du club. Présentation du bilan, élection du comité, projets pour la saison.",
    isRegistrationOpen: true,
  },
  {
    id: "event-003",
    title: "Stage vélo Majorque",
    date: "2026-04-10",
    time: "06:00",
    location: "Aéroport de Genève",
    description: "Stage d'une semaine à Majorque. 6 jours de vélo, hébergement tout compris. Places limitées !",
    isRegistrationOpen: true,
    registrationUrl: "https://chat.whatsapp.com/H1RW0OpgOfH7TXJ8OKGA0n",
  },
  {
    id: "event-004",
    title: "Nocturne urbaine",
    date: "2026-06-21",
    time: "21:00",
    location: "Place de la Palud, Lausanne",
    description: "Balade nocturne dans Lausanne pour fêter l'été. Lumières obligatoires, bonne ambiance garantie.",
    isRegistrationOpen: false,
  },
];
