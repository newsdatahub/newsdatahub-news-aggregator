/**
 * Date range filter component
 */

import React, { useState, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from '../../utils/formatters';

const LABEL: string = 'Date Range';
const LABEL_START: string = 'Start Date';
const LABEL_END: string = 'End Date';
const PLACEHOLDER_START: string = 'Select start date';
const PLACEHOLDER_END: string = 'Select end date';
const BUTTON_7_DAYS: string = '7 days';
const BUTTON_14_DAYS: string = '14 days';
const BUTTON_30_DAYS: string = '30 days';
const BUTTON_CLEAR: string = 'Clear Dates';
const QUICK_RANGE_7: number = 7;
const QUICK_RANGE_14: number = 14;
const QUICK_RANGE_30: number = 30;

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

export function DateRangeFilter({ startDate, endDate, onChange }: DateRangeFilterProps): React.ReactElement {
  const [start, setStart] = useState<Date | null>(startDate ? new Date(startDate) : null);
  const [end, setEnd] = useState<Date | null>(endDate ? new Date(endDate) : null);

  const handleStartChange = useCallback((date: Date | null): void => {
    setStart(date);
    if (date) {
      const formattedStart: string = formatDate(date);
      const formattedEnd: string = end ? formatDate(end) : '';
      onChange(formattedStart, formattedEnd);
    }
  }, [end, onChange]);

  const handleEndChange = useCallback((date: Date | null): void => {
    setEnd(date);
    if (date) {
      const formattedStart: string = start ? formatDate(start) : '';
      const formattedEnd: string = formatDate(date);
      onChange(formattedStart, formattedEnd);
    }
  }, [start, onChange]);

  const setQuickRange = useCallback((days: number): void => {
    const endDate: Date = new Date();
    const startDate: Date = new Date();
    startDate.setDate(startDate.getDate() - days);
    setStart(startDate);
    setEnd(endDate);
    onChange(formatDate(startDate), formatDate(endDate));
  }, [onChange]);

  const clearDates = useCallback((): void => {
    setStart(null);
    setEnd(null);
    onChange('', '');
  }, [onChange]);

  const maxDate: Date = new Date();

  return (
    <div className="filter-section">
      <h3>{LABEL}</h3>
      <div className="date-quick-buttons">
        <button onClick={() => setQuickRange(QUICK_RANGE_7)} className="quick-button" type="button">
          {BUTTON_7_DAYS}
        </button>
        <button onClick={() => setQuickRange(QUICK_RANGE_14)} className="quick-button" type="button">
          {BUTTON_14_DAYS}
        </button>
        <button onClick={() => setQuickRange(QUICK_RANGE_30)} className="quick-button" type="button">
          {BUTTON_30_DAYS}
        </button>
      </div>
      <div className="date-pickers">
        <div className="date-picker-wrapper">
          <label>{LABEL_START}</label>
          <DatePicker
            selected={start}
            onChange={handleStartChange}
            selectsStart
            startDate={start}
            endDate={end}
            maxDate={maxDate}
            placeholderText={PLACEHOLDER_START}
            className="date-input"
          />
        </div>
        <div className="date-picker-wrapper">
          <label>{LABEL_END}</label>
          <DatePicker
            selected={end}
            onChange={handleEndChange}
            selectsEnd
            startDate={start}
            endDate={end}
            minDate={start}
            maxDate={maxDate}
            placeholderText={PLACEHOLDER_END}
            className="date-input"
          />
        </div>
      </div>
      {(start || end) && (
        <button onClick={clearDates} className="clear-dates-button" type="button">
          {BUTTON_CLEAR}
        </button>
      )}
    </div>
  );
}
