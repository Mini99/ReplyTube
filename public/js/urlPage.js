$(document).ready(() => {
    var urlId = window.location.href.slice(-11);

    $.get("/api/posts/" + urlId, results => {
        outputPosts(results, $(".commentsContainer"))
    })
})

$("#commentTextarea").keyup(event => {
    var textbox = $(event.target);
    var value = textbox.val().trim();

    var submitButton = $("#submitPostButton");

    if(submitButton.length == 0) return alert("No submit button found");

    if(value == "") {
        submitButton.prop("disabled", true);
        return;
    }
    else {
        submitButton.prop("disabled", false);
    }
})

$("#submitPostButton").click(() => {
    var button = $(event.target);
    var textbox = $("#commentTextarea");

    var urlId = window.location.href.slice(-11);

    var data = {
        content: textbox.val(),
        urlId: urlId
    }

    $.post("/api/posts", data, (postData, status, xhr) => {
        var html = createCommentHtml(postData);
        $(".commentsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);
    })
})

function createCommentHtml(postData) {   
    
    return `<div class='post' data-id=${postData.postId}>
                <div class='mainPostContentContainer'>
                    <div class='postImageContainer'>
                        <img src=''>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                        </div>
                    </div>
                </div>
            </div>`;
}

function outputPosts(results, container) {
    container.html("");

    results.forEach(result => {
        var html = createCommentHtml(result)
        container.prepend(html);
    });

    if(results.length == 0) {
        container.prepend("<span class='noResults'>Nothing to show</span>")
    }
}

