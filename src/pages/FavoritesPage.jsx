// src/pages/FavoritesPage.jsx
import { Link } from "react-router-dom";

function FavoritesPage({ favorites }) {
  return (
    <div className="p-12">
      <h1 className="text-4xl font-bold mb-8">Your Favorite Cities</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-300">No favorites yet. Start exploring!</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="bg-white text-black rounded-lg overflow-hidden shadow-md">
              <img src={fav.image} alt={fav.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg">{fav.name}, {fav.country}</h3>
                <p className="text-sm text-gray-600">Population: {fav.population?.toLocaleString()}</p>
                <Link
                  to={`/book-flights/${encodeURIComponent(fav.name)}`}
                  className="block mt-3 bg-blue-600 text-white text-center p-2 rounded hover:bg-blue-700 transition"
                >
                  Book Flight
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;