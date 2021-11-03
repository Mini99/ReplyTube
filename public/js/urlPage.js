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

window.onload = function(){
    document.getElementById("replySpinner").style.display = "none"
    document.getElementById("commentsContainer").style.display = "block"
    var urlId = window.location.href.slice(-11);
    
    $.get("/api/urls/checkReplies/" + urlId, results => {
        results.forEach(result => {
            document.getElementById("showReplies" + result.postId).style.display = "block";
        });
    })
  };

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
    var start = 0;
    var end = 5;

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

            document.getElementById("allReplies" + postId).style.display = "block";
            $.get("/api/urls/replies/" + urlId + "/" + postId, results => {
                outputReplies(results, $(".allReplies" + postId));
                results.forEach(resultAll => {
                    if(resultAll.likes > 0) {
                        document.getElementById('replyLikeButton' + resultAll.replyId).className += ' active';
                    }
                });
            })
            document.getElementById("showReplies" + postId).style.display = "none";
            document.getElementById("hideReplies" + postId).style.display = "block";
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

$(document).on("click", ".replyLikeButton", (event) => {
    var button = $(event.target);
    var replyId = getReplyIdFromElement(button);

    if(replyId === undefined) return;

    $.ajax({
        url: `/api/urls/${replyId}/replyLike`,
        type: "PUT",
        success: (replyData) => {
            
            button.find("span").text(replyData.likes);

            if(replyData.active === 0){
                button.addClass("active");
            }
            else {
                button.removeClass("active");

                if(replyData.likes === 0) {
                    button.find("span").text("");
                }
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

$(document).on("click", ".replyTrashActive", (event) => {
    var button = $(event.target);
    var replyId = getReplyIdFromElement(button);
    var postId = getPostIdFromElement(button);

    if(replyId === undefined) return;

    $.ajax({
        url: `/api/urls/deleteReply/${replyId}/${postId}`,
        type: "DELETE",
        success: (countReplies) => {
            document.body.querySelector(`.reply[data-id='${replyId}']`).style.display = "none";

            if(countReplies[0].countReplies === 1) {
                document.getElementById("showReplies" + postId).style.display = "none";
                document.getElementById("hideReplies" + postId).style.display = "none";
            }
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

$(document).on("click", ".showReplies", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    document.getElementById("allReplies" + postId).style.display = "block";

    document.getElementById("showReplies" + postId).style.display = "none";
    document.getElementById("hideReplies" + postId).style.display = "block";

    $.get("/api/urls/countReplies/" + postId, results => {
        $.get("/api/urls/replies/" + urlId + "/" + postId, results => {
            outputReplies(results, $(".allReplies" + postId));
        
            results.forEach(result => {
                $.get("/api/urls/" + result.replyId + "/checkReplyLikes/", replyResults => {
                    if(replyResults.length > 0) {
                        document.getElementById('replyLikeButton' + replyResults[0].replyId).className += ' active';
                    }
                })
            })
        })
    })
})

$(document).on("click", ".hideReplies", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    document.getElementById("hideReplies" + postId).style.display = "none";
    document.getElementById("showReplies" + postId).style.display = "block";

    document.getElementById("allReplies" + postId).style.display = "none";
})

function getPostIdFromElement(element) {
    var isRoot = element.hasClass("post");
    var rootElement = isRoot == true ? element : element.closest(".post");
    var postId = rootElement.data().id;

    if(postId === undefined) return alert("Post id undefinded");

    return postId;
}

function getReplyIdFromElement(element) {
    var isRoot = element.hasClass("reply");
    var rootElement = isRoot == true ? element : element.closest(".reply");
    var postId = rootElement.data().id;

    if(postId === undefined) return alert("Reply id undefinded");

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

                                <button class='showReplies' id='showReplies${postData.postId}'>Show Replies</button>
                                <button class='hideReplies' id='hideReplies${postData.postId}'>Hide Replies</button>
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
                <div class='allReplies${postData.postId}' id='allReplies${postData.postId}'></div>
            </div>`;
}

function createReplyHtml(replyData) {   

    var likeButtonActiveClass;
    var trashActiveClass;

    if(replyData.active === "1"){
        likeButtonActiveClass = "active";
    }
    else {
        likeButtonActiveClass = "";
    }

    if(userLoggedIn.username !== replyData.postedBy) {
        trashActiveClass = "replyTrashNotActive";
    }
    else {
        trashActiveClass = "replyTrashActive";
    }
    
    return `<div class='reply' data-id=${replyData.replyId}>
                <div class='mainPostContentContainer'>
                    <div class='postImageContainer'>
                        <img src='${replyData.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <span class='username'><a href='/profile/${replyData.postedBy}'>${replyData.postedBy}</a></span>
                        </div>
                        <div class='postBody'>
                            <span>${replyData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer green'>
                                <button id='replyLikeButton${replyData.replyId}' class='replyLikeButton ${likeButtonActiveClass}'>
                                <i class="far fa-thumbs-up"></i>
                                <span id='replyLikes'>${replyData.likes || ""}</span>
                                </button>

                                <button class='${trashActiveClass}'>
                                <i class="far fa-trash-alt"></i>
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

function outputLikes(results) {
    document.getElementById("videoLikes").innerHTML = results[0].likes;

    $.get("/api/urls/" + urlId + "/checkLikes", results => {
        if(results) {
            document.getElementById('videoLikeButton').className += ' active'
        }
    })
}

function outputReplies(results, container) {
    container.html("");
    results.forEach(result => {
        var html = createReplyHtml(result);
        container.prepend(html); 
    });
}