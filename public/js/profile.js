$(document).ready(() => {
    loadVideos();
});

function loadVideos() {
    $.get("/api/urls/" + profileUser, results => {
        outputUrls(results, $(".urlsContainer"))
    })
}