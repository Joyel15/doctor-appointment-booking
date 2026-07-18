import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { specializations, popularSearches } from "../../data/specializations.js";

// Background colors per category
const categoryColors = {
  "General & Others": "bg-gray-50 hover:bg-gray-100 border-gray-200",
  "Heart & Blood": "bg-red-50 hover:bg-red-100 border-red-200",
  "Skin & Hair": "bg-pink-50 hover:bg-pink-100 border-pink-200",
  "Brain & Nerves": "bg-purple-50 hover:bg-purple-100 border-purple-200",
  "Bones & Joints": "bg-orange-50 hover:bg-orange-100 border-orange-200",
  "Women & Children": "bg-rose-50 hover:bg-rose-100 border-rose-200",
  "Eyes & ENT": "bg-cyan-50 hover:bg-cyan-100 border-cyan-200",
  "Mind & Mental Health": "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
  "Digestive System": "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
};

// Emoji icons per category
const categoryIcons = {
  "General & Others": "🩺",
  "Heart & Blood": "❤️",
  "Skin & Hair": "✨",
  "Brain & Nerves": "🧠",
  "Bones & Joints": "🦴",
  "Women & Children": "👶",
  "Eyes & ENT": "👁️",
  "Mind & Mental Health": "🧘",
  "Digestive System": "🫁",
};

const Specializations = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const query = search.toLowerCase().trim();

  // Match against specialization name OR symptom keywords
  // Also checks if query contains the keyword (fixes "skin rash" matching)
  const filteredSpecializations = specializations.filter((spec) => {
    if (!query) return true;

    const nameMatch = spec.name.toLowerCase().includes(query);

    const keywordMatch = spec.keywords.some((k) => {
      const keyword = k.toLowerCase();
      return keyword.includes(query) || query.includes(keyword);
    });

    return nameMatch || keywordMatch;
  });

  // Group filtered results by category
  const grouped = filteredSpecializations.reduce((acc, spec) => {
    if (!acc[spec.category]) acc[spec.category] = [];
    acc[spec.category].push(spec);
    return acc;
  }, {});

  const goToDoctors = (specializationName) => {
    navigate(
      `/doctors?specialization=${encodeURIComponent(specializationName)}`
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-5xl mx-auto">

      {/* Page Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
        Not Sure Who to See?
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Search your symptom or browse specializations below.
      </p>

      {/* Search bar */}
      <div className="max-w-md mx-auto mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. chest pain, skin rash, fever..."
          className="w-full border border-gray-300 bg-neutral-50 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Popular search chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {popularSearches.map((term) => (
          <button
            key={term}
            onClick={() => setSearch(term)}
            className="text-xs bg-neutral-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-neutral-100 transition"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filteredSpecializations.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          <p className="text-4xl mb-4">🔍</p>
          <p className="mb-2 font-medium">
            No specific match found for "{search}"
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Try a different symptom or see a general physician
          </p>
          <button
            onClick={() => goToDoctors("General Physician")}
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            See a General Physician
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([category, specs]) => (
            <div key={category}>

              {/* Category heading with emoji */}
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">
                  {categoryIcons[category] || "🏥"}
                </span>
                {category}
              </h2>

              {/* Specialization cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {specs.map((spec) => (
                  <button
                    key={spec.name}
                    onClick={() => goToDoctors(spec.name)}
                    className={`text-left rounded-xl border p-5 transition shadow-sm hover:shadow-md ${
                      categoryColors[category] ||
                      "bg-white hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {spec.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {spec.description}
                    </p>
                  </button>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Specializations;