/**
 * Country filter component
 */

import { COUNTRIES } from '../../constants/countries';
import { MultiSelect } from '../MultiSelect';

interface CountryFilterProps {
  selected: string[];
  onChange: (countries: string[]) => void;
}

export function CountryFilter({ selected, onChange }: CountryFilterProps) {
  const options = COUNTRIES.map((country) => ({
    value: country.code,
    label: country.name,
    flag: country.flag,
  }));

  return (
    <div className="filter-section">
      <h3>Countries</h3>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={onChange}
        placeholder="Select countries..."
        showFlags={true}
      />
    </div>
  );
}
