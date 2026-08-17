
const defaultTasks = [
    {
        id: 1,
        title: "Complete HTML portfolio page",
        subject: "Web Development",
        priority: "high",
        dueDate: "2026-08-18",
        completed: false
    },
    {
        id: 2,
        title: "Practice spreadsheet formulas",
        subject: "Excel",
        priority: "medium",
        dueDate: "2026-08-20",
        completed: false
    },
    {
        id: 3,
        title: "Read machine learning notes",
        subject: "Machine Learning",
        priority: "low",
        dueDate: "2026-08-22",
        completed: true
    },
    {
        id: 4,
        title: "Build a data chart",
        subject: "Data Science",
        priority: "medium",
        dueDate: "2026-08-25",
        completed: false
    }
];


const subjects = [
    {
        name: "Web Development",
        description: "HTML, CSS and JavaScript"
    },
    {
        name: "Data Science",
        description: "Data, charts and insights"
    },
    {
        name: "Excel",
        description: "Formulas and spreadsheets"
    },
    {
        name: "Machine Learning",
        description: "Models and algorithms"
    }
];



let tasks = loadTasks();

let currentFilter = "all";

let searchText = "";

let studentName =
    localStorage.getItem("studyFlowStudentName") || "Aiman Imran";

let editingTaskId = null;



const taskModal = document.getElementById("taskModal");

const taskForm = document.getElementById("taskForm");

const taskList = document.getElementById("taskList");

const dashboardTaskList =
    document.getElementById("dashboardTaskList");

const toast = document.getElementById("toast");



function loadTasks() {

    const savedTasks =
        localStorage.getItem("studyFlowTasks");

    if (savedTasks) {
        return JSON.parse(savedTasks);
    }

    localStorage.setItem(
        "studyFlowTasks",
        JSON.stringify(defaultTasks)
    );

    return [...defaultTasks];
}


function saveTasks() {

    localStorage.setItem(
        "studyFlowTasks",
        JSON.stringify(tasks)
    );
}


function getFirstName(name) {

    const firstName = name.trim().split(" ")[0];

    return firstName || "Student";
}


function getInitials(name) {

    return name
        .trim()
        .split(" ")
        .map(function (word) {
            return word[0];
        })
        .join("")
        .slice(0, 2)
        .toUpperCase();
}


function formatDate(dateString) {

    const date =
        new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}


function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}


function updateStudentName() {

    const firstName = getFirstName(studentName);

    const initials = getInitials(studentName);

    document.getElementById(
        "welcomeStudentName"
    ).textContent = firstName;

    document.getElementById(
        "sidebarStudentName"
    ).textContent = studentName;

    document.getElementById(
        "topProfileButton"
    ).textContent = initials;

    document.querySelector(
        ".small-avatar"
    ).textContent = initials;

    document.getElementById(
        "studentNameInput"
    ).value = studentName;
}


function updateStatistics() {

    const total = tasks.length;

    const completed =
        tasks.filter(function (task) {
            return task.completed;
        }).length;

    const pending = total - completed;

    const percentage =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);


    document.getElementById(
        "totalTasks"
    ).textContent = total;

    document.getElementById(
        "completedTasks"
    ).textContent = completed;

    document.getElementById(
        "pendingTasks"
    ).textContent = pending;

    document.getElementById(
        "overallProgress"
    ).textContent = `${percentage}%`;

    document.getElementById(
        "miniProgressBar"
    ).style.width = `${percentage}%`;


    document.getElementById(
        "ringProgress"
    ).textContent = `${percentage}%`;

    document.getElementById(
        "progressCompletedText"
    ).textContent = `${completed} tasks`;

    document.getElementById(
        "progressPendingText"
    ).textContent = `${pending} tasks`;


    updateProgressRing(
        "progressRing",
        percentage
    );

    document.getElementById(
        "largeRingProgress"
    ).textContent = `${percentage}%`;

    document.getElementById(
        "largeCompletedText"
    ).textContent = `${completed} tasks`;

    document.getElementById(
        "largePendingText"
    ).textContent = `${pending} tasks`;

    updateProgressRing(
        "largeProgressRing",
        percentage
    );
}


