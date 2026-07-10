import { useRef, useEffect, useState } from 'react';
import type { Category } from '../types';
import { motion } from 'framer-motion';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export function CategoryNav({ categories, activeCategory, onCategoryChange }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollTo = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -200 : 200;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <motion.div
      className="category-nav"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="category-nav-inner">
        {showLeft && (
          <button className="scroll-hint left" onClick={() => scrollTo('left')}>
            ‹
          </button>
        )}
        <div className="category-scroll" ref={scrollRef} onScroll={checkScroll}>
          <button
            className={`category-tag ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => onCategoryChange('all')}
            style={activeCategory === 'all' ? { background: 'linear-gradient(135deg, #6366f1, #a78bfa)', color: '#fff' } : {}}
          >
            <span className="tag-icon">✨</span>
            <span>全部</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-tag ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
              style={activeCategory === cat.id ? { background: cat.gradient, color: '#fff' } : {}}
            >
              <span className="tag-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
        {showRight && (
          <button className="scroll-hint right" onClick={() => scrollTo('right')}>
            ›
          </button>
        )}
      </div>
    </motion.div>
  );
}
