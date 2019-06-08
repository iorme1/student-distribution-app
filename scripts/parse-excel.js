import { ClassroomsData } from './classroom-manager.js';
import { ViewBuilder } from './classroom-view-builder.js';
import { alertSuccess, alertWarning } from './alerts.js';
const StudentList = {};

function handleFile() {
  let files = this.files, f = files[0];

  if (!validFileUpload(f.name)) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: 'Invalid File Format',
      footer: 'Please upload an excel file.'
    });
    $('#file-upload').val('');
    return;
  }

  let reader = new FileReader();
  reader.onload = function(e) {
    let data = new Uint8Array(e.target.result);
    let workbook = XLSX.read(data, {type: 'array'});

    let firstSheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[firstSheetName];

    StudentList.data = XLSX.utils.sheet_to_json(worksheet, {raw: true})
    ViewBuilder.showOrganizeButton();
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

export { StudentList };

document.querySelector("#file-upload")
  .addEventListener("change", handleFile, false);
