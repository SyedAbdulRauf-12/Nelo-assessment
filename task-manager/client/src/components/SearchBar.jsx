function SearchBar({ value, onChange }) {
  return (
    <div className="mb-4 relative">
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {/* Search Icon decoration */}
      <span className="absolute left-3 top-3.5 text-gray-400 text-lg">
        ⌕
      </span>
    </div>
  );
}

export default SearchBar;