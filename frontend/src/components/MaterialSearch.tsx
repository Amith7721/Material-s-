"use client";

import { useState } from "react";

export default function MaterialSearch() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [range, setRange] = useState({
    density: { min: "", max: "" },
    tensile: { min: "", max: "" },
    thermal: { min: "", max: "" },
    elasticity: { min: "", max: "" },
    sustainability: { min: "", max: "" },
  });
  const [applications, setApplications] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const [results, setResults] = useState<any[]>([]);

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    set((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  };

  const handleSubmit = () => {
    // Placeholder: clear results – replace with API call later
    setResults([]);
  };

  return (
    <section className="max-w-5xl mx-auto p-6 bg-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-xl">
      <h1 className="text-3xl font-bold text-center text-cyan-300 mb-6">Material Discovery</h1>
      <p className="text-center text-gray-300 mb-8">
        Find the perfect material for your needs using advanced search and filters
      </p>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 p-3 bg-gray-800/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
          placeholder="Search materials by name, properties, or applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
          onClick={handleSubmit}
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Categories */}
        <fieldset className="p-4 border border-gray-600 rounded-lg">
          <legend className="text-sm font-medium text-gray-400">Categories</legend>
          {[
            "Metals",
            "Polymers",
            "Ceramics",
            "Composites",
            "Nanomaterials",
            "Semiconductors",
          ].map((c) => (
            <label key={c} className="inline-flex items-center mr-4 mt-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-cyan-600"
                checked={category.includes(c)}
                onChange={() => toggle(setCategory, c)}
              />
              <span className="ml-2 text-gray-200">{c}</span>
            </label>
          ))}
        </fieldset>

        {/* Applications */}
        <fieldset className="p-4 border border-gray-600 rounded-lg">
          <legend className="text-sm font-medium text-gray-400">Applications</legend>
          {[
            "Aerospace",
            "Automotive",
            "Medical",
            "Electronics",
            "Energy",
            "Construction",
          ].map((app) => (
            <label key={app} className="inline-flex items-center mr-4 mt-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-cyan-600"
                checked={applications.includes(app)}
                onChange={() => toggle(setApplications, app)}
              />
              <span className="ml-2 text-gray-200">{app}</span>
            </label>
          ))}
        </fieldset>

        {/* Numeric filters */}
        <fieldset className="col-span-2 p-4 border border-gray-600 rounded-lg">
          <legend className="text-sm font-medium text-gray-400">Numeric Filters</legend>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Density */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Density (g/cm³)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="flex-1 p-2 bg-gray-800/70 rounded"
                  value={range.density.min}
                  onChange={(e) =>
                    setRange((r) => ({
                      ...r,
                      density: { ...r.density, min: e.target.value },
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="flex-1 p-2 bg-gray-800/70 rounded"
                  value={range.density.max}
                  onChange={(e) =>
                    setRange((r) => ({
                      ...r,
                      density: { ...r.density, max: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            {/* Tensile Strength */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tensile Strength (MPa)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="flex-1 p-2 bg-gray-800/70 rounded"
                  value={range.tensile.min}
                  onChange={(e) =>
                    setRange((r) => ({
                      ...r,
                      tensile: { ...r.tensile, min: e.target.value },
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="flex-1 p-2 bg-gray-800/70 rounded"
                  value={range.tensile.max}
                  onChange={(e) =>
                    setRange((r) => ({
                      ...r,
                      tensile: { ...r.tensile, max: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            {/* Thermal Conductivity */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Thermal Conductivity (W/m·K)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="flex-1 p-2 bg-gray-800/70 rounded"
                  value={range.thermal.min}
                  onChange={(e) =>
                    setRange((r) => ({
                      ...r,
                      thermal: { ...r.thermal, min: e.target.value },
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="flex-1 p-2 bg-gray-800/70 rounded"
                  value={range.thermal.max}
                  onChange={(e) =>
                    setRange((r) => ({
                      ...r,
                      thermal: { ...r.thermal, max: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            {/* Elasticity */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Elasticity (GPa)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="flex-1 p-2 bg-gray-800/70 rounded"
                  value={range.elasticity.min}
                  onChange={(e) =>
                    setRange((r) => ({
                      ...r,
                      elasticity: { ...r.elasticity, min: e.target.value },
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="flex-1 p-2 bg-gray-800/70 rounded"
                  value={range.elasticity.max}
                  onChange={(e) =>
                    setRange((r) => ({
                      ...r,
                      elasticity: { ...r.elasticity, max: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            {/* Sustainability */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sustainability (0‑100)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="flex-1 p-2 bg-gray-800/70 rounded"
                  value={range.sustainability.min}
                  onChange={(e) =>
                    setRange((r) => ({
                      ...r,
                      sustainability: { ...r.sustainability, min: e.target.value },
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="flex-1 p-2 bg-gray-800/70 rounded"
                  value={range.sustainability.max}
                  onChange={(e) =>
                    setRange((r) => ({
                      ...r,
                      sustainability: { ...r.sustainability, max: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Sort selector */}
      <div className="flex items-center gap-2 mb-6">
        <label className="text-gray-400">Sort By:</label>
        <select
          className="p-2 bg-gray-800/70 rounded text-white"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="name">Name A‑Z</option>
          <option value="density">Lowest Density</option>
          <option value="sustainability">Most Sustainable</option>
          <option value="cost">Lowest Cost</option>
        </select>
      </div>

      {/* Results area */}
      <div className="border-t border-gray-600 pt-6">
        {results.length === 0 ? (
          <p className="text-center text-gray-400">
            {search || category.length || applications.length
              ? "No materials found matching your criteria. Try adjusting your filters."
              : "0 materials found"}
          </p>
        ) : (
          <ul className="grid gap-4">
            {/* Render result cards here when data is available */}
          </ul>
        )}
      </div>
    </section>
  );
}
