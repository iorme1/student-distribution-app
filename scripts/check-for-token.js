import { alertWarning } from './alerts.js';

export function checkForToken() {
  let token = localStorage.getItem("jwt");

  if (token) {
    return token
  } else {
    alertWarning('You have to be logged in to do that.')
    return false;
  }
}
