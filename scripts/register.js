import { postData } from './post.js';
import { alertSuccess, alertWarning } from './alerts.js'
import { ViewBuilder } from './classroom-view-builder.js';

function showRegisterModal() {
  $('#modalLoginForm').modal('toggle');
  $('#modalRegisterForm').modal('toggle');
}

function registerAccount(e) {
  e.preventDefault();
  let form = this;
  //let baseURL = 'http://localhost:3001/api/v1';
  let baseURL = 'https://student-distrubition-api.herokuapp.com/api/v1';
  let email = form.elements["email"].value;
  let password = form.elements["password"].value;

  ViewBuilder.showSpinner();

  postData(`${baseURL}/users`, {
    email: email,
    password: password
  })
  .then(data => {
    ViewBuilder.removeSpinner();
    $('#modalRegisterForm').modal('toggle');
    alertSuccess("You have successfully registered an account.")
  })
  .catch(err => {
    ViewBuilder.removeSpinner();
    alertWarning(err);
  });
}


document.querySelector('.create-acct-btn').onclick = showRegisterModal;
document.querySelector('.register-form').onsubmit = registerAccount;
