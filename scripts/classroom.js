import { StudentList } from "./parse-excel.js";
import { dragElement } from "./drag.js";

const ClassroomsData = ClassroomsManager();

function ClassroomsManager() {
   const state = {
     classrooms: {},
     attributes: [],
     targetAttribute: "",
     lastOverElement: null,
     maxCapacity: 0
   }

  function getLowestClassScore() {
    let targetClass;
    let currentSmallest = Infinity;
    let classes = state.classrooms;

    for (let room in classes) {
      // going to need to throw errors and use some kind of sweet alert
      // to let user know that the attribute chosen to organize their
      // students by was not input correctly, etc.  going to need to find
      // all places where user error from mistyping anything can be saved
      // and displayed properly to the user.

      if (classes[room].score < currentSmallest) {
        currentSmallest = classes[room].score;
        targetClass = classes[room];
      }
    }
    return targetClass;
  }

  function addStudent(room, student) {
    room.students.push(student)
    incrementRoomAttributes(room, student)
  }

  function removeStudent(room, student) {
    room.students = room.students.filter(currentStudent => {
      return student != currentStudent;
    });
    decrementRoomAttributes(room, student);
  }

  function decrementRoomAttributes(room, student) {
    for (let attr in student) {
      if (
        room.attributeTotals[attr] == "undefined" ||
        attr.toLowerCase() == "name"
      ) continue;

      if (attr.toLowerCase() == 'sex') {
        student[attr].toLowerCase() == "m" ?
        room.attributeTotals.males-- :
        room.attributeTotals.females--;
      } else {
        room.attributeTotals[attr] -= student[attr]
      }
    }
    let targetAttribute = state.targetAttribute;

    room.score -= student[targetAttribute];
  }


  function incrementRoomAttributes(room, student) {
    for (let attr in student) {
      if (
        room.attributeTotals[attr] == "undefined" ||
        attr.toLowerCase() == "name"
      ) continue;

      if (attr.toLowerCase() == 'sex') {
        student[attr].toLowerCase() == "m" ?
        room.attributeTotals.males++ :
        room.attributeTotals.females++;
      } else {
        room.attributeTotals[attr] += student[attr]
      }
    }
    let targetAttribute = state.targetAttribute;
    room.score += student[targetAttribute];
  }

  function getAllClassrooms() {
    return state.classrooms;
  }

  function getClassroom(classroomName) {
    return state.classrooms[classroomName];
  }

  function addClassroom(classroomName) {
    state.classrooms[classroomName] = {
      score: 0,
      students: [],
      attributeTotals: {
        males: 0,
        females: 0
      }
    };
  }

  function setTargetAttribute(attr) {
    state.targetAttribute = attr;
  }

  function getTargetAttribute() {
    return state.targetAttribute;
  }

  function getClassroomAttributes() {
    for (let key in state.classrooms) {
      return Object.keys(state.classrooms[key].attributeTotals)
    }
  }

  function setAllAttributes(students) {
    let classes = state.classrooms;

    for (let key in students) state.attributes.push(key);

    // sets classroom stat properties for each classroom
    for (let room in classes) {
      let attributeTotals = classes[room].attributeTotals;

      for (let key in students) {
        let value = students[key]
        let attr = key.toLowerCase();
        if (attr.includes("name") || attr.includes("sex")) continue;

        attributeTotals[key] = 0;
      }
    }
  }

  /* unpacks nested obect into a simple array of student objects */
  function formatStudentList() {
    let result = []

    for (let key in StudentList.data) {
      result.push(StudentList.data[key])
    }

    return result;
  }

  function getLowestClassScore() {
    let targetClass;
    let currentSmallest = Infinity;
    let classes = state.classrooms;

    for (let room in classes) {
      if (classes[room].score < currentSmallest) {
        currentSmallest = classes[room].score;
        targetClass = classes[room];
      }
    }
    return targetClass;
  }

  function setMaxCapacity(capacity) {
    state.maxCapacity = capacity;
  }

  function getMaxCapacity() {
    return state.maxCapacity;
  }

  function organizeStudentsByTargetAttribute() {
    this.style.display = "none"; // removes organize button

    let formattedStudentList = formatStudentList();

    setAllAttributes(formattedStudentList[0]);

    let sortedStudents = formattedStudentList.sort((a,b) => {
       return b[state.targetAttribute] - a[state.targetAttribute];
    });

    for (let i = 0; i < sortedStudents.length; i+=1) {
      let targetClass = getLowestClassScore();
      let student = sortedStudents[i];

      addStudent(targetClass, student)
    }

    classroomHTMLBuilder();
  }

  function setStudentBlock() {
    let studentBlock = new Swappable
      .default(document.querySelectorAll('.swappable'), {
        draggable: 'div'
      });

    studentBlock.on("drag:over:container", setLastOverElement)
    studentBlock.on("drag:stop", handleStudentSwap)
  }

  function setLastOverElement() {
    let lastOver = document.querySelector('.draggable-container--over');
    state.lastOverElement = lastOver;
  }

  function getStudentFromClassroom(studentName, room) {
    return room.students.filter(student => {
      let foundStudent = false
      for (let attr in student) {
        let key = attr.toLowerCase();
        if (key.includes("name")) {
          if (student[attr] == studentName) {
            foundStudent = true;
            break;
          }
        }
      }
      return foundStudent;
    })[0];
  }

  function handleStudentSwap() {
    let originalElement = document.querySelector('.draggable--original');
    let swappedWithElement = state.lastOverElement;

    if (isEmptySlot(originalElement) && isEmptySlot(swappedWithElement)) return;

    let origRoomName = originalElement.dataset.classroom;
    let swapRoomName = swappedWithElement.dataset.classroom;

    if (origRoomName == swapRoomName) return;

    let origRoomNameObj = state.classrooms[origRoomName];
    let swapRoomNameObj = state.classrooms[swapRoomName];

    /* check for swapping student with empty slot */
    if(isEmptySlot(originalElement)) {
      let swapStudentObj = getStudentFromClassroom(
        swappedWithElement.dataset.identifier,
        swapRoomNameObj
      );
      addStudent(origRoomNameObj, swapStudentObj);
      removeStudent(swapRoomNameObj, swapStudentObj);
      swapClassroomDataSet(originalElement, swappedWithElement)
      updateStatsView(origRoomName, swapRoomName);
      return;
    }

    if (isEmptySlot(swappedWithElement)) {
      let origStudentObj = getStudentFromClassroom(
          originalElement.dataset.identifier,
          origRoomNameObj
        );
      addStudent(swapRoomNameObj, origStudentObj);
      removeStudent(origRoomNameObj, origStudentObj);
      swapClassroomDataSet(originalElement, swappedWithElement)
      updateStatsView(swapRoomName, origRoomName)
      return;
    }

    let origStudentObj = getStudentFromClassroom(
        originalElement.dataset.identifier,
        origRoomNameObj
      );

    let swapStudentObj = getStudentFromClassroom(
      swappedWithElement.dataset.identifier,
      swapRoomNameObj
    );

    addStudent(swapRoomNameObj, origStudentObj);
    addStudent(origRoomNameObj, swapStudentObj);
    removeStudent(origRoomNameObj, origStudentObj);
    removeStudent(swapRoomNameObj, swapStudentObj);

    swapClassroomDataSet(originalElement, swappedWithElement)
    updateStatsView(origRoomName, swapRoomName)
  }

  function swapClassroomDataSet(original, swapped) {
    let temp = original.dataset.classroom
    original.dataset.classroom = swapped.dataset.classroom
    swapped.dataset.classroom = temp;
  }

  function isEmptySlot(elmnt) {
    return elmnt.dataset.identifier == "empty-slot";
  }

  function updateStatsView(room1Name, room2Name) {
    let room1Container = document
      .querySelector(`[data-classroomtable="${room1Name}"]`);

    let room1StatsContainer = room1Container.querySelector(".classroom-stats");
    let room1Stats = room1StatsContainer.querySelectorAll('span');

    room1Stats.forEach(stat => {
      stat.textContent = state
        .classrooms[room1Name]
        .attributeTotals[stat.dataset.attribute]
    });

    let room2Container = document
      .querySelector(`[data-classroomtable="${room2Name}"]`);

    let room2StatsContainer = room2Container.querySelector(".classroom-stats");
    let room2Stats = room2StatsContainer.querySelectorAll('span');

    room2Stats.forEach(stat => {
      stat.textContent = state
      .classrooms[room2Name]
      .attributeTotals[stat.dataset.attribute]
    });
  }

  return {
    addClassroom,
    getAllClassrooms,
    getClassroom,
    setTargetAttribute,
    getTargetAttribute,
    organizeStudentsByTargetAttribute,
    getClassroomAttributes,
    getLowestClassScore,
    setStudentBlock,
    getMaxCapacity,
    setMaxCapacity
  }
}


