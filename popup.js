// TODO: Refaire les colors en style pure avec les #color chargés a la place des classes
// TODO: Trigger le changement de background sans le bouton de validation pour fludifier la sélection

const colors = [
    "turquoise" 
    ,"green-sea"
    ,"emerald" 
    ,"nephritis" 
    ,"peter-river"
    ,"belize-hole"
    ,"amethyst" 
    ,"wisteria" 
    ,"wet-asphalt" 
    ,"midnight-blue"  
    ,"sunflower" 
    ,"orange"  
    ,"carrot" 
    ,"pumpkin" 
    ,"alizarin" 
    ,"pomegranate" 
    ,"clouds" 
    ,"silver" 
    ,"concrete" 
    ,"asbestos" 
]

const colorsIntensity = ["","-50",'-100',"-200","-300","-400","-500","-600","-700","-800","-900"] 

console.log("coucou")

document.addEventListener("DOMContentLoaded", () => {

    const changeBgColorSubmit = document.getElementById("changeBgColor");
    const selectColor = document.getElementById("selectColor");
    const demoColorContainer = document.getElementById("demo_color")
    const paletteColor = document.getElementById("paletteColor")



    console.log("coucou")

    if (!changeBgColorSubmit || !selectColor || !demoColorContainer || !paletteColor) {
        console.log(changeBgColorSubmit,selectColor,demoColorContainer,paletteColor,'ici')
        console.warn("Certains éléments ne sont pas trouvés.");
        return;
    }
    // const ids = colorsIntensity.length * colors.length
    console.log("coucou")

    let i = 1

    colorsIntensity.forEach(currentIntensity => {
        let createDiv = document.createElement("div");
        paletteColor.appendChild(createDiv)

        colors.forEach(currentColor => {
            let currentButton = document.createElement("button");
            currentButton.dataset.index = `Bouton-palette-color-${i}`;
            const currentClass = `${currentColor}${currentIntensity}`
            console.log(currentClass,'ici')
            currentButton.classList.add(currentClass ,"demo_color_button")
            createDiv.appendChild(currentButton)
            
            currentButton.addEventListener("click", () => {
                console.log("color clicked", currentClass)
                changeDemoColorContainer(currentClass,demoColorContainer)
            });
            i++
        });

    });

    selectColor.addEventListener("change", async ()=>{
        console.log(selectColor.value,'tonpere')
        if(selectColor.value){

            const color = selectColor.value
            changeDemoColorContainer(color,demoColorContainer)
        }
        else{
            console.log("aucune")
        }
        // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // 

        // if (tab) {
        //     chrome.scripting.executeScript({
        //         target: { tabId: tab.id },
        //         function: changeDemoColorContainer,
        //         args: [color] // Envoie la couleur choisie
        //     });
        // }
    })


    changeBgColorSubmit.addEventListener("click", async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // 

        const computedStyles = window.getComputedStyle(demoColorContainer);

        const bgColor = computedStyles.backgroundColor;
        
        console.log(bgColor,'bgColor');
        // const bgColor = demoColorContainer.style.backgroundColor;
        
        // console.log(bgColor);
        console.log(tab,'yoooo')
        chrome.runtime.sendMessage({ action: "changeColor", bgColor });

        if (tab) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: changeBackgroundColor,
                args: [bgColor] // Envoie la couleur choisie    
            });
        }
    });
});
function changeBackgroundColor(color) {
    const background = document.querySelector("#component_sidebar + div");
    if (background) {
        background.style.backgroundColor = color;
    } else {
        console.warn("Élément Background introuvable !");
    }
}

function changeDemoColorContainer(bgColor,demoColorContainer){
    console.log(bgColor,demoColorContainer)
    if(demoColorContainer){
        demoColorContainer.classList = ""
        demoColorContainer.classList.add(bgColor)

        console.log("iciiiii")
        // demoColorContainer.style.height = 100%
    }
    else{
        console.warn("Element demoColorContainer introuvable")
    }
}
