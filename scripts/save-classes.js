import { ClassroomsData } from './classroom-manager.js';
import { postData } from './post.js';
import { alertWarning, alertSuccess } from './alerts.js';
import { checkForToken } from './check-for-token.js';
import { ViewBuilder } from './classroom-view-builder.js';

function saveClassroomData() {
  let token = checkForToken();
  if (!token) return;

  if (!userCreatedClassrooms()) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      showCancelButton: true,
      text: "You don't have any classroom data to save!"
    })
    return;
  } else {
    requestSaveData(token);
  }
}

function requestSaveData(token) {
  //let baseURL = "http://localhost:3001/api/v1";
  let baseURL = 'https://student-distribution-api.herokuapp.com/api/v1';
  let classroomsState = ClassroomsData.getState();
  let url = `${baseURL}/save-state`;
  ViewBuilder.showSpinner();

  postData(url, {state: classroomsState}, token)
    .then(data => {
      ViewBuilder.removeSpinner();
      alertSuccess("You have successfully saved your data.")
    })
    .catch(err => {
      ViewBuilder.removeSpinner();
      alertWarning(err)
    });
}

function userCreatedClassrooms() {
  let classrooms = ClassroomsData.getAllClassrooms();

  if (Object.keys(classrooms).length == 0) {
    return false;
  } else {
    return true;
  }
}


document.querySelector('.save-classrooms-btn').onclick = saveClassroomData;
