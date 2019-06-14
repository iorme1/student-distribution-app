import { checkForToken } from './check-for-token.js';

function postData(url = '', data = {}, token=false) {
    let headers = {'Content-Type': 'application/json'};

    if (token) headers['Authorization'] = 'Bearer ' + token;

    return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    })
    .then(response => response.json());
}

export { postData }
