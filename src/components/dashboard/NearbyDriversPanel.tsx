import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, MapPin, Circle } from 'lucide-react';

interface NearbyDriversPanelProps {
  open: boolean;
  onClose: () => void;
}

const mockDrivers = [
  { id: 1, name: 'Ahmed B.', distance: '0.3 km', available: true, deliveries: 12 },
  { id: 2, name: 'Youssef M.', distance: '0.8 km', available: true, deliveries: 8 },
  { id: 3, name: 'Karim L.', distance: '1.2 km', available: false, deliveries: 15 },
  { id: 4, name: 'Omar H.', distance: '1.5 km', available: true, deliveries: 6 },
];

export default function NearbyDriversPanel({ open, onClose }: NearbyDriversPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 bg-card shadow-elevated flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <h2 className="text-lg font-bold text-foreground">Livreurs à proximité</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {mockDrivers.map(d => (
                <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-primary">
                    {d.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{d.name}</p>
                      <Circle className={`w-2 h-2 fill-current ${d.available ? 'text-green-500' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />{d.distance} • {d.deliveries} livraisons
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
