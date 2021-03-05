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

$(document).on("click", ".likeButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    if(postId === undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (postData) => {
            
            button.find("span").text(postData.likes);

            if(postData.active === 0){
                button.addClass("active");
            }
            else {
                button.removeClass("active");
            }
            
        }
    })
    
})

function getPostIdFromElement(element) {
    var isRoot = element.hasClass("post");
    var rootElement = isRoot == true ? element : element.closest(".post");
    var postId = rootElement.data().id;

    if(postId === undefined) return alert("Post id undefinded");

    return postId;
}

function createCommentHtml(postData) {   

    var likeButtonActiveClass;

    console.log(postData);

    if(postData.active === "1"){
        likeButtonActiveClass = "active";
    }
    else {
        likeButtonActiveClass = "";
    }
    
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
                            <div class='postButtonContainer green'>
                                <button class='likeButton ${likeButtonActiveClass}'>
                                <i class="far fa-thumbs-up"></i>
                                <span>${postData.likes || ""}</span>
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
        $.get("/api/posts/" + result.postId + "/checkLikes", results => {
            result.active = results;
            var html = createCommentHtml(result)
            container.prepend(html);
        })
        
    });
}

