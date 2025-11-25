/**
 * Language filter component
 */

import React, { useMemo } from 'react';
import type { Language } from '../../constants/languages';
import { LANGUAGES } from '../../constants/languages';
import { Select } from '../Select';

const PLACEHOLDER: string = 'All Languages';
const LABEL: string = 'Language';

interface LanguageFilterProps {
  selected: Language['code'];
  onChange: (language: string) => void;
}

export function LanguageFilter({ selected, onChange }: LanguageFilterProps): React.ReactElement {
  const options = useMemo(() => {
    return LANGUAGES.map((lang: Language) => ({
      value: lang.code,
      label: lang.name,
    }));
  }, []);

  return (
    <div className="filter-section">
      <div className="filter-label">
        <span className="filter-label-text">{LABEL}</span>
        <Select
          options={options}
          selected={selected}
          onChange={onChange}
          placeholder={PLACEHOLDER}
        />
      </div>
    </div>
  );
}
