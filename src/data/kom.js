/**
 * Données mock pour le KOM du mois
 * @type {import('../types').KomMonthly}
 */
export const currentKom = {
  id: "kom-2025-12",
  month: "2025-12",
  segmentName: "Montée de Chexbres",
  segmentUrl: "https://www.strava.com/segments/12345678",
  segmentDistance: 3200,
  segmentElevation: 280,
  leaderboard: [
    {
      rank: 1,
      athleteName: "Marco V.",
      time: "8:42",
      stravaUrl: "https://www.strava.com/activities/111111",
    },
    {
      rank: 2,
      athleteName: "Sophie L.",
      time: "9:15",
      stravaUrl: "https://www.strava.com/activities/222222",
    },
    {
      rank: 3,
      athleteName: "Thomas B.",
      time: "9:28",
      stravaUrl: "https://www.strava.com/activities/333333",
    },
    {
      rank: 4,
      athleteName: "Julie M.",
      time: "9:45",
    },
    {
      rank: 5,
      athleteName: "Pierre D.",
      time: "10:02",
    },
    {
      rank: 6,
      athleteName: "Emma R.",
      time: "10:18",
    },
    {
      rank: 7,
      athleteName: "Lucas F.",
      time: "10:35",
    },
    {
      rank: 8,
      athleteName: "Chloé P.",
      time: "10:52",
    },
  ],
};

/**
 * Historique des KOM précédents
 * @type {import('../types').KomMonthly[]}
 */
export const komHistory = [
  {
    id: "kom-2025-11",
    month: "2025-11",
    segmentName: "Col du Mollendruz",
    segmentUrl: "https://www.strava.com/segments/87654321",
    segmentDistance: 8500,
    segmentElevation: 650,
    leaderboard: [
      { rank: 1, athleteName: "Sophie L.", time: "28:15" },
      { rank: 2, athleteName: "Marco V.", time: "29:02" },
      { rank: 3, athleteName: "Pierre D.", time: "31:45" },
    ],
  },
  {
    id: "kom-2025-10",
    month: "2025-10",
    segmentName: "Côte de Lutry",
    segmentUrl: "https://www.strava.com/segments/11223344",
    segmentDistance: 1800,
    segmentElevation: 120,
    leaderboard: [
      { rank: 1, athleteName: "Thomas B.", time: "4:12" },
      { rank: 2, athleteName: "Marco V.", time: "4:18" },
      { rank: 3, athleteName: "Emma R.", time: "4:35" },
    ],
  },
];
