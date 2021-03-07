$(document).ready(() => {
    if(selectedTab === "likedPosts") {
        loadLikedPosts();
    }
    else {
        loadPosts();
    }
});

function loadPosts() {
    $.get("/api/posts/" + profileUser + '/user', results => {
        outputPosts(results, $(".postsContainer"))
    })
}

function loadLikedPosts() {
    $.get("/api/posts/" + profileUser + '/likedPosts', results => {
        outputPosts(results, $(".postsContainer"))
    })
}

function createCommentHtml(postData) {   

    var likeButtonActiveClass;

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