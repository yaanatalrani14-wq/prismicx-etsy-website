import { useEffect, useRef, useState } from 'react';
import { Listing, ColorMode } from '../types';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface EmbeddingCanvasProps {
  listings: Listing[];
  colorMode: ColorMode;
  onListingHover: (listing: Listing | null) => void;
  onListingClick: (listing: Listing | null) => void;
  highlightedListing?: Listing | null;
}

export default function EmbeddingCanvas({
  listings,
  colorMode,
  onListingHover,
  onListingClick,
  highlightedListing,
}: EmbeddingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [hoveredListing, setHoveredListing] = useState<Listing | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !dimensions.width) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width * window.devicePixelRatio;
    canvas.height = dimensions.height * window.devicePixelRatio;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const baseScale = Math.min(dimensions.width, dimensions.height) * 0.35;

    listings.forEach((listing) => {
      const screenX = centerX + listing.x * baseScale * transform.scale + transform.x;
      const screenY = centerY + listing.y * baseScale * transform.scale + transform.y;

      if (screenX < -20 || screenX > dimensions.width + 20 || screenY < -20 || screenY > dimensions.height + 20) {
        return;
      }

      const isHovered = hoveredListing?.id === listing.id;
      const isHighlighted = highlightedListing?.id === listing.id;

      let color: string;
      if (colorMode === 'performance') {
        const hue = listing.performance * 60;
        const lightness = 45 + listing.performance * 10;
        color = `hsla(${hue}, 70%, ${lightness}%, 0.8)`;
      } else if (colorMode === 'cluster') {
        const hue = (Math.abs(listing.x * 137 + listing.y * 197) % 360);
        color = `hsla(${hue}, 65%, 55%, 0.8)`;
      } else {
        const shopIndex = listing.shop.charCodeAt(0) % 360;
        color = `hsla(${shopIndex}, 60%, 50%, 0.8)`;
      }

      const baseRadius = 4 + listing.performance * 3;
      const radius = isHovered ? baseRadius * 1.5 : isHighlighted ? baseRadius * 1.8 : baseRadius;

      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);

      if (isHighlighted) {
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
      } else if (isHovered) {
        ctx.fillStyle = color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = color;
      }

      ctx.fill();
      if (isHovered || isHighlighted) {
        ctx.stroke();
      }
    });

    if (hoveredListing) {
      const screenX = centerX + hoveredListing.x * baseScale * transform.scale + transform.x;
      const screenY = centerY + hoveredListing.y * baseScale * transform.scale + transform.y;

      ctx.beginPath();
      ctx.arc(screenX, screenY, 30, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [listings, dimensions, transform, colorMode, hoveredListing, highlightedListing]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const baseScale = Math.min(dimensions.width, dimensions.height) * 0.35;

    let found: Listing | null = null;
    for (const listing of listings) {
      const screenX = centerX + listing.x * baseScale * transform.scale + transform.x;
      const screenY = centerY + listing.y * baseScale * transform.scale + transform.y;
      const radius = 4 + listing.performance * 3;
      const distance = Math.sqrt((mouseX - screenX) ** 2 + (mouseY - screenY) ** 2);

      if (distance <= radius + 5) {
        found = listing;
        break;
      }
    }

    setHoveredListing(found);
    onListingHover(found);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (hoveredListing) {
      onListingClick(hoveredListing);
    }
  };

  const handleZoom = (delta: number) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(5, prev.scale + delta)),
    }));
  };

  const handleReset = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div ref={containerRef} className="relative flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setHoveredListing(null);
          onListingHover(null);
          setIsDragging(false);
        }}
        onClick={handleClick}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      />

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => handleZoom(0.2)}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Reset View"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {!hoveredListing && listings.length > 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Zoom in to explore sub-clusters</span> • Hover to preview • Click for details
          </p>
        </div>
      )}
    </div>
  );
}
