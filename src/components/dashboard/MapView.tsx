import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { Search, X, Loader2, Crosshair } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const neonIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const myPositionIcon = new L.DivIcon({
  html: `<div style="
    width: 20px; height: 20px;
    background: hsl(45, 100%, 50%);
    border-radius: 50%;
    border: 3px solid hsl(220, 15%, 14%);
    box-shadow: 0 0 12px hsla(45,100%,50%,0.6), 0 0 24px hsla(45,100%,50%,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  className: '',
});

const vehicleIcon = new L.DivIcon({
  html: `<div style="
    width: 36px; height: 36px;
    background: hsl(45, 100%, 50%);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 12px hsla(45,100%,50%,0.6), 0 0 24px hsla(45,100%,50%,0.3);
    border: 3px solid hsl(220, 15%, 14%);
    font-size: 18px;
  ">🚚</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  className: '',
});

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

function LocationUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function FitBounds({ markers }: { markers: Array<{ lat: number; lng: number }> }) {
  const map = useMap();
  const fitted = useRef(false);
  const prevKey = useRef('');
  useEffect(() => {
    const key = markers.map(m => `${m.lat},${m.lng}`).join('|');
    if (markers.length >= 2 && key !== prevKey.current) {
      prevKey.current = key;
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
      fitted.current = true;
    }
  }, [markers, map]);
  return null;
}

interface MapViewProps {
  markers?: Array<{ lat: number; lng: number; label?: string }>;
  center?: [number, number];
  showSearch?: boolean;
  showRoute?: boolean;
  isNavigating?: boolean;
  className?: string;
  driverPosition?: [number, number] | null;
  routeCoords?: [number, number][];
  onSearchSelect?: (lat: number, lng: number, label: string) => void;
}

export default function MapView({
  markers = [],
  center = [33.5731, -7.5898],
  showSearch = true,
  showRoute = false,
  isNavigating = false,
  className = '',
  driverPosition = null,
  routeCoords = [],
  onSearchSelect,
}: MapViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchMarker, setSearchMarker] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const locateMe = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setMapCenter(coords);
      },
      () => {},
      { enableHighAccuracy: true }
    );
  };

  const searchAddress = useCallback(async (query: string) => {
    if (query.length < 3) { setSuggestions([]); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ma`
      );
      const data: SearchResult[] = await res.json();
      setSuggestions(data);
    } catch { setSuggestions([]); }
    finally { setSearching(false); }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAddress(value), 400);
  };

  const handleSelectSuggestion = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setSearchMarker({ lat, lng, label: result.display_name });
    setMapCenter([lat, lng]);
    setSearchQuery(result.display_name.split(',')[0]);
    setSuggestions([]);
    onSearchSelect?.(lat, lng, result.display_name);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setSearchMarker(null);
  };

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden ${className}`}>
      <MapContainer center={mapCenter} zoom={13} className="w-full h-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <LocationUpdater center={mapCenter} />
        {markers.length >= 2 && <FitBounds markers={markers} />}

        {showRoute && routeCoords.length >= 2 && (
          <Polyline positions={routeCoords} pathOptions={{ color: 'hsl(45, 100%, 50%)', weight: 5, opacity: 0.9 }} />
        )}
        {showRoute && routeCoords.length >= 2 && (
          <Polyline positions={routeCoords} pathOptions={{ color: 'hsl(45, 100%, 60%)', weight: 12, opacity: 0.15 }} />
        )}

        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]} icon={neonIcon}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}

        {driverPosition && (
          <Marker position={driverPosition} icon={isNavigating ? vehicleIcon : myPositionIcon}>
            <Popup>{isNavigating ? 'Position actuelle' : 'Ma position'}</Popup>
          </Marker>
        )}

        {searchMarker && (
          <Marker position={[searchMarker.lat, searchMarker.lng]} icon={blueIcon}>
            <Popup>{searchMarker.label}</Popup>
          </Marker>
        )}
      </MapContainer>

      {showSearch && (
        <div className="absolute top-4 right-4 z-[1000] w-72">
          <div className="bg-card/95 backdrop-blur-xl rounded-xl shadow-elevated border border-border neon-glow">
            <div className="flex items-center gap-2 px-4 py-2.5">
              {searching ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
              ) : (
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Rechercher une adresse..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="flex-shrink-0">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            {suggestions.length > 0 && (
              <div className="border-t border-border max-h-60 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectSuggestion(s)}
                    className="w-full text-left px-4 py-3 hover:bg-accent transition-colors text-sm text-foreground border-b border-border/50 last:border-b-0"
                  >
                    <p className="truncate">{s.display_name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showSearch && (
        <button
          onClick={locateMe}
          className="absolute top-4 left-4 z-[1000] w-10 h-10 bg-card/95 backdrop-blur-xl rounded-xl shadow-elevated border border-border flex items-center justify-center hover:bg-muted transition-colors"
          title="Ma position"
        >
          <Crosshair className="w-4 h-4 text-primary" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
