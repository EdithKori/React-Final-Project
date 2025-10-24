// src/CityDetails.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const GEODB_API_KEY = "fa2eb75aa4msh6724d222bb40ccbp15198fjsn374de9c343aa";
const PEXELS_API_KEY = "443Uro0KeescgFUE6urSaJ8YVjQJJlQARSJwPbDLNZTjbccRDzP4Hggd";

function CityDetails() {
  const { name: encodedName } = useParams();
  const cityName = decodeURIComponent(encodedName);
  const [cityData, setCityData] = useState(null);
  const [taggedImages, setTaggedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback famous cities with known landmarks
  const famousCities = {
    Tokyo: ["Tokyo Tower", "Shibuya Crossing", "Senso-ji Temple", "Akihabara", "Meiji Shrine", "Tokyo Skytree"],
    Barcelona: ["Sagrada Familia", "Park Güell", "La Rambla", "Casa Batlló", "Camp Nou", "Gothic Quarter"],
    "New York": ["Statue of Liberty", "Central Park", "Times Square", "Empire State Building", "Brooklyn Bridge", "One World Trade Center"],
    Sydney: ["Sydney Opera House", "Sydney Harbour Bridge", "Bondi Beach", "The Rocks", "Darling Harbour", "Royal Botanic Garden"],
    Paris: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Montmartre", "Arc de Triomphe", "Seine River"],
    London: ["Big Ben", "London Eye", "Tower Bridge", "Buckingham Palace", "British Museum", "Trafalgar Square"],
  };

  const fetchImage = async (query) => {
    try {
      const res = await axios.get(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
        { headers: { Authorization: PEXELS_API_KEY } }
      );
      return res.data.photos[0]?.src.medium || "https://via.placeholder.com/300?text=No+Image";
    } catch {
      return "https://via.placeholder.com/300?text=No+Image";
    }
  };

  const fetchLandmarks = async (cityName) => {
    // 1. Try known cities
    if (famousCities[cityName]) {
      return famousCities[cityName];
    }

    // 2. Fetch from Wikipedia via GeoDB + WikiData
    try {
      const geoRes = await axios.get(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(cityName)}&limit=1`,
        {
          headers: {
            "X-RapidAPI-Key": GEODB_API_KEY,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );
      const city = geoRes.data.data[0];
      if (!city?.wikiDataId) return Array(6).fill(null).map((_, i) => `${cityName} Landmark ${i + 1}`);

      const wikidataId = city.wikiDataId;
      const sparql = `
        SELECT ?item ?itemLabel WHERE {
          ?item wdt:P131* wd:${wikidataId} .
          ?item wdt:P31/wdt:P279* wd:Q839954 .
          SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
        }
        LIMIT 6
      `;

      const wikiRes = await axios.get("https://query.wikidata.org/sparql", {
        params: { query: sparql, format: "json" },
        headers: { "User-Agent": "CityExplorer/1.0" },
      });

      const results = wikiRes.data.results.bindings;
      if (results.length === 0) return Array(6).fill(null).map((_, i) => `${cityName} Landmark ${i + 1}`);

      return results.map(r => r.itemLabel.value).slice(0, 6);
    } catch (error) {
      console.error("Landmark fetch error:", error);
      return Array(6).fill(null).map((_, i) => `${cityName} Landmark ${i + 1}`);
    }
  };

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        // 1. Fetch city info
        const geoRes = await axios.get(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(cityName)}&limit=1`,
          {
            headers: {
              "X-RapidAPI-Key": GEODB_API_KEY,
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );
        const city = geoRes.data.data[0];
        if (!city) throw new Error("City not found");

        setCityData({
          name: city.name,
          country: city.country,
          region: city.region,
          population: city.population,
          latitude: city.latitude,
          longitude: city.longitude,
        });

        // 2. Fetch real landmarks
        const landmarks = await fetchLandmarks(city.name);

        // 3. Fetch images for each
        const images = await Promise.all(
          landmarks.map(async (loc) => ({
            url: await fetchImage(`${loc} ${city.name}`),
            location: loc
          }))
        );
        setTaggedImages(images);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, [cityName]);

  if (loading) return <div className="text-center p-8 text-white">Loading city & landmarks...</div>;
  if (!cityData) return <div className="text-center p-8 text-red-500">City not found.</div>;

  return (
    <div className="p-8 text-white min-h-screen bg-gradient-to-br from-[#0f172a] to-[#312e81]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-2">{cityData.name}</h1>
        <p className="text-xl mb-6">{cityData.region}, {cityData.country}</p>
        <p className="text-lg">Population: <strong>{cityData.population?.toLocaleString()}</strong></p>
        <p className="text-lg mb-8">Coordinates: {cityData.latitude}, {cityData.longitude}</p>

        <h2 className="text-3xl font-semibold mt-10 mb-6">Famous Landmarks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {taggedImages.map((item, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl shadow-lg bg-white/10 backdrop-blur">
              <img
                src={item.url}
                alt={item.location}
                className="w-full h-64 object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-lg font-bold text-white">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CityDetails;