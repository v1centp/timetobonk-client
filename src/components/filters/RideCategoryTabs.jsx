import { categoryLabels, categoryColors } from "../../data/rides";

const CATEGORIES = ["all", "tranquille", "course", "aventure"];

/**
 * Onglets de filtrage par catégorie de sortie
 * @param {Object} props
 * @param {import('../../types').RideCategory | 'all'} props.selected - Catégorie sélectionnée
 * @param {(category: import('../../types').RideCategory | 'all') => void} props.onChange - Callback de changement
 */
export default function RideCategoryTabs({ selected, onChange }) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filtrer par catégorie"
    >
      {CATEGORIES.map((category) => {
        const isSelected = selected === category;
        const label = category === "all" ? "Toutes" : categoryLabels[category];
        const colors = category !== "all" ? categoryColors[category] : null;

        return (
          <button
            key={category}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(category)}
            className={`
              inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bamboo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-panda-950
              ${
                isSelected
                  ? colors
                    ? `${colors.bg} ${colors.text} ${colors.border}`
                    : "border-bamboo-500/30 bg-bamboo-500/10 text-white"
                  : "border-panda-700/50 bg-panda-800/60 text-panda-300 hover:border-panda-600 hover:text-white"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
