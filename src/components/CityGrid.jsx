// src/components/CityGrid.jsx
import CityCard from "./CityCard";

function CityGrid({ cities, onToggleFavorite, favorites, favoritesLoading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {cities.map((city) => (
        <CityCard
          key={city.name}
          city={city}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          favoritesLoading={favoritesLoading}
        />
      ))}
    </div>
  );
}

export default CityGrid;