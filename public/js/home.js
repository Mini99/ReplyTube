$(document).ready(() => {
    $.get("/api/urls", results => {
        outputUrls(results, $(".urlsContainer"))
    })
})