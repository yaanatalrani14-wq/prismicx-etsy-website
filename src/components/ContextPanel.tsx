import { Listing } from '../types';
import { Heart, Eye, Tag } from 'lucide-react';

interface ContextPanelProps {
  listing: Listing | null;
  similarListings: Listing[];
}

export default function ContextPanel({ listing, similarListings }: ContextPanelProps) {
  if (!listing) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out">
      <div className="px-6 py-4">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-24 h-24 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.src = 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=200';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {listing.title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">by {listing.shop}</p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-medium">{listing.favorites}</span>
                <span className="text-gray-400">favs</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{listing.views}</span>
                <span className="text-gray-400">views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  {(listing.performance * 100).toFixed(0)}% performance
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {similarListings.length > 0 && (
            <div className="flex-shrink-0 w-80 border-l border-gray-200 pl-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                Similar Listings Nearby
              </h4>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {similarListings.slice(0, 3).map((similar) => (
                  <div key={similar.id} className="flex items-center gap-2 text-xs">
                    <img
                      src={similar.imageUrl}
                      alt={similar.title}
                      className="w-8 h-8 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=200';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-gray-700 font-medium">{similar.title}</p>
                      <p className="text-gray-400">
                        {(calculateSimilarity(listing, similar) * 100).toFixed(0)}% similar
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
