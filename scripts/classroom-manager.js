import { StudentList } from "./parse-excel.js";
import { dragElement } from "./drag.js";
import { ViewBuilder } from "./classroom-view-builder.js"

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

    ViewBuilder.classroomHTMLBuilder();
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

document.querySelector(".classroom-modal-input-fields")
  .onsubmit = classRoomHandler;

document.querySelector(".org-classes-btn")
  .onclick = ClassroomsData.organizeStudentsByTargetAttribute

export { ClassroomsData }
