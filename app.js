(function addMainArticles(){
    const realTimeContainer = document.querySelector('.real-time-articles');

    realTimeContainer.innerHTML = '';

    fetch(`https://api.nytimes.com/svc/news/v3/content/all/all/one.json?api-key=Zc72YsrLhE3iZGvsO1DLYHpKQNpBqgJZ`)
    .then(response => response.json())
    .then(addArticle)
    .catch(e => requestError(e, 'image'));    

    function addArticle(data) {
        let htmlContent = "";
        if (data.results && data.results.length > 1) {

                htmlContent = '<ul class="row">' + data.results.map(article => `<li class = "col-sm-6 col-md-4 main-articles">
                <figure><img class="article-thumb" src="${article.thumbnail_standard}" alt=""></figure>
                <h2><a href = " ${article.url}"> ${article.title}</a></h2>
                <p>${article.abstract}</p>
                </li>`).join('') + '</ul>';
        } else {
            htmlContent = `<div class = "error-no-articles">No articles available</div>`;
        }
        realTimeContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

    function requestError(e, part) {
        console.log(e);
        realTimeContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }
})();

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        $('.real-time-articles').fadeOut('fast');
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        


        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 315b248f3e6ab1e08f2a26ef4cc0b61eacbbbde4b3c788e7452a51f386fc3257'
            }
        }).then(response => response.json())
            .then(addImage)
            .catch(e => requestError(e, 'image'));

        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=LsZPivAAbjtPsNg2gM33VSRYFdfFlaBb`)
            .then(response => response.json())
            .then(addArticles)
            .catch(e => requestError(e, 'image'));    

        function addImage(data) {
            let htmlContent = "";
            if(data.results.length>1){
                const firstImage = data.results[0];
                console.log(firstImage);
                responseContainer.insertAdjacentHTML('afterbegin', `<figure>
                    <img src="${firstImage.urls.small}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                    </figure>`
                );
            } else{
                htmlContent = `<div class = "error-no-image">No image available</div>`;
            }
            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }

        function addArticles(data) {
            let htmlContent;
            console.log(data.response)
            if (data.response && data.response.docs && data.response.docs.length > 1) {
                htmlContent = '<ul class= "row">' + data.response.docs.map(article => `<li class = "col-12 col-sm-6 col-md-6 col-lg-4 article">
                <h2><a href = " ${article.web_url}"> ${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
                </li>`).join('') + '</ul>';
            } else {
                htmlContent = `<div class = "error-no-articles">No articles available</div>`;
            }
            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }

        function requestError(e, part) {
            console.log(e);
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }
    });
})();
