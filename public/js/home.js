$(document).ready(() => {
    $.get("/api/urls/range/0/9", results => {
        outputUrlsHome(results, $(".urlsContainer"))
    })
})

var start = 10;
var end = 19;

$(window).scroll(function() {
    $.get("/api/urls/countVids", results => {
        console.log(results.countVids);
        if(end <= results.countVids) {
            if($(window).scrollTop() == $(document).height() - $(window).height()) {
                document.getElementById("loadWheel").style.display = "block";
                $.ajax({
                    url: "/api/urls/range/" + start + "/" + end,
                    type: "GET",
                    success: (results) => {
                        document.getElementById("loadWheel").style.display = "none";
                        results.forEach(result => {
                            var html = createPostHtml(result)
                            $(".urlsContainer").append(html);
                        });
                    }
                })
                start+=10;
                end+=10;
            }
        }
    })
});