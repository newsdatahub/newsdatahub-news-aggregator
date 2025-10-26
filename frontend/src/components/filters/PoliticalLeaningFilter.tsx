/**
 * Political leaning filter component
 */

import { POLITICAL_LEANINGS } from '../../constants/filters';
import { MultiSelect } from '../MultiSelect';

interface PoliticalLeaningFilterProps {
  selected: string[];
  onChange: (leanings: string[]) => void;
  isDark: boolean;
}

export function PoliticalLeaningFilter({ selected, onChange, isDark }: PoliticalLeaningFilterProps) {
  const options = POLITICAL_LEANINGS.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const renderTag = (value: string) => {
    const option = POLITICAL_LEANINGS.find((o) => o.value === value);
    if (!option) return value;
    const color = isDark ? option.darkColor : option.color;
    return (
      <span
        style={{
          backgroundColor: `${color}20`,
          color: color,
          borderColor: color,
          border: '1px solid',
          padding: '0.125rem 0.5rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      >
        {option.label}
      </span>
    );
  };

  const renderOption = (value: string, label: string) => {
    const option = POLITICAL_LEANINGS.find((o) => o.value === value);
    if (!option) return label;
    const color = isDark ? option.darkColor : option.color;
    return (
      <span
        style={{
          backgroundColor: `${color}20`,
          color: color,
          borderColor: color,
          border: '1px solid',
          padding: '0.25rem 0.75rem',
          borderRadius: '999px',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'inline-block',
        }}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="filter-section">
      <h3>Political Leaning</h3>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={onChange}
        placeholder="Select political leanings..."
        renderTag={renderTag}
        renderOption={renderOption}
      />
    </div>
  );
}
