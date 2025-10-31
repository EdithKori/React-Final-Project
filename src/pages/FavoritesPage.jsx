// src/pages/FavoritesPage.jsx
import { Link } from "react-router-dom";
import CityCard from "../components/CityCard";

function FavoritesPage({ favorites, onToggleFavorite }) {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-center lg:text-left">
          Your Favorite Cities
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 mb-6 text-base sm:text-lg">
              No favorites yet. Start exploring!
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm sm:text-base"
            >
              Explore Cities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {favorites.map((fav) => (
              <div key={fav.id} className="h-full">
                <CityCard
                  city={{
                    ...fav,
                    isFavorite: true
                  }}
                  onToggleFavorite={onToggleFavorite}
                />
                <Link
                  to={`/book-flights/${encodeURIComponent(fav.name)}`}
                  className="block mt-3 bg-blue-600 text-white text-center py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                >
                  Book Flight
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;