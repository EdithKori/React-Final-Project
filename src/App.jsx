// src/App.jsx 
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import CityDetails from "./CityDetails.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import FlightBookingPage from "./FlightBookingPage.jsx";

const GEODB_API_KEY = "fa2eb75aa4msh6724d222bb40ccbp15198fjsn374de9c343aa";
const PEXELS_API_KEY = "443Uro0KeescgFUE6urSaJ8YVjQJJlQARSJwPbDLNZTjbccRDzP4Hggd";

const fallbackCities = [
  {
    name: "Barcelona",
    country: "Spain",
    population: 5600000,
    region: "Catalonia",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad",
    latitude: 41.3851,
    longitude: 2.1734,
  },
  {
    name: "Tokyo",
    country: "Japan",
    population: 14000000,
    region: "Kanto",
    image: "https://images.unsplash.com/photo-1549693578-d683be217e58",
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    name: "New York",
    country: "USA",
    population: 8800000,
    region: "New York",
    image: "https://images.unsplash.com/photo-1566546415667-71e5245881ad?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    name: "Sydney",
    country: "Australia",
    population: 5300000,
    region: "New South Wales",
    image: "https://media.istockphoto.com/id/2193092154/photo/darling-harbor-in-sidney-in-australia-at-sunset.jpg?s=2048x2048&w=is&k=20&c=oxioGXu7i2oBXfXdAu1SanZQpkqGyBbIh0_Ux0YDFds=",
    latitude: -33.8688,
    longitude: 151.2093,
  },
];

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState(fallbackCities);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const fetchCityImage = async (cityName) => {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(cityName)}&per_page=1`,
        { headers: { Authorization: PEXELS_API_KEY } }
      );
      const data = await res.json();
      return data.photos[0]?.src.medium || "https://via.placeholder.com/300x200?text=No+Image";
    } catch {
      return "https://via.placeholder.com/300x200?text=No+Image";
    }
  };

  // Load favorites
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFavorites(favs);
    });
    return () => unsubscribe();
  }, [user]);

  // Search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setCities(
        fallbackCities.map((c) => ({
          ...c,
          isFavorite: favorites.some((f) => f.name === c.name),
        }))
      );
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=8&namePrefix=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              "X-RapidAPI-Key": GEODB_API_KEY,
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );
        const data = await res.json();
        const apiCities = data.data || [];

        const citiesWithImages = await Promise.all(
          apiCities.map(async (c) => ({
            name: c.city || c.name,
            country: c.country,
            population: c.population,
            region: c.region,
            latitude: c.latitude,
            longitude: c.longitude,
            image: await fetchCityImage(c.city || c.name),
            isFavorite: favorites.some((f) => f.name === (c.city || c.name)),
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

    const isFav = favorites.some((f) => f.name === city.name);
    if (isFav) {
      const favDoc = favorites.find((f) => f.name === city.name);
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
        longitude: city.longitude,
      });
    }
  };


  const allKnownCities = [
    ...fallbackCities,
    ...cities.filter((c) => !fallbackCities.some((f) => f.name === c.name)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0f172a] via-[#f97316] to-[#312e81] text-white">
      <Header
        user={user}
        onLogout={handleLogout}
        favoritesCount={favorites.length}
        onLoginClick={() => setShowAuth(true)}
      />

      <div className="pt-4">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                cities={cities}
                loading={loading}
                showAuth={showAuth}
                setShowAuth={setShowAuth}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                error={error}
                handleLogin={handleLogin}
                handleSignup={handleSignup}
                toggleFavorite={toggleFavorite}
                onLoginClick={() => setShowAuth(true)}
                favorites={favorites}
              />
            }
          />
          <Route
            path="/city/:name"
            element={<CityDetails cities={allKnownCities} />}
          />
         
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route path="/book-flights/:cityName" element={<FlightBookingPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;