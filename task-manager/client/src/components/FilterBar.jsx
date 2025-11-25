function FilterBar({ filter, setFilter, priorityFilter, setPriorityFilter }) {
  const getBtnStyle = (type) => 
    `px-4 py-1.5 rounded-full text-sm font-semibold transition border ${
      filter === type 
        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
    }`;

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
      {/* Status Filters */}
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={getBtnStyle('all')}>All</button>
        <button onClick={() => setFilter('pending')} className={getBtnStyle('pending')}>Pending</button>
        <button onClick={() => setFilter('completed')} className={getBtnStyle('completed')}>Done</button>
      </div>

      {/* Priority Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">Priority:</span>
        <select 
          className="p-1.5 rounded border border-gray-300 text-sm focus:ring-blue-500 bg-white"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;