import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createClient, User, Session } from '@supabase/supabase-js';

// --- CONFIGURATION SUPABASE ---
// Ces clés sont lues depuis votre fichier .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Initialisation du client Supabase unique pour tout le projet.
 * Ce client permet de communiquer avec la base de données et l'authentification.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// --- TYPES POUR L'AUTHENTIFICATION ---
interface AuthContextType {
  user: User | null;         // L'utilisateur actuellement connecté
  session: Session | null;   // La session active (jeton JWT)
  loading: boolean;          // Indique si on attend une réponse de Supabase
  userRole: 'livreur' | 'client' | null; // Le rôle de l'utilisateur (récupéré depuis la table 'profiles')
  signUp: (email: string, password: string, role: 'livreur' | 'client', fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

// --- CONTEXTE ET FOURNISSEUR (PROVIDER) ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Composant Provider qui enveloppe toute l'application (dans App.tsx).
 * Il écoute les changements d'état (connexion/déconnexion) en temps réel.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'livreur' | 'client' | null>(null);

  /**
   * Fonction pour récupérer le rôle de l'utilisateur depuis la table 'profiles' de la base de données.
   */
  const fetchUserRole = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    return data?.role as 'livreur' | 'client' | null;
  };

  useEffect(() => {
    let mounted = true;

    // 1. Vérifier s'il y a déjà une session active au chargement de l'app
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // On récupère d'abord le rôle dans les metadata (instantané)
        const metaRole = session.user.user_metadata?.role as 'livreur' | 'client' | undefined;
        if (metaRole) setUserRole(metaRole);
        
        // Puis on vérifie en base de données pour être sûr
        fetchUserRole(session.user.id).then(role => {
          if (mounted && role) setUserRole(role);
        });
      }
      setLoading(false);
    });

    // 2. Écouter les changements d'état (ex: l'utilisateur se connecte ou se déconnecte)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const metaRole = session.user.user_metadata?.role as 'livreur' | 'client' | undefined;
        if (metaRole) setUserRole(metaRole);
        fetchUserRole(session.user.id).then(role => {
          if (mounted && role) setUserRole(role);
        });
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => { 
      mounted = false; 
      subscription.unsubscribe(); 
    };
  }, []);

  // --- ACTIONS D'AUTHENTIFICATION ---

  const signUp = async (email: string, password: string, role: 'livreur' | 'client', fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, role }, // Stocke le rôle dans les metadata de l'utilisateur
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, userRole, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour utiliser l'authentification dans n'importe quel composant.
 * Usage: const { user, userRole, signOut } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
