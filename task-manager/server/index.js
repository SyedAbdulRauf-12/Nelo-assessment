const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- Tasks Data Structure ---
// using In Memory storage rahter than Database
let tasks = [
    { 
        id: 1, 
        title: "Learn React Hooks", 
        description: "Understand useState and useEffect deeply.", 
        priority: "High", 
        dueDate: "2025-10-25", 
        completed: true 
    }
];

// 1. GET /tasks : Displays all the tasks
app.get('/tasks', (req, res) => {
    const { filter } = req.query;
    let result = tasks;
    
    if (filter === 'completed') result = tasks.filter(t => t.completed);
    else if (filter === 'pending') result = tasks.filter(t => !t.completed);

    res.json(result);
});

// 2. POST /tasks : Adding new tasks
app.post('/tasks', (req, res) => {
    const { title, description, priority, dueDate } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

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

// 3. PUT /tasks/:id : Edit existing tasks
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, priority, dueDate, completed } = req.body;

    const taskIndex = tasks.findIndex(t => t.id == id);
    if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

    // Only update fields that are sent in the request
    if (title !== undefined) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (priority !== undefined) tasks[taskIndex].priority = priority;
    if (dueDate !== undefined) tasks[taskIndex].dueDate = dueDate;
    if (completed !== undefined) tasks[taskIndex].completed = completed;

    res.json(tasks[taskIndex]);
});

// 4. DELETE /tasks/:id : Delete tasks with confirmation
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id != id);
    res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});