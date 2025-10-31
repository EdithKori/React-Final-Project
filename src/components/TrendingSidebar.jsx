// src/components/TrendingSidebar.jsx 
import { Link } from "react-router-dom";

function TrendingSidebar({ onLoginClick }) {
  const trending = ["Barcelona", "Tokyo", "New York", "Sydney"];

  return (
    <aside className="w-full sm:w-64 lg:w-72 bg-[#1e1b4b]/70 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-lg mt-8 lg:mt-[180px] h-fit">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-center sm:text-left">
        Trending
      </h3>
      
      <ul className="space-y-2 text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base">
        {trending.map((city) => (
          <li key={city} className="truncate">
            <Link
              to={`/city/${encodeURIComponent(city)}`}
              className="block hover:text-indigo-300 transition"
            >
              {city}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={onLoginClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition w-full text-sm sm:text-base"
      >
        Sign Up
      </button>
    </aside>
  );
}

export default TrendingSidebar;