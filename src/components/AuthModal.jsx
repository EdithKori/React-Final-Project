// src/components/AuthModal.jsx
function AuthModal({ email, setEmail, password, setPassword, error, onLogin, onSignup, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={onLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 mb-4 border rounded text-gray-900" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 mb-4 border rounded text-gray-900" required />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 mb-2">Login</button>
          <button type="button" onClick={onSignup} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Sign Up</button>
          <button type="button" onClick={onClose} className="w-full mt-2 text-gray-600">Close</button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;