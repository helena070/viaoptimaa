import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Package, MapPin, Star } from 'lucide-react';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const mockNotifications = [
  { id: 1, icon: Package, title: 'Nouvelle commande', message: 'Commande #1042 assignée à vous', time: 'Il y a 5 min', unread: true },
  { id: 2, icon: MapPin, title: 'Zone mise à jour', message: 'Votre zone de livraison a été étendue', time: 'Il y a 30 min', unread: true },
  { id: 3, icon: Star, title: 'Évaluation reçue', message: 'Vous avez reçu 5 étoiles !', time: 'Il y a 2h', unread: false },
  { id: 4, icon: Package, title: 'Commande livrée', message: 'Commande #1038 confirmée', time: 'Hier', unread: false },
];

export default function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 bg-card shadow-elevated flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <h2 className="text-lg font-bold text-foreground">Notifications</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {mockNotifications.map(n => (
                <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${n.unread ? 'bg-accent/50' : 'hover:bg-muted'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.unread ? 'gradient-brand' : 'bg-muted'}`}>
                    <n.icon className={`w-4 h-4 ${n.unread ? 'text-primary-foreground' : 'text-muted-foreground'}`} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                  </div>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
