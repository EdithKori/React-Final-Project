// src/pages/HomePage.jsx
import SearchBar from "../components/SearchBar.jsx";
import CityGrid from "../components/CityGrid.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import TrendingSidebar from "../components/TrendingSidebar.jsx";
import AuthModal from "../components/AuthModal.jsx";

function HomePage({
  searchQuery, setSearchQuery,
  cities, loading,
  showAuth, setShowAuth,
  email, setEmail, password, setPassword, error,
  handleLogin, handleSignup,
  toggleFavorite, onLoginClick
}) {
  return (
    <div>
      <main className="flex justify-center gap-12 px-12 mt-10">
        <div className="max-w-3xl">
          <h2 className="text-5xl font-extrabold mb-3">Discover the World</h2>
          <p className="text-gray-200 mb-6">Explore cities and save your favorites</p>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <CityGrid cities={cities} onToggleFavorite={toggleFavorite} />
          )}
        </div>

        <TrendingSidebar onLoginClick={onLoginClick} />
      </main>

      {showAuth && (
        <AuthModal
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          error={error}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}

export default HomePage;