function classRoomHandler(e) {
  e.preventDefault()
  $("#modal-cr").modal('toggle');

  let form = this;
  let targetAttribute = form.elements["spread-factor"].value
  let classroomInputs = Array.from(form.elements["classroom-name"]);
  let maxCapacity = form.elements["max-capacity"].value

  ClassroomsData.setMaxCapacity(maxCapacity);
  ClassroomsData.setTargetAttribute(targetAttribute);

  classroomInputs.forEach(room => ClassroomsData.addClassroom(room.value));
}


function classroomHTMLBuilder() {
  let classes = ClassroomsData.getAllClassrooms();
  let targetAttribute = ClassroomsData.getTargetAttribute();

  for (let room in classes) {
    let classroomsContainer = document.querySelector('.classrooms-container');

    /* creates head of the classroom table */
    let roomContainer = document.createElement('div');
    roomContainer.classList.add("classroom");
    roomContainer.dataset.classroomtable = room;

    let titleContainer = document.createElement('div');
    titleContainer.classList.add("classroom-title");
    titleContainer.classList.add("text-center");
    titleContainer.textContent = room;

    let toggleMinimizeBtn = document.createElement('button');
    toggleMinimizeBtn.classList.add("toggle-classroom");
    toggleMinimizeBtn.onclick = toggleClassroom;

    titleContainer.appendChild(toggleMinimizeBtn);


    roomContainer.appendChild(titleContainer);
    classroomsContainer.appendChild(roomContainer);
    /* end of head of classroom table */

    let studentBatch = [...classes[room].students];
    /* array of html rows */
    let studentHTMLrows = createStudentHTMLrows(studentBatch, room)

    studentHTMLrows.forEach(row => roomContainer.appendChild(row))

    let roomStatsContainer = document.createElement('div');
    roomStatsContainer.classList.add("classroom-stats");
    roomContainer.appendChild(roomStatsContainer);

    let statsHTMLrows = createStatsHTMLrows(classes[room]);

    statsHTMLrows.forEach(row => roomStatsContainer.appendChild(row));
    /* drags entire classroom only by title element as a handle
     because we need rows nested in this element to be
     draggable as well */
    dragElement(titleContainer);
  }
  ClassroomsData.setStudentBlock()
}

