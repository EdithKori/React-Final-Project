// src/CityDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const PEXELS_API_KEY = "443Uro0KeescgFUE6urSaJ8YVjQJJlQARSJwPbDLNZTjbccRDzP4Hggd";
const GEODB_API_KEY = "fa2eb75aa4msh6724d222bb40ccbp15198fjsn374de9c343aa";

function CityDetails() {
  const { name: encodedName } = useParams();
  const cityName = decodeURIComponent(encodedName);
  const [city, setCity] = useState(null);
  const [images, setImages] = useState([]);
  const [cityLoading, setCityLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const hasFetched = useRef(false); // PREVENT DOUBLE FETCH

  // FETCH CITY DATA — ONLY ONCE
  useEffect(() => {
    if (hasFetched.current) return; // BLOCK DOUBLE RUN
    hasFetched.current = true;

    const fetchCity = async () => {
      setCityLoading(true);
      console.log("[DEBUG] Fetching city (ONCE):", cityName);

      let found = false;

      try {
        // LAYER 1: Exact match
        const res1 = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(cityName)}&limit=1&minPopulation=1000`,
          {
            headers: {
              "X-RapidAPI-Key": GEODB_API_KEY,
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );
        const data1 = await res1.json();
        if (data1.data?.[0]) {
          const c = data1.data[0];
          setCity({
            name: c.name,
            country: c.country,
            population: c.population,
            region: c.region || "N/A"
          });
          found = true;
        }
      } catch (err) {
        console.warn("[DEBUG] Layer 1 failed:", err);
      }

      if (!found) {
        try {
          // LAYER 2: Broader search
          const res2 = await fetch(
            `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(cityName)}&limit=5`,
            {
              headers: {
                "X-RapidAPI-Key": GEODB_API_KEY,
                "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
              },
            }
          );
          const data2 = await res2.json();
          if (data2.data?.[0]) {
            const c = data2.data[0];
            setCity({
              name: c.name,
              country: c.country,
              population: c.population,
              region: c.region || "N/A"
            });
            found = true;
          }
        } catch (err) {
          console.warn("[DEBUG] Layer 2 failed:", err);
        }
      }

      // FINAL FALLBACK
      if (!found) {
        console.warn("[DEBUG] Using URL name as fallback.");
        setCity({
          name: cityName,
          country: "Unknown",
          population: "N/A",
          region: "N/A"
        });
      }

      setCityLoading(false);
    };

    fetchCity();
  }, [cityName]); // ONLY ON URL CHANGE

  // FETCH IMAGES — ONLY AFTER CITY IS SET
  useEffect(() => {
    if (!city || cityLoading) return;

    const fetchImages = async () => {
      setImageLoading(true);
      console.log("[DEBUG] Fetching images for:", city.name);

      try {
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(city.name)} ${city.country}&per_page=20&orientation=landscape`,
          { headers: { Authorization: PEXELS_API_KEY } }
        );

        if (!res.ok) throw new Error("Pexels failed");

        const data = await res.json();
        const photos = data.photos || [];

        const unique = [];
        const seen = new Set();

        for (const p of photos) {
          const url = p.src.landscape || p.src.large || p.src.medium;
          if (url && !seen.has(url) && unique.length < 6) {
            unique.push(url);
            seen.add(url);
          }
        }

        if (unique.length < 6) {
          const fallback = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(city.name)}&per_page=20`,
            { headers: { Authorization: PEXELS_API_KEY } }
          );
          const fallbackData = await fallback.json();
          for (const p of fallbackData.photos || []) {
            const url = p.src.landscape || p.src.medium;
            if (url && !seen.has(url) && unique.length < 6) {
              unique.push(url);
              seen.add(url);
            }
          }
        }

        setImages(unique);
      } catch (err) {
        console.error("[DEBUG] Image fetch failed:", err);
        setImages([]);
      } finally {
        setImageLoading(false);
      }
    };

    fetchImages();
  }, [city]); // ONLY WHEN CITY IS FULLY SET

  // LOADING
  if (cityLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#312e81] text-white flex items-center justify-center">
        <p className="text-xl">Loading <strong>{cityName}</strong>...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#312e81] text-white p-12">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-6 px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Home
        </Link>

        {/* CITY DATA — NEVER FLASHES */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">{city.name}</h1>
          <p className="text-2xl text-indigo-300 mb-1">{city.country}</p>
          <p className="text-lg text-gray-300 mb-1">
            Population: <span className="font-semibold">
              {city.population === "N/A" ? "N/A" : Number(city.population).toLocaleString()}
            </span>
          </p>
          <p className="text-lg text-gray-300">
            Region: <span className="font-semibold">{city.region}</span>
          </p>
        </div>

        {/* IMAGES */}
        {imageLoading ? (
          <p className="text-center text-gray-300">Loading images...</p>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative group overflow-hidden rounded-lg shadow-lg">
                <img
                  src={img}
                  alt={city.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300">No images found.</p>
        )}
      </div>
    </div>
  );
}

export default CityDetails;