import { useState, useEffect, useRef, useCallback } from 'react';

const ARRIVAL_THRESHOLD_METERS = 50;

function haversineDistance(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

async function fetchOptimizedRoute(
  start: [number, number],
  waypoints: Array<{ lat: number; lng: number }>
): Promise<{ coords: [number, number][]; order: number[]; distance: number; duration: number }> {
  if (waypoints.length === 0) return { coords: [], order: [], distance: 0, duration: 0 };

  const allPoints = [`${start[1]},${start[0]}`, ...waypoints.map(w => `${w.lng},${w.lat}`)].join(';');

  try {
    // Use trip API for optimal ordering, source=first so driver position is the start
    const res = await fetch(
      `https://router.project-osrm.org/trip/v1/driving/${allPoints}?source=first&roundtrip=false&overview=full&geometries=geojson`
    );
    const data = await res.json();
    if (data.trips && data.trips.length > 0) {
      const trip = data.trips[0];
      const coords: [number, number][] = trip.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
      // waypoint indices (skip first which is driver position)
      const order = data.waypoints
        .slice(1)
        .map((wp: any) => wp.waypoint_index - 1)
        .filter((i: number) => i >= 0);
      return {
        coords,
        order,
        distance: trip.distance,
        duration: trip.duration,
      };
    }
  } catch (e) {
    console.error('OSRM trip error:', e);
  }

  // Fallback to simple route
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${allPoints}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      return {
        coords: data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]),
        order: waypoints.map((_, i) => i),
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
      };
    }
  } catch (e) {
    console.error('OSRM route fallback error:', e);
  }

  return { coords: [], order: [], distance: 0, duration: 0 };
}

// Play a short notification sound
function playArrivalSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
    // Second beep
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 1100;
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
    osc2.start(ctx.currentTime + 0.2);
    osc2.stop(ctx.currentTime + 0.7);
  } catch {
    // Audio not available
  }
}

interface UseDriverNavigationProps {
  markers: Array<{ lat: number; lng: number; label?: string }>;
  isNavigating: boolean;
  currentAddressIndex: number;
  onArrival: (index: number, label: string) => void;
  onRouteCalculated: (distance: number, duration: number) => void;
}

export function useDriverNavigation({
  markers,
  isNavigating,
  currentAddressIndex,
  onArrival,
  onRouteCalculated,
}: UseDriverNavigationProps) {
  const [driverPosition, setDriverPosition] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const watchIdRef = useRef<number | null>(null);
  const arrivedSetRef = useRef<Set<number>>(new Set());
  const routeCalcRef = useRef<string>('');

  // Get initial position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setDriverPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {
        // Fallback to Casablanca center
        setDriverPosition([33.5731, -7.5898]);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // Watch position when navigating
  useEffect(() => {
    if (isNavigating) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        pos => {
          setDriverPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isNavigating]);

  // Calculate optimized route when markers change or driver position updates significantly
  const calcRoute = useCallback(async () => {
    if (!driverPosition || markers.length === 0) {
      setRouteCoords([]);
      return;
    }

    // Only recalculate if markers actually changed
    const remainingMarkers = markers.slice(currentAddressIndex);
    if (remainingMarkers.length === 0) {
      setRouteCoords([]);
      return;
    }

    const key = `${driverPosition[0].toFixed(3)},${driverPosition[1].toFixed(3)}|${remainingMarkers.map(m => `${m.lat.toFixed(5)},${m.lng.toFixed(5)}`).join('|')}`;
    if (key === routeCalcRef.current) return;
    routeCalcRef.current = key;

    const result = await fetchOptimizedRoute(driverPosition, remainingMarkers);
    setRouteCoords(result.coords);
    onRouteCalculated(result.distance, result.duration);
  }, [driverPosition, markers, currentAddressIndex, onRouteCalculated]);

  // Recalculate route when markers change
  useEffect(() => {
    calcRoute();
  }, [markers, currentAddressIndex]);

  // Recalculate on first position or when navigating starts
  useEffect(() => {
    if (driverPosition && isNavigating) {
      // Force recalculate by clearing the cache key
      routeCalcRef.current = '';
      calcRoute();
    }
  }, [isNavigating, driverPosition]);

  // Check arrival at current address
  useEffect(() => {
    if (!isNavigating || !driverPosition || markers.length === 0 || currentAddressIndex >= markers.length) return;

    const target = markers[currentAddressIndex];
    const dist = haversineDistance(driverPosition, [target.lat, target.lng]);

    if (dist <= ARRIVAL_THRESHOLD_METERS && !arrivedSetRef.current.has(currentAddressIndex)) {
      arrivedSetRef.current.add(currentAddressIndex);
      playArrivalSound();
      onArrival(currentAddressIndex, target.label || `Adresse #${currentAddressIndex + 1}`);
    }
  }, [driverPosition, isNavigating, markers, currentAddressIndex, onArrival]);

  // Reset arrived set when addresses change
  useEffect(() => {
    arrivedSetRef.current = new Set();
    routeCalcRef.current = '';
  }, [markers.length]);

  return {
    driverPosition,
    routeCoords,
  };
}
