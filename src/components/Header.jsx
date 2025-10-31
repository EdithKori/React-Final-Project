// src/components/Header.jsx 
import { Link } from "react-router-dom";
import { useState } from "react";

function Header({ user, onLogout, favoritesCount, onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="px-4 sm:px-6 lg:px-12 py-4 sm:py-6 bg-black/20 backdrop-blur-md sticky top-0 z-40">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl sm:text-2xl font-bold hover:text-indigo-300 transition">
          CityExplorer
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link to="/" className="hover:text-indigo-300 transition font-medium">Home</Link>
          <Link to="/favorites" className="hover:text-indigo-300 transition font-medium">
            Favorites ({favoritesCount})
          </Link>
          {user ? (
            <button onClick={onLogout} className="px-4 sm:px-5 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md hover:bg-white/30 transition text-sm font-medium">
              Logout
            </button>
          ) : (
            <button onClick={onLoginClick} className="px-4 sm:px-5 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md hover:bg-white/30 transition text-sm font-medium">
              Login
            </button>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md hover:bg-white/10 transition"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 pb-4 border-t border-white/20 pt-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-indigo-300 transition font-medium text-center">Home</Link>
          <Link to="/favorites" onClick={() => setIsOpen(false)} className="hover:text-indigo-300 transition font-medium text-center">
            Favorites ({favoritesCount})
          </Link>
          {user ? (
            <button onClick={() => { onLogout(); setIsOpen(false); }} className="px-5 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md hover:bg-white/30 transition text-sm font-medium mx-auto w-fit">
              Logout
            </button>
          ) : (
            <button onClick={() => { onLoginClick(); setIsOpen(false); }} className="px-5 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md hover:bg-white/30 transition text-sm font-medium mx-auto w-fit">
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Header;