chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installée !");
});

chrome.action.onClicked.addListener((tab) => {
    console.log("Extension cliquée sur l'onglet :", tab);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message')

    if (message.action === "changeCustomColor") {
        console.log("Changement de variable CSS demandé :", message.newColor);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            
            if (tabs.length === 0) return;

            chrome.scripting.executeScript({ 
                target: { tabId: tabs[0].id },
                function: (newColor) => {
                    const type = '--' + newColor.type
                    saveThemeColor("custom-" + newColor.type, newColor.value);
                    document.documentElement.style.setProperty(type, newColor.value);
                    console.log("Variable CSS mise à jour :" + type, "->", newColor.value);
                },
                args: [message.newColor] 
            });
        });
    }else if (message.action === "resetColors") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log(tabs);
            if (tabs.length === 0) return;
    
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: () => {    
                    document.documentElement.removeAttribute("style");
                }
            });
        });
    }
    
});
