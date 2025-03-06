console.log("coucou")

document.addEventListener("DOMContentLoaded", () => {

    const changeBgColor = document.getElementById("changeBgColor");
    const selectColor = document.getElementById("selectColor");
    const demoColor = document.getElementById("changeBgColor")



    if (!changeBgColor || !selectColor || !demoColor) {
        console.log(changeBgColor,selectColor,demoColor,'ici')
        console.warn("Certains éléments ne sont pas trouvés.");
        return;
    }

    selectColor.addEventListener("change", async ()=>{
        console.log(selectColor.value,'tonpere')
        if(selectColor.value){

            const color = selectColor.value
            changeDemoColor(color)
        }
        else{
            console.log("aucune")
        }
        // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // 

        // if (tab) {
        //     chrome.scripting.executeScript({
        //         target: { tabId: tab.id },
        //         function: changeDemoColor,
        //         args: [color] // Envoie la couleur choisie
        //     });
        // }
    })


    changeBgColor.addEventListener("click", async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // 
        const color = selectColor.value
        console.log(color)
        console.log(tab,'yoooo')
        chrome.runtime.sendMessage({ action: "changeColor", color });

        if (tab) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: changeBackgroundColor,
                args: [selectColor.value] // Envoie la couleur choisie
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

function changeDemoColor(color){
    if(demoColor){
        demoColor.style.backgroundColor = color
    }
    else{
        console.warn("Element demoColor introuvable")
    }
}
