// Reusable loading spinner displayed while data is being fetched
const Spinner = () => {
  return (
    // Center the spinner horizontally and vertically
    <div className="flex items-center justify-center min-h-[200px]">

      {/* Animated circular loader */}
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>

    </div>
  );
};

export default Spinner;