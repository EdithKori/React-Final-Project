// src/FlightBookingPage.jsx
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { AVIATIONSTACK_API_KEY } from "./firebase";

function FlightBookingPage() {
  const { cityName: encodedName } = useParams();
  const cityName = decodeURIComponent(encodedName);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get(
          `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_API_KEY}&arr_city=${encodeURIComponent(cityName)}&limit=10`
        );
        setFlights(res.data.data || []);
      } catch (err) {
        console.error("Flight error:", err);
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [cityName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#312e81] text-white p-12">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-6 px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Flights to {cityName}</h1>

        {loading ? (
          <p className="text-center">Searching flights...</p>
        ) : flights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flights.map((flight, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
                <h3 className="text-xl font-bold">{flight.flight.iata}</h3>
                <p><strong>Airline:</strong> {flight.airline.name}</p>
                <p><strong>From:</strong> {flight.departure.airport}</p>
                <p><strong>Departure:</strong> {new Date(flight.departure.scheduled).toLocaleString()}</p>
                <button className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300">No flights found.</p>
        )}
      </div>
    </div>
  );
}

export default FlightBookingPage;