import { postData } from './post.js';
import { alertSuccess, alertWarning } from './alerts.js'

function showRegisterModal() {
  $('#modalLoginForm').modal('toggle');
  $('#modalRegisterForm').modal('toggle');
}

function registerAccount(e) {
  e.preventDefault();
  let form = this;
  // let baseURL = 'http://localhost:3001/api/v1';
  let baseURL = 'https://student-distrubition-api.herokuapp.com/api/v1'
  let email = form.elements["email"].value
  let password = form.elements["password"].value

  postData(`${baseURL}/users`, {
    email: email,
    password: password
  })
  .then(data => {
    $('#modalRegisterForm').modal('toggle');
    alertSuccess("You have successfully registered an account.")
  })
  .catch(err => alertWarning(err))
}


document.querySelector('.create-acct-btn').onclick = showRegisterModal;
document.querySelector('.register-form').onsubmit = registerAccount;
