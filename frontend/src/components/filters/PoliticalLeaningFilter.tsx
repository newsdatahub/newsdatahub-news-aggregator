/**
 * Political leaning filter component
 */

import React, { useMemo, useCallback } from 'react';
import type { PoliticalLeaningOption } from '../../constants/filters';
import { POLITICAL_LEANINGS } from '../../constants/filters';
import type { PoliticalLeaning } from '../../types/news';
import { MultiSelect } from '../MultiSelect';
import styles from './PoliticalLeaningFilter.module.css';

const PLACEHOLDER: string = 'Select political leanings...';
const LABEL: string = 'Political Leaning';

interface PoliticalLeaningFilterProps {
  selected: PoliticalLeaning[];
  onChange: (leanings: PoliticalLeaning[]) => void;
  isDark: boolean;
}

export function PoliticalLeaningFilter({ selected, onChange, isDark }: PoliticalLeaningFilterProps): React.ReactElement {
  const options = useMemo(() => {
    return POLITICAL_LEANINGS.map((option: PoliticalLeaningOption) => ({
      value: option.value,
      label: option.label,
    }));
  }, []);

  const renderTag = useCallback((value: string): React.ReactNode => {
    const option: PoliticalLeaningOption | undefined = POLITICAL_LEANINGS.find((o: PoliticalLeaningOption) => o.value === value);
    if (!option) return value;
    return (
      <span className={styles.politicalTag}>
        {option.label}
      </span>
    );
  }, []);

  const renderOption = useCallback((value: string, label: string): React.ReactNode => {
    const option: PoliticalLeaningOption | undefined = POLITICAL_LEANINGS.find((o: PoliticalLeaningOption) => o.value === value);
    if (!option) return label;
    const color: string = isDark ? option.darkColor : option.color;
    return (
      <span
        className={styles.politicalOption}
        style={{
          backgroundColor: `${color}20`,
          color: color,
          borderColor: color,
        }}
      >
        {label}
      </span>
    );
  }, [isDark]);

  return (
    <div className="filter-section">
      <div className="filter-label">
        <span className="filter-label-text">{LABEL}</span>
        <MultiSelect
          options={options}
          selected={selected}
          onChange={onChange}
          placeholder={PLACEHOLDER}
          renderTag={renderTag}
          renderOption={renderOption}
        />
      </div>
    </div>
  );
}
