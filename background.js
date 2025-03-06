chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installée !");
});

chrome.action.onClicked.addListener((tab) => {
    console.log("Extension cliquée sur l'onglet :", tab);
});
