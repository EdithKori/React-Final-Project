// src/CityDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const PEXELS_API_KEY = "443Uro0KeescgFUE6urSaJ8YVjQJJlQARSJwPbDLNZTjbccRDzP4Hggd";

function CityDetails({ cities }) {
  const { name: encodedName } = useParams();
  const cityName = decodeURIComponent(encodedName);
  const [city, setCity] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundCity = cities.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase()
    );

    if (foundCity) {
      setCity({
        name: foundCity.name,
        country: foundCity.country,
        population: foundCity.population?.toLocaleString() || "N/A",
        region: foundCity.region || "N/A",
      });

      const fetchImages = async () => {
        try {
          const res = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(cityName)}&per_page=6`,
            { headers: { Authorization: PEXELS_API_KEY } }
          );
          const data = await res.json();
          setImages(data.photos?.map(p => p.src.medium) || []);
        } catch {
          setImages([]);
        } finally {
          setLoading(false);
        }
      };
      fetchImages();
    } else {
      setLoading(false);
    }
  }, [cityName, cities]);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <p className="text-xl">Loading <strong>{cityName}</strong>...</p>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-400 text-xl">City not found</p>
        <Link to="/" className="mt-4 inline-block px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="p-12 relative min-h-screen">
      {/* CITY INFO */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-2">{city.name}</h1>
        <p className="text-2xl text-indigo-300 mb-1">{city.country}</p>
        <p className="text-lg text-gray-300 mb-1">
          Population: <span className="font-semibold">{city.population}</span>
        </p>
        <p className="text-lg text-gray-300">
          Region: <span className="font-semibold">{city.region}</span>
        </p>
      </div>

      {/* IMAGE GRID WITH HOVER ZOOM */}
      <div className="grid grid-cols-3 gap-4">
        {images.length > 0 ? (
          images.map((img, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg shadow-md group cursor-pointer"
            >
              <img
                src={img}
                alt={`${city.name} ${i + 1}`}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))
        ) : (
          <p className="col-span-3 text-gray-400">No images available</p>
        )}
      </div>

      {/* BACK TO HOME — BOTTOM RIGHT */}
      <div className="fixed bottom-8 right-8">
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition transform hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default CityDetails;