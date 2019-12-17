$(document).ready(function() {
    let scrapedList = $(".scrapedList")
    // scrapeArticles()
    $("#scrape-button").on("click", loadArticles);
    $(document).on("click", ".savebtn", saveArticles)
    $("#clear").on("click", clearArticles)

    function loadArticles () {
        $.ajax({
            method: "GET",
            url: "/api/articles",
        }).then(function(data) {
            console.log(data)
            scrapedList.empty();
            if (data) {
                renderArticles(data);
            } else {
                scrapedList.append("<div>No Articles to Show</div>");
            }
        }). catch(function(err){
            console.log(err);
        });
    }

    function articleDiv(article) {
        let div = $("<div class='article border border-info p-3 m-5'>");
        let head = $("<h3 class='head'>").text(article.title)
        let link = $("<a type='button' class='btn btn-info m-2' class='link' target='_blank'>").attr("href", article.url).text("Read Article")
        let body = $("<div class='articleBody'>").text(article.summary);
        let save = $("<button type='button' class='savebtn btn btn-info m-2'>Save Article</button>")
        div.append(head, body, link, save);
        div.data("_id", article._id);
        return div;
    }

    function renderArticles(articles) {
        let newArticles = [];
        for (let i = 0; i < articles.length; i++) {
            newArticles.push(articleDiv(articles[i]));
        }
        scrapedList.append(newArticles)
    }

    function scrapeArticles() {
        $.ajax({
            method: "GET",
            url: "/api/scrape",
        }).then(function(data) {
            res.json(data)
        })
    }

    function saveArticles() {
        let savedArticle = $(this).parents(".article").data()
        $(this).parents(".article").remove(); 
        savedArticle.saved = true;
        $.ajax({
            method: "PUT",
            url: "api/articles/" + savedArticle._id,
            data: savedArticle
        }).then(function(data) {
            scrapeArticles();
        })
    }

    function clearArticles() {
        scrapedList.empty();
        scrapeArticles();
    }

})