function toggleClassroom() {
  let parent = this.parentNode;
  let grandParent = parent.parentNode;

  let students = grandParent.querySelectorAll('.student-row');
  let stats = grandParent.querySelector('.classroom-stats')

  students.forEach(student => {
    if (student.classList.contains("d-none")) {
      student.classList.remove("d-none");
    } else {
      student.classList.add("d-none");
    }
  });

  if(stats.classList.contains("d-none")) {
   stats.classList.remove("d-none");
  } else {
   stats.classList.add("d-none");
  }
}

function createStatsHTMLrows(room) {
    let attributes = ClassroomsData.getClassroomAttributes();
    let rows = [];

    while (true) {
      if (attributes.length == 0) break;
      /* create the row that contains 2 columns */
      let row = document.createElement('div');
      row.classList.add("row");
      row.classList.add("no-gutters");
      row.classList.add("stats");
      /* end row */

      let attr1 = attributes.pop();
      let col1 = document.createElement('div');
      col1.classList.add("col-6");

      let attr1_p = document.createElement('p');
      attr1_p.textContent = attr1

      let span1 = document.createElement('span');
      span1.classList.add("ml-1")
      span1.classList.add("stat-score")
      span1.dataset.attribute = attr1;
      span1.textContent = room.attributeTotals[attr1];

      attr1_p.appendChild(span1)
      col1.appendChild(attr1_p);
      row.appendChild(col1);

      if (attributes.length == 0) {
        rows.push(row);
        break;
      }

      let attr2 = attributes.pop();
      let col2 = document.createElement('div');
      col2.classList.add("col-6");

      let attr2_p = document.createElement('p');
      attr2_p.textContent = attr2;

      let span2 = document.createElement('span');
      span2.classList.add("ml-1")
      span2.classList.add("stat-score")
      span2.dataset.attribute = attr2;
      span2.textContent = room.attributeTotals[attr2];

      attr2_p.appendChild(span2)
      col2.appendChild(attr2_p);
      row.appendChild(col2);

      rows.push(row);
    }
    return rows;
}

