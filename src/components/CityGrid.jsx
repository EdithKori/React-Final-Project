// src/components/CityGrid.jsx
import CityCard from "./CityCard";

function CityGrid({ cities, onToggleFavorite, favorites = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
      {cities.map((city) => (
        <CityCard
          key={`${city.name}-${city.country}`}
          city={{
            ...city,
            isFavorite: favorites.some((f) => f.name === city.name)
          }}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

export default CityGrid;