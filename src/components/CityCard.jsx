// src/components/CityCard.jsx 
import { Link } from "react-router-dom";

function CityCard({ city, onToggleFavorite }) {
  const isFavorite = city.isFavorite;

  return (
    <div className="bg-white text-black rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
     
      <Link
        to={`/city/${encodeURIComponent(city.name)}`}
        className="block flex-grow"
      >
        <div className="relative overflow-hidden">
          <img
            src={city.image || "https://via.placeholder.com/300x200?text=No+Image"}
            alt={city.name}
            className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-3 sm:p-4 md:p-5">
          <h3 className="font-bold text-base sm:text-lg md:text-xl line-clamp-1">
            {city.name}, {city.country}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Population: {city.population?.toLocaleString() || "N/A"}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            Region: {city.region || "N/A"}
          </p>
        </div>
      </Link>

      {/* STAR BUTTON — ALWAYS VISIBLE */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite(city);
        }}
        className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-200 backdrop-blur-sm shadow-md z-10
          ${isFavorite
            ? "bg-yellow-400 text-black hover:bg-yellow-500"
            : "bg-white/90 text-gray-700 hover:bg-white"
          } hover:scale-110 active:scale-95`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.89a1 1 0 00-1.176 0l-3.976 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.89c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.89a1 1 0 00-1.176 0l-3.976 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.89c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
        )}
      </button>
    </div>
  );
}

export default CityCard;