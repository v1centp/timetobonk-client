/**
 * Types et interfaces pour le site Panda Cycling
 * Utilisation de JSDoc pour la documentation TypeScript-like
 */

/**
 * @typedef {'tranquille' | 'course' | 'aventure'} RideCategory
 */

/**
 * @typedef {Object} Ride
 * @property {string} id - Identifiant unique
 * @property {string} title - Nom de la sortie
 * @property {RideCategory} category - Catégorie de la sortie
 * @property {string} date - Date ISO de la sortie
 * @property {string} time - Heure de départ (ex: "09:00")
 * @property {string} meetingPoint - Point de rendez-vous
 * @property {number} distance - Distance en km
 * @property {number} elevation - Dénivelé en mètres
 * @property {string} [description] - Description optionnelle
 * @property {string} [gpxUrl] - URL du fichier GPX
 * @property {string} [imageUrl] - URL de l'image de couverture
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Identifiant unique
 * @property {string} title - Nom du produit
 * @property {string} description - Description
 * @property {number} price - Prix en CHF
 * @property {string} imageUrl - URL de l'image principale
 * @property {string[]} [images] - URLs des images supplémentaires
 * @property {string[]} [sizes] - Tailles disponibles (pour vêtements)
 * @property {string[]} [colors] - Couleurs disponibles
 * @property {boolean} inStock - Disponibilité
 * @property {string} [orderUrl] - URL de commande (WhatsApp)
 */

/**
 * @typedef {'instagram' | 'whatsapp' | 'strava' | 'facebook'} SocialPlatform
 */

/**
 * @typedef {Object} SocialLink
 * @property {SocialPlatform} platform - Plateforme sociale
 * @property {string} url - URL du lien
 * @property {string} label - Texte à afficher
 */

/**
 * @typedef {Object} ApiResponse
 * @template T
 * @property {T} data - Données de la réponse
 * @property {boolean} success - Succès de la requête
 * @property {string} [error] - Message d'erreur éventuel
 */

// Export vide pour que le fichier soit traité comme un module
export {};
