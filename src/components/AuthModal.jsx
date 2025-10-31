// src/components/AuthModal.jsx
function AuthModal({ email, setEmail, password, setPassword, error, onLogin, onSignup, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 md:p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Login / Sign Up</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm sm:text-base"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm sm:text-base"
            required
          />

          {error && (
            <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 px-3 rounded-lg">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium text-sm sm:text-base">
              Login
            </button>
            <button type="button" onClick={onSignup} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-sm sm:text-base">
              Sign Up
            </button>
          </div>

          <button type="button" onClick={onClose} className="w-full text-gray-600 hover:text-gray-800 text-sm sm:text-base transition">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;