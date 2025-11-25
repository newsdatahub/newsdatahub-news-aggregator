/**
 * Political leaning badge component
 */

import React, { useMemo } from 'react';
import { getPoliticalLeaningColor, getPoliticalLeaningLabel } from '../utils/colors';
import styles from './PoliticalBadge.module.css';

const ALPHA_SUFFIX: string = '20';

interface PoliticalBadgeProps {
  leaning: string;
  isDark: boolean;
}

export function PoliticalBadge({ leaning, isDark }: PoliticalBadgeProps): React.ReactElement {
  const color: string = useMemo(() => {
    return getPoliticalLeaningColor(leaning, isDark);
  }, [leaning, isDark]);

  const label: string = useMemo(() => {
    return getPoliticalLeaningLabel(leaning);
  }, [leaning]);

  const backgroundColor: string = `${color}${ALPHA_SUFFIX}`;

  return (
    <span
      className={styles.badge}
      style={{
        backgroundColor,
        color,
        borderColor: color,
      }}
    >
      {label}
    </span>
  );
}
