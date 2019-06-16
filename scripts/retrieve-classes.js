import { ClassroomsData } from './classroom-manager.js';
import { alertWarning, alertSuccess } from './alerts.js';
import { checkForToken } from './check-for-token.js';
import { ViewBuilder } from './classroom-view-builder.js';

function retrieveClassroomData() {
  //let baseURL = 'http://localhost:3001/api/v1';
  let baseURL = 'https://student-distribution-api.herokuapp.com/api/v1';
  let url = `${baseURL}/retrieve-state`;

  let token = checkForToken();
  if (!token) return;

  ViewBuilder.showSpinner();

  fetch(url, {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + token }
  })
  .then(response => response.json())
  .then(data => {
    ViewBuilder.removeSpinner();

    let dataExists = checkForData(data);

    if (!dataExists) {
      alertWarning('You do not have any saved data yet!')
    } else {
      let newState = JSON.parse(data.state);
      ClassroomsData.setState(newState);
      alertSuccess("You have successfully retrieved your data.")
    }
  })
  .catch(err => {
    ViewBuilder.removeSpinner();
    alertWarning(err)
  });
}

function checkForData(data) {
  return data != null;
}

document.querySelector('.retrieve-classrooms-btn').onclick = retrieveClassroomData;
