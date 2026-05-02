import { useState, useRef, useEffect } from "react";
import { apiRequest } from "../../lib/api";

/**
 * LocationSearchInput
 * Debounced autocomplete input for Pakistani cities / locations.
 * Search is proxied through /api/maps/search which uses Nominatim
 * with countrycodes=pk, so results are always Pakistan-only.
 *
 * Props:
 *   label         – input label text
 *   placeholder   – input placeholder
 *   selectedName  – controlled display value (name of selected place)
 *   selected      – the full place object (truthy = green checkmark shown)
 *   onSelect      – callback(place) when a result is chosen
 *   onClear       – optional callback when user types after a selection
 *   className     – extra class on the wrapper div
 */
export default function LocationSearchInput({
  label,
  placeholder = "Search city or area in Pakistan…",
  selectedName = "",
  selected,
  onSelect,
  onClear,
  className = "",
}) {
  const [query, setQuery]       = useState(selectedName);
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const debounceRef             = useRef(null);
  const prevSelectedName        = useRef(selectedName);

  // Sync display value when parent changes the selected place
  useEffect(() => {
    if (selectedName !== prevSelectedName.current) {
      setQuery(selectedName);
      prevSelectedName.current = selectedName;
    }
  }, [selectedName]);

  function handleInput(e) {
    const value = e.target.value;
    setQuery(value);

    // If user clears or retypes, notify parent the selection was reset
    if (selected && value !== selectedName) {
      onClear?.();
    }

    clearTimeout(debounceRef.current);

    if (!value || value.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await apiRequest(
          `/maps/search?q=${encodeURIComponent(value.trim())}`
        );
        setResults(res.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 320); // 320 ms debounce – respects Nominatim 1 req/sec policy
  }

  function handleSelect(place) {
    setQuery(place.name || place.city || place.label);
    setResults([]);
    onSelect(place);
  }

  function handleBlur() {
    // Slight delay so click on result registers before blur hides list
    setTimeout(() => setResults([]), 180);
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          className={`fretron-input w-full rounded-xl border px-4 py-2.5 pr-10 text-sm text-slate-900 outline-none transition
            placeholder:text-slate-400
            focus:ring-2 focus:ring-blue-200
            dark:text-slate-100 dark:placeholder:text-slate-500
            ${
              selected
                ? "border-green-400 bg-green-50 focus:border-green-500 dark:border-green-700 dark:bg-green-950/30"
                : "border-slate-300 bg-white focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
            }`}
        />

        {/* Status icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base">
          {loading ? (
            <svg
              className="h-4 w-4 animate-spin text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : selected ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
              ✓
            </span>
          ) : (
            <span className="text-slate-400">🔍</span>
          )}
        </span>
      </div>

      {/* Dropdown results */}
      {results.length > 0 && (
        <div className="animate-dropdown absolute left-0 right-0 top-full z-[4000] mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          {results.map((item, i) => (
            <button
              key={item.place_id ?? i}
              type="button"
              onMouseDown={() => handleSelect(item)}
              className="block w-full border-b border-slate-100 px-4 py-2.5 text-left last:border-0 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none dark:border-slate-700 dark:hover:bg-slate-700 dark:focus:bg-slate-700"
            >
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.name}
              </div>
              <div className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                {item.label}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
