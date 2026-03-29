import { motion } from 'framer-motion';
import { Upload, Brain, Navigation, QrCode, Users, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: "Import intelligent",
    desc: "Importez un fichier Excel ou prenez une photo de votre bordereau. Notre IA extrait et valide chaque adresse automatiquement.",
  },
  {
    icon: Brain,
    title: "Optimisation IA",
    desc: "L'algorithme calcule le trajet le plus court en tenant compte du trafic, des priorités et des créneaux horaires.",
  },
  {
    icon: Navigation,
    title: "Navigation en temps réel",
    desc: "Suivi GPS précis avec mise à jour de la vitesse, distance restante et temps d'arrivée estimé.",
  },
  {
    icon: QrCode,
    title: "Validation QR Code",
    desc: "Chaque livraison est confirmée par un scan QR unique. Traçabilité complète et preuve de livraison.",
  },
  {
    icon: Users,
    title: "Collaboration livreurs",
    desc: "Transférez une livraison à un collègue proche. Visualisez les livreurs à proximité en temps réel.",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord client",
    desc: "Vos clients suivent leur livraison en direct sur carte, évaluent le service et scannent le QR à réception.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Une plateforme complète pour livreurs et clients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.2, 0, 0, 1] }}
              className="group p-6 rounded-2xl bg-card shadow-soft hover:shadow-elevated transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl gradient-brand-light flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                <f.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
