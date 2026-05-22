import type { LeadPriority } from "@/types/lead";

interface PriorityBadgeProps {
  priority: LeadPriority;
}

const BADGE_CONFIG: Record<
  LeadPriority,
  { className: string; label: string }
> = {
  Alto: {
    className: "bg-green-500 text-white",
    label: "Alto",
  },
  Medio: {
    className: "bg-yellow-500 text-white",
    label: "Médio",
  },
  Baixo: {
    className: "bg-red-500 text-white",
    label: "Baixo",
  },
  NaoClassificado: {
    className: "bg-gray-500 text-white",
    label: "Não classificado",
  },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { className, label } = BADGE_CONFIG[priority];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}
