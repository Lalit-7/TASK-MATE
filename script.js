document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.menu-link');
    const pages = document.querySelectorAll('.page');
    
    function showPage(pageId) {
        pages.forEach(page => page.classList.add('hidden'));
        document.getElementById(pageId).classList.remove('hidden');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            const targetPage = link.id.replace('Page', '');
            showPage(targetPage);
        });
    });

    showPage('home');

    const quoteDisplay = document.getElementById('quoteDisplay');
    const quotes = [
        "Believe in yourself! Every journey begins with a single step.",
        "Stay focused and never give up on your dreams!",
        "Consistency leads to success.",
        "The only limit to your achievement is your imagination.",
        "Push through the tough times and success will follow.",
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        "The only way to achieve the impossible is to believe it is possible.", 
        "Don’t watch the clock; do what it does. Keep going.",
        "Your limitation—it's only your imagination.",
        "Push yourself, because no one else is going to do it for you.",
        "Great things never come from comfort zones.",
        "Dream it. Wish it. Do it.",
        "Success doesn’t just find you. You have to go out and get it.",
        "The harder you work for something, the greater you’ll feel when you achieve it.",
        "Dream bigger. Do bigger."
    ];
    setInterval(() => {
        const index = Math.floor(Math.random() * quotes.length);
        quoteDisplay.textContent = quotes[index];
    }, 5000);

    const startTimerButton = document.getElementById('startTimerButton');
    const timerDisplay = document.getElementById('timerDisplay');
    let overallTimerInterval;

    startTimerButton.addEventListener('click', () => {
        const timerMinutes = parseInt(document.getElementById('timerMinutes').value);
        if (isNaN(timerMinutes) || timerMinutes <= 0) {
            alert('Please enter a valid number of minutes.');
            return;
        }
        let overallTimeLeft = timerMinutes * 60;
        clearInterval(overallTimerInterval);

        overallTimerInterval = setInterval(() => {
            if (overallTimeLeft <= 0) {
                clearInterval(overallTimerInterval);
                alert('Overall timer is up!');
                timerDisplay.textContent = 'Time’s up!';
            } else {
                const minutes = Math.floor(overallTimeLeft / 60);
                const seconds = overallTimeLeft % 60;
                timerDisplay.textContent = `Time left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                overallTimeLeft--;
            }
        }, 1000);
    });

    const taskInput = document.getElementById('taskInput');
    const taskCategory = document.getElementById('taskCategory');
    const taskPriority = document.getElementById('taskPriority');
    const taskList = document.getElementById('taskList');
    const addTaskButton = document.getElementById('addTaskButton');
    const statsElements = {
        totalTasks: document.getElementById('totalTasks'),
        highPriorityTasks: document.getElementById('highPriorityTasks'),
        workTasks: document.getElementById('workTasks'),
        personalTasks: document.getElementById('personalTasks'),
        urgentTasks: document.getElementById('urgentTasks')
    };

    function updateStatistics(category, priority, increment = true) {
        const change = increment ? 1 : -1;
        statsElements.totalTasks.textContent = parseInt(statsElements.totalTasks.textContent) + change;
        if (priority === 'High') statsElements.highPriorityTasks.textContent = parseInt(statsElements.highPriorityTasks.textContent) + change;
        if (category === 'Work') statsElements.workTasks.textContent = parseInt(statsElements.workTasks.textContent) + change;
        if (category === 'Personal') statsElements.personalTasks.textContent = parseInt(statsElements.personalTasks.textContent) + change;
        if (category === 'Urgent') statsElements.urgentTasks.textContent = parseInt(statsElements.urgentTasks.textContent) + change;
    }

    addTaskButton.addEventListener('click', () => {
        const taskName = taskInput.value.trim();
        const category = taskCategory.value;
        const priority = taskPriority.value;
        if (taskName === '') {
            alert('Please enter a task!');
            return;
        }
        const taskItem = document.createElement('li');
        const taskTimerDisplay = document.createElement('span');
        taskTimerDisplay.className = 'task-timer';
        taskTimerDisplay.textContent = 'No timer set';

        taskItem.innerHTML = `
            <span><strong>${taskName}</strong> [${category}] - Priority: <em>${priority}</em></span>
            <input type="number" placeholder="Timer (min)" class="task-timer-input">
            <button class="startTaskTimerButton">Start Timer</button>
            <button class="completeTaskButton">Complete</button>
            <button class="deleteTaskButton">Delete</button>
        `;
        taskItem.appendChild(taskTimerDisplay);
        taskList.appendChild(taskItem);
        updateStatistics(category, priority, true);

        let taskTimerInterval;
        taskItem.querySelector('.startTaskTimerButton').addEventListener('click', () => {
            const timerInput = taskItem.querySelector('.task-timer-input').value;
            let timeLeft = parseInt(timerInput) * 60;
            if (isNaN(timeLeft) || timeLeft <= 0) {
                alert('Please enter a valid number of minutes.');
                return;
            }
            clearInterval(taskTimerInterval);
            taskTimerInterval = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(taskTimerInterval);
                    alert(`Time is up for task: ${taskName}`);
                    taskTimerDisplay.textContent = 'Time’s up!';
                } else {
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    taskTimerDisplay.textContent = `Time left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                    timeLeft--;
                }
            }, 1000);
        });
        taskItem.querySelector('.completeTaskButton').addEventListener('click', () => {
            taskItem.style.textDecoration = 'line-through';
            taskItem.style.opacity = '0.6';
            clearInterval(taskTimerInterval);
            taskTimerDisplay.textContent = 'Completed';
        });
        taskItem.querySelector('.deleteTaskButton').addEventListener('click', () => {
            clearInterval(taskTimerInterval);
            taskList.removeChild(taskItem);
            updateStatistics(category, priority, false);
        });
    });

    const journalEntry = document.getElementById('journalEntry');
    const journalStatus = document.getElementById('journalStatus');
    const journalDisplay = document.getElementById('journalDisplay');
    const journalEntries = [];

    document.getElementById('saveJournalButton').addEventListener('click', () => {
        const entry = journalEntry.value.trim();
        if (entry === '') {
            journalStatus.textContent = 'Please write something in the journal before saving.';
            return;
        }
        journalEntries.push(entry);
        displayJournalEntries();
        journalEntry.value = '';
        journalStatus.textContent = 'Journal entry saved!';
    });

    function displayJournalEntries() {
        journalDisplay.innerHTML = '';
        journalEntries.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'journal-entry';
            entryDiv.innerHTML = `
                <p>${entry}</p>
                <button onclick="editJournal(${index})">Edit</button>
                <button onclick="deleteJournal(${index})">Delete</button>
            `;
            journalDisplay.appendChild(entryDiv);
        });
    }

    window.editJournal = (index) => {
        const newEntry = prompt('Edit your journal entry:', journalEntries[index]);
        if (newEntry !== null && newEntry.trim() !== '') {
            journalEntries[index] = newEntry;
            displayJournalEntries();
        }
    };

    window.deleteJournal = (index) => {
        journalEntries.splice(index, 1);
        displayJournalEntries();
    };
});
