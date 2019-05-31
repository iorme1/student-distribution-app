import { ClassroomsData } from './classroom.js';
const StudentList = {};

function handleFile() {
  if (!userCreatedClassrooms()) {
    // CHANGE THIS TO USE SWEET ALERT 
    alert(
      "Please configure classrooms first by clicking Create Classrooms button"
    )
    location.reload();
  }

  let files = this.files, f = files[0];
  let reader = new FileReader();
  reader.onload = function(e) {
    let data = new Uint8Array(e.target.result);
    let workbook = XLSX.read(data, {type: 'array'});

    let firstSheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[firstSheetName];

    StudentList.data = XLSX.utils.sheet_to_json(worksheet, {raw: true})
    $('#modal-fu').modal('toggle')
  };
  reader.readAsArrayBuffer(f);
}

function userCreatedClassrooms() {
  let classrooms = ClassroomsData.getAllClassrooms();

  if (Object.keys(classrooms).length == 0) {
    return false;
  } else {
    return true;
  }
}

export { StudentList };


document.querySelector("#file-upload")
  .addEventListener("change", handleFile, false);
