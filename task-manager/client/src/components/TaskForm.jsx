import { useState } from 'react';

function TaskForm({ onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium', // Default value
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate that title is not empty
    if (!formData.title.trim()) return;
    
    // Send the whole object to App.jsx
    onAdd(formData);
    
    // Reset the form
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
      <h2 className="text-lg font-bold mb-3 text-gray-700">Add New Task</h2>
      
      <div className="space-y-3">
        {/* Title Input */}
        <div>
          <input
            type="text"
            placeholder="Task Title"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        {/* Description Input */}
        <div>
          <textarea
            placeholder="Description (optional)"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="flex gap-3">
          {/* Priority Dropdown */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Priority</label>
            <select
              className="w-full p-2 border rounded bg-white"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Due Date Input */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Due Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition mt-2"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;