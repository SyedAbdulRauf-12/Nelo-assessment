import { useState, useEffect, useMemo } from 'react'; 
import { useNavigate } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce'; 
import TaskForm from './TaskForm';
import FilterBar from './FilterBar';
import TaskItem from './TaskItem';
import SearchBar from './SearchBar';

const API_URL = 'http://localhost:5000/tasks';

function Dashboard() {
  const navigate = useNavigate();
  
  // --- Master Data State ---
  // 'tasks' hold ALL tasks that match the server filters (Status/Priority)
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Filter & Search States ---
  const [filter, setFilter] = useState('all');          // Server-side filter
  const [priorityFilter, setPriorityFilter] = useState('All'); // Server-side filter
  const [searchText, setSearchText] = useState('');     // Client-side input
  
  // 1. Debounce the input (300ms)
  const debouncedSearch = useDebounce(searchText, 300);

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  // --- 2. Fetch API Data (Server Side Filtering) ---
  // We only fetch when the broad categories (Status/Priority) change.
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter !== 'all') params.append('filter', filter);
        if (priorityFilter !== 'All') params.append('priority', priorityFilter);
        
        // We fetch the list, then search locally.
        
        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        
        const data = await response.json();
        setTasks(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Error connecting to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [filter, priorityFilter]); // <--- Only re-fetch if these change

  // --- 3. Elastic-Style Local Filtering ---
  // We derive 'displayedTasks' from 'tasks' using the debounced search term.
  // useMemo ensures we don't re-calculate this unless tasks or search changes.
  const displayedTasks = useMemo(() => {
    if (!debouncedSearch) return tasks;

    const lowerQuery = debouncedSearch.toLowerCase();

    return tasks.filter((task) => {
      // Partial substring matching & Case-insensitive
      const matchTitle = task.title.toLowerCase().includes(lowerQuery);
      const matchDesc = task.description && task.description.toLowerCase().includes(lowerQuery);
      
      return matchTitle || matchDesc;
    });
  }, [tasks, debouncedSearch]);


  // --- CRUD Operations ---
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
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
            <p className="text-gray-500 text-sm">Organize your day efficiently</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline font-semibold">Logout</button>
        </header>

        <TaskForm onAdd={addTask} />
        <div className="border-t border-gray-100 my-6"></div>
        
        {/* Search Input */}
        <SearchBar value={searchText} onChange={setSearchText} />
        
        {/* Filters */}
        <FilterBar filter={filter} setFilter={setFilter} priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter} />

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <p className="text-center text-gray-400">Loading tasks...</p>
        ) : (
          <div className="space-y-2">
            {/* RENDER THE LOCALLY FILTERED LIST */}
            {displayedTasks.length === 0 ? (
              <p className="text-center text-gray-400 italic mt-8">
                 {searchText ? "No matching tasks found." : "No tasks found."}
              </p>
            ) : (
              displayedTasks.map((task) => (
                <TaskItem
                  key={task.id} task={task}
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

export default Dashboard;