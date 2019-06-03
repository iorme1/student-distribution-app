import { ClassroomsData } from './classroom-manager.js'

function removeClassForm() {
  let parent = this.parentNode;
  let grandParent = parent.parentNode;

  grandParent.removeChild(parent);
}

function removeAllClassNameInputs(element) {
  let parent = element.parentNode;
  let grandParent = parent.parentNode;

  var elements = grandParent.getElementsByClassName("removable");

  while (elements[0]) {
    grandParent.removeChild(elements[0]);
  }
}

function createFormLabel() {
  let label = document.createElement('label');
  label.setAttribute("for", "classroom-name");
  label.classList.add("col-form-label");
  label.classList.add("text-danger");
  label.textContent = "Classroom Name";

  return label;
}

function createFormDiv() {
  let div = document.createElement('div')
  div.classList.add("form-group");
  div.classList.add("removable");

  return div;
}

function createFormInput() {
  let input = document.createElement('input');
  input.setAttribute("type", "text");
  input.setAttribute("name", "classroom-name");
  input.classList.add("form-control");

  return input;
}

function createRemoveBtn() {
  let removeBtn = document.createElement('button');
  removeBtn.classList.add("btn");
  removeBtn.classList.add("btn-xs");
  removeBtn.classList.add("btn-danger");
  removeBtn.textContent = "remove class"
  removeBtn.onclick = removeClassForm;

  return removeBtn;
}

function addClassNameInputs() {
  removeAllClassNameInputs(this);

  let numberOfClasses = this.value;
  let form = document.querySelector('.classroom-modal-input-fields');

  for (let i = 0; i < numberOfClasses; i++) {
    let div = createFormDiv();
    let label = createFormLabel();
    let input = createFormInput();
    let removeBtn = createRemoveBtn();

    div.appendChild(label);
    div.appendChild(input);
    div.appendChild(removeBtn);
    form.appendChild(div);
  }
}

function classRoomHandler(e) {
  e.preventDefault()
  $("#modal-cr").modal('toggle');

  let form = this;
  let targetAttribute = form.elements["spread-factor"].value.toLowerCase();
  let classroomInputs = Array.from(form.elements["classroom-name"]);
  let maxCapacity = form.elements["max-capacity"].value

  ClassroomsData.setMaxCapacity(maxCapacity);
  ClassroomsData.setTargetAttribute(targetAttribute);

  classroomInputs.forEach(room => ClassroomsData.addClassroom(room.value));
}

document.querySelector(".classroom-modal-input-fields")
  .onsubmit = classRoomHandler;

document.querySelector("#num-classrooms-input").onkeyup = addClassNameInputs;
document.querySelector("#num-classrooms-input").onchange = addClassNameInputs;
