const STORAGE_KEY = 'theme_intra';

/**
 * Initialise le chrome.storage si nécessaire
 */
function initThemeStorage() {
    chrome.storage.local.get([STORAGE_KEY], function(result) {
        if (!result[STORAGE_KEY]) {
            resetTheme()
        }
    });
}

/**
 * Reset le theme
 */
function resetTheme(){
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
    chrome.storage.local.set({ [STORAGE_KEY]: defaultTheme });
}

/**
 * Récupère les couleurs du chrome.storage
 * @returns {Object} Objet contenant les couleurs du thème
 */
function getThemeFromStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEY], function(result) {
            resolve(result[STORAGE_KEY] || {});
        });
    });
}

/**
 * Sauvegarde une couleur spécifique dans le chrome.storage
 * @param {string} key - Clé du style (ex: "custom-primary")
 * @param {string} value - Valeur à stocker (ex: "#FF5733")
 */
function saveThemeColor(key, value) {
    getThemeFromStorage().then(theme => {
        theme[key] = value;
        chrome.storage.local.set({ [STORAGE_KEY]: theme });
    });
}

/**
 * Applique les couleurs du chrome.storage aux variables CSS
 */
function applyStoredTheme() {
    getThemeFromStorage().then(theme => {
        for (let key in theme) {
            if (theme[key]) {
                let cssVar = "--" + key.replace("custom-", "");
                document.documentElement.style.setProperty(cssVar, theme[key]);

                if (document.querySelector("#"+key) ){
                    document.querySelector("#"+key).style.backgroundColor = theme[key]

                }
            }
        }
    });
}



initThemeStorage();
applyStoredTheme();
