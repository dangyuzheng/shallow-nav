import { memo } from 'react';
import type { Category, TagOption } from '../types';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  tagOptions: TagOption[];
  activeTags: string[];
  onTagToggle: (tagId: string) => void;
  onClearTags: () => void;
}

export const CategoryNav = memo(function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
  tagOptions,
  activeTags,
  onTagToggle,
  onClearTags,
}: CategoryNavProps) {
  const costTags = tagOptions.filter(t => t.group === 'cost');
  const expTags = tagOptions.filter(t => t.group === 'exp');

  return (
    <div className="category-nav">
      {/* Category pills */}
      <div className="category-pills">
        <button
          className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          全部
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            <span className="pill-icon">{cat.icon}</span>
            <span className="pill-text">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Tag filters */}
      <div className="tag-filters">
        <div className="tag-group">
          <span className="tag-group-label">费用</span>
          <div className="tag-options">
            {costTags.map(tag => (
              <button
                key={tag.id}
                className={`tag-btn ${activeTags.includes(tag.id) ? 'active' : ''}`}
                style={activeTags.includes(tag.id) ? { '--tag-color': tag.color } as React.CSSProperties : undefined}
                onClick={() => onTagToggle(tag.id)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
        <div className="tag-group">
          <span className="tag-group-label">体验</span>
          <div className="tag-options">
            {expTags.map(tag => (
              <button
                key={tag.id}
                className={`tag-btn ${activeTags.includes(tag.id) ? 'active' : ''}`}
                style={activeTags.includes(tag.id) ? { '--tag-color': tag.color } as React.CSSProperties : undefined}
                onClick={() => onTagToggle(tag.id)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
        {activeTags.length > 0 && (
          <button className="tag-clear" onClick={onClearTags}>
            清除筛选
          </button>
        )}
      </div>
    </div>
  );
});
