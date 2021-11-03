// $("#postTextarea").keyup(event => {
//     var textbox = $(event.target);
//     var value = textbox.val().trim();

//     var submitButton = $("#submitSearchButton");

//     if(submitButton.length == 0) return alert("No submit button found");

//     if(value == "") {
//         submitButton.prop("disabled", true);
//         return;
//     }
//     else { //value.startsWith("http://www.youtube.com/watch?v=") || value.startsWith("https://www.youtube.com/watch?v=") || value.startsWith("http://www.youtube.com/v/") || value.startsWith("https://www.youtube.com/v/") || value.startsWith("http://youtu.be/") || value.startsWith("https://youtu.be/")
//         submitButton.prop("disabled", false);
//         return;
//     }
// })

//Globals
var cropper;

$("#submitSearchButton").click(() => {
    var button = $(event.target);
    var textbox = $("#postTextarea");

    const originalString = textbox.val();
    const strippedString = originalString.replace(/(<([^>]+)>)/gi, "");

    var data = {
        content: strippedString,
        thumbnail: null
    }

    if(data.content.startsWith("http://www.youtube.com/watch?v=")) {
        data.content = data.content.slice(31,42);
        data.thumbnail = "https://img.youtube.com/vi/" + data.content + "/default.jpg";
    }
    else if(data.content.startsWith("https://www.youtube.com/watch?v=")) {
        data.content = data.content.slice(32,43);
        data.thumbnail = "https://img.youtube.com/vi/" + data.content + "/default.jpg";
    }

    else if(data.content.startsWith("http://www.youtube.com/v/")) {
        data.content = data.content.slice(25,36);
        data.thumbnail = "https://img.youtube.com/vi/" + data.content + "/default.jpg";
    }
    else if(data.content.startsWith("https://www.youtube.com/v/")) {
        data.content = data.content.slice(26,37);
        data.thumbnail = "https://img.youtube.com/vi/" + data.content + "/default.jpg";
    }

    else if(data.content.startsWith("http://youtu.be/")) {
        data.content = data.content.slice(16,27);
        data.thumbnail = "https://img.youtube.com/vi/" + data.content + "/default.jpg";
    }
    else if(data.content.startsWith("https://youtu.be/")) {
        data.content = data.content.slice(17,28);
        data.thumbnail = "https://img.youtube.com/vi/" + data.content + "/default.jpg";
    }
    else {
        $('#invalidUrl').show();
        return;
    }

    // var newLink = "localhost:3003/watch/" + id;

    // window.location.href = newLink;

    $.post("/api/urls", data, (urlData, status, xhr) => {
        
        var html = createPostHtml(urlData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        //button.prop("disabled", true);
    })

    if(userLoggedIn === "") {
        window.location.href = '/guestUrl/' + data.content;
    }
    else {
        window.location.href = '/urls/' + data.content;
    }

})

//https://www.youtube.com/watch?v=dQw4w9WgXcQ

$(document).on("click", ".url", (event) => {
    var element = $(event.target);
    var urlId = getUrlIdFromElement(element);

    if(urlId !== undefined && !element.is("button")) {
        if(userLoggedIn === "") {
            window.location.href = '/guestUrl/' + urlId;
        }
        else {
            window.location.href = '/urls/' + urlId;
        }
    }
})

function getUrlIdFromElement(element) {
    var isRoot = element.hasClass("url");
    var rootElement = isRoot == true ? element : element.closest(".url");
    var urlId = rootElement.data().id;

    if(urlId === undefined) return alert("Url id undefinded");

    return urlId;
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

function outputUrls(results, container) {
    container.html("");

    results.forEach(result => {
        var html = createPostHtml(result)
        container.prepend(html);
    });
}

function outputUrlsHome(results, container) {
    container.html("");

    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });
}