function updateProgressRing(id, percentage) {

    const ring = document.getElementById(id);

    if (!ring) {
        return;
    }

    const degrees = percentage * 3.6;

    ring.style.background =
        `conic-gradient(
            var(--primary) ${degrees}deg,
            #edf0f7 ${degrees}deg
        )`;
}


function getVisibleTasks() {

    let visibleTasks = [...tasks];


    if (currentFilter === "pending") {

        visibleTasks =
            visibleTasks.filter(function (task) {
                return !task.completed;
            });
    }


    if (currentFilter === "completed") {

        visibleTasks =
            visibleTasks.filter(function (task) {
                return task.completed;
            });
    }


    if (currentFilter === "high") {

        visibleTasks =
            visibleTasks.filter(function (task) {
                return task.priority === "high";
            });
    }


    if (searchText) {

        const search =
            searchText.toLowerCase();

        visibleTasks =
            visibleTasks.filter(function (task) {

                return (
                    task.title.toLowerCase().includes(search) ||
                    task.subject.toLowerCase().includes(search)
                );

            });
    }


    return visibleTasks;
}


function createTaskHTML(task) {

    const completedClass =
        task.completed ? "completed" : "";

    const titleClass =
        task.completed ? "completed-title" : "";


    return `
        <div class="task-item">

            <button
                class="task-check ${completedClass}"
                data-action="toggle"
                data-id="${task.id}"
                aria-label="Complete task"
            >
                ${task.completed ? "✓" : ""}
            </button>


            <div class="task-info">

                <p class="task-title ${titleClass}">
                    ${escapeHTML(task.title)}
                </p>

                <p class="task-meta">
                    ${escapeHTML(task.subject)}
                    · Due ${formatDate(task.dueDate)}
                </p>

            </div>


            <span class="priority-badge priority-${task.priority}">
                ${task.priority}
            </span>


            <div class="task-actions">

                <button
                    class="edit-task"
                    data-action="edit"
                    data-id="${task.id}"
                    aria-label="Edit task"
                >
                    ✎
                </button>

                <button
                    class="delete-task"
                    data-action="delete"
                    data-id="${task.id}"
                    aria-label="Delete task"
                >
                    ×
                </button>

            </div>

        </div>
    `;
}


function renderTaskList(element, taskArray) {

    if (!taskArray.length) {

        element.innerHTML =
            `<div class="empty-state">
                No tasks found.
             </div>`;

        return;
    }


    element.innerHTML =
        taskArray
            .map(createTaskHTML)
            .join("");
}


function renderTasks() {

    const visibleTasks =
        getVisibleTasks();

    renderTaskList(
        taskList,
        visibleTasks
    );
}


function renderDashboardTasks() {

    const recentTasks =
        [...tasks]
            .sort(function (a, b) {
                return b.id - a.id;
            })
            .slice(0, 4);

    renderTaskList(
        dashboardTaskList,
        recentTasks
    );
}


function escapeHTML(text) {

    const element =
        document.createElement("div");

    element.textContent = text;

    return element.innerHTML;
}


function getSubjectProgress(subjectName) {

    const subjectTasks =
        tasks.filter(function (task) {
            return task.subject === subjectName;
        });


    if (subjectTasks.length === 0) {
        return 0;
    }


    const completedTasks =
        subjectTasks.filter(function (task) {
            return task.completed;
        }).length;


    return Math.round(
        (completedTasks / subjectTasks.length) * 100
    );
}


function createSubjectHTML(subject) {

    const progress =
        getSubjectProgress(subject.name);


    return `
        <article class="subject-card">

            <h4>${subject.name}</h4>

            <p>${subject.description}</p>

            <div class="subject-progress-label">

                <span>Progress</span>

                <strong>${progress}%</strong>

            </div>

            <div class="subject-progress">

                <span style="width: ${progress}%"></span>

            </div>

        </article>
    `;
}


function renderSubjects() {

    const subjectHTML =
        subjects
            .map(createSubjectHTML)
            .join("");


    document.getElementById(
        "dashboardSubjectGrid"
    ).innerHTML = subjectHTML;


    document.getElementById(
        "fullSubjectGrid"
    ).innerHTML = subjectHTML;
}


