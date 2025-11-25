function FilterBar({ filter, setFilter }) {
  // Helper class for active/inactive styles
  const getBtnStyle = (type) => 
    `px-3 py-1 rounded-full text-sm font-semibold transition ${
      filter === type 
        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
        : 'text-gray-500 hover:bg-gray-200'
    }`;

  return (
    <div className="flex justify-center gap-3 mb-4">
      <button onClick={() => setFilter('all')} className={getBtnStyle('all')}>
        All
      </button>
      <button onClick={() => setFilter('completed')} className={getBtnStyle('completed')}>
        Completed
      </button>
      <button onClick={() => setFilter('pending')} className={getBtnStyle('pending')}>
        Pending
      </button>
    </div>
  );
}

export default FilterBar;