// src/components/SearchBar.jsx
function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center bg-white rounded-full shadow-md w-full max-w-xl px-4 py-2 mb-10">
      <input
        type="text"
        placeholder="Search for a city"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow text-gray-700 bg-transparent outline-none px-2"
      />
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M9.5 17A7.5 7.5 0 109.5 2a7.5 7.5 0 000 15z" />
      </svg>
    </div>
  );
}

export default SearchBar;