import { postData } from './post.js';
import { alertSuccess, alertWarning } from './alerts.js';
import { ViewBuilder } from './classroom-view-builder.js';

function login(e) {
  let form = this;
  //let baseURL = 'http://localhost:3001/api/v1';
  let baseURL = 'https://student-distrubition-api.herokuapp.com/api/v1'
  let url = `${baseURL}/authenticate`;

  e.preventDefault()
  $('#modalLoginForm').modal('toggle');
  ViewBuilder.showSpinner();

  let email = form.elements["email"].value;
  let password = form.elements["password"].value;

  postData(url, {
    email: email,
    password: password
  })
  .then(token => {
    ViewBuilder.removeSpinner();
    let auth_token = token["auth_token"];

    if (auth_token) {
      setJWT(auth_token);
      setUser(email);
      ViewBuilder.setCurrentUser(email);
      alertSuccess('You have successfully logged in.')
    } else {
      alertWarning("Invalid login credentials")
    }
  })
  .catch(err => {
    ViewBuilder.removeSpinner();
    alertWarning(err);
  })
}

function setJWT(auth_token) {
  localStorage.setItem("jwt", auth_token);
}

function setUser(email) {
  localStorage.setItem("user", email)
}

document.querySelector('.login-form')
  .onsubmit = login;
