chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installée !");
});

chrome.action.onClicked.addListener((tab) => {
    console.log("Extension cliquée sur l'onglet :", tab);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "changeCustomColor") {
        console.log("Changement de variable CSS demandé :", message.newColor);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;

            chrome.scripting.executeScript({ // script google exécuté dans la page 
                target: { tabId: tabs[0].id },
                function: (newColor) => {
                    const type = '--' + newColor.type
                    document.documentElement.style.setProperty(type, newColor.value);
                    console.log("Variable CSS mise à jour :" + type, "->", newColor.value);
                },
                args: [message.newColor] 
            });
        });
    }
});
