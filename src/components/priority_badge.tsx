import { LeadPriority } from "@/types/lead";

interface PriorityBadgeProps {
  priority: LeadPriority;
}

const BADGE_CONFIG: Record<
  LeadPriority,
  { className: string; label: string }
> = {
  Alto: {
    className: "bg-green-100 text-green-800",
    label: "Alto",
  },
  Medio: {
    className: "bg-yellow-100 text-yellow-800",
    label: "Médio",
  },
  Baixo: {
    className: "bg-red-100 text-red-800",
    label: "Baixo",
  },
  NaoClassificado: {
    className: "bg-gray-100 text-gray-600",
    label: "Não classificado",
  },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { className, label } = BADGE_CONFIG[priority];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
