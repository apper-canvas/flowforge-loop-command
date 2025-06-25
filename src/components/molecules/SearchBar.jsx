import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = '',
  debounceMs = 300 
}) => {
  const [query, setQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onSearch?.(value);
    }, debounceMs);

    setDebounceTimer(timer);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch?.('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <ApperIcon name="Search" size={18} />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="
          w-full pl-11 pr-10 py-3 bg-surface-800 border border-surface-600 rounded-lg
          text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200
        "
      />
      {query && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={clearSearch}
          className="
            absolute right-3 top-1/2 -translate-y-1/2 
            text-gray-400 hover:text-white transition-colors p-1
          "
        >
          <ApperIcon name="X" size={16} />
        </motion.button>
      )}
    </div>
  );
};

export default SearchBar;