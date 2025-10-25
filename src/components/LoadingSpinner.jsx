// src/components/LoadingSpinner.jsx
function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2 text-gray-200">
      <div className="w-5 h-5 border-2 border-t-transparent border-gray-200 rounded-full animate-spin"></div>
      <p>Searching cities...</p>
    </div>
  );
}

export default LoadingSpinner;