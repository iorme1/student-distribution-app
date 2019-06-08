import { checkForToken } from './check-for-token.js';

function postData(url = '', data = {}, authResource=false) {
    let headers = {'Content-Type': 'application/json'};

    if (authResource) {
      let token = checkForToken();
      if (!token) return;
      token = localStorage.getItem("jwt");
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
