function postData(url = '', data = {}, authResource=false) {
    let headers = {'Content-Type': 'application/json'};

    if (authResource) {
      let token = JSON.parse(localStorage.getItem("jwt")).auth_token
      headers['Authorization'] = 'Bearer ' + token;
    }

    return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    })
    .then(response => response.json());
}

export { postData }
