// src/pages/FlightBookingPage.jsx
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AVIATIONSTACK_API_KEY } from "./firebase";

function FlightBookingPage() {
  const { cityName: encodedName } = useParams();
  const cityName = decodeURIComponent(encodedName);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch(
          `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_API_KEY}&arr_city=${encodeURIComponent(cityName)}&limit=10`
        );
        const data = await res.json();
        setFlights(data.data || []);
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#312e81] text-white px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-6 px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm sm:text-base"
        >
          Back to Home
        </Link>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-6 sm:mb-8 text-center lg:text-left">
          Flights to {cityName}
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg sm:text-xl text-gray-300">Searching flights...</p>
          </div>
        ) : flights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {flights.map((flight, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-lg sm:text-xl font-bold text-indigo-300 mb-2">
                  {flight.flight.iata}
                </h3>
                <div className="space-y-1 text-sm sm:text-base">
                  <p><strong>Airline:</strong> {flight.airline.name}</p>
                  <p><strong>From:</strong> {flight.departure.airport}</p>
                  <p><strong>Departure:</strong> {new Date(flight.departure.scheduled).toLocaleString()}</p>
                </div>
                <button className="mt-4 w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm sm:text-base">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg sm:text-xl text-gray-300">No flights found.</p>
            <p className="text-sm text-gray-400 mt-2">Try another city or check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlightBookingPage;