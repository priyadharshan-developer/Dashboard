// ================== STORAGE ==================
let students = JSON.parse(localStorage.getItem("studentsData")) || [
    {
        name: "Pri",
        attendance: 95,
        subjects: [
            { name: "Java", marks: 95 },
            { name: "Python", marks: 86 },
            { name: "C#", marks: 89 }
        ]
    }
];

let currentStudentIndex = 0;
let chart;

// ================== INIT ==================
window.onload = function () {
    loadDropdown();
    loadStudent(0);
};

// ================== DROPDOWN ==================
function loadDropdown() {
    let select = document.getElementById("studentSelect");
    if (!select) return;

    select.innerHTML = "";

    students.forEach((s, i) => {
        let op = document.createElement("option");
        op.value = i;
        op.textContent = s.name;
        select.appendChild(op);
    });

    select.onchange = () => loadStudent(select.value);
}

// ================== LOAD STUDENT ==================
function loadStudent(i) {
    if (!students[i]) return;

    currentStudentIndex = i;
    let s = students[i];

    // Dashboard display
    if (document.getElementById("studentName"))
        document.getElementById("studentName").innerText = s.name;

    if (document.getElementById("studentAttendance"))
        document.getElementById("studentAttendance").innerText = s.attendance + "%";

    if (document.getElementById("attendanceValue"))
        document.getElementById("attendanceValue").innerText = "Attendance: " + s.attendance + "%";

    // Average
    if (document.getElementById("studentAverage")) {
        let avg = 0;
        if (s.subjects.length > 0) {
            let total = s.subjects.reduce((a, b) => a + b.marks, 0);
            avg = (total / s.subjects.length).toFixed(2);
        }
        document.getElementById("studentAverage").innerText = avg + "%";
    }

    // Attendance bar
    if (document.getElementById("attendanceBar")) {
        document.getElementById("attendanceBar").style.width = s.attendance + "%";
    }

    renderTable();
    updateChart();
}

// ================== ADD STUDENT ==================
function addStudent() {
    let name = document.getElementById("name").value.trim();
    let att = parseInt(document.getElementById("attendance").value);

    if (!name || isNaN(att)) {
        alert("Enter valid data");
        return;
    }

    students.push({
        name,
        attendance: att,
        subjects: []
    });

    save();
    loadDropdown();
    loadStudent(students.length - 1);

    document.getElementById("name").value = "";
    document.getElementById("attendance").value = "";
}

// ================== ADD SUBJECT ==================
function addOrUpdateSubject() {
    let name = document.getElementById("subjectName").value.trim();
    let marks = parseInt(document.getElementById("subjectMarks").value);

    if (!name || isNaN(marks)) {
        alert("Enter valid subject");
        return;
    }

    students[currentStudentIndex].subjects.push({ name, marks });

    save();
    loadStudent(currentStudentIndex);

    document.getElementById("subjectName").value = "";
    document.getElementById("subjectMarks").value = "";
}

// ================== TABLE ==================
function renderTable() {
    let table = document.getElementById("table");
    if (!table) return;

    table.innerHTML = "";

    students[currentStudentIndex].subjects.forEach((s, i) => {
        table.innerHTML += `
        <tr>
            <td>${s.name}</td>
            <td>${s.marks}</td>
            <td>
                <button onclick="deleteSubject(${i})" class="text-red-400">Delete</button>
            </td>
        </tr>`;
    });
}

// ================== DELETE ==================
function deleteSubject(i) {
    students[currentStudentIndex].subjects.splice(i, 1);
    save();
    loadStudent(currentStudentIndex);
}

// ================== CHART ==================
function updateChart() {
    let ctx = document.getElementById("chart");
    if (!ctx) return;

    if (chart) chart.destroy();

    let data = students[currentStudentIndex].subjects;

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(x => x.name),
            datasets: [{
                label: "Marks",
                data: data.map(x => x.marks)
            }]
        }
    });
}

// ================== SAVE ==================
function save() {
    localStorage.setItem("studentsData", JSON.stringify(students));
}