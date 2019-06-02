import { ClassroomsData } from './classroom-manager.js';
const StudentList = {};

function handleFile() {
  let files = this.files, f = files[0];

  if (!userCreatedClassrooms()) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: 'You have not created your classrooms yet!',
      footer: 'click on the "create classroom button"'
    });
    return;
  }

  if (!validFileUpload(f.name)) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: 'Invalid File Format',
      footer: 'Please upload an excel file.'
    });
    return;
  }

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

function validFileUpload(fileName) {
  let allowedExtensions = ["xlsx","xls","xlsxm", "xltx","xltm"];
  let fileExtension = fileName.split('.').pop();

  for (let i = 0; i < allowedExtensions.length; i++) {
    if(allowedExtensions[i] == fileExtension) {
	     return true;
    }
  }
  return false;
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
