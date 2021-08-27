$(document).ready(() => {
    var urlId = window.location.href.slice(-11);

    $.get("/api/posts/" + urlId, results => {
        outputPosts(results, $(".commentsContainer"))
    })

    $.get("/api/posts/", results => {
        var currUser = results;
    })

    $.get("/api/urls/likes/" + urlId, results => {
        outputLikes(results)
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

    $.ajax({
        url: `/api/posts/${data.content}/${data.urlId}/comment`,
        type: "POST",
        success: (postData) => {
            var html = createCommentHtml(postData);
            $(".commentsContainer").prepend(html);
            textbox.val("");
            button.prop("disabled", true);
        }
    })
})

$(document).on("click", ".submitReply", (event) => {
    event.preventDefault();
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    if(postId === undefined) return;

    var replyContent = document.getElementById("replyTextarea" + postId).value;
    var strippedString = replyContent.replace(/(<([^>]+)>)/gi, "");
    var newString = escapeHtml(strippedString);

    $.ajax({
        url: `/api/urls/reply`,
        type: "POST",
        data: {
            postId: postId,
            content: newString,
            postedBy: userLoggedIn.username,
            urlId: urlId,
            profilePic: userLoggedIn.profilePic,
            likes: 0
        },
        success: (replyData) => {
            document.getElementById("postId" + postId).style.display = "none";
            document.getElementById("replyTextarea" + postId).value = "";
            console.log(replyData);
        }
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

$(document).on("click", ".trashActive", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    if(postId === undefined) return;

    $.ajax({
        url: `/api/posts/delete/${postId}`,
        type: "DELETE",
        success: () => {
            document.body.querySelector(`.post[data-id='${postId}']`).style.display = "none";
        }
    })
})

$(document).on("click", ".videoLikeButton", (event) => {
    var button = $(event.target);

    $.ajax({
        url: `/api/urls/${urlId}/like`,
        type: "PUT",
        success: (videoData) => {
            
            button.find("span").text(videoData.likes);

            if(videoData.active === 0){
                button.addClass("active");
            }
            else {
                button.removeClass("active");
            }
            
        }
    })
})

$(document).on("click", ".replyButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    if(postId === undefined) return;

    document.getElementById("postId" + postId).style.display = "block";
})

$(document).on("click", ".cancelReply", (event) => {
    event.preventDefault();
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    if(postId === undefined) return;

    document.getElementById("postId" + postId).style.display = "none";
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
    var trashActiveClass;

    if(postData.active === "1"){
        likeButtonActiveClass = "active";
    }
    else {
        likeButtonActiveClass = "";
    }

    if(userLoggedIn.username !== postData.postedBy) {
        trashActiveClass = "trashNotActive";
    }
    else {
        trashActiveClass = "trashActive";
    }
    
    return `<div class='post' data-id=${postData.postId}>
                <div class='mainPostContentContainer'>
                    <div class='postImageContainer'>
                        <img src='${postData.profilePic}'>
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

                                <button class='replyButton'>
                                <i class="fas fa-reply"></i>
                                </button>

                                <button class='${trashActiveClass}'>
                                <i class="far fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='replyDisplay' id='postId${postData.postId}'>
                    <div class='mainReplyContentContainer'>
                        <form>
                            <textarea id='replyTextarea${postData.postId}' placeholder='Reply'></textarea>
                            <div class='replyBtn'>
                                <input class='submitReply' type='submit' value='Reply'>
                                <button class='cancelReply' id='cancelReply'>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class='allReplies'>

                </div>
            </div>`;

            //mainReplyContentContainer
            // <div class='replyFormContainer'>
            //             <div class='userImageContainer'>
            //                 <img src=${userLoggedIn.profilePic} alt="User's profile picture">
            //             </div>
            //             <div class='replyTextareaContainer'>
            //                 <textarea id='replyTextarea' placeholder="Comment"></textarea>
            //             </div>
            //             <div class='replyButtonsContainer'>
            //                 <button id='submitReplyButton' disabled>Post</button>
            //             </div>
            //         </div>
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

function outputLikes(results) {
    document.getElementById("videoLikes").innerHTML = results[0].likes;

    $.get("/api/urls/" + urlId + "/checkLikes", results => {
        if(results) {
            document.getElementById('videoLikeButton').className += ' active'
        }
    })
}


