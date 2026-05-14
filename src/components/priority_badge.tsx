import { LeadPriority } from "@/types/lead";

interface PriorityBadgeProps {
  priority: LeadPriority;
}

const BADGE_CONFIG: Record<
  LeadPriority,
  { className: string; label: string }
> = {
  Alto: {
    className: "bg-green-600 text-green-100 border border-green-500",
    label: "Alto",
  },
  Medio: {
    className: "bg-yellow-600 text-yellow-100 border border-yellow-500",
    label: "Médio",
  },
  Baixo: {
    className: "bg-red-600 text-red-100 border border-red-500",
    label: "Baixo",
  },
  NaoClassificado: {
    className: "bg-gray-600 text-gray-100 border border-gray-500",
    label: "Não classificado",
  },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { className, label } = BADGE_CONFIG[priority];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${className}`}
    >
      {label}
    </span>
  );
}
