/**
 * Reusable multi-select component
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';

const ICON_SIZE_ARROW: number = 16;
const ICON_SIZE_X: number = 12;
const DEFAULT_PLACEHOLDER: string = 'Select...';
const ARROW_CLASS_OPEN: string = 'open';

interface MultiSelectOption<T = string> {
  value: T;
  label: string;
  flag?: string;
}

interface MultiSelectProps<T = string> {
  options: MultiSelectOption<T>[];
  selected: T[];
  onChange: (values: T[]) => void;
  placeholder?: string;
  showFlags?: boolean;
  renderTag?: (value: T) => React.ReactNode;
  renderOption?: (value: T, label: string) => React.ReactNode;
}

export function MultiSelect<T = string>({
  options,
  selected,
  onChange,
  placeholder = DEFAULT_PLACEHOLDER,
  showFlags = false,
  renderTag,
  renderOption,
}: MultiSelectProps<T>): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = useCallback((): void => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const toggleOption = useCallback((value: T): void => {
    if (selected.includes(value)) {
      const newSelected: T[] = selected.filter((v: T) => v !== value);
      onChange(newSelected);
    } else {
      const newSelected: T[] = [...selected, value];
      onChange(newSelected);
    }
  }, [selected, onChange]);

  const removeOption = useCallback((value: T, e: React.MouseEvent): void => {
    e.stopPropagation();
    const newSelected: T[] = selected.filter((v: T) => v !== value);
    onChange(newSelected);
  }, [selected, onChange]);

  const selectedOptions: MultiSelectOption<T>[] = useMemo(() => {
    return options.filter((opt: MultiSelectOption<T>) => selected.includes(opt.value));
  }, [options, selected]);

  const arrowClass: string = `multiselect-arrow ${isOpen ? ARROW_CLASS_OPEN : ''}`;

  return (
    <div className="multiselect-container" ref={containerRef}>
      <div className="multiselect-trigger" onClick={handleToggle}>
        <div className="multiselect-values">
          {selectedOptions.length === 0 ? (
            <span className="multiselect-placeholder">{placeholder}</span>
          ) : (
            <div className="multiselect-tags">
              {selectedOptions.map((option: MultiSelectOption<T>) => (
                <span key={String(option.value)} className="multiselect-tag">
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
                    onClick={(e: React.MouseEvent) => removeOption(option.value, e)}
                    type="button"
                  >
                    <X size={ICON_SIZE_X} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronDown size={ICON_SIZE_ARROW} className={arrowClass} />
      </div>

      {isOpen && (
        <div className="multiselect-dropdown">
          {options.map((option: MultiSelectOption<T>) => (
            <label key={String(option.value)} className="multiselect-option">
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
