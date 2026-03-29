import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, Camera, X, CheckCircle2, Loader2 } from 'lucide-react';

interface ImportPanelProps {
  open: boolean;
  onClose: () => void;
  onImport: (addresses: string[]) => void;
}

export default function ImportPanel({ open, onClose, onImport }: ImportPanelProps) {
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setProcessing(true);
    // Simulate AI processing
    await new Promise(r => setTimeout(r, 2000));
    const mockAddresses = [
      '12 Rue Mohammed V, Casablanca',
      '45 Boulevard Zerktouni, Casablanca',
      '8 Avenue Hassan II, Casablanca',
      '23 Rue Ibnou Sina, Casablanca',
      '67 Boulevard Anfa, Casablanca',
    ];
    setProcessing(false);
    onImport(mockAddresses);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 bg-card shadow-elevated p-6 overflow-y-auto"
        >
          {/* Progress bar */}
          {processing && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-muted overflow-hidden">
              <div className="h-full w-1/3 gradient-brand animate-progress" />
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Importer des adresses</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            </button>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
              dragging ? 'border-primary bg-accent' : 'border-border hover:border-primary/50 hover:bg-accent/50'
            }`}
          >
            {processing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-medium text-foreground">Analyse IA en cours...</p>
                <p className="text-xs text-muted-foreground">{fileName}</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm font-medium text-foreground mb-1">Glissez votre fichier ici</p>
                <p className="text-xs text-muted-foreground">Excel (.xlsx) ou image (.jpg, .png)</p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv,.jpg,.jpeg,.png"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-muted text-sm font-medium text-foreground hover:bg-secondary transition-colors duration-200"
            >
              <FileSpreadsheet className="w-4 h-4" strokeWidth={1.5} />
              Excel
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-muted text-sm font-medium text-foreground hover:bg-secondary transition-colors duration-200"
            >
              <Camera className="w-4 h-4" strokeWidth={1.5} />
              Photo
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            L'IA extraira automatiquement les adresses de votre document
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
