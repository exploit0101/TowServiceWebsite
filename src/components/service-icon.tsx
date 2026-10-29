import { Truck, Container, Motorbike, Zap, Cable, CircleDashed, KeyRound, CircleDot, Fuel, BatteryPlus, Wrench, type LucideIcon } from 'lucide-react';
import type { ServiceIconName } from '@/lib/service-catalog';

const towingDrawings = {
  truck: <>
    <path d="M2 20h18V13h5l5 7v5h-1.5M20 25h-9.5M5.5 25H2v-5M23 15v5h5" />
    <circle cx="8" cy="25" r="2.5" /><circle cx="26" cy="25" r="2.5" />
    <path d="M4 16v-3l3-4h7l3 4v3M4 13h13M10 9v4M3 17h15" />
  </>,
  'heavy-duty': <>
    <path d="M2 20V7h18v18h-2.5M3.5 25H2v-5M8.5 25h4M20 11h5l5 9v5h-1.5M23 14v6h5" />
    <circle cx="6" cy="25" r="2.5" /><circle cx="15" cy="25" r="2.5" /><circle cx="26" cy="25" r="2.5" />
    <path d="M5 11h12M5 15h12" />
  </>,
  winch: <>
    <rect x="4" y="10" width="15" height="12" rx="3" />
    <path d="M8 10v12M12 10v12M16 10v12M2 13v6M2 16h2M19 16h5V6h5v13a3 3 0 0 1-6 0" />
  </>,
};

const serviceIcons = {
  truck: Truck,
  'heavy-duty': Container,
  motorcycle: Motorbike,
  battery: Zap,
  winch: Cable,
  'flat-tire': CircleDashed,
  lockout: KeyRound,
  tire: CircleDot,
  fuel: Fuel,
  'battery-replacement': BatteryPlus,
  'tire-repair': Wrench,
} satisfies Record<ServiceIconName, LucideIcon>;

export function ServiceIcon({ icon, className, size = 24, strokeWidth = 1.65 }: {
  icon: ServiceIconName; className?: string; size?: number; strokeWidth?: number;
}) {
  if (icon === 'truck' || icon === 'heavy-duty' || icon === 'winch') {
    return <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={strokeWidth * 1.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" data-service-icon={icon}>{towingDrawings[icon]}</svg>;
  }
  const Icon = serviceIcons[icon];
  return <Icon className={className} size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" data-service-icon={icon} />;
}
