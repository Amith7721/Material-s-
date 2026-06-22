"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, Sliders, ChevronDown, X } from "lucide-react";
import api from "@/services/api";

interface FilterState {
  search: string;
  categories: string[];
  minDensity?: number;
  maxDensity?: number;
  minTensile?: number;
  maxTensile?: number;
  minConductivity?: number;
  maxConductivity?: number;
  minElasticity?: number;
  maxElasticity?: number;
  minSustainability?: number;
  maxSustainability?: number;
  applications?: string[];
  sortBy: string;
}

interface Material {
  _id: string;
  name: string;
  category: string;
  density?: number;
  tensileStrength?: number;
  thermalConductivity?: number;
  elasticity?: number;
  sustainabilityScore?: number;
  applications?: string[];
  advantages?: string[];
  materialImage?: string;
}

const CATEGORIES = ["Metals", "Polymers", "Ceramics", "Composites", "Nanomaterials", "Semiconductors"];
const COMMON_APPLICATIONS = ["Aerospace", "Automotive", "Medical", "Electronics", "Energy", "Construction"];

export default function MaterialDiscovery() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    sortBy: "newest",
  });

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replicaMessage, setReplicaMessage] = useState<string | null>(null);
  const [replicatingId, setReplicatingId] = useState<string | null>(null);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append("search", filters.search);
      if (filters.categories.length) params.append("category", filters.categories.join(","));
      if (filters.minDensity) params.append("minDensity", filters.minDensity.toString());
      if (filters.maxDensity) params.append("maxDensity", filters.maxDensity.toString());
      if (filters.minTensile) params.append("minTensile", filters.minTensile.toString());
      if (filters.maxTensile) params.append("maxTensile", filters.maxTensile.toString());
      if (filters.minConductivity) params.append("minConductivity", filters.minConductivity.toString());
      if (filters.maxConductivity) params.append("maxConductivity", filters.maxConductivity.toString());
      if (filters.minElasticity) params.append("minElasticity", filters.minElasticity.toString());
      if (filters.maxElasticity) params.append("maxElasticity", filters.maxElasticity.toString());
      if (filters.minSustainability) params.append("minSustainability", filters.minSustainability.toString());
      if (filters.maxSustainability) params.append("maxSustainability", filters.maxSustainability.toString());
      if (filters.applications?.length) params.append("applications", filters.applications.join(","));
      params.append("sortBy", filters.sortBy);
      params.append("page", page.toString());

      const { data } = await api.get(`/materials/search/advanced?${params}`);
      setMaterials(data.data || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error("Failed to fetch materials", err);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    setPage(1);
  };

  const handleApplicationToggle = (app: string) => {
    setFilters(prev => ({
      ...prev,
      applications: prev.applications?.includes(app)
        ? prev.applications.filter(a => a !== app)
        : [...(prev.applications || []), app]
    }));
    setPage(1);
  };

  const handleRangeChange = (field: string, value: number, type: "min" | "max") => {
    setFilters(prev => ({
      ...prev,
      [`${type}${field.charAt(0).toUpperCase() + field.slice(1)}`]: value || undefined
    }));
    setPage(1);
  };

  const replicateMaterial = async (materialId: string) => {
    try {
      setReplicaMessage(null);
      setReplicatingId(materialId);
      const response = await api.post(`/materials/${materialId}/replica`, {
        name: `Replica of ${materials.find(m => m._id === materialId)?.name || 'Material'}`
      });
      setReplicaMessage(`Replica created: ${response.data.name}`);
      setMaterials(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Replica creation failed', error);
      setReplicaMessage('Unable to create replica. Please try again.');
    } finally {
      setReplicatingId(null);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      sortBy: "newest",
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-navy-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Material Discovery</h1>
          <p className="text-white/60">Find the perfect material for your needs using advanced search and filters</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
              type="text"
              placeholder="Search materials by name, properties, or applications..."
              value={filters.search}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
          >
            <Sliders className="w-4 h-4" />
            Advanced Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
          
          {(filters.categories.length > 0 || filters.applications?.length || filters.search) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 p-6 bg-white/5 border border-white/10 rounded-xl">
            
            {/* Categories */}
            <div>
              <h3 className="text-white font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="w-4 h-4 rounded bg-white/10 border-white/30 checked:bg-cyan-500 cursor-pointer"
                    />
                    <span className="text-white/80 text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Density Range */}
            <div>
              <h3 className="text-white font-semibold mb-3">Density (g/cm³)</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minDensity || ""}
                  onChange={(e) => handleRangeChange("Density", parseFloat(e.target.value), "min")}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxDensity || ""}
                  onChange={(e) => handleRangeChange("Density", parseFloat(e.target.value), "max")}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm"
                />
              </div>
            </div>

            {/* Tensile Strength Range */}
            <div>
              <h3 className="text-white font-semibold mb-3">Tensile Strength (MPa)</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minTensile || ""}
                  onChange={(e) => handleRangeChange("Tensile", parseFloat(e.target.value), "min")}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxTensile || ""}
                  onChange={(e) => handleRangeChange("Tensile", parseFloat(e.target.value), "max")}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm"
                />
              </div>
            </div>

            {/* Thermal Conductivity Range */}
            <div>
              <h3 className="text-white font-semibold mb-3">Thermal Conductivity (W/m·K)</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minConductivity || ""}
                  onChange={(e) => handleRangeChange("Conductivity", parseFloat(e.target.value), "min")}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxConductivity || ""}
                  onChange={(e) => handleRangeChange("Conductivity", parseFloat(e.target.value), "max")}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm"
                />
              </div>
            </div>

            {/* Elasticity Range */}
            <div>
              <h3 className="text-white font-semibold mb-3">Elasticity (GPa)</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minElasticity || ""}
                  onChange={(e) => handleRangeChange("Elasticity", parseFloat(e.target.value), "min")}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxElasticity || ""}
                  onChange={(e) => handleRangeChange("Elasticity", parseFloat(e.target.value), "max")}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm"
                />
              </div>
            </div>

            {/* Sustainability Score */}
            <div>
              <h3 className="text-white font-semibold mb-3">Sustainability (0-100)</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Min"
                  value={filters.minSustainability || ""}
                  onChange={(e) => handleRangeChange("Sustainability", parseFloat(e.target.value), "min")}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Max"
                  value={filters.maxSustainability || ""}
                  onChange={(e) => handleRangeChange("Sustainability", parseFloat(e.target.value), "max")}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-sm"
                />
              </div>
            </div>

            {/* Applications */}
            <div className="md:col-span-2 lg:col-span-3">
              <h3 className="text-white font-semibold mb-3">Applications</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_APPLICATIONS.map(app => (
                  <label key={app} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.applications?.includes(app) || false}
                      onChange={() => handleApplicationToggle(app)}
                      className="w-4 h-4 rounded bg-white/10 border-white/30 checked:bg-cyan-500 cursor-pointer"
                    />
                    <span className="text-white/80 text-sm">{app}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="md:col-span-2 lg:col-span-3">
              <h3 className="text-white font-semibold mb-3">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "name", label: "Name A-Z" },
                  { value: "density", label: "Lowest Density" },
                  { value: "sustainability", label: "Most Sustainable" },
                  { value: "cost", label: "Lowest Cost" }
                ].map(sort => (
                  <button
                    key={sort.value}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: sort.value }));
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      filters.sortBy === sort.value
                        ? "bg-cyan-500 text-white"
                        : "bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          <div className="mb-4 text-white/60 text-sm">
            {materials.length} materials found
          </div>

          {replicaMessage && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm">
              {replicaMessage}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block px-4 py-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                Loading materials...
              </div>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              No materials found matching your criteria. Try adjusting your filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map(material => (
                  <div
                    key={material._id}
                    className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all"
                  >
                    {material.materialImage && (
                      <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 overflow-hidden relative">
                        <Image
                          src={material.materialImage}
                          alt={material.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white flex-1">{material.name}</h3>
                        <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded whitespace-nowrap ml-2">
                          {material.category}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mb-4 text-sm text-white/60">
                        {material.density && <p>Density: {material.density} g/cm³</p>}
                        {material.tensileStrength && <p>Strength: {material.tensileStrength} MPa</p>}
                        {material.sustainabilityScore && (
                          <p>Sustainability: {material.sustainabilityScore}/100</p>
                        )}
                      </div>

                      {material.applications && material.applications.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {material.applications.slice(0, 2).map(app => (
                            <span key={app} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
                              {app}
                            </span>
                          ))}
                          {material.applications.length > 2 && (
                            <span className="text-xs text-white/50">+{material.applications.length - 2}</span>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <a
                          href={`/materials/${material._id}`}
                          className="block w-full text-center py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors text-sm font-medium"
                        >
                          View Details
                        </a>
                        <button
                          type="button"
                          disabled={replicatingId === material._id}
                          onClick={() => replicateMaterial(material._id)}
                          className="w-full text-center py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {replicatingId === material._id ? 'Replicating…' : 'Create Replica'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white/10 text-white rounded disabled:opacity-50 hover:bg-white/20 transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded ${
                          page === p
                            ? "bg-cyan-500 text-white"
                            : "bg-white/10 text-white hover:bg-white/20"
                        } transition-colors`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white/10 text-white rounded disabled:opacity-50 hover:bg-white/20 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
