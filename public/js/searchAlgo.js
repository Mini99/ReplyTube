var input = document.getElementById("query");

input.addEventListener("keyup", function(event) {
    event.preventDefault();
    document.getElementById("submitQuery").click();
});

function searchVids() {
    var name = document.getElementById("query").value;
    name = name.replace(/\\|\//g,'');
    if(name != "") {
        $.get("/api/searches/" + name, results => {
            if(results.length > 0) {
                outputUsers(results, $(".urlsContainer"))
            }
            else {
                $(".urlsContainer").html("");
                var html = `<div class='userNotFound'>
                            <span>Video not found</span>
                        </div>`;
                $(".urlsContainer").prepend(html);
            }
        })
    }
    else {
        $.get("/api/searches", results => {
            outputUsers(results, $(".urlsContainer"))
        })
    }
}

function showAllVids() {
    document.getElementById("query").value = '';
    $.get("/api/searches", results => {
        outputUsers(results, $(".urlsContainer"))
    })
}

function outputUsers(results, container) {
    container.html("");

    results.forEach(result => {
        var html = createPostHtml(result)
        container.prepend(html);
    });
}

function createPostHtml(urlData) {    

    var thumbnailPic = urlData.urlPic;

    return `<div class='url' data-id=${urlData.urlId}>
                <div class='mainContentContainer'>
                    <div class='urlImageContainer'>
                        <img src='${thumbnailPic}'>
                    </div>
                    <div class='urlContentContainer'>
                        <div class='header'>
                        </div>
                        <div class='urlBody'>
                            <span>${urlData.urlId}</span>
                        </div>
                        <div class='urlFooter'>
                        </div>
                    </div>
                </div>
            </div>`;
}
