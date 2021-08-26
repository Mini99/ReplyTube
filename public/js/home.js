$(document).ready(() => {
    $.get("/api/urls/range/0/9", results => {
        outputUrlsHome(results, $(".urlsContainer"))
    })

    function getTotalVids() {
        $.get("/api/urls/countVids", results => {
            return results.countVids;
        })
    }
})

$(window).scroll(function() {
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
        document.getElementById("loadWheel").style.display = "block";
        setTimeout(() => { 
            $.ajax({
                url: "/api/urls/range/10/19",
                type: "GET",
                success: (results) => {
                    document.getElementById("loadWheel").style.display = "none";
                    results.forEach(result => {
                        var html = createPostHtml(result)
                        $(".urlsContainer").append(html).fadeIn();
                    });
                }
            })
        }, 1000);
    }
});