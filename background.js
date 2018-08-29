browser.contextMenus.create({
    id: "selected-links-download",
    title: "Download selected links",
});
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "selected-links-download") {
        downloadSelectedLinks(tab.id);
    }
});

function downloadSelectedLinks(tabid) {
    getSelectedUrls(tabid).then(
        // The result from executeScript is an array
        // where the actual result is in position 0
        (result) => result[0].forEach(download)
    );
}

function getSelectedUrls(tabid) {
    return loadSelectionScriptIfNecessary(tabid).then(
        () => browser.tabs.executeScript(tabid, {code: "retrieveSelection();"})
    ).catch((error) => {
        // This could happen if the extension is not allowed to run code in
        // the page, for example if the tab is a privileged page.
        console.error("Failed to copy text: " + error);
    });
}

function loadSelectionScriptIfNecessary(tabid) {
    return browser.tabs.executeScript({
        code: "typeof retrieveSelection === 'function';",
    }).then((results) => {
        // The content script's last expression will be true if the function
        // has been defined. If this is not the case, then we need to run
        // selection-retriever.js to define function retrieveSelection.
        if (!results || results[0] !== true) {
            return browser.tabs.executeScript(tabid, {
                file: "selection-retriever.js",
            });
        }
    });
}

function download(url) {
    const request = new XMLHttpRequest();
    request.addEventListener("load", function () {
        const downloading = browser.downloads.download({url: this.responseURL});
    });
    request.open("HEAD", url);
    request.send();
}
