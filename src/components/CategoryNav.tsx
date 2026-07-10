import type { Category } from '../types';
import { motion } from 'framer-motion';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export function CategoryNav({ categories, activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <motion.div
      className="category-nav"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="category-tags-wrap">
        <button
          className={`category-tag ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
          style={activeCategory === 'all' ? { background: 'linear-gradient(135deg, #6366f1, #a78bfa)', color: '#fff', borderColor: 'transparent' } : {}}
        >
          <span className="tag-icon">✨</span>
          <span>全部</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tag ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
            style={activeCategory === cat.id ? { background: cat.gradient, color: '#fff', borderColor: 'transparent' } : {}}
          >
            <span className="tag-icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
