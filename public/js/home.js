$(document).ready(() => {
    $.get("/api/urls/range/0/9", results => {
        outputUrlsHome(results, $(".urlsContainer"))
    })
})

var start = 10;
var end = 19;

$(window).scroll(function() {
    $.get("/api/urls/countVids", results => {
        if(end < results.countVids) {
            if($(window).scrollTop() == $(document).height() - $(window).height()) {
                document.getElementById("loadWheel").style.display = "block";
                setTimeout(() => { 
                    $.ajax({
                        url: "/api/urls/range/" + start + "/" + end,
                        type: "GET",
                        success: (results) => {
                            document.getElementById("loadWheel").style.display = "none";
                            results.forEach(result => {
                                var html = createPostHtml(result)
                                $(".urlsContainer").append(html).fadeIn();
                            });
                        }
                    })
                    start+=10;
                    end+=10;
                }, 1000);
            }
        }
    })
});