import { postData } from './post.js';
import { alertSuccess, alertWarning } from './alerts.js';

function login(e) {
  let form = this;
  /* let baseURL = 'http://localhost:3001/api/v1';   for development */
  let baseURL = 'https://student-distrubition-api.herokuapp.com/api/v1'
  e.preventDefault()
  $('#modalLoginForm').modal('toggle');

  let email = form.elements["email"].value
  let password = form.elements["password"].value

  postData(`${baseURL}/authenticate`, {
    email: email,
    password: password
  })
  .then(token => {
    setJWT(token);
    alertSuccess('You have successfully logged in.')
  })
  .catch(err => alertWarning("Error logging into your account. Try again."))

}

function setJWT(token) {
  localStorage.setItem("jwt", JSON.stringify(token));
}

document.querySelector('.login-form')
  .onsubmit = login;
