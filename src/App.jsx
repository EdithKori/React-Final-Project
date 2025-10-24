// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth, db, AVIATIONSTACK_API_KEY } from "./firebase";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, where } from "firebase/firestore";
import CityDetails from "./CityDetails";
import FlightBookingPage from "./FlightBookingPage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const GEODB_API_KEY = "fa2eb75aa4msh6724d222bb40ccbp15198fjsn374de9c343aa";
  const PEXELS_API_KEY = "443Uro0KeescgFUE6urSaJ8YVjQJJlQARSJwPbDLNZTjbccRDzP4Hggd";

  const fallbackCities = [
    { name: "Barcelona", country: "Spain", population: "5.6M", region: "Catalonia", image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad", latitude: 41.3851, longitude: 2.1734 },
    { name: "Tokyo", country: "Japan", population: "14M", region: "Kanto", image: "https://images.unsplash.com/photo-1549693578-d683be217e58", latitude: 35.6762, longitude: 139.6503 },
    { name: "New York", country: "USA", population: "8.8M", region: "New York", image: "/src/assets/images/newyork.jpg", latitude: 40.7128, longitude: -74.0060 },
    { name: "Sydney", country: "Australia", population: "5.3M", region: "New South Wales", image: "/src/assets/images/sydney.jpg", latitude: -33.8688, longitude: 151.2093 }
  ];

  const fetchCityImage = async (cityName) => {
    try {
      const res = await axios.get(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(cityName)}&per_page=1`,
        { headers: { Authorization: PEXELS_API_KEY } }
      );
      return res.data.photos[0]?.src.medium || "https://via.placeholder.com/300x200?text=No+Image";
    } catch {
      return "https://via.placeholder.com/300x200?text=No+Image";
    }
  };

  // Load favorites — FIXED
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavorites(favs);
    });
    return () => unsubscribe();
  }, [user]);

  // Search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setCities(fallbackCities.map(c => ({ ...c, isFavorite: favorites.some(f => f.name === c.name) })));
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=8&namePrefix=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              "X-RapidAPI-Key": GEODB_API_KEY,
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );

        const apiCities = res.data.data || [];
        const citiesWithImages = await Promise.all(
          apiCities.map(async (c) => ({
            ...c,
            image: await fetchCityImage(c.name),
            isFavorite: favorites.some(f => f.name === c.name)
          }))
        );
        setCities(citiesWithImages);
      } catch (err) {
        console.error(err);
        setCities([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, favorites]);

  // Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowAuth(false);
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setShowAuth(false);
    } catch (err) {
      setError("Signup failed. Try a stronger password.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const toggleFavorite = async (city) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    const isFav = favorites.some(f => f.name === city.name);
    if (isFav) {
      const favDoc = favorites.find(f => f.name === city.name);
      await deleteDoc(doc(db, "favorites", favDoc.id));
    } else {
      await addDoc(collection(db, "favorites"), {
        userId: user.uid,
        name: city.name,
        country: city.country,
        image: city.image,
        population: city.population,
        region: city.region,
        latitude: city.latitude,
        longitude: city.longitude
      });
    }
  };

  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          <div className="min-h-screen text-white bg-gradient-to-tr from-[#0f172a] via-[#f97316] to-[#312e81]">
            <nav className="flex justify-between items-center px-12 py-6">
              <h1 className="text-2xl font-bold">CityExplorer</h1>
              <div className="flex items-center gap-8 text-gray-200">
                <Link to="/" className="hover:text-white transition">Home</Link>
                <Link to="/favorites" className="hover:text-white transition">
                  Favorites ({favorites.length})
                </Link>
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
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 mb-4 border rounded text-gray-900" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 mb-4 border rounded text-gray-900" required />
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 mb-2">Login</button>
                    <button type="button" onClick={handleSignup} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Sign Up</button>
                    <button type="button" onClick={() => setShowAuth(false)} className="w-full mt-2 text-gray-600">Close</button>
                  </form>
                </div>
              </div>
            )}

            <main className="flex justify-center gap-12 px-12 mt-10">
              <div className="max-w-3xl">
                <h2 className="text-5xl font-extrabold mb-3">Discover the World</h2>
                <p className="text-gray-200 mb-6">Explore cities and save your favorites</p>

                <div className="flex items-center bg-white rounded-full shadow-md w-full max-w-xl px-4 py-2 mb-10">
                  <input
                    type="text"
                    placeholder="Search for a city"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow text-gray-700 bg-transparent outline-none px-2"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M9.5 17A7.5 7.5 0 109.5 2a7.5 7.5 0 000 15z" />
                  </svg>
                </div>

                {loading ? (
                  <div className="flex items-center gap-2 text-gray-200">
                    <div className="w-5 h-5 border-2 border-t-transparent border-gray-200 rounded-full animate-spin"></div>
                    <p>Searching cities...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {cities.map((city) => (
                      <div key={city.name} className="bg-white text-black rounded-lg overflow-hidden shadow-md hover:scale-105 transition relative">
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
                            toggleFavorite(city);
                          }}
                          className={`absolute top-2 right-2 p-2 rounded-full transition ${
                            city.isFavorite ? "bg-yellow-400 text-black" : "bg-white/70 text-gray-700"
                          } hover:scale-110`}
                          aria-label={city.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          {city.isFavorite ? "Filled Star" : "Empty Star"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <aside className="bg-[#1e1b4b]/70 backdrop-blur-lg rounded-xl p-6 h-fit shadow-lg w-64 mt-[180px]">
                <h3 className="text-lg font-semibold mb-4">Trending</h3>
                <ul className="space-y-2 text-gray-200 mb-8">
                  <li>Barcelona</li>
                  <li>Tokyo</li>
                  <li>New York</li>
                  <li>Sydney</li>
                </ul>
                <button onClick={() => setShowAuth(true)} className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700 w-full">
                  Sign Up
                </button>
              </aside>
            </main>
          </div>
        }
      />

      <Route path="/city/:name" element={<CityDetails />} />

      <Route
        path="/favorites"
        element={
          <div className="min-h-screen text-white bg-gradient-to-br from-[#0f172a] to-[#312e81] p-12">
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
        }
      />

      <Route path="/book-flights/:cityName" element={<FlightBookingPage />} />
    </Routes>
  );
}

export default App;