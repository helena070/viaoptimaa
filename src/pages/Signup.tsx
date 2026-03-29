import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-service';
import { Zap, Truck, Package, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type Role = 'livreur' | 'client';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('livreur');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, role, fullName);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Inscription réussie ! Vérifiez votre email.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
          </div>
          <span className="text-2xl font-extrabold text-foreground tracking-tight">ViaOptima</span>
        </Link>

        <div className="bg-card rounded-2xl shadow-soft p-8">
          <h1 className="text-xl font-bold text-foreground mb-1">Créer un compte</h1>
          <p className="text-sm text-muted-foreground mb-6">Rejoignez ViaOptima en quelques secondes</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([
              { value: 'livreur' as Role, icon: Truck, label: 'Livreur' },
              { value: 'client' as Role, icon: Package, label: 'Client' },
            ]).map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`relative flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 ${
                  role === r.value
                    ? 'border-primary bg-accent shadow-soft'
                    : 'border-transparent bg-muted hover:border-border'
                }`}
              >
                <r.icon className={`w-5 h-5 ${role === r.value ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={1.5} />
                <span className={`text-sm font-semibold ${role === r.value ? 'text-primary' : 'text-muted-foreground'}`}>{r.label}</span>
                {role === r.value && (
                  <motion.div layoutId="role-indicator" className="absolute inset-0 rounded-xl border-2 border-primary" />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow duration-200"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full mt-1.5 px-4 py-3 rounded-xl bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow duration-200"
                placeholder="vous@exemple.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mot de passe</label>
              <div className="relative mt-1.5">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow duration-200 pr-10"
                  placeholder="Min. 6 caractères"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-brand text-primary-foreground font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
            >
              {loading ? 'Inscription...' : `S'inscrire comme ${role === 'livreur' ? 'Livreur' : 'Client'}`}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