function renderSubjectProgress() {

    const container =
        document.getElementById(
            "subjectProgressList"
        );


    container.innerHTML =
        subjects.map(function (subject) {

            const progress =
                getSubjectProgress(subject.name);


            return `
                <div class="subject-progress-item">

                    <h4>
                        ${subject.name}
                        <span>${progress}%</span>
                    </h4>

                    <div class="subject-progress">
                        <span
                            style="width: ${progress}%"
                        ></span>
                    </div>

                </div>
            `;

        }).join("");
}


function renderDeadlines() {

    const container =
        document.getElementById(
            "dashboardDeadlineList"
        );


    const upcomingTasks =
        tasks
            .filter(function (task) {
                return !task.completed;
            })
            .sort(function (a, b) {

                return new Date(a.dueDate) -
                    new Date(b.dueDate);

            })
            .slice(0, 4);


    if (!upcomingTasks.length) {

        container.innerHTML =
            `<div class="empty-state">
                No upcoming deadlines.
             </div>`;

        return;
    }


    container.innerHTML =
        upcomingTasks.map(function (task) {

            const date =
                new Date(`${task.dueDate}T00:00:00`);


            return `
                <div class="deadline-item">

                    <div class="deadline-date">

                        <strong>
                            ${date.getDate()}
                        </strong>

                        ${date.toLocaleDateString(
                            "en-US",
                            { month: "short" }
                        )}

                    </div>


                    <div class="deadline-info">

                        <h4>
                            ${escapeHTML(task.title)}
                        </h4>

                        <p>
                            ${escapeHTML(task.subject)}
                        </p>

                    </div>


                    <span
                        class="priority-badge
                        priority-${task.priority}"
                    >
                        ${task.priority}
                    </span>

                </div>
            `;

        }).join("");
}


function openTaskModal(task = null) {

    taskModal.classList.remove("hidden");


    if (task) {

        editingTaskId = task.id;

        document.getElementById(
            "modalTitle"
        ).textContent = "Edit task";

        document.getElementById(
            "taskTitle"
        ).value = task.title;

        document.getElementById(
            "taskSubject"
        ).value = task.subject;

        document.getElementById(
            "taskPriority"
        ).value = task.priority;

        document.getElementById(
            "taskDueDate"
        ).value = task.dueDate;

    } else {

        editingTaskId = null;

        taskForm.reset();

        document.getElementById(
            "modalTitle"
        ).textContent = "Add a new task";

    }


    document.getElementById(
        "taskTitle"
    ).focus();
}


function closeTaskModal() {

    taskModal.classList.add("hidden");

    taskForm.reset();

    editingTaskId = null;

    document.getElementById(
        "formError"
    ).textContent = "";
}


function saveTask(event) {

    event.preventDefault();


    const title =
        document.getElementById(
            "taskTitle"
        ).value.trim();


    const subject =
        document.getElementById(
            "taskSubject"
        ).value;


    const priority =
        document.getElementById(
            "taskPriority"
        ).value;


    const dueDate =
        document.getElementById(
            "taskDueDate"
        ).value;


    const formError =
        document.getElementById(
            "formError"
        );


    if (!title || !subject || !dueDate) {

        formError.textContent =
            "Please fill in all required fields.";

        return;
    }


    if (editingTaskId) {

        const task =
            tasks.find(function (item) {
                return item.id === editingTaskId;
            });


        if (task) {

            task.title = title;
            task.subject = subject;
            task.priority = priority;
            task.dueDate = dueDate;

        }

        showToast("Task updated.");

    } else {

        const newTask = {

            id: Date.now(),

            title: title,

            subject: subject,

            priority: priority,

            dueDate: dueDate,

            completed: false

        };


        tasks.unshift(newTask);

        showToast("Task added.");
    }


    saveTasks();

    renderEverything();

    closeTaskModal();
}


function handleTaskAction(event) {

    const button =
        event.target.closest("button");


    if (!button) {
        return;
    }


    const action =
        button.dataset.action;


    const taskId =
        Number(button.dataset.id);


    const task =
        tasks.find(function (item) {
            return item.id === taskId;
        });


    if (!task) {
        return;
    }


    if (action === "toggle") {

        task.completed =
            !task.completed;

        showToast(
            task.completed
                ? "Task completed."
                : "Task moved to pending."
        );
    }


    if (action === "delete") {

        tasks =
            tasks.filter(function (item) {
                return item.id !== taskId;
            });

        showToast("Task deleted.");
    }


    if (action === "edit") {

        openTaskModal(task);

        return;
    }


    saveTasks();

    renderEverything();
}


