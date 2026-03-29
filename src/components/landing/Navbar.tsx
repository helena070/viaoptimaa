import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
          </div>
          <span className="text-lg font-extrabold text-foreground tracking-tight">ViaOptima</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 px-3 py-2"
          >
            Connexion
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold gradient-brand text-primary-foreground px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </nav>
  );
}
