import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskItem from './components/TaskItem';

const API_URL = 'http://localhost:5000/tasks';

function App() {
  // --- State Management ---
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // Options: 'all', 'completed', 'pending'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. Fetch Tasks (READ) ---
  // This runs when the component mounts OR when the 'filter' state changes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // We pass the filter query to the backend: ?filter=completed
        const url = filter === 'all' ? API_URL : `${API_URL}?filter=${filter}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        
        const data = await response.json();
        setTasks(data);
        setError(null);
      } catch (err) {
        setError('Error connecting to server. Is the backend running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter]);

  // --- 2. Add Task (CREATE) ---
  const addTask = async (taskData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData), // We now send the whole object
      });
      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // --- 3. Toggle Status & Edit Text (UPDATE) ---
  // We handle both updates in one function since they use the same API endpoint
  const updateTask = async (id, updates) => {
    try {
      // Optimistic UI Update: Update UI before waiting for server (makes it feel snappy)
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );

      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Error updating task:', err);
      // In a real app, you might revert the state here if the server fails
    }
  };

  // --- 4. Delete Task (DELETE) ---
  const deleteTask = async (id) => {
    try {
      // Optimistic UI Update
      setTasks((prev) => prev.filter((t) => t.id !== id));

      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
          <p className="text-gray-500 text-sm">Add, Edit or Delete Tasks</p>
        </header>

        {/* Input Form */}
        <TaskForm onAdd={addTask} />

        {/* Filter Controls */}
        <FilterBar filter={filter} setFilter={setFilter} />

        {/* Error Message */}
        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-400">Loading tasks...</p>
        ) : (
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-400 italic mt-8">No tasks found.</p>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={(id, status) => updateTask(id, { completed: status })}
                  onEdit={(id, text) => updateTask(id, { text })}
                  onDelete={deleteTask}
                />
              ))
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App;