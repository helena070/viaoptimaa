import { useState } from 'react';
import { useAuth } from '@/lib/auth-service';
import MapView from '@/components/dashboard/MapView';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, LogOut, Bell, History, QrCode, Star,
  Phone, X, ChevronUp, ChevronDown, Package, Clock, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

export default function ClientDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  // Mock delivery data
  const delivery = {
    id: 'DEL-2026-0042',
    status: 'En cours',
    driverName: 'Ahmed B.',
    eta: '14:02',
    distance: '2.3 km',
  };

  const driverMarker = [{ lat: 33.575, lng: -7.592, label: 'Livreur: ' + delivery.driverName }];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-4 glass z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
          </div>
          <span className="font-bold text-foreground text-sm">ViaOptima</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors relative" title="Notifications">
            <Bell className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Historique">
            <History className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <LogOut className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView markers={driverMarker} showSearch={false} />

        {/* Bottom panel */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="mx-4 mb-4">
            <button
              onClick={() => setPanelExpanded(!panelExpanded)}
              className="glass rounded-t-xl w-10 h-6 flex items-center justify-center mx-auto -mb-px"
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
                  className="glass rounded-2xl p-5 space-y-4"
                >
                  {/* Order info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">{delivery.id}</p>
                      <p className="text-lg font-bold text-foreground">{delivery.driverName}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent">
                      <Package className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                      <span className="text-xs font-semibold text-primary">{delivery.status}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card shadow-soft">
                      <Clock className="w-4 h-4 text-primary" strokeWidth={1.5} />
                      <div>
                        <p className="stat-label">ETA</p>
                        <p className="text-lg font-mono font-semibold text-foreground tabular-nums">{delivery.eta}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card shadow-soft">
                      <MapPin className="w-4 h-4 text-primary" strokeWidth={1.5} />
                      <div>
                        <p className="stat-label">Distance</p>
                        <p className="text-lg font-mono font-semibold text-foreground tabular-nums">{delivery.distance}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setShowQR(true)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card shadow-soft hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <QrCode className="w-5 h-5 text-primary" strokeWidth={1.5} />
                      <span className="text-[10px] font-semibold text-muted-foreground">Scanner QR</span>
                    </button>
                    <button
                      onClick={() => setShowRating(true)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card shadow-soft hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <Star className="w-5 h-5 text-primary" strokeWidth={1.5} />
                      <span className="text-[10px] font-semibold text-muted-foreground">Évaluer</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card shadow-soft hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5">
                      <Phone className="w-5 h-5 text-primary" strokeWidth={1.5} />
                      <span className="text-[10px] font-semibold text-muted-foreground">Contacter</span>
                    </button>
                  </div>

                  {/* Cancel/Suspend */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 rounded-xl bg-muted text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                      Suspendre
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl bg-destructive/10 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors duration-200">
                      Annuler
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-2xl shadow-elevated p-8 text-center max-w-xs w-full"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Votre QR Code</h3>
              <p className="text-xs text-muted-foreground mb-6">Montrez ce code au livreur pour confirmer la livraison</p>
              <div className="bg-card p-4 rounded-xl inline-block shadow-soft">
                <QRCodeSVG value={delivery.id} size={180} fgColor="hsl(222, 47%, 11%)" />
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-4">{delivery.id}</p>
              <button
                onClick={() => setShowQR(false)}
                className="mt-6 w-full py-3 rounded-xl gradient-brand text-primary-foreground font-semibold text-sm"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowRating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-2xl shadow-elevated p-8 text-center max-w-xs w-full"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Évaluer la livraison</h3>
              <p className="text-xs text-muted-foreground mb-6">Comment s'est passée votre livraison ?</p>
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(s)}>
                    <Star
                      className={`w-8 h-8 transition-colors ${s <= rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRating(false)}
                className="w-full py-3 rounded-xl gradient-brand text-primary-foreground font-semibold text-sm"
              >
                Envoyer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
