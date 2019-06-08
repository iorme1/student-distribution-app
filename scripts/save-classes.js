import { ClassroomsData } from './classroom-manager.js';
import { postData } from './post.js';
import { alertWarning, alertSuccess } from './alerts.js';
import { checkForToken } from './check-for-token.js';

function saveClassroomData() {
  let token = checkForToken();

  if (!token) {
    alertWarning('You have to be logged in to do that.');
    return;
  } else if (!userCreatedClassrooms()) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      showCancelButton: true,
      text: "You don't have any classroom data to save!"
    })
    return;
  } else {
    requestSaveData();
  }
}

function requestSaveData() {
  //let baseURL = 'http://localhost:3001/api/v1';
  let baseURL = 'https://student-distrubition-api.herokuapp.com/api/v1'
  let classroomsState = ClassroomsData.getState();
  let url = `${baseURL}/save-state`;

  postData(url, {state: classroomsState}, true)
    .then(data => {
      alertSuccess("You have successfully saved your data.")
    })
    .catch(err => alertWarning(err))
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
