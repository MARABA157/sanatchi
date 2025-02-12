import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'range' | 'checkbox' | 'radio';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

interface FilterState {
  [key: string]: string | number | boolean | string[];
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  onFilterChange: (filters: FilterState) => void;
  initialState?: FilterState;
  className?: string;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  initialState = {},
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>(initialState);

  const handleFilterChange = (id: string, value: string | number | boolean | string[]) => {
    const newState = { ...filterState, [id]: value };
    setFilterState(newState);
    onFilterChange(newState);
  };

  const clearFilters = () => {
    setFilterState({});
    onFilterChange({});
  };

  const renderFilterInput = (filter: FilterOption) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            value={filterState[filter.id] as string || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
          >
            <option value="">All</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'range':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={filter.min}
              max={filter.max}
              step={filter.step}
              value={filterState[filter.id] as number || filter.min}
              onChange={(e) => handleFilterChange(filter.id, Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm">
              {filterState[filter.id] || filter.min}
            </span>
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(filterState[filter.id] as string[] || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValues = filterState[filter.id] as string[] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v) => v !== option.value);
                    handleFilterChange(filter.id, newValues);
                  }}
                  className="form-checkbox"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={filter.id}
                  value={option.value}
                  checked={filterState[filter.id] === option.value}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  className="form-radio"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {Object.keys(filterState).length > 0 && (
          <span className="bg-blue-500 text-white text-xs rounded-full px-2">
            {Object.keys(filterState).length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 right-0 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Advanced Filters
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {filters.map((filter) => (
                <div key={filter.id}>
                  <label className="block text-sm font-medium mb-1">
                    {filter.label}
                  </label>
                  {renderFilterInput(filter)}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Clear All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedFilters;
