import { StudentList } from "./parse-excel.js";
import { dragElement } from "./drag.js";
import { ViewBuilder } from "./classroom-view-builder.js"
import { alertWarning, alertSuccess } from './alerts.js';

const ClassroomsData = ClassroomsManager();

function ClassroomsManager() {
   let state = {
     classrooms: {},
     studentAttributes: [],
     classroomAttributes: {
       "males" : "number",
       "females": "number"
     },
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
    incrementClassroomAttributes(room, student)
  }

  function removeStudent(room, student) {
    room.students = room.students.filter(currentStudent => {
      return student != currentStudent;
    });
    decrementClassroomAttributes(room, student);
  }

  function decrementClassroomAttributes(room, student) {
    for (let attr in student) {
      /* special case for "sex" attribute because it requires an adjustment
      to males/females property in classroom attributeTotals*/
      if (attr == 'sex') {
        student[attr].toLowerCase() == "m" ?
        room.attributeTotals.males-- :
        room.attributeTotals.females--;
        /* if the student attribute isn't relevant to classroom attributeTotals
         then we skip the attribute  (i.e name) */
      } else if (room.attributeTotals[attr] == undefined) {
        continue;
      } else if (state.classroomAttributes[attr] == "binary type") {
        /* binary types are Yes/No fields */
        if (student[attr] == "yes") room.attributeTotals[attr]--;
      } else {
        /* all other attributes will be decreased based on this student's
         attribute value */
        room.attributeTotals[attr] -= student[attr]
      }
    }
    let targetAttribute = state.targetAttribute;
    room.score -= student[targetAttribute];
  }


  function incrementClassroomAttributes(room, student) {
    for (let attr in student) {
      /* special case for "sex" attribute because it requires an adjustment
      to males/females property in classroom attributeTotals*/
      if (attr == 'sex') {
        student[attr].toLowerCase() == "m" ?
        room.attributeTotals.males++ :
        room.attributeTotals.females++;
        /* if the student attribute isn't relevant to classroom attributeTotals
         then we skip the attribute  (i.e name, etc) */
      } else if (room.attributeTotals[attr] == undefined) {
        continue;
      } else if (state.classroomAttributes[attr] == "binary type") {
          /* binary types are Yes/No fields */
          if(student[attr] == "yes") room.attributeTotals[attr]++;
      } else {
        /* all other attributes will be increased based on this student's
         attribute value */
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

  function getState() {
    return state;
  }

  function revertState() {
    state = {
      classrooms: {},
      studentAttributes: [],
      classroomAttributes: {
        "males" : "number",
        "females": "number"
      },
      targetAttribute: "",
      lastOverElement: null,
      maxCapacity: 0
    }
  }

  function setState(newState) {
    state = newState;
    // remove current classrooms if there are any and replace with saved data
    ViewBuilder.removeClassroomHTML();
    ViewBuilder.classroomHTMLBuilder();
  }

  function addClassroom(roomName) {
    let classrooms = state.classrooms;
    let room = createRoomObject();

    classrooms[roomName] = room;
  }

  function createRoomObject() {
     return {
       score: 0,
       students: [],
       attributeTotals: {males: 0, females: 0}
     }
  }

  function setTargetAttribute(attr) {
    state.targetAttribute = attr;
  }

  function getTargetAttribute() {
    return state.targetAttribute;
  }

  function getClassroomAttributes() {
     return state.classroomAttributes;
  }

  function getStudentAttributes() {
    return [...state.studentAttributes];
  }

  function setAllAttributes(students) {
    let classes = state.classrooms;
    /* sets student attributes */
    for (let key in students) {
      state.studentAttributes.push(key);
    }

    setClassroomAttributes(classes, students)
  }

  function setClassroomAttributes(classes, students) {
    let studentAttrs = getStudentAttributes();
    for (let room in classes) {
      let attributeTotals = classes[room].attributeTotals;
      /* attributeTotals are the totals per classroom in relevant attributes
       and the classroomAttributes set below/after this are more of a key
       to check the "type" of the attribute itself.
      */
      for (let attr in studentAttrs) {
        let attribute = studentAttrs[attr];
        /* already added males/females properties for attributeTotals,
        so we don't need to use "sex" attribute directly here. and name
        attribute for students is irrelevant to attributeTotals */
        if (attribute.includes("name") || attribute.includes("sex")) continue;

        attributeTotals[attribute] = 0;
      }
    }
    /* creates classroom attribute/value types for state. used for
    instances where we only need the classroom attribute name and/or need
    to figure out the type (I.e "number" or "binary type") */
    for (let attr in students) {
      /* skip name and sex because they are not used as properties on
       classroom.AttributeTotals object */
      if (attr.includes("name") || attr.includes("sex")) continue;
      /* yes/no student attribute values mean we want set this property
       as a binary type */
      if (students[attr] == "yes" || students[attr] == "no") {
        state.classroomAttributes[attr] = "binary type";
      } else {
        state.classroomAttributes[attr] = "number";
      }
    }
  }

  /* unpacks nested obect into a simple array of student objects with lower
   cased attribute keys */
  function formatStudentList() {
    let students = []
    // StudentList.data contains student objects
    for (let key in StudentList.data) {
      let student = StudentList.data[key];
      let studentWithLowerCaseKey = {};
      /* lowercase all student attribute keys */
      for (let attr in student) {
        let newKey = attr.toLowerCase();
        studentWithLowerCaseKey[newKey] = student[attr];
      }
      students.push(studentWithLowerCaseKey)
    }

    return students;
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

  function noMatchingAttribute(targetAttribute) {
    let studentAttrs = state.studentAttributes;

    return studentAttrs.indexOf(targetAttribute) === -1
  }

  function organizeStudentsByTargetAttribute() {
    this.style.visibility = "hidden"; // removes organize button

    let students = formatStudentList();

    setAllAttributes(students[0]);
    //check that target attribute matches any of the excel columns
    if (noMatchingAttribute(state.targetAttribute)) {
      let msg = 'It looks like your target attribute was not input properly. '+
      'Please go back to the classroom form and re enter your target ' +
      'attribute to match a column on your excel file';
      $('#file-upload').val('');
      revertState();
      alertWarning(msg);
      return;
    }

    let sortedStudents = students.sort((a,b) => {
       return b[state.targetAttribute] - a[state.targetAttribute];
    });

    for (let i = 0; i < sortedStudents.length; i+=1) {
      let targetClass = getLowestClassScore();
      let student = sortedStudents[i];

      addStudent(targetClass, student)
    }
    ViewBuilder.classroomHTMLBuilder();
  }

  function setStudentSwappable() {
    let studentSwappable = new Swappable
      .default(document.querySelectorAll('.swappable'), {
        draggable: 'div'
      });

    studentSwappable.on("drag:over:container", setLastOverElement)
    studentSwappable.on("drag:stop", handleStudentSwap)
  }

  function setLastOverElement() {
    let lastOver = document.querySelector('.draggable-container--over');
    state.lastOverElement = lastOver;
  }

  function getStudentFromClassroom(studentName, room) {
    return room.students.filter(student => {
      let foundStudent = false
      for (let attr in student) {
        if (attr.includes("name") && student[attr] == studentName) {
          foundStudent = true;
          break;
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

    ViewBuilder.removeHighlightsAfterSwap(originalElement, swappedWithElement)

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

  /* this should be in ViewBuilder class */
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
    getStudentAttributes,
    getClassroom,
    setTargetAttribute,
    getTargetAttribute,
    organizeStudentsByTargetAttribute,
    getClassroomAttributes,
    getLowestClassScore,
    setStudentSwappable,
    getMaxCapacity,
    setMaxCapacity,
    getState,
    setState
  }
}

document.querySelector(".org-classes-btn")
  .onclick = ClassroomsData.organizeStudentsByTargetAttribute;

export { ClassroomsData }
