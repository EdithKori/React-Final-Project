// src/components/Header.jsx
import { Link } from "react-router-dom";

function Header({ user, onLogout, favoritesCount, onLoginClick }) {
  return (
    <nav className="px-12 py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">CityExplorer</h1>
        <div className="flex items-center gap-8">
          <Link to="/" className="hover:text-indigo-300 transition font-medium">Home</Link>
          <Link to="/favorites" className="hover:text-indigo-300 transition font-medium">
            Favorites ({favoritesCount})
          </Link>
          {user ? (
            <button
              onClick={onLogout}
              className="px-5 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md hover:bg-white/ newcom30 transition text-sm font-medium"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-5 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md hover:bg-white/30 transition text-sm font-medium"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;