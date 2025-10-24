import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import CityDetails from "./CityDetails";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const GEODB_API_KEY = "fa2eb75aa4msh6724d222bb40ccbp15198fjsn374de9c343aa";
  const PEXELS_API_KEY = "443Uro0KeescgFUE6urSaJ8YVjQJJlQARSJwPbDLNZTjbccRDzP4Hggd";

  const fallbackCities = [
    {
      id: "Q2643743",
      name: "Barcelona",
      country: "Spain",
      population: "5.6M",
      region: "Catalonia",
      description: "The capital of Catalonia, Spain, known for its art, architecture, and beaches.",
      image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad"
    },
    {
      id: "Q18575",
      name: "Tokyo",
      country: "Japan",
      population: "14M",
      region: "Kanto",
      description: "The capital of Japan, known for its modernity and rich cultural heritage.",
      image: "https://images.unsplash.com/photo-1549693578-d683be217e58"
    },
    {
      id: "Q60",
      name: "New York",
      country: "USA",
      population: "8.8M",
      region: "New York",
      description: "The Big Apple, iconic skyline, Times Square, Broadway, and endless energy.",
      image: "/src/assets/images/newyork.jpg"
    },
    {
      id: "Q1748",
      name: "Sydney",
      country: "Australia",
      population: "5.3M",
      region: "New South Wales",
      description: "Home to the Opera House, Harbour Bridge, and stunning beaches.",
      image: "/src/assets/images/sydney.jpg"
    }
  ];

  const fetchCityImage = async (cityName) => {
    console.log(`Fetching image for: ${cityName}`);
    if (!PEXELS_API_KEY || PEXELS_API_KEY === "YOUR_PEXELS_API_KEY") {
      console.log("No Pexels API key provided");
      return "https://via.placeholder.com/300x200?text=No+Image";
    }
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(cityName)}&per_page=1`,
        {
          headers: { Authorization: PEXELS_API_KEY }
        }
      );
      console.log(`Pexels response status for ${cityName}: ${response.status}`);
      const imageUrl = response.data.photos?.[0]?.src?.medium || "https://via.placeholder.com/300x200?text=No+Image";
      console.log(`Image URL for ${cityName}: ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      console.error(`Pexels fetch error for ${cityName}:`, error.response?.status, error.response?.data || error.message);
      return "https://via.placeholder.com/300x200?text=No+Image";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      console.log("No search query, showing fallback cities");
      setCities(fallbackCities);
      setImageLoading({});
      setLoading(false);
      return;
    }

    const fetchCities = async () => {
      setLoading(true);
      setImageLoading({});
      try {
        console.log(`Fetching cities for query: ${searchQuery}`);
        const response = await axios.get(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=8&namePrefix=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              "X-RapidAPI-Key": GEODB_API_KEY,
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
            }
          }
        );
        console.log("GeoDB response:", response.data);
        const apiCities = response.data.data || [];
        console.log("Parsed cities:", apiCities);

        if (apiCities.length === 0) {
          console.log("No cities found for query:", searchQuery);
          setCities([]);
          alert("No cities found. Try another search!");
          return;
        }

        const citiesWithImages = await Promise.all(
          apiCities.map(async (city) => {
            setImageLoading((prev) => ({ ...prev, [city.id || city.name]: true }));
            const image = await fetchCityImage(city.name);
            return {
              ...city,
              description: `${city.name} awaits your discovery!`,
              image
            };
          })
        );

        console.log("Cities with images:", citiesWithImages);
        setCities(citiesWithImages);
        setImageLoading((prev) => {
          const newLoading = { ...prev };
          citiesWithImages.forEach((city) => {
            newLoading[city.id || city.name] = false;
          });
          return newLoading;
        });
      } catch (error) {
        console.error("GeoDB fetch error:", error.response?.status, error.response?.data || error.message);
        setCities([]);
        alert("Failed to fetch cities. Try another search!");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchCities, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowAuth(false);
      setError("");
    } catch (error) {
      setError("Failed to log in. Check your email or password.");
      console.error("Login error:", error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setShowAuth(false);
      setError("");
    } catch (error) {
      setError("Failed to sign up. Email may be in use or password too weak.");
      console.error("Signup error:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen text-white bg-gradient-to-tr from-[#0f172a] via-[#f97316] to-[#312e81]">
            <nav className="flex justify-between items-center px-12 py-6">
              <h1 className="text-2xl font-bold">CityExplorer</h1>
              <div className="flex items-center gap-8 text-gray-200">
                <Link to="/" className="hover:text-white transition">Home</Link>
                <a href="#" className="hover:text-white transition">Favorites</a>
                {user ? (
                  <button onClick={handleLogout} className="px-4 py-1 border border-gray-400 rounded-md hover:bg-white hover:text-black transition">
                    Logout
                  </button>
                ) : (
                  <button onClick={() => setShowAuth(true)} className="px-4 py-1 border border-gray-400 rounded-md hover:bg-white hover:text-black transition">
                    Login
                  </button>
                )}
              </div>
            </nav>

            {showAuth && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h2 className="text-2xl font-bold mb-4">Login</h2>
                  <form onSubmit={handleLogin}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full p-2 mb-4 border rounded text-gray-900 placeholder-gray-500"
                      required
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full p-2 mb-4 border rounded text-gray-900 placeholder-gray-500"
                      required
                    />
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 mb-2">
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={handleSignup}
                      className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
                    >
                      Sign Up
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAuth(false)}
                      className="w-full mt-2 text-gray-600 hover:text-gray-800"
                    >
                      Close
                    </button>
                  </form>
                </div>
              </div>
            )}

            <main className="flex justify-center gap-12 px-12 mt10">
              <div className="max-w-3xl">
                <h2 className="text-5xl font-extrabold mb-3">Discover the World</h2>
                <p className="text-gray-200 mb-6">
                  Explore cities and learn interesting facts about them
                </p>

                <div className="flex items-center bg-white rounded-full shadow-md w-full max-w-xl px-4 py-2 mb-10">
                  <input
                    type="text"
                    placeholder="Search for a city"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow text-gray-700 bg-transparent outline-none px-2"
                    aria-label="Search for cities"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="gray"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M9.5 17A7.5 7.5 0 109.5 2a7.5 7.5 0 000 15z"
                    />
                  </svg>
                </div>

                {loading ? (
                  <div className="flex items-center gap-2 text-gray-200">
                    <div className="w-5 h-5 border-2 border-t-transparent border-gray-200 rounded-full animate-spin"></div>
                    <p>Searching cities...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {cities.map((city) => {
                      const isImageLoading = imageLoading[city.id || city.name];
                      return (
                        <Link
                          to={`/city/${city.id || city.name}`}
                          key={city.id || city.name}
                          className="bg-white text-black rounded-lg overflow-hidden shadow-md hover:scale-105 transition"
                        >
                          {isImageLoading ? (
                            <div className="w-full h-40 flex items-center justify-center bg-gray-200">
                              <div className="w-8 h-8 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            <img
                              src={city.image}
                              alt={`${city.name}, ${city.country}`}
                              className="w-full h-40 object-cover"
                              loading="lazy"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-bold text-lg">{city.name}, {city.country}</h3>
                            <p className="text-sm text-gray-600 mb-1">Population: {city.population?.toLocaleString() || "N/A"}</p>
                            <p className="text-sm text-gray-600 mb-1">Region: {city.region || "N/A"}</p>
                            <p className="text-sm text-gray-600">{city.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                    {cities.length === 0 && searchQuery && (
                      <p className="col-span-2 text-gray-200">No cities found. Try another search!</p>
                    )}
                  </div>
                )}
              </div>

              <aside className="bg-[#1e1b4b]/70 backdrop-blur-lg rounded-xl p-6 h-fit shadow-lg w-64 mt-[180px]">
                <h3 className="text-lg font-semibold mb-4">Trending Cities</h3>
                <ul className="space-y-2 text-gray-200 mb-8">
                  <li>Barcelona</li>
                  <li>Tokyo</li>
                  <li>New York</li>
                  <li>Sydney</li>
                  <li>Rio de Janeiro</li>
                </ul>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Sign Up</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Create an account to save your favorite cities
                  </p>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                  >
                    Sign Up
                  </button>
                </div>
              </aside>
            </main>
          </div>
        }
      />
      <Route path="/city/:id" element={<CityDetails />} />
    </Routes>
  );
}

export default App;