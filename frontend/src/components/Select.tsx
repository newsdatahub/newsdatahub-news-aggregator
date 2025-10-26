/**
 * Reusable select component
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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

export function Select({ options, selected, onChange, placeholder = 'Select...' }: SelectProps) {
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

  const selectedOption = options.find((opt) => opt.value === selected);

  return (
    <div className="select-container" ref={containerRef}>
      <div className="select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className={selectedOption ? 'select-value' : 'select-placeholder'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`select-arrow ${isOpen ? 'open' : ''}`} />
      </div>

      {isOpen && (
        <div className="select-dropdown">
          <div
            className="select-option"
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
          >
            <span className="option-label">{placeholder}</span>
          </div>
          {options.map((option) => (
            <div
              key={option.value}
              className={`select-option ${selected === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span className="option-label">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
