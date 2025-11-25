/**
 * Reusable select component
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

const ICON_SIZE: number = 16;
const DEFAULT_PLACEHOLDER: string = 'Select...';
const ARROW_CLASS_OPEN: string = 'open';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  selected: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Select({ options, selected, onChange, placeholder = DEFAULT_PLACEHOLDER }: SelectProps): React.ReactElement {
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

  const handleSelectOption = useCallback((value: string): void => {
    onChange(value);
    setIsOpen(false);
  }, [onChange]);

  const handleClearSelection = useCallback((): void => {
    onChange('');
    setIsOpen(false);
  }, [onChange]);

  const selectedOption: SelectOption | undefined = options.find((opt: SelectOption) => opt.value === selected);
  const displayText: string = selectedOption ? selectedOption.label : placeholder;
  const displayClass: string = selectedOption ? 'select-value' : 'select-placeholder';
  const arrowClass: string = `select-arrow ${isOpen ? ARROW_CLASS_OPEN : ''}`;

  return (
    <div className="select-container" ref={containerRef}>
      <div className="select-trigger" onClick={handleToggle}>
        <span className={displayClass}>
          {displayText}
        </span>
        <ChevronDown size={ICON_SIZE} className={arrowClass} />
      </div>

      {isOpen && (
        <div className="select-dropdown">
          <div
            className="select-option"
            onClick={handleClearSelection}
          >
            <span className="option-label">{placeholder}</span>
          </div>
          {options.map((option: SelectOption) => {
            const optionClass: string = `select-option ${selected === option.value ? 'selected' : ''}`;
            return (
              <div
                key={option.value}
                className={optionClass}
                onClick={() => handleSelectOption(option.value)}
              >
                <span className="option-label">{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
