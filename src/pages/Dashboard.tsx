import { useAuth } from '@/lib/auth-service';
import DriverDashboard from './DriverDashboard';
import ClientDashboard from './ClientDashboard';
import { Navigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Dashboard() {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center animate-pulse">
          <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
        </div>
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (userRole === 'client') return <ClientDashboard />;
  return <DriverDashboard />;
}
