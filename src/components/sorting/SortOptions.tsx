import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react';

export interface SortOption {
  id: string;
  label: string;
  value: string;
}

interface SortOptionsProps {
  options: SortOption[];
  defaultSort?: string;
  onChange: (sortId: string, direction: 'asc' | 'desc') => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  options,
  defaultSort,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(defaultSort || options[0]?.id);
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');

  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    onChange(sortId, direction);
    setIsOpen(false);
  };

  const toggleDirection = () => {
    const newDirection = direction === 'asc' ? 'desc' : 'asc';
    setDirection(newDirection);
    onChange(selectedSort, newDirection);
  };

  const selectedOption = options.find((option) => option.id === selectedSort);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <span>{selectedOption?.label || 'Sort By'}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDirection}
          className={`p-2 rounded-md border border-gray-200 dark:border-gray-700 ${
            direction === 'asc'
              ? 'bg-blue-50 dark:bg-blue-900/20'
              : 'bg-white dark:bg-gray-800'
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
          >
            {options.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                onClick={() => handleSortChange(option.id)}
                className="w-full px-4 py-2 text-left flex items-center justify-between"
              >
                <span>{option.label}</span>
                {selectedSort === option.id && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortOptions;
