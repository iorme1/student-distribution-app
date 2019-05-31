function removeClassForm() {
  let parent = this.parentNode;
  let grandParent = parent.parentNode;

  grandParent.removeChild(parent);
}

function removeAllClassForms(element) {
  let parent = element.parentNode;
  let grandParent = parent.parentNode;

  var elements = grandParent.getElementsByClassName("removable");

  while (elements[0]) {
    grandParent.removeChild(elements[0]);
  }
}

function addClassNameInputs() {
  removeAllClassForms(this);

  let numberOfClasses = this.value;
  let form = document.querySelector('.classroom-modal-input-fields');

  for (let i = 0; i < numberOfClasses; i++) {
    let div = document.createElement('div')
    div.classList.add("form-group");
    div.classList.add("removable");

    let label = document.createElement('label');
    label.setAttribute("for", "classroom-name");
    label.classList.add("col-form-label");
    label.classList.add("text-danger");
    label.textContent = "Classroom Name";

    let input = document.createElement('input');
    input.setAttribute("type", "text");
    input.setAttribute("name", "classroom-name");
    input.classList.add("form-control");

    let removeBtn = document.createElement('button');
    removeBtn.classList.add("btn");
    removeBtn.classList.add("btn-xs");
    removeBtn.classList.add("btn-danger");
    removeBtn.textContent = "remove class"
    removeBtn.onclick = removeClassForm;

    div.appendChild(label);
    div.appendChild(input);
    div.appendChild(removeBtn);
    form.appendChild(div);
  }
}

document.querySelector("#num-classrooms-input").onkeyup = addClassNameInputs;
document.querySelector("#num-classrooms-input").onchange = addClassNameInputs;
