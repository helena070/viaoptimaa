import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import { Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-foreground">ViaOptima</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 ViaOptima. Optimisation logistique intelligente.</p>
        </div>
      </footer>
    </div>
  );
}
