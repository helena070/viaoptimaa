import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/lib/auth-service';
import MapView from '@/components/dashboard/MapView';
import StatCard from '@/components/dashboard/StatCard';
import ImportPanel from '@/components/dashboard/ImportPanel';
import AddressList from '@/components/dashboard/AddressList';
import NotificationsPanel from '@/components/dashboard/NotificationsPanel';
import HistoryPanel from '@/components/dashboard/HistoryPanel';
import ChatPanel from '@/components/dashboard/ChatPanel';
import NearbyDriversPanel from '@/components/dashboard/NearbyDriversPanel';
import SettingsPanel from '@/components/dashboard/SettingsPanel';
import { useDriverNavigation } from '@/hooks/useDriverNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import {
  Upload, Bell, History, MessageSquare,
  Settings, Zap, ToggleLeft, ToggleRight, Users, Play,
  Pause, ChevronUp, ChevronDown, Gauge, Timer, Route as RouteIcon, MapPin, X, QrCode, Trash2
} from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [importOpen, setImportOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [driversOpen, setDriversOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [routeDistance, setRouteDistance] = useState(0);
  const [routeDuration, setRouteDuration] = useState(0);
  const [selectedQrIndex, setSelectedQrIndex] = useState<number | null>(null);

  const anyPanelOpen = importOpen || notifOpen || historyOpen || chatOpen || driversOpen || settingsOpen;

  const markers = useMemo(() => {
    return addresses.map((addr, i) => ({
      lat: 33.5731 + (i * 0.008) - (addresses.length * 0.004),
      lng: -7.5898 + (i * 0.006) - (addresses.length * 0.003),
      label: addr,
    }));
  }, [addresses]);

  const handleArrival = useCallback((index: number, label: string) => {
    toast.success(`🎯 Arrivé à: ${label}`, {
      description: 'Vous êtes arrivé à destination',
      duration: 5000,
    });
    // Auto advance to next
    if (index + 1 < addresses.length) {
      setCurrentAddressIndex(index + 1);
    }
  }, [addresses.length]);

  const handleRouteCalculated = useCallback((distance: number, duration: number) => {
    setRouteDistance(distance);
    setRouteDuration(duration);
  }, []);

  const { driverPosition, routeCoords } = useDriverNavigation({
    markers,
    isNavigating,
    currentAddressIndex,
    onArrival: handleArrival,
    onRouteCalculated: handleRouteCalculated,
  });

  const handleImport = (addrs: string[]) => {
    setAddresses(addrs);
    setCurrentAddressIndex(0);
    setImportOpen(false);
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
    if (currentAddressIndex >= newAddresses.length && newAddresses.length > 0) {
      setCurrentAddressIndex(newAddresses.length - 1);
    } else if (newAddresses.length === 0) {
      setCurrentAddressIndex(0);
      setIsNavigating(false);
    }
    toast.info('Adresse supprimée, trajet recalculé');
  };

  const formatDistance = (m: number) => {
    if (m >= 1000) return `${(m / 1000).toFixed(1)}`;
    return `${Math.round(m)}`;
  };

  const formatETA = (seconds: number) => {
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-surface-200 overflow-hidden">
      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-4 bg-card shadow-soft z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
          </div>
          <span className="font-bold text-foreground text-sm">ViaOptima</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isAvailable ? 'bg-accent text-primary' : 'bg-muted text-muted-foreground'
            }`}
          >
            {isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          </button>

          <button onClick={() => setImportOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Importer">
            <Upload className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <button onClick={() => setDriversOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Livreurs">
            <Users className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <button onClick={() => setNotifOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors relative" title="Notifications">
            <Bell className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full gradient-brand" />
          </button>
          <button onClick={() => setHistoryOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Historique">
            <History className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <button onClick={() => setChatOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Messages">
            <MessageSquare className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <button onClick={() => setSettingsOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Paramètres">
            <Settings className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView
          markers={markers}
          showSearch={!anyPanelOpen}
          showRoute={markers.length >= 2}
          isNavigating={isNavigating}
          driverPosition={driverPosition}
          routeCoords={routeCoords}
        />

        {/* Bottom stats panel */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="mx-4 mb-3">
            <button
              onClick={() => setPanelExpanded(!panelExpanded)}
              className="bg-card/95 backdrop-blur-xl rounded-t-xl w-10 h-5 flex items-center justify-center mx-auto -mb-px shadow-soft"
            >
              {panelExpanded ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronUp className="w-3 h-3 text-muted-foreground" />}
            </button>

            <AnimatePresence>
              {panelExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                  className="bg-card/95 backdrop-blur-xl rounded-2xl p-3 space-y-2 shadow-elevated max-h-[50vh] overflow-y-auto"
                >
                  <div className="grid grid-cols-3 gap-2">
                    <StatCard label="Vitesse" value={driverPosition ? "—" : "0"} unit="km/h" icon={Gauge} />
                    <StatCard label="Distance" value={formatDistance(routeDistance)} unit={routeDistance >= 1000 ? "km" : "m"} icon={RouteIcon} />
                    <StatCard label="ETA" value={formatETA(routeDuration)} unit="" icon={Timer} />
                  </div>

                  {addresses.length > 0 && (
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-accent/50">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Prochaine</p>
                        <p className="text-xs font-semibold text-foreground truncate">{addresses[currentAddressIndex]}</p>
                      </div>
                      <button onClick={() => setSelectedQrIndex(currentAddressIndex)} className="p-1 rounded-lg hover:bg-muted">
                        <QrCode className="w-4 h-4 text-primary" strokeWidth={1.5} />
                      </button>
                    </div>
                  )}

                  <AddressList
                    addresses={addresses}
                    currentIndex={currentAddressIndex}
                    onSelect={setCurrentAddressIndex}
                    onRemove={handleRemoveAddress}
                    onShowQr={setSelectedQrIndex}
                  />

                  <div className="flex gap-2">
                    {addresses.length > 0 ? (
                      <button
                        onClick={() => setIsNavigating(!isNavigating)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          isNavigating
                            ? 'bg-muted text-foreground'
                            : 'gradient-brand text-primary-foreground hover:shadow-lg hover:shadow-primary/25'
                        }`}
                      >
                        {isNavigating ? (
                          <><Pause className="w-4 h-4" strokeWidth={1.5} />Pause</>
                        ) : (
                          <><Play className="w-4 h-4" strokeWidth={1.5} />Démarrer</>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => setImportOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-brand text-primary-foreground font-semibold text-sm"
                      >
                        <Upload className="w-4 h-4" strokeWidth={1.5} />
                        Importer des adresses
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {selectedQrIndex !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedQrIndex(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card rounded-2xl p-6 shadow-elevated max-w-xs w-full space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">QR Code - Commande #{selectedQrIndex + 1}</h3>
                  <button onClick={() => setSelectedQrIndex(null)} className="p-1 rounded-lg hover:bg-muted">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-white">
                  <QRCodeSVG
                    value={`order-${selectedQrIndex}-${addresses[selectedQrIndex]}`}
                    size={160}
                    level="H"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center truncate">{addresses[selectedQrIndex]}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Panels */}
      <ImportPanel open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
      <NearbyDriversPanel open={driversOpen} onClose={() => setDriversOpen(false)} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
