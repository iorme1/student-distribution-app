import { ViewBuilder } from './classroom-view-builder.js';
import { alertSuccess } from './alerts.js';

const AccountManager = {
  removeCredentials() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    ViewBuilder.removeCurrentUser();
    ViewBuilder.toggleAccountBtn("Account Login");
    alertSuccess("You have successfully logged out.");
  },

  setCredentials(token, email) {
    localStorage.setItem("jwt", token)
    localStorage.setItem("user", email);
    ViewBuilder.setCurrentUser(email);
    ViewBuilder.toggleAccountBtn("Account Logout");
    alertSuccess('You have successfully logged in.')
  },

  checkForUser() {
    let user = localStorage.getItem("user");
    if (user) {
      ViewBuilder.setCurrentUser(user);
      ViewBuilder.toggleAccountBtn("Account Logout");
    } else {
      ViewBuilder.toggleAccountBtn("Account Login");
    }
  }
}

AccountManager.checkForUser();

export { AccountManager }
