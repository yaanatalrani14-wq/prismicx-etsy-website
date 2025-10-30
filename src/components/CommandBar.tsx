import { Search, ChevronDown } from 'lucide-react';
import { ViewMode } from '../types';

interface CommandBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedNiche: string;
  onNicheChange: (niche: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function CommandBar({
  searchQuery,
  onSearchChange,
  selectedNiche,
  onNicheChange,
  viewMode,
  onViewModeChange,
}: CommandBarProps) {
  const niches = [
    'Jewelry → Necklaces → Boho',
    'Jewelry → Necklaces',
    'Home Decor → Wall Art',
    'Accessories → Bags',
  ];

  const viewModes: { value: ViewMode; label: string }[] = [
    { value: 'explore', label: 'Explore' },
    { value: 'compare', label: 'Compare' },
    { value: 'query', label: 'Query' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shadow-sm">
      <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
          E
        </div>
        <span>Etsy Semantic Explorer</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Try "boho moon necklace" or "similar to listing #12345"'
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {viewModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onViewModeChange(mode.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === mode.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={selectedNiche}
            onChange={(e) => onNicheChange(e.target.value)}
            className="appearance-none pl-3 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {niches.map((niche) => (
              <option key={niche} value={niche}>
                {niche}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
