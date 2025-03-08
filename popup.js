// css pack
const colors = [
    "turquoise", "green-sea", "emerald", "nephritis", "peter-river", 
    "belize-hole", "amethyst", "wisteria", "wet-asphalt", "midnight-blue", 
    "sunflower", "orange", "carrot", "pumpkin", "alizarin", "pomegranate", 
    "clouds", "silver", "concrete", "asbestos"
];
// css pack
const colorsIntensity = ["", "-50", "-100", "-200", "-300", "-400", "-500", "-600", "-700", "-800", "-900"];
let i = 1;

// customButton de popupHtml
const customLptfColors = [
    "custom-primary",
    "custom-secondary",
    "custom-tertiary",
    "custom-fourth",
    "custom-textColor",
    "custom-sideBarBackgroundColor",
    "custom-sideBarIconAndTextColor",
    "custom-success",
    "custom-error",
    "custom-active",
    "custom-inactive"
]

document.addEventListener("DOMContentLoaded", async () => {

    // tous les selecteurs correspondant aux custom ids 
    const buttons = customLptfColors.map(id => document.getElementById(id)).filter(btn => btn);
    let currentCustomColor = { type: "", value: "" };
    let activeButtonId = ""; 
    
    buttons.forEach(button => {
        button.addEventListener("click", function (event) {
            console.log("Bouton cliqué :", event.target.id);
    
            // reset le bouton actif
            if (this.classList.contains("neu-button-active")) {
                this.classList.remove("neu-button-active");
                this.classList.add("neu-button-inactive");
                currentCustomColor.type = "";
                activeButtonId = "";
                console.log("Bouton désactivé :", this.id);
            } else {
                // active le button et desactive les autres
                buttons.forEach(btn => {
                    btn.classList.remove("neu-button-active");
                    btn.classList.add("neu-button-inactive");
                });
    
                this.classList.remove("neu-button-inactive");
                this.classList.add("neu-button-active");
                let toto = this.id.toString()

                if (this.id.toString().startsWith("custom-")) { 
            
                    activeButtonId = this.id.toString().substring(7);
                }
                else{
                    // throw une erreur de selection du DOM mauvais button reference id 
                    // voir pour un autre type de config
                }
                console.log("Bouton activé :", this.id);
            }
        });
    });
    
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // Récupérer l'onglet actif
    console.log(tab, "Tab Info");
    
    // container a refacto^ Palette
    const demoColorContainer = document.getElementById("demo_color");
    const paletteColor = document.getElementById("paletteColor");
    
    if (!demoColorContainer || !paletteColor) {
        console.warn("Certains éléments ne sont pas trouvés.");
        return; // a refacto en toast
    }
    
    colorsIntensity.forEach(currentIntensity => {
        let createDiv = document.createElement("div");
        paletteColor.appendChild(createDiv);
    
        colors.forEach(currentColor => {
            // listen chaque button de la paelette de couleur 
            let currentButton = document.createElement("button");
            currentButton.dataset.index = `Bouton-palette-color-${i}`;
            const currentClass = `${currentColor}${currentIntensity}`;
            currentButton.classList.add(currentClass, "demo_color_button");
            createDiv.appendChild(currentButton);
    
            currentButton.addEventListener("click", async () => {
                if (!activeButtonId) {
                    console.warn("Aucun bouton selected");
                    return;
                }
                
                const computedStyles = window.getComputedStyle(currentButton);
                currentCustomColor.value = computedStyles.backgroundColor;
                currentCustomColor.type = activeButtonId;

                // experimental ajout couleur au selecot mais y'a un delais a regler
                let activeSelector= document.getElementById('custom-'+activeButtonId)
                activeSelector.classList = ""
                activeSelector.classList = "neu-button-active "+ currentClass
                

                console.log("currentCustomColor :", currentCustomColor);
    
                chrome.runtime.sendMessage({
                    action: "changeCustomColor",
                    newColor: currentCustomColor
                });
            });
    
            i++;
        });
    });
});
// Fonction pour envoyer les variables CSS au background.js
// inutilisé, façon pour forcer le css dans la page
// function getCSSVariablesFromPage() {
//     const colors = ["--primary", "--secondary", "--tertiary", "--textColor", "--lineColor"];
//     const styles = getComputedStyle(document.documentElement);
//     const lptfColors = {};

//     colors.forEach(color => {
//         lptfColors[color] = styles.getPropertyValue(color).trim();
//     });

//     chrome.runtime.sendMessage({ action: "getCSSVariables", data: lptfColors });
// }

// // Fonction pour changer la couleur de fond sur la page
// function changeBackgroundColor(color) {
//     const background = document.querySelector("#component_sidebar + div");
//     if (background) {
//         background.style.backgroundColor = color;
//     } else {
//         console.warn("Élément Background introuvable !");
//     }
// }

// Dans popup.js ou dans ton code de gestion des événements