function showSection(sectionId) {

    document
        .querySelectorAll(".page-section")
        .forEach(function (section) {

            section.classList.remove(
                "active-section"
            );

        });


    const section =
        document.getElementById(sectionId);


    if (section) {

        section.classList.add(
            "active-section"
        );

    }


    document
        .querySelectorAll(".nav-link")
        .forEach(function (link) {

            link.classList.toggle(
                "active",
                link.dataset.section === sectionId
            );

        });


    document
        .getElementById("sidebar")
        .classList.remove("open");
}



function saveSettings() {

    const input =
        document.getElementById(
            "studentNameInput"
        );


    const newName =
        input.value.trim();


    if (!newName) {

        document.getElementById(
            "settingsMessage"
        ).textContent =
            "Please enter your name.";

        return;
    }


    studentName = newName;


    localStorage.setItem(
        "studyFlowStudentName",
        studentName
    );


    updateStudentName();


    document.getElementById(
        "settingsMessage"
    ).textContent =
        "Settings saved successfully.";

    showToast("Profile updated.");
}


function resetTasks() {

    const confirmed =
        confirm(
            "Reset all tasks to the sample tasks?"
        );


    if (!confirmed) {
        return;
    }


    tasks = [...defaultTasks];

    saveTasks();

    renderEverything();

    showToast("Sample tasks restored.");
}


function renderEverything() {

    updateStatistics();

    renderTasks();

    renderDashboardTasks();

    renderSubjects();

    renderSubjectProgress();

    renderDeadlines();

    updateStudentName();
}


document
    .getElementById("openTaskModalButton")
    .addEventListener(
        "click",
        function () {
            openTaskModal();
        }
    );


document
    .getElementById("tasksAddButton")
    .addEventListener(
        "click",
        function () {
            openTaskModal();
        }
    );


document
    .getElementById("closeTaskModalButton")
    .addEventListener(
        "click",
        closeTaskModal
    );


taskForm.addEventListener(
    "submit",
    saveTask
);


taskList.addEventListener(
    "click",
    handleTaskAction
);


dashboardTaskList.addEventListener(
    "click",
    handleTaskAction
);



document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        function (event) {

            searchText =
                event.target.value.trim();

            renderTasks();

        }
    );



document
    .getElementById("filterRow")
    .addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".filter-button"
                );


            if (!button) {
                return;
            }


            currentFilter =
                button.dataset.filter;


            document
                .querySelectorAll(
                    ".filter-button"
                )
                .forEach(function (item) {

                    item.classList.toggle(
                        "active",
                        item === button
                    );

                });


            renderTasks();

        }
    );



document
    .querySelectorAll(".nav-link")
    .forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                showSection(
                    link.dataset.section
                );

            }
        );

    });



document
    .getElementById("dashboardTasksButton")
    .addEventListener(
        "click",
        function () {
            showSection("tasksSection");
        }
    );


document
    .getElementById("dashboardSubjectsButton")
    .addEventListener(
        "click",
        function () {
            showSection("subjectsSection");
        }
    );



document
    .getElementById("menuButton")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("sidebar")
                .classList.toggle("open");

        }
    );



document
    .getElementById("topProfileButton")
    .addEventListener(
        "click",
        function () {
            showSection("settingsSection");
        }
    );


document
    .getElementById("sidebarProfileButton")
    .addEventListener(
        "click",
        function () {
            showSection("settingsSection");
        }
    );



document
    .getElementById("saveSettingsButton")
    .addEventListener(
        "click",
        saveSettings
    );


document
    .getElementById("resetTasksButton")
    .addEventListener(
        "click",
        resetTasks
    );


document
    .getElementById("notificationButton")
    .addEventListener(
        "click",
        function () {
            showToast("You are all caught up.");
        }
    );



document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {
            closeTaskModal();
        }

    }
);



taskModal.addEventListener(
    "click",
    function (event) {

        if (event.target === taskModal) {
            closeTaskModal();
        }

    }
);


document.getElementById(
    "currentDate"
).textContent =
    new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );


renderEverything();