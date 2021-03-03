$(document).ready(() => {
    var urlId = window.location.href.slice(-11);

    $.get("/api/posts/" + urlId, results => {
        outputPosts(results, $(".commentsContainer"))
    })

    $.get("/api/posts/", results => {
        var currUser = results;
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

var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};
  
function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

$("#submitPostButton").click(() => {
    var button = $(event.target);
    var textbox = $("#commentTextarea");

    var urlId = window.location.href.slice(-11);

    const strippedString = escapeHtml(textbox.val());

    var data = {
        content: strippedString,
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
                        <img src='/images/${postData.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <span class='username'><a href='/profile/${postData.postedBy}'>${postData.postedBy}</a></span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button>
                                <i class="far fa-thumbs-up"></i>
                                </button>
                            </div>
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
}

