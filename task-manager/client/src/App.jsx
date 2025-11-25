import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskItem from './components/TaskItem';
import SearchBar from './components/SearchBar';

const API_URL = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Filtering & Search State ---
  const [filter, setFilter] = useState('all');          // Status: all, completed, pending
  const [priorityFilter, setPriorityFilter] = useState('All'); // Priority: All, High, Medium, Low
  const [searchText, setSearchText] = useState('');     // Immediate input text
  const [debouncedSearch, setDebouncedSearch] = useState(''); // Text used for API calls

  // --- 1. Debouncing Logic ---
  // Wait for the user to stop typing for 500ms before updating 'debouncedSearch'
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500); // 500ms delay

    return () => clearTimeout(timer); // Cleanup (cancel previous timer if typing continues)
  }, [searchText]);

  // --- 2. Fetch Tasks (Triggers on any filter change) ---
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // Construct Query URL
        // Example: /tasks?filter=pending&priority=High&search=meeting
        const params = new URLSearchParams();
        if (filter !== 'all') params.append('filter', filter);
        if (priorityFilter !== 'All') params.append('priority', priorityFilter);
        if (debouncedSearch) params.append('search', debouncedSearch);

        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        
        const data = await response.json();
        setTasks(data);
        setError(null);
      } catch (err) {
        setError('Error connecting to server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter, priorityFilter, debouncedSearch]); // Runs when any of these change

  // --- CRUD Operations (Same as before) ---
  const addTask = async (taskData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);
    } catch (err) { console.error(err); }
  };

  const updateTask = async (id, updates) => {
    try {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    try {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          <p className="text-gray-500 text-sm">Organize your day efficiently</p>
        </header>

        <TaskForm onAdd={addTask} />
        
        <div className="border-t border-gray-100 my-6"></div>

        {/* New Search Bar */}
        <SearchBar value={searchText} onChange={setSearchText} />

        {/* Updated Filter Bar */}
        <FilterBar 
          filter={filter} 
          setFilter={setFilter} 
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <p className="text-center text-gray-400">Loading tasks...</p>
        ) : (
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-400 italic mt-8">
                {searchText ? "No matching tasks found." : "No tasks found."}
              </p>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={(id, status) => updateTask(id, { completed: status })}
                  onEdit={(id, data) => updateTask(id, data)}
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