// src/pages/FlightBookingPage.jsx → FINAL, NO ERRORS, NO TYPESCRIPT, NO ENV
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function FlightBookingPage() {
  const { cityName: encodedName } = useParams();
  const cityName = decodeURIComponent(encodedName || "City");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MOCK FLIGHTS — ALWAYS SHOW 3 REALISTIC FLIGHTS
    const mockFlights = [
      {
        flight: { iata: "AA123" },
        airline: { name: "American Airlines" },
        departure: {
          airport: "JFK - New York",
          scheduled: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2h
        },
      },
      {
        flight: { iata: "UA456" },
        airline: { name: "United Airlines" },
        departure: {
          airport: "LAX - Los Angeles",
          scheduled: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // +4h
        },
      },
      {
        flight: { iata: "DL789" },
        airline: { name: "Delta Air Lines" },
        departure: {
          airport: "ORD - Chicago",
          scheduled: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // +6h
        },
      },
    ];

    setFlights(mockFlights);
    setLoading(false);
  }, [encodedName]); // ← Only depend on encodedName

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#312e81] text-white px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-block mb-6 px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm sm:text-base"
        >
          Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-6 sm:mb-8 text-center lg:text-left">
          Flights to {cityName}
        </h1>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-400"></div>
            <p className="mt-4 text-lg text-gray-300">Searching flights...</p>
          </div>
        ) : flights.length > 0 ? (
          /* Flight Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {flights.map((flight, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
              >
                <h3 className="text-lg sm:text-xl font-bold text-indigo-300 mb-2">
                  {flight.flight?.iata || "N/A"}
                </h3>
                <div className="space-y-1 text-sm sm:text-base text-gray-200">
                  <p><strong>Airline:</strong> {flight.airline?.name || "Unknown"}</p>
                  <p><strong>From:</strong> {flight.departure?.airport || "N/A"}</p>
                  <p><strong>Departure:</strong> {flight.departure?.scheduled ? new Date(flight.departure.scheduled).toLocaleString() : "N/A"}</p>
                </div>
                <button className="mt-4 w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm sm:text-base shadow-md">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* No Flights */
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