import { ClassroomsData } from './classroom-manager.js';
import { dragElement } from './drag.js';

function CreateViewBuilder() {
  function classroomHTMLBuilder() {
    let classes = ClassroomsData.getAllClassrooms();
    let targetAttribute = ClassroomsData.getTargetAttribute();
    let classroomsContainer = document.querySelector('.classrooms-container');

    for (let room in classes) {
      let students = classes[room].students;

      let roomContainer = createRoomContainer(room)
      classroomsContainer.appendChild(roomContainer);

      let studentHTMLrows = createStudentHTMLrows(students, room)
      studentHTMLrows.forEach(row => roomContainer.appendChild(row))

      let roomStatsContainer = createRoomStatsContainer()
      roomContainer.appendChild(roomStatsContainer);

      let statsHTMLrows = createStatsHTMLrows(classes[room], room);
      statsHTMLrows.forEach(row => roomStatsContainer.appendChild(row));
    }
    ClassroomsData.setStudentSwappable();
  }

  function createRoomStatsContainer() {
    let roomStatsContainer = document.createElement('div');
    roomStatsContainer.classList.add("classroom-stats");

    return roomStatsContainer;
  }

  function createRoomContainer(room) {
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

    dragElement(titleContainer); // make draggable handle for classroom

    return roomContainer;
  }

  function createRow(htmlClassname) {
    let row = document.createElement('div');
    row.classList.add("row");
    row.classList.add("no-gutters");
    row.classList.add(htmlClassname);

    return row;
  }

  function createP(text) {
    let attr_p = document.createElement('p');
    attr_p.textContent = text;

    return attr_p
  }

  function getStudentName(student) {
    for (let key in student) if(key.includes("name")) return student[key]
  }

  function createCol6() {
    let col = document.createElement('div');
    col.classList.add("col-6");

    return col;
  }

  function createStudentDiv(studentName, roomName) {
    let studentDiv = document.createElement('div');
    studentDiv.classList.add("student");
    studentDiv.classList.add("swappable");
    studentDiv.onmouseover = displayStudentStats;
    studentDiv.dataset.identifier = studentName;
    studentDiv.dataset.classroom = roomName;
    studentDiv.textContent = `${studentName} - `;

    return studentDiv;
  }

  function createStudentSpan(student, targetAttribute) {
    let span = document.createElement('span');
    span.classList.add("ml-1");
    span.classList.add("score");
    span.textContent = student[targetAttribute];

    return span;
  }

  function createStatSpan(attr, room) {
    let span = document.createElement('span');
    span.classList.add("ml-1");
    span.classList.add("stat-score");
    span.dataset.attribute = attr;
    span.textContent = room.attributeTotals[attr];

    return span;
  }

  function createEmptySlot(roomName) {
    let emptySlot = document.createElement('div');
    emptySlot.classList.add("swappable");
    emptySlot.classList.add("student");
    emptySlot.classList.add("empty-seat");
    emptySlot.dataset.identifier = "empty-slot";
    emptySlot.dataset.classroom = roomName;
    emptySlot.textContent = '- empty slot -';

    return emptySlot;
  }

  function createStudentHTMLrows(studentList, roomName) {
    let students = [...studentList];
    let emptySlots = ClassroomsData.getMaxCapacity() - students.length;
    let rows = [];
    let targetAttribute = ClassroomsData.getTargetAttribute();

    while (true) {
      if (students.length == 0) break;

      let row = createRow("student-row");

      let student1 = students.pop();
      let student1Name = getStudentName(student1)

      let col1 = createCol6();
      let student1Div = createStudentDiv(student1Name, roomName)
      let span1 = createStudentSpan(student1, targetAttribute)

      student1Div.appendChild(span1);
      col1.appendChild(student1Div);
      row.appendChild(col1);

      if (students.length == 0) {
        /* create empty slot here */
        if(emptySlots >= 1) {
          emptySlots--;

          let emptySlotCol = createCol6();
          let emptySlotDiv = createEmptySlot(roomName);

          emptySlotCol.appendChild(emptySlotDiv);
          row.appendChild(emptySlotCol);
        } else {
          rows.push(row);
        }
        break;
      }

      let student2 = students.pop();
      let student2Name = getStudentName(student2)

      let col2 = createCol6();
      let student2Div = createStudentDiv(student2Name, roomName);
      let span2 = createStudentSpan(student2, targetAttribute)

      student2Div.appendChild(span2)
      col2.appendChild(student2Div);
      row.appendChild(col2);
      rows.push(row);
    }
    // add remaining empty seat slots to classroom
    while (emptySlots > 0) {
      let row = createRow("student-row")
      let emptySlotCol1 = createCol6();
      let emptySlotDiv1 = createEmptySlot(roomName);

      emptySlotCol1.appendChild(emptySlotDiv1);
      row.appendChild(emptySlotCol1);

      emptySlots--;

      if (emptySlots == 0) {
        rows.push(row)
        break;
      }

      let emptySlotCol2 = createCol6();
      let emptySlotDiv2 = createEmptySlot(roomName);

      emptySlotCol2.appendChild(emptySlotDiv2);
      row.appendChild(emptySlotCol2);

      emptySlots--;
      rows.push(row)
    }
    return rows;
  }


  function createStatsHTMLrows(room, roomName) {
      let attributes = Object.keys(ClassroomsData.getClassroomAttributes());
      let rows = [];

      while (true) {
        if (attributes.length == 0) break;

        let row = createRow("stats");

        let attr1 = attributes.pop();
        let col1 = createCol6();

        let attr1_p = createP(attr1);
        attr1_p.dataset.classroom = roomName;
        attr1_p.dataset.active = "no";
        attr1_p.onclick = toggleHighLightRelevantStudents;
        let span1 = createStatSpan(attr1, room);

        attr1_p.appendChild(span1)
        col1.appendChild(attr1_p);
        row.appendChild(col1);

        if (attributes.length == 0) {
          rows.push(row);
          break;
        }

        let attr2 = attributes.pop();
        let col2 = createCol6();

        let attr2_p = createP(attr2);
        attr2_p.dataset.classroom = roomName;
        attr2_p.dataset.active = "no";
        attr2_p.onclick = toggleHighLightRelevantStudents;
        let span2 = createStatSpan(attr2, room);

        attr2_p.appendChild(span2)
        col2.appendChild(attr2_p);
        row.appendChild(col2);

        rows.push(row);
      }
      return rows;
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

  function toggleHighLightRelevantStudents() {
    let attribute = this.firstElementChild.dataset.attribute;
    let datasetRoomName = this.dataset.classroom;

    let classroom = ClassroomsData.getClassroom(datasetRoomName);
    let students = classroom.students;
    let classroomContainer = document
      .querySelector(`[data-classroomtable="${datasetRoomName}"]`);

    let studentsHTML = classroomContainer.querySelectorAll('.student');
    let relevantStudents = new Set();
    let classroomAttributes = ClassroomsData.getClassroomAttributes();

    /* only dealing with binary types and males/female highlights */
    if (classroomAttributes[attribute] != "binary type" &&
        attribute != "males"
        && attribute != "females") {
        return;
      }

    studentsHTML.forEach(student => {
      student.style.color = "black";
      student.style.backgroundColor = '#FFDC00';
      student.style.border = "1px solid black";
    });

    if (attribute == "males") {
      students.forEach(student => {
        if(student["sex"] == "m" || student["sex"] == "M") {
          relevantStudents.add(student["name"])
        }
      });
    } else if (attribute == "females") {
      students.forEach(student => {
        if (student["sex"]  == "f" || student["sex"] == "F") {
          relevantStudents.add(student["name"]);
        }
      });
    } else if (classroomAttributes[attribute] == "binary type") {
      students.forEach(student => {
        if (student[attribute] == "yes") {
          relevantStudents.add(student["name"]);
        }
      });
    } else {
      return;
    }

    studentsHTML.forEach(student => {
      let studentName = student.dataset.identifier;

      if (relevantStudents.has(studentName)) {
        student.style.color = "white";
        student.style.backgroundColor = "black";
        student.style.border = "1px solid red";
      }
    });
  }

  function removeHighlightsAfterSwap(elmnt1, elmnt2) {
    elmnt1.style.color = "red";
    elmnt1.style.backgroundColor = 'lightblue';
    elmnt1.style.border = "1px solid black";

    elmnt2.style.color = "red";;
    elmnt2.style.backgroundColor = 'lightblue';
    elmnt2.style.border = "1px solid black";
    animateCSS(elmnt1, 'flipInX')
    animateCSS(elmnt2, 'flipInX')
    
    setTimeout(function() {
      elmnt1.style.color = "black";
      elmnt1.style.backgroundColor = '#FFDC00';
      elmnt1.style.border = "1px solid black";

      elmnt2.style.color = "black";
      elmnt2.style.backgroundColor = '#FFDC00';
      elmnt2.style.border = "1px solid black";
    },1000)

  }

  function displayStudentStats() {
    let studentElmnt = this;
    let studentName = studentElmnt.dataset.identifier;
    let roomName = studentElmnt.dataset.classroom;
    let classroomObj = ClassroomsData.getClassroom(roomName);
    let studentObj = classroomObj.students.find(student => {
      return student["name"] == studentName;
    })

    showHTMLstudentData(studentElmnt, studentObj)
  }


  function showHTMLstudentData(studentElmnt, studentObj) {
    let studentData = document.querySelector('.student-data');
    removePreviousData(studentData)

    for (let attr in studentObj) {
      let text = `${attr}: ${studentObj[attr]}`
      let p = createP(text)
      studentData.appendChild(p);
    }
  }

  function removePreviousData(studentData) {
    while (studentData.firstChild) {
      studentData.removeChild(studentData.firstChild);
    }
  }

  function animateCSS(element, animationName, callback) {
    element.classList.add('animated', animationName)

    function handleAnimationEnd() {
        element.classList.remove('animated', animationName)
        element.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    element.addEventListener('animationend', handleAnimationEnd)
  }

  return {
    removeHighlightsAfterSwap,
    classroomHTMLBuilder,
    toggleHighLightRelevantStudents
  }
}

const ViewBuilder = CreateViewBuilder();

export { ViewBuilder };
