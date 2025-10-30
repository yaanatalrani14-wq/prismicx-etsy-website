import { Listing } from '../types';
import { X, Heart, Eye, Tag, TrendingUp, MapPin } from 'lucide-react';

interface DetailDrawerProps {
  listing: Listing | null;
  onClose: () => void;
  nearbyListings: Listing[];
}

export default function DetailDrawer({ listing, onClose, nearbyListings }: DetailDrawerProps) {
  if (!listing) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto animate-slide-in z-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Listing Details</h2>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-64 object-cover rounded-lg shadow-md"
            onError={(e) => {
              e.currentTarget.src = 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
          <p className="text-sm text-gray-500">by {listing.shop}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-900 uppercase tracking-wide">Favorites</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{listing.favorites}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-900 uppercase tracking-wide">Views</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{listing.views}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-medium text-amber-900 uppercase tracking-wide">Performance Score</span>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-amber-900">
              {(listing.performance * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-amber-700 mb-1">relative to niche</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-500" />
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Tags</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {listing.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-500" />
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Semantic Neighbors</h4>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Listings closest to this one in embedding space
          </p>
          <div className="space-y-3">
            {nearbyListings.slice(0, 5).map((nearby) => {
              const similarity = calculateSimilarity(listing, nearby);
              return (
                <div
                  key={nearby.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <img
                    src={nearby.imageUrl}
                    alt={nearby.title}
                    className="w-12 h-12 object-cover rounded flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=200';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate mb-1">
                      {nearby.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{nearby.shop}</span>
                      <span className="font-semibold text-amber-600">
                        {(similarity * 100).toFixed(0)}% similar
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Semantic position: ({listing.x.toFixed(3)}, {listing.y.toFixed(3)})
          </p>
        </div>
      </div>
    </div>
  );
}

function calculateSimilarity(listing1: Listing, listing2: Listing): number {
  const distance = Math.sqrt(
    Math.pow(listing1.x - listing2.x, 2) + Math.pow(listing1.y - listing2.y, 2)
  );
  return Math.max(0, 1 - distance / 2);
}