function createStudentHTMLrows(studentBatch, roomName) {
  let students = [...studentBatch];
  let emptySlots = ClassroomsData.getMaxCapacity() - students.length;
  let rows = [];
  let targetAttribute = ClassroomsData.getTargetAttribute();

  while (true) {
    if (students.length == 0) break;
    /* create the row that contains 2 columns */
    let row = document.createElement('div');
    row.classList.add("row");
    row.classList.add("no-gutters");
    row.classList.add("student-row");
    /* end row */

    /* create first student for col 1 */
    let student1 = students.pop();
    let student1Name;

    for (let key in student1) {
      let attr = key.toLowerCase();
      if (attr.includes("name")) {
        student1Name = student1[key]
        break;
      }
    }

    let col1 = document.createElement('div');
    col1.classList.add("col-6");

    let student1Div = document.createElement('div');
    student1Div.classList.add("student");
    student1Div.classList.add("swappable");
    student1Div.dataset.identifier = student1Name;
    student1Div.dataset.classroom = roomName;
    student1Div.textContent = `${student1Name} - `

    let span1 = document.createElement('span');
    span1.classList.add("ml-1");
    span1.classList.add("score");
    span1.textContent = student1[targetAttribute];

    student1Div.appendChild(span1);

    col1.appendChild(student1Div);
    row.appendChild(col1);
    /* end col 1 */

    if (students.length == 0) {
      /* create empty slot here */
      if(emptySlots >= 1) {
        emptySlots--;

        let emptySlotCol = document.createElement('div');
        emptySlotCol.classList.add("col-6");

        let emptySlotDiv = document.createElement('div');

        emptySlotDiv.classList.add("swappable");
        emptySlotDiv.classList.add("student");
        emptySlotDiv.classList.add("empty-seat");
        emptySlotDiv.dataset.identifier = "empty-slot";
        emptySlotDiv.dataset.classroom = roomName;
        emptySlotDiv.textContent = '- empty slot -';

        emptySlotCol.appendChild(emptySlotDiv);
        row.appendChild(emptySlotCol);
      } else {
        rows.push(row);
      }
      break;
    }

    /* create student 2 for 2nd column in row */
    let student2 = students.pop();

    let student2Name;

    for (let key in student2) {
      let attr = key.toLowerCase();
      if (attr.includes("name")) {
        student2Name = student2[key]
        break;
      }
    }

    let col2 = document.createElement('div');
    col2.classList.add("col-6");

    let student2Div = document.createElement('div');
    student2Div.classList.add("student");
    student2Div.classList.add("swappable");
    student2Div.dataset.identifier = student2Name
    student2Div.dataset.classroom = roomName
    student2Div.textContent = `${student2Name} - `

    let span2 = document.createElement('span');
    span2.classList.add("ml-1")
    span2.classList.add("score")
    span2.textContent = student2[targetAttribute];

    student2Div.appendChild(span2)

    col2.appendChild(student2Div);
    row.appendChild(col2);
    /*  end col 2 */
    rows.push(row);
  }

  while (emptySlots > 0) {
    let row = document.createElement('div');
    row.classList.add("row");
    row.classList.add("no-gutters");
    row.classList.add("student-row");

    let emptySlotCol1 = document.createElement('div');
    emptySlotCol1.classList.add("col-6");

    let emptySlotDiv1 = document.createElement('div');

    emptySlotDiv1.classList.add("swappable");
    emptySlotDiv1.classList.add("student");
    emptySlotDiv1.classList.add("empty-seat");
    emptySlotDiv1.dataset.identifier = "empty-slot";
    emptySlotDiv1.dataset.classroom = roomName;
    emptySlotDiv1.textContent = '- empty slot -';

    emptySlotCol1.appendChild(emptySlotDiv1);
    row.appendChild(emptySlotCol1);

    emptySlots--;

    if (emptySlots == 0) {
      rows.push(row)
      break;
    }

    let emptySlotCol2 = document.createElement('div');
    emptySlotCol2.classList.add("col-6");

    let emptySlotDiv2 = document.createElement('div');

    emptySlotDiv2.classList.add("swappable");
    emptySlotDiv2.classList.add("student");
    emptySlotDiv2.classList.add("empty-seat");
    emptySlotDiv2.dataset.identifier = "empty-slot";
    emptySlotDiv2.dataset.classroom = roomName;
    emptySlotDiv2.textContent = '- empty slot -';

    emptySlotCol2.appendChild(emptySlotDiv2);
    row.appendChild(emptySlotCol2);

    emptySlots--;

    rows.push(row)
  }

  return rows;
}


document.querySelector(".classroom-modal-input-fields")
  .onsubmit = classRoomHandler;

document.querySelector(".org-classes-btn")
  .onclick = ClassroomsData.organizeStudentsByTargetAttribute

export { ClassroomsData }

/*
NOTES:

Add a ViewManager function for view update related things
Find other places to organize into encapsulated objects

Currently have hacky "attributes" situation. We have state.attributeTotals
and just genereal "attributes" array. Used interchangebly right now with
hacky conditionals... fix this up.

also should refactor the setting up of attributes to lower case everything
right from the start, so we dont have to check later in the code. 

Figure out how to setup an "order" of operations for a user to
make for better user experience, make it very clear and only
give option for creatin classrooms FIRST, THEN show import
students button
*/
