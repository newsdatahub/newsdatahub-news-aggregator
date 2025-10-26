/**
 * Date range filter component
 */

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from '../../utils/formatters';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

export function DateRangeFilter({ startDate, endDate, onChange }: DateRangeFilterProps) {
  const [start, setStart] = useState<Date | null>(startDate ? new Date(startDate) : null);
  const [end, setEnd] = useState<Date | null>(endDate ? new Date(endDate) : null);

  const handleStartChange = (date: Date | null) => {
    setStart(date);
    if (date) {
      onChange(formatDate(date), end ? formatDate(end) : '');
    }
  };

  const handleEndChange = (date: Date | null) => {
    setEnd(date);
    if (date) {
      onChange(start ? formatDate(start) : '', formatDate(date));
    }
  };

  const setQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStart(start);
    setEnd(end);
    onChange(formatDate(start), formatDate(end));
  };

  const clearDates = () => {
    setStart(null);
    setEnd(null);
    onChange('', '');
  };

  return (
    <div className="filter-section">
      <h3>Date Range</h3>
      <div className="date-quick-buttons">
        <button onClick={() => setQuickRange(7)} className="quick-button">
          7 days
        </button>
        <button onClick={() => setQuickRange(14)} className="quick-button">
          14 days
        </button>
        <button onClick={() => setQuickRange(30)} className="quick-button">
          30 days
        </button>
      </div>
      <div className="date-pickers">
        <div className="date-picker-wrapper">
          <label>Start Date</label>
          <DatePicker
            selected={start}
            onChange={handleStartChange}
            selectsStart
            startDate={start}
            endDate={end}
            maxDate={new Date()}
            placeholderText="Select start date"
            className="date-input"
          />
        </div>
        <div className="date-picker-wrapper">
          <label>End Date</label>
          <DatePicker
            selected={end}
            onChange={handleEndChange}
            selectsEnd
            startDate={start}
            endDate={end}
            minDate={start}
            maxDate={new Date()}
            placeholderText="Select end date"
            className="date-input"
          />
        </div>
      </div>
      {(start || end) && (
        <button onClick={clearDates} className="clear-dates-button">
          Clear Dates
        </button>
      )}
    </div>
  );
}
