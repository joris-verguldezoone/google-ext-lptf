

const STORAGE_KEY = 'theme_intra';

/**
 * Initialise le localStorage si nécessaire
 */
function initThemeStorage() {
	console.log('salut')
    if (!localStorage.getItem(STORAGE_KEY)) {
        const defaultTheme = {
            "custom-primary": "",
            "custom-secondary": "",
            "custom-tertiary": "",
            "custom-fourth": "",
            "custom-textColor": "",
            "custom-sideBarBackgroundColor": "",
            "custom-sideBarIconAndTextColor": "",
            "custom-success": "",
            "custom-error": "",
            "custom-active": "",
            "custom-inactive": ""
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTheme));
    }
}

/**
 * Récupère les couleurs du localStorage
 * @returns {Object} Objet contenant les couleurs du thème
 */
function getThemeFromStorage() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

/**
 * Sauvegarde une couleur spécifique dans le localStorage
 * @param {string} key - Clé du style (ex: "custom-primary")
 * @param {string} value - Valeur à stocker (ex: "#FF5733")
 */
function saveThemeColor(key, value) {
    let theme = getThemeFromStorage();
    theme[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
}

/**
 * Applique les couleurs du localStorage aux variables CSS
 */
function applyStoredTheme() {
    const theme = getThemeFromStorage();
    for (let key in theme) {
        if (theme[key]) {
            let cssVar = "--" + key.replace("custom-", "");
            document.documentElement.style.setProperty(cssVar, theme[key]);
        }
    }
}


initThemeStorage();
applyStoredTheme();
