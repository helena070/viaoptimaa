import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  unit: string;
  icon?: LucideIcon;
}

export default function StatCard({ label, value, unit, icon: Icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass p-3 rounded-xl"
    >
      <div className="flex items-center justify-between mb-0.5">
        <p className="stat-label">{label}</p>
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-mono font-semibold tabular-nums" style={{ color: 'hsl(var(--surface-900))' }}>{value}</span>
        <span className="stat-unit text-[11px]">{unit}</span>
      </div>
    </motion.div>
  );
}
