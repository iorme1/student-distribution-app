import { ClassroomsData } from './classroom-manager.js';
import { postData } from './post.js';
import { alertWarning, alertSuccess } from './alerts.js';

function retrieveClassroomData() {
  //let baseURL = 'http://localhost:3001/api/v1';
  let baseURL = 'https://student-distrubition-api.herokuapp.com/api/v1'
  let token = JSON.parse(localStorage.getItem("jwt")).auth_token

  fetch(`${baseURL}/retrieve-state`, {
    method: 'GET',
    headers: {'Authorization': 'Bearer ' + token }
  })
  .then(response => response.json())
  .then(data => {
    let newState = JSON.parse(data.state);
    ClassroomsData.setState(newState);
    alertSuccess("You have successfully retrieved your data.")
  })
  .catch(err => alertWarning(err))
}

document.querySelector('.retrieve-classrooms-btn').onclick = retrieveClassroomData;
