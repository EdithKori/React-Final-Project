// src/components/SearchBar.jsx 
function SearchBar({ value, onChange }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-10">
      <div className="flex items-center bg-white rounded-full shadow-lg w-full px-4 sm:px-5 py-3 sm:py-3.5 transition-all duration-200 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-indigo-400">
        <input
          type="text"
          placeholder="Search for a city..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-grow text-gray-700 bg-transparent outline-none text-base sm:text-lg placeholder-gray-400 px-1 sm:px-2"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2m0 0A7.5 7.5 0 101.8 1.8a7.5 7.5 0 0013.4 13.4z" />
        </svg>
      </div>
    </div>
  );
}

export default SearchBar;