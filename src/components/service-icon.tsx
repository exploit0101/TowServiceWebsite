import { Truck, Zap, KeyRound, CircleDot, Fuel, BatteryPlus, Wrench, type LucideIcon } from 'lucide-react';
import type { ServiceIconName } from '@/lib/service-catalog';

const serviceIcons = {
  truck: Truck,
  battery: Zap,
  lockout: KeyRound,
  tire: CircleDot,
  fuel: Fuel,
  'battery-replacement': BatteryPlus,
  'tire-repair': Wrench,
} satisfies Record<ServiceIconName, LucideIcon>;

export function ServiceIcon({ icon, className, size = 24, strokeWidth = 1.65 }: {
  icon: ServiceIconName; className?: string; size?: number; strokeWidth?: number;
}) {
  const Icon = serviceIcons[icon];
  return <Icon className={className} size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" data-service-icon={icon} />;
}
