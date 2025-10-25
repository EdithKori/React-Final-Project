// src/components/CityGrid.jsx
import CityCard from "./CityCard";

function CityGrid({ cities, onToggleFavorite }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {cities.map((city) => (
        <CityCard key={city.name} city={city} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}

export default CityGrid;