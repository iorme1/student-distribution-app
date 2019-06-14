import { alertWarning } from './alerts.js';

export function checkForToken() {
  let token = localStorage.getItem("jwt");

  if (token) {
    return token
  } else {
    let msg = "You have to be logged in to do that. If the application says "+
    "you are logged in, then your session may have expired. Simply logout and "+
    "log back in to renew your session.";
    alertWarning(msg);
    return false;
  }
}
