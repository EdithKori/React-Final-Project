// src/components/CityCard.jsx
import { Link } from "react-router-dom";

function CityCard({ city, onToggleFavorite }) {
  return (
    <div className="bg-white text-black rounded-lg overflow-hidden shadow-md hover:scale-105 transition relative">
      <Link to={`/city/${encodeURIComponent(city.name)}`} className="block">
        <img src={city.image} alt={city.name} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h3 className="font-bold text-lg">{city.name}, {city.country}</h3>
          <p className="text-sm text-gray-600 mb-1">Population: {city.population?.toLocaleString() || "N/A"}</p>
          <p className="text-sm text-gray-600 mb-1">Region: {city.region || "N/A"}</p>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(city);
        }}
        className={`absolute top-2 right-2 p-2 rounded-full transition ${
          city.isFavorite ? "bg-yellow-400 text-black" : "bg-white/70 text-gray-700"
        } hover:scale-110`}
        aria-label={city.isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {city.isFavorite ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.89a1 1 0 00-1.176 0l-3.976 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.89c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.89a1 1 0 00-1.176 0l-3.976 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.89c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
        )}
      </button>
    </div>
  );
}

export default CityCard;