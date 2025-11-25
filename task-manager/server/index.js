const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- Database ---
//Not using any databse, hence In-Memory Databse
let tasks = [
    { 
        id: 1, 
        title: "Finish Nelo Assessment", 
        description: "Complete this Task manager webApp", 
        priority: "High", 
        dueDate: "2025-10-25", 
        completed: true 
    }
];

//Display the tasks based on filter
app.get('/tasks', (req, res) => {
    const { filter, priority, search } = req.query;
    let result = tasks;

    if (filter === 'completed') result = result.filter(t => t.completed);
    else if (filter === 'pending') result = result.filter(t => !t.completed);

    if (priority && priority !== 'All') result = result.filter(t => t.priority === priority);

    if (search) {
        const lowerSearch = search.toLowerCase();
        result = result.filter(t => 
            t.title.toLowerCase().includes(lowerSearch) || 
            (t.description && t.description.toLowerCase().includes(lowerSearch))
        );
    }
    res.json(result);
});

//Adding new tasks to task-list
app.post('/tasks', (req, res) => {
    const { title, description, priority, dueDate } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const newTask = {
        id: Date.now(),
        title,
        description: description || "",
        priority: priority || "Medium",
        dueDate: dueDate || "",
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

//Editing existing tasks
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, priority, dueDate, completed } = req.body;
    const taskIndex = tasks.findIndex(t => t.id == id);
    if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

    if (title !== undefined) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (priority !== undefined) tasks[taskIndex].priority = priority;
    if (dueDate !== undefined) tasks[taskIndex].dueDate = dueDate;
    if (completed !== undefined) tasks[taskIndex].completed = completed;

    res.json(tasks[taskIndex]);
});

//Deleting tasks
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id != id);
    res.json({ message: "Task deleted successfully" });
});

//Task mail automation
const Time = 10000; //kept for 10sec or 10,000 ms for quick update in demo

// Function to run periodically
function sendTaskReminders() {
    console.log(`\n[${new Date().toLocaleTimeString()}] ⏳ Checking for pending tasks...`);
    
    // Find pending tasks
    const pendingTasks = tasks.filter(t => !t.completed);

    if (pendingTasks.length === 0) {
        console.log("   ✅ No pending tasks. No emails sent.");
        return;
    }

    // Simulating to send emails
    console.log(`   📨 Found ${pendingTasks.length} pending tasks. Sending reminders...`);
    
    pendingTasks.forEach(task => {
        // Mock Email is logged onto server console
        console.log(`      ---------------------------------------------------`);
        console.log(`      To:      admin@nelo.com`);
        console.log(`      Subject: 🔔 Reminder: ${task.title}`);
        console.log(`      Body:    Priority: ${task.priority} | Due: ${task.dueDate || 'No Date'}`);
        console.log(`      ---------------------------------------------------`);
    });
}

// Start the timer
setInterval(sendTaskReminders, Time);
console.log("📧 Mail Automation Service Started...");


//Server start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});