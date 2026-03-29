import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Send, ArrowLeft, User } from 'lucide-react';
import { useAuth, supabase } from '@/lib/auth-service';

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
}

interface Client {
  id: string;
  full_name: string;
  phone: string | null;
}

interface Message {
  id: number;
  sender: 'me' | 'client';
  text: string;
  time: string;
}

export default function ChatPanel({ open, onClose }: ChatPanelProps) {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (open) {
      loadClients();
    }
  }, [open]);

  const loadClients = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .eq('role', 'client')
      .limit(20);
    if (data) setClients(data);
  };

  const openConversation = (client: Client) => {
    setSelectedClient(client);
    setMessages([
      { id: 1, sender: 'client', text: `Bonjour, où en est ma commande ?`, time: '14:00' },
    ]);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'me', text: message, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setMessage('');
  };

  const goBack = () => {
    setSelectedClient(null);
    setMessages([]);
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
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                {selectedClient && (
                  <button onClick={goBack} className="p-1 rounded-lg hover:bg-muted transition-colors mr-1">
                    <ArrowLeft className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  </button>
                )}
                <MessageSquare className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <h2 className="text-lg font-bold text-foreground">
                  {selectedClient ? selectedClient.full_name : 'Messages'}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </div>

            {!selectedClient ? (
              /* Client list */
              <div className="flex-1 overflow-y-auto">
                {clients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <User className="w-10 h-10 mb-2 opacity-40" />
                    <p className="text-sm">Aucun client trouvé</p>
                  </div>
                ) : (
                  clients.map(c => (
                    <button
                      key={c.id}
                      onClick={() => openConversation(c)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border/50"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{c.full_name || 'Client'}</p>
                        <p className="text-xs text-muted-foreground">{c.phone || 'Pas de téléphone'}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : (
              /* Conversation */
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                        m.sender === 'me'
                          ? 'gradient-brand text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}>
                        <p>{m.text}</p>
                        <p className={`text-[10px] mt-1 ${m.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      placeholder="Tapez un message..."
                      className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                    <button onClick={handleSend} className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                      <Send className="w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
