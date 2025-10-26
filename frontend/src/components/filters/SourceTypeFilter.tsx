/**
 * Source type filter component
 */

import { SOURCE_TYPES } from '../../constants/filters';
import { MultiSelect } from '../MultiSelect';

interface SourceTypeFilterProps {
  selected: string[];
  onChange: (types: string[]) => void;
}

export function SourceTypeFilter({ selected, onChange }: SourceTypeFilterProps) {
  const options = SOURCE_TYPES.map((type) => ({
    value: type.value,
    label: type.label,
  }));

  return (
    <div className="filter-section">
      <h3>Source Type</h3>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={onChange}
        placeholder="Select source types..."
      />
    </div>
  );
}
