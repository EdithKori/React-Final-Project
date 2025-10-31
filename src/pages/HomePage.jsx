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
  toggleFavorite, onLoginClick,
  favorites
}) {
  return (
    <div className="min-h-screen">
      <main className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-12 px-4 sm:px-6 lg:px-12 mt-8 lg:mt-10">
        <div className="w-full lg:max-w-3xl flex-shrink-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 text-center lg:text-left">
            Discover the World
          </h2>
          <p className="text-gray-200 mb-6 text-center lg:text-left text-sm sm:text-base">
            Explore cities and save your favorites
          </p>

          <div className="max-w-xl mx-auto lg:mx-0">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center"><LoadingSpinner /></div>
            ) : (
              <CityGrid
                cities={cities}
                onToggleFavorite={toggleFavorite}
                favorites={favorites}
              />
            )}
          </div>
        </div>

        <div className="hidden lg:block flex-shrink-0">
          <TrendingSidebar onLoginClick={onLoginClick} />
        </div>
      </main>

      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md">
            <AuthModal
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              error={error}
              onLogin={handleLogin}
              onSignup={handleSignup}
              onClose={() => setShowAuth(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;