import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Route, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroMap from '@/assets/hero-map.jpg';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroMap} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      </div>

      {/* Decorative glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, hsl(44, 100%, 59%), transparent 70%)' }} />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 shadow-soft bg-card"
          >
            <span className="w-2 h-2 rounded-full gradient-brand" />
            <span className="text-sm font-medium text-muted-foreground">Optimisation logistique intelligente</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0, 0, 1] }}
            className="text-5xl md:text-7xl font-extrabold text-foreground leading-[0.95] mb-6"
          >
            Chaque livraison,
            <br />
            <span className="text-secondary">le trajet parfait.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0, 0, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            ViaOptima transforme vos listes d'adresses en trajets optimisés par l'IA.
            Importez, optimisez, livrez — en temps réel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0, 0, 1] }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-brand text-primary-foreground font-semibold text-base transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-card shadow-soft font-semibold text-foreground text-base transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5"
            >
              Se connecter
            </Link>
          </motion.div>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.2, 0, 0, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 max-w-3xl"
        >
          {[
            { icon: Route, title: 'Import IA', desc: 'Photo ou Excel → trajet optimisé' },
            { icon: MapPin, title: 'Suivi temps réel', desc: 'Livreur et client connectés' },
            { icon: Zap, title: 'QR Code', desc: 'Validation instantanée à la livraison' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: [0.2, 0, 0, 1] }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-card shadow-soft"
            >
              <div className="p-2 rounded-xl gradient-brand-light">
                <f.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
