/*
 * Needs to be loaded as a content-script because it needs acess to
 * the selection in the active window.
 */
function retrieveSelection() {
    // Simplest way to get the selected nodes
    const selectedFragment = window.getSelection().getRangeAt(0).cloneContents();
    const linkNodes = selectedFragment.querySelectorAll("a[href]");

    let urls = [];
    for (var linkNode of linkNodes) {
        // Skip named anchor links to same page
        if (linkNode.getAttribute("href")[0] == '#') continue;
        urls.push(linkNode.href);
    }
    return urls;
}
