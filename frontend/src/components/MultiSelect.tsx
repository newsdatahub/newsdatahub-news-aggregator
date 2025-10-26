/**
 * Reusable multi-select component
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface MultiSelectOption {
  value: string;
  label: string;
  flag?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  showFlags?: boolean;
  renderTag?: (value: string) => React.ReactNode;
  renderOption?: (value: string, label: string) => React.ReactNode;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  showFlags = false,
  renderTag,
  renderOption,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  const selectedOptions = options.filter((opt) => selected.includes(opt.value));

  return (
    <div className="multiselect-container" ref={containerRef}>
      <div className="multiselect-trigger" onClick={() => setIsOpen(!isOpen)}>
        <div className="multiselect-values">
          {selectedOptions.length === 0 ? (
            <span className="multiselect-placeholder">{placeholder}</span>
          ) : (
            <div className="multiselect-tags">
              {selectedOptions.map((option) => (
                <span key={option.value} className="multiselect-tag">
                  {renderTag ? (
                    renderTag(option.value)
                  ) : (
                    <>
                      {showFlags && option.flag && <span className="tag-flag">{option.flag}</span>}
                      <span className="tag-label">{option.label}</span>
                    </>
                  )}
                  <button
                    className="tag-remove"
                    onClick={(e) => removeOption(option.value, e)}
                    type="button"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronDown size={16} className={`multiselect-arrow ${isOpen ? 'open' : ''}`} />
      </div>

      {isOpen && (
        <div className="multiselect-dropdown">
          {options.map((option) => (
            <label key={option.value} className="multiselect-option">
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggleOption(option.value)}
              />
              {renderOption ? (
                renderOption(option.value, option.label)
              ) : (
                <>
                  {showFlags && option.flag && <span className="option-flag">{option.flag}</span>}
                  <span className="option-label">{option.label}</span>
                </>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
