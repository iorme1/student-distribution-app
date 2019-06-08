import { ClassroomsData } from './classroom-manager.js';
import { postData } from './post.js';
import { alertWarning, alertSuccess } from './alerts.js';

function saveClassroomData() {
  if (!userCreatedClassrooms()) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      showCancelButton: true,
      text: "You don't have any classroom data to save!"
    })
  } else {
    requestSaveData();
  }
}

function requestSaveData() {
  //let baseURL = 'http://localhost:3001/api/v1';
  let baseURL = 'https://student-distrubition-api.herokuapp.com/api/v1'
  let classroomsState = ClassroomsData.getState();

  postData(`${baseURL}/save-state`, {
    state: classroomsState
  }, true)
  .then(data => {
    console.log("response", data)
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
