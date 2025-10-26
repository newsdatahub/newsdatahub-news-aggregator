/**
 * Topic filter component
 */

import { TOPICS } from '../../constants/topics';
import { capitalizeWords } from '../../utils/formatters';
import { MultiSelect } from '../MultiSelect';

interface TopicFilterProps {
  selected: string[];
  onChange: (topics: string[]) => void;
  isExclude?: boolean;
}

export function TopicFilter({ selected, onChange, isExclude = false }: TopicFilterProps) {
  const options = TOPICS.map((topic) => ({
    value: topic,
    label: capitalizeWords(topic),
  }));

  return (
    <div className="filter-section">
      <h3>{isExclude ? 'Exclude Topics' : 'Topics'}</h3>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={onChange}
        placeholder={isExclude ? 'Exclude topics...' : 'Select topics...'}
      />
    </div>
  );
}
