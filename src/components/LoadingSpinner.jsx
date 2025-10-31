// src/components/LoadingSpinner.jsx 
function LoadingSpinner() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 text-gray-200 py-12">
      <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 sm:border-4 border-t-transparent border-gray-200 rounded-full animate-spin"></div>
      <p className="text-sm sm:text-base lg:text-lg font-medium">Searching cities...</p>
    </div>
  );
}

export default LoadingSpinner;