import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Circle, Trash2, QrCode } from 'lucide-react';

interface AddressListProps {
  addresses: string[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onRemove?: (index: number) => void;
  onShowQr?: (index: number) => void;
}

export default function AddressList({ addresses, currentIndex, onSelect, onRemove, onShowQr }: AddressListProps) {
  if (addresses.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
        Adresses ({addresses.length})
      </p>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {addresses.map((addr, i) => (
          <motion.div
            key={`${i}-${addr}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-200 ${
              i === currentIndex
                ? 'bg-accent shadow-soft'
                : i < currentIndex
                ? 'bg-muted/50 opacity-60'
                : 'hover:bg-muted'
            }`}
          >
            <button onClick={() => onSelect(i)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
              <div className="flex-shrink-0">
                {i < currentIndex ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                ) : i === currentIndex ? (
                  <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                )}
              </div>
              <p className={`text-xs truncate ${i === currentIndex ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                {addr}
              </p>
            </button>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {onShowQr && (
                <button onClick={() => onShowQr(i)} className="p-1 rounded hover:bg-muted/80">
                  <QrCode className="w-3 h-3 text-primary" strokeWidth={1.5} />
                </button>
              )}
              {onRemove && (
                <button onClick={() => onRemove(i)} className="p-1 rounded hover:bg-destructive/20">
                  <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" strokeWidth={1.5} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
