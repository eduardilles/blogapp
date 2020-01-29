// returns a promise that needs to be resolved in order
// to get the articles needed
let articles = async () =>  {
    let article;

    let data = fetch('http://localhost:3000/api/articles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        return res.json();
    }).then((data) => article = data).then((data) => {
        return data;
    });
    article = await data;

    return article;
}

// function in order to create a Article
function createArticle(element) {
    let header = document.createElement("h1");
    header.className = 'article-heading';
    header.innerHTML = element.metaData.title;
    document.getElementById('articles').append(header);
}

// resolving the promise and get the expected data
articles().then((data) => {
    data.forEach(el => {
        createArticle(el);
    });
});