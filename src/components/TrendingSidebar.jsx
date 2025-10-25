// src/components/TrendingSidebar.jsx
function TrendingSidebar({ onLoginClick }) {
  return (
    <aside className="bg-[#1e1b4b]/70 backdrop-blur-lg rounded-xl p-6 h-fit shadow-lg w-64 mt-[180px]">
      <h3 className="text-lg font-semibold mb-4">Trending</h3>
      <ul className="space-y-2 text-gray-200 mb-8">
        <li>Barcelona</li>
        <li>Tokyo</li>
        <li>New York</li>
        <li>Sydney</li>
      </ul>
      <button onClick={onLoginClick} className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700 w-full">
        Sign Up
      </button>
    </aside>
  );
}

export default TrendingSidebar;