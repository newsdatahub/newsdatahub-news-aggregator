import React, { useMemo } from 'react';
import type { Country } from '../../constants/countries';
import { COUNTRIES } from '../../constants/countries';
import { MultiSelect } from '../MultiSelect';

const PLACEHOLDER: string = 'Select countries...';
const LABEL: string = 'Countries';

interface CountryFilterProps {
  selected: Country['code'][];
  onChange: (countries: string[]) => void;
}

export function CountryFilter({ selected, onChange }: CountryFilterProps): React.ReactElement {
  const options = useMemo(() => {
    return COUNTRIES.map((country: Country) => ({
      value: country.code,
      label: country.name,
      flag: country.flag,
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
          showFlags
        />
      </div>
    </div>
  );
}
