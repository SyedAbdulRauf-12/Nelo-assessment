import { useState } from 'react';

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // New state for confirmation
  const [editData, setEditData] = useState({ ...task });

  const handleSave = () => {
    onEdit(task.id, editData);
    setIsEditing(false);
  };

  const priorityColor = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
  };

  // --- EDIT MODE VIEW ---
  if (isEditing) {
    return (
      <div className="bg-white p-4 mb-3 rounded-lg shadow border border-blue-200">
        <input 
          className="block w-full mb-2 p-1 border rounded font-bold" 
          value={editData.title} 
          onChange={e => setEditData({...editData, title: e.target.value})} 
        />
        <textarea 
          className="block w-full mb-2 p-1 border rounded h-16 text-sm" 
          value={editData.description} 
          onChange={e => setEditData({...editData, description: e.target.value})} 
        />
        <div className="flex gap-2 mb-2 text-sm">
           <select 
             className="border p-1 rounded"
             value={editData.priority}
             onChange={e => setEditData({...editData, priority: e.target.value})} 
           >
             <option>High</option><option>Medium</option><option>Low</option>
           </select>
           <input 
             type="date" 
             className="border p-1 rounded"
             value={editData.dueDate}
             onChange={e => setEditData({...editData, dueDate: e.target.value})} 
           />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200">Cancel</button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Save Changes</button>
        </div>
      </div>
    );
  }

  // --- NORMAL VIEW (With Delete Confirmation) ---
  return (
    <div className={`p-4 mb-3 rounded-lg shadow-sm border transition-all duration-200 
      ${showDeleteConfirm 
        ? 'bg-red-50 border-red-300'  // Warning styles
        : (task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200')
      }
    `}>
      
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-start flex-1">
          {/* Checkbox (Hidden during confirmation to reduce clutter) */}
          {!showDeleteConfirm && (
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id, !task.completed)}
              className="mt-1.5 w-5 h-5 cursor-pointer text-blue-600 accent-blue-600"
            />
          )}
          
          <div className="flex-1">
            {showDeleteConfirm ? (
               // Confirmation Message
               <div className="py-1">
                 <p className="text-red-700 font-bold mb-1">Delete this task?</p>
                 <p className="text-red-500 text-sm">This action cannot be undone.</p>
               </div>
            ) : (
               // Standard Task Content
               <>
                 <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                   {task.title}
                 </h3>
                 <p className={`text-sm mb-2 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                   {task.description}
                 </p>
                 
                 <div className="flex gap-2 text-xs font-semibold">
                   <span className={`px-2 py-0.5 rounded ${priorityColor[task.priority] || 'bg-gray-100'}`}>
                     {task.priority}
                   </span>
                   {task.dueDate && (
                     <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                       Due: {task.dueDate}
                     </span>
                   )}
                 </div>
               </>
            )}
          </div>
        </div>

        {/* Action Buttons Column */}
        <div className="flex flex-col gap-2 ml-4 w-24">
          {showDeleteConfirm ? (
            <>
               <button 
                 onClick={() => onDelete(task.id)} 
                 className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-700 shadow-sm"
               >
                 YES, DELETE
               </button>
               <button 
                 onClick={() => setShowDeleteConfirm(false)} 
                 className="bg-white text-gray-600 border border-gray-300 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-50"
               >
                 CANCEL
               </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-gray-400 hover:text-blue-600 text-sm text-right font-medium transition"
              >
                Edit
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="text-red-300 hover:text-red-600 text-sm text-right font-medium transition"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskItem;