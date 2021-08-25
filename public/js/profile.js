$(document).ready(() => {
    if(selectedTab === "likedVideos") {
        loadLikedVideos();
    }
    else if(selectedTab === "likedPosts") {
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

function loadLikedVideos() {
    $.get("/api/posts/" + profileUser + '/likedVideos', results => {
        outputUrls(results, $(".postsContainer"))
    })
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

function createCommentHtml(postData) {   

    var likeButtonActiveClass;

    if(postData.active === "1"){
        likeButtonActiveClass = "active";
    }
    else {
        likeButtonActiveClass = "";
    }
    
    return `<div class='post' data-id=${postData.postId} onclick="window.location.href='/urls/${postData.urlId}'" style='cursor: pointer'>
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

$("#filePhoto").change(function(){
    if(this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var image = document.getElementById("imagePreview");
            image.src = e.target.result;

            if(cropper !== undefined) {
                cropper.destroy();
            }

            cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                background: false
            });

        }
        reader.readAsDataURL(this.files[0]);
    }
})

$("#imageUploadButton").click(() => {
    var canvas = cropper.getCroppedCanvas();

    if(canvas == null) {
        alert("Could not upload iamge. Make sure it is an image file.");
        return;
    }

    canvas.toBlob((blob) => {
        var formData = new FormData();
        formData.append("croppedImage", blob);

        $.ajax({
            url: "/api/users/profilePicture",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: () => location.reload()
        })
    })
})