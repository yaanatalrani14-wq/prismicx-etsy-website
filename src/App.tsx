import { useState, useMemo, useEffect } from 'react';
import CommandBar from './components/CommandBar';
import EmbeddingCanvas from './components/EmbeddingCanvas';
import ContextPanel from './components/ContextPanel';
import DetailDrawer from './components/DetailDrawer';
import { generateMockListings } from './data/mockData';
import { Listing, ViewMode, ColorMode } from './types';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('Jewelry → Necklaces → Boho');
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  const [colorMode, setColorMode] = useState<ColorMode>('performance');
  const [hoveredListing, setHoveredListing] = useState<Listing | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    setListings(generateMockListings());
  }, [selectedNiche]);

  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return listings;

    const query = searchQuery.toLowerCase();
    return listings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(query) ||
        listing.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        listing.shop.toLowerCase().includes(query)
    );
  }, [listings, searchQuery]);

  const highlightedListing = useMemo(() => {
    if (!searchQuery.trim() || filteredListings.length === listings.length) return null;
    return filteredListings[0] || null;
  }, [searchQuery, filteredListings, listings.length]);

  const nearbyListings = useMemo(() => {
    const target = selectedListing || hoveredListing;
    if (!target) return [];

    return listings
      .filter((l) => l.id !== target.id)
      .map((listing) => ({
        listing,
        distance: Math.sqrt(
          Math.pow(listing.x - target.x, 2) + Math.pow(listing.y - target.y, 2)
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map((item) => item.listing);
  }, [listings, hoveredListing, selectedListing]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setColorMode('performance');
    }
  };

  const handleListingClick = (listing: Listing | null) => {
    setSelectedListing(listing);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <CommandBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedNiche={selectedNiche}
        onNicheChange={setSelectedNiche}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <EmbeddingCanvas
          listings={filteredListings}
          colorMode={colorMode}
          onListingHover={setHoveredListing}
          onListingClick={handleListingClick}
          highlightedListing={highlightedListing}
        />

        {hoveredListing && !selectedListing && (
          <ContextPanel listing={hoveredListing} similarListings={nearbyListings} />
        )}
      </div>

      <DetailDrawer
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        nearbyListings={nearbyListings}
      />

      {viewMode === 'compare' && !selectedListing && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare Mode</h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter your listing title or ID in the search bar to see how it compares to others in the semantic space.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('explore')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Back to Explore
            </button>
          </div>
        </div>
      )}

      {viewMode === 'query' && !searchQuery && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl p-6 max-w-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Natural Language Query</h3>
          <p className="text-sm text-gray-600 mb-4">
            Ask questions about the semantic space using natural language:
          </p>
          <div className="space-y-2 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 font-mono">
              "Show me listings similar to 'boho moon necklace'"
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 font-mono">
              "What's between 'minimalist' and 'vintage'?"
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 font-mono">
              "Highlight high performers near 'celestial jewelry'"
            </div>
          </div>
          <button
            onClick={() => setViewMode('explore')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Back to Explore
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
