import { useState, useRef, useEffect } from 'react';
import { Search, X, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 200);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <motion.div
      className="search-bar-wrapper"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className={`search-bar ${isFocused ? 'focused' : ''}`}>
        <Search className="search-icon" size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder="搜索站点名称或描述..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              className="clear-btn"
              onClick={handleClear}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileTap={{ scale: 0.8 }}
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
        {!query && !isFocused && (
          <Compass className="search-hint-icon" size={16} />
        )}
      </div>
    </motion.div>
  );
}
