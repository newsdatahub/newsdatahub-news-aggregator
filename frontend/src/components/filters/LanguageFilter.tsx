/**
 * Language filter component
 */

import { LANGUAGES } from '../../constants/languages';
import { Select } from '../Select';

interface LanguageFilterProps {
  selected: string;
  onChange: (language: string) => void;
}

export function LanguageFilter({ selected, onChange }: LanguageFilterProps) {
  const options = LANGUAGES.map((lang) => ({
    value: lang.code,
    label: lang.name,
  }));

  return (
    <div className="filter-section">
      <h3>Language</h3>
      <Select
        options={options}
        selected={selected}
        onChange={onChange}
        placeholder="All Languages"
      />
    </div>
  );
}
