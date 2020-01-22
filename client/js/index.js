fetch('http://localhost:3000/api/articles', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then((res) => {
    return res.json();
}).then((data) => {
    console.log(data);
});
