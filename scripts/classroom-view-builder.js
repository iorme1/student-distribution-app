import { ClassroomsData } from './classroom-manager.js';
import { dragElement } from './drag.js';

function CreateViewBuilder() {
  function classroomHTMLBuilder() {
    let classes = ClassroomsData.getAllClassrooms();
    let targetAttribute = ClassroomsData.getTargetAttribute();
    let classroomsContainer = document.querySelector('.classrooms-container');

    for (let room in classes) {
      let roomContainer = createRoomContainer(room)
      classroomsContainer.appendChild(roomContainer);

      let students = classes[room].students;

      let studentHTMLrows = createStudentHTMLrows(students, room)
      studentHTMLrows.forEach(row => roomContainer.appendChild(row))

      let roomStatsContainer = createRoomStatsContainer()
      roomContainer.appendChild(roomStatsContainer);

      let statsHTMLrows = createStatsHTMLrows(classes[room]);
      statsHTMLrows.forEach(row => roomStatsContainer.appendChild(row));
    }
    ClassroomsData.setStudentBlock()
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


  function createStudentHTMLrows(studentList, roomName) {
    let students = [...studentList];
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
      student1Div.onmouseover = displayStudentStats;
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
      student2Div.onmouseover = displayStudentStats;
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

  function displayStudentStats() {
    let studentElmnt = this;
    let studentName = studentElmnt.dataset.identifier;
    let roomName = studentElmnt.dataset.classroom;
    let classroomObj = ClassroomsData.getClassroom(roomName);
    let studentObj = classroomObj.students.find(student => {
      return student.Name == studentName;
    })

    showHTMLstudentData(studentElmnt, studentObj)
  }


  function showHTMLstudentData(studentElmnt, studentObj) {
    for (let attr in studentObj) {
      //
    }
  }

  return {
    classroomHTMLBuilder
  }
}

const ViewBuilder = CreateViewBuilder();

export { ViewBuilder };
