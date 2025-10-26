/**
 * Political leaning badge component
 */

import { getPoliticalLeaningColor, getPoliticalLeaningLabel } from '../utils/colors';

interface PoliticalBadgeProps {
  leaning: string;
  isDark: boolean;
}

export function PoliticalBadge({ leaning, isDark }: PoliticalBadgeProps) {
  const color = getPoliticalLeaningColor(leaning, isDark);
  const label = getPoliticalLeaningLabel(leaning);

  return (
    <span
      className="political-badge"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: color,
      }}
    >
      {label}
    </span>
  );
}
