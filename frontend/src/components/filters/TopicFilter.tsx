/**
 * Topic filter component
 */

import React, { useMemo } from 'react';
import type { Topic } from '../../constants/topics';
import { TOPICS } from '../../constants/topics';
import { capitalizeWords } from '../../utils/formatters';
import { MultiSelect } from '../MultiSelect';

const PLACEHOLDER_INCLUDE: string = 'Select topics...';
const PLACEHOLDER_EXCLUDE: string = 'Exclude topics...';
const LABEL_INCLUDE: string = 'Topics';
const LABEL_EXCLUDE: string = 'Exclude Topics';

interface TopicFilterProps {
  selected: Topic[];
  onChange: (topics: Topic[]) => void;
  isExclude?: boolean;
}

export function TopicFilter({ selected, onChange, isExclude = false }: TopicFilterProps): React.ReactElement {
  const options = useMemo(() => {
    return TOPICS.map((topic: Topic) => ({
      value: topic,
      label: capitalizeWords(topic),
    }));
  }, []);

  const placeholder: string = isExclude ? PLACEHOLDER_EXCLUDE : PLACEHOLDER_INCLUDE;
  const label: string = isExclude ? LABEL_EXCLUDE : LABEL_INCLUDE;

  return (
    <div className="filter-section">
      <div className="filter-label">
        <span className="filter-label-text">{label}</span>
        <MultiSelect
          options={options}
          selected={selected}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
