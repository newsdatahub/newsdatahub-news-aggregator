/**
 * Source type filter component
 */

import React, { useMemo } from 'react';
import type { SourceTypeOption } from '../../constants/filters';
import { SOURCE_TYPES } from '../../constants/filters';
import type { SourceType } from '../../types/news';
import { MultiSelect } from '../MultiSelect';

const PLACEHOLDER: string = 'Select source types...';
const LABEL: string = 'Source Type';

interface SourceTypeFilterProps {
  selected: SourceType[];
  onChange: (types: SourceType[]) => void;
}

export function SourceTypeFilter({ selected, onChange }: SourceTypeFilterProps): React.ReactElement {
  const options = useMemo(() => {
    return SOURCE_TYPES.map((type: SourceTypeOption) => ({
      value: type.value,
      label: type.label,
    }));
  }, []);

  return (
    <div className="filter-section">
      <div className="filter-label">
        <span className="filter-label-text">{LABEL}</span>
        <MultiSelect
          options={options}
          selected={selected}
          onChange={onChange}
          placeholder={PLACEHOLDER}
        />
      </div>
    </div>
  );
}
