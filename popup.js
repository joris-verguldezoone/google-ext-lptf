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
            console.log(this);
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
    
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); 
    
    
    // container a refacto^ Palette
    // const demoColorContainer = document.getElementById("demo_color");
    const paletteColor = document.getElementById("paletteColor");
    
    if ( !paletteColor) {
        console.warn("Certains éléments ne sont pas trouvés.");
        return; // a refacto en toast,... ... c'est toi le toast !
    }
    paletteColor.style.width = '500px'
    colorsIntensity.forEach(currentIntensity => {
        let createDiv = document.createElement("div");
        paletteColor.appendChild(createDiv);
    
        colors.forEach(currentColor => {
            // listen chaque button de la palette de couleur 
            let currentButton = document.createElement("button");
            currentButton.dataset.index = `Bouton-palette-color-${i}`;
            const currentClass = `${currentColor}${currentIntensity}`;
            currentButton.classList.add(currentClass, "demo_color_button");
            currentButton.classList.add(currentClass, "button");
            createDiv.appendChild(currentButton);
    
            currentButton.addEventListener("click", async () => {
                if (!activeButtonId) {
                    console.log("Aucun bouton selected");
                    return;
                }
                
                const computedStyles = window.getComputedStyle(currentButton);
                currentCustomColor.value = computedStyles.backgroundColor;
                currentCustomColor.type = activeButtonId;
                console.log(currentCustomColor.value);

                // experimental ajout couleur au selectot mais y'a un delais a regler
                let activeSelector= document.getElementById('custom-'+activeButtonId)
                activeSelector.classList = ""
                activeSelector.removeAttribute("style")
                activeSelector.classList = "neu-button-active "+ currentClass
    
                chrome.runtime.sendMessage({
                    action: "changeCustomColor",
                    newColor: currentCustomColor
                });
            });
    
            i++;
        });
    });
});


if( document.querySelector('#displayPalette') ){
    // DOC : Display palette perso 
    document.querySelector('#displayPalette').addEventListener('click', () => {
        const palette = document.querySelector('#customPalette');
        palette.style.display = palette.style.display === 'block' ? 'none' : 'block';
    });


    // DOC : reset du theme custom
    document.querySelector('#resetBtn').addEventListener('click', () => {
        chrome.runtime.sendMessage({
            action: "resetColors",
        });
        buttons = document.querySelector('#custom_buttons').children
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.backgroundColor = 'white';
          }
        resetTheme()
    });

}

