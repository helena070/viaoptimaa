import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, User, Phone, MapPin, Bell, Moon, Shield, LogOut, Truck, Building2, Save, Loader2 } from 'lucide-react';
import { useAuth, supabase } from '@/lib/auth-service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [zone, setZone] = useState('Casablanca');
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    if (open && user) {
      loadProfile();
    }
  }, [open, user]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) {
      setFullName(data.full_name || '');
      setPhoneNum(data.phone || '');
      setVehicleType((data as any).vehicle_type || '');
      setVehiclePlate((data as any).vehicle_plate || '');
      setCompanyName((data as any).company_name || '');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      phone: phoneNum,
      vehicle_type: vehicleType,
      vehicle_plate: vehiclePlate,
      company_name: companyName,
    } as any).eq('id', user.id);
    setSaving(false);
    if (error) {
      toast.error('Erreur lors de la sauvegarde');
    } else {
      toast.success('Profil mis à jour');
      setEditing(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const InputField = ({ icon: Icon, label, value, onChange, placeholder }: { icon: any; label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        {editing ? (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/50"
          />
        ) : (
          <p className="text-sm font-semibold text-foreground truncate">{value || '-'}</p>
        )}
      </div>
    </div>
  );

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
                <Settings className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <h2 className="text-lg font-bold text-foreground">Paramètres</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Profile */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Profil</p>
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="text-xs font-semibold text-primary hover:underline">
                      Modifier
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Enregistrer
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <InputField icon={User} label="Nom complet" value={fullName} onChange={setFullName} placeholder="Votre nom" />
                  <InputField icon={Phone} label="Téléphone" value={phoneNum} onChange={setPhoneNum} placeholder="+212 6XX XXX XXX" />
                  <InputField icon={MapPin} label="Zone de livraison" value={zone} onChange={setZone} placeholder="Ville" />
                </div>
              </div>

              {/* Vehicle */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Véhicule</p>
                <div className="space-y-2">
                  <InputField icon={Truck} label="Type de véhicule" value={vehicleType} onChange={setVehicleType} placeholder="Moto, Voiture, Camionnette..." />
                  <InputField icon={Truck} label="Plaque d'immatriculation" value={vehiclePlate} onChange={setVehiclePlate} placeholder="XX-XXXXX" />
                </div>
              </div>

              {/* Company */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Société</p>
                <div className="space-y-2">
                  <InputField icon={Building2} label="Nom de la société" value={companyName} onChange={setCompanyName} placeholder="Nom de l'entreprise" />
                </div>
              </div>

              {/* Preferences */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Préférences</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                      <p className="text-sm text-foreground">Notifications</p>
                    </div>
                    <button
                      onClick={() => setNotifEnabled(!notifEnabled)}
                      className={`w-10 h-6 rounded-full transition-colors ${notifEnabled ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-primary-foreground transition-transform mx-1 ${notifEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Moon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                      <p className="text-sm text-foreground">Mode sombre</p>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-10 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-primary-foreground transition-transform mx-1 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Sécurité</p>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <Shield className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  <p className="text-sm text-foreground">Changer le mot de passe</p>
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive font-semibold text-sm hover:bg-destructive/20 transition-colors"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                Se déconnecter
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
