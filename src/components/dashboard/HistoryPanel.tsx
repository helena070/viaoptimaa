import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, CheckCircle2, Clock, MapPin, QrCode, ChevronRight } from 'lucide-react';
import { useAuth, supabase } from '@/lib/auth-service';
import { QRCodeSVG } from 'qrcode.react';

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
}

interface Order {
  id: string;
  delivery_address: string;
  pickup_address: string | null;
  status: string;
  qr_code: string;
  created_at: string;
  notes: string | null;
}

export default function HistoryPanel({ open, onClose }: HistoryPanelProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (open && user) {
      setLoading(true);
      supabase
        .from('orders')
        .select('*')
        .eq('driver_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setOrders((data as Order[]) || []);
          setLoading(false);
        });
    }
  }, [open, user]);

  const statusLabel = (s: string) => {
    const map: Record<string, string> = { pending: 'En attente', in_progress: 'En cours', delivered: 'Livrée', cancelled: 'Annulée' };
    return map[s] || s;
  };

  const statusColor = (s: string) => {
    if (s === 'delivered') return 'text-primary';
    if (s === 'in_progress') return 'text-yellow-400';
    if (s === 'cancelled') return 'text-red-400';
    return 'text-muted-foreground';
  };

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
                {selectedOrder ? (
                  <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg hover:bg-muted">
                    <ChevronRight className="w-5 h-5 text-primary rotate-180" strokeWidth={1.5} />
                  </button>
                ) : (
                  <History className="w-5 h-5 text-primary" strokeWidth={1.5} />
                )}
                <h2 className="text-lg font-bold text-foreground">
                  {selectedOrder ? 'Détails commande' : 'Historique'}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedOrder ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Statut</p>
                      <p className={`text-sm font-bold ${statusColor(selectedOrder.status)}`}>{statusLabel(selectedOrder.status)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Adresse de livraison</p>
                      <p className="text-sm font-semibold text-foreground">{selectedOrder.delivery_address}</p>
                    </div>
                    {selectedOrder.pickup_address && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Adresse de ramassage</p>
                        <p className="text-sm font-semibold text-foreground">{selectedOrder.pickup_address}</p>
                      </div>
                    )}
                    {selectedOrder.notes && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm text-foreground">{selectedOrder.notes}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <p className="text-sm text-foreground">{new Date(selectedOrder.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center p-6 rounded-xl bg-white">
                    <QRCodeSVG value={selectedOrder.qr_code} size={180} level="H" />
                    <p className="mt-3 text-xs text-gray-500 font-mono">{selectedOrder.qr_code}</p>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Aucune commande</div>
              ) : (
                orders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="w-full p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-foreground truncate flex-1">{order.delivery_address}</p>
                      <div className="flex items-center gap-2 ml-2">
                        <QrCode className="w-4 h-4 text-primary" strokeWidth={1.5} />
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`font-semibold ${statusColor(order.status)}`}>{statusLabel(order.status)}</span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
