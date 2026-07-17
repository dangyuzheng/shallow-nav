import { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Site } from '../types';
import { categories } from '../data/sites';

interface SiteCardProps {
  site: Site;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  index: number;
}

export function SiteCard({ site, isFavorite, onToggleFavorite, index }: SiteCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleFavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(site.id);
  };

  const category = categories.find(c => c.id === site.category);
  const fallbackGradient = category?.gradient || 'linear-gradient(135deg, #6366f1, #a78bfa)';

  return (
    <motion.a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="site-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.35 }}
      whileHover={{ y: -4 }}
    >
      <div className="card-header">
        <div className="card-logo">
          {!imgError ? (
            <img
              src={site.logo}
              alt={site.name}
              onError={() => setImgError(true)}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="logo-fallback" style={{ background: fallbackGradient }}>
              {site.name[0]}
            </span>
          )}
        </div>
        <motion.button
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavClick}
          whileTap={{ scale: 0.7 }}
          aria-label={isFavorite ? '取消收藏' : '收藏'}
        >
          <Heart
            size={16}
            fill={isFavorite ? '#f43f5e' : 'none'}
            stroke={isFavorite ? '#f43f5e' : 'currentColor'}
          />
        </motion.button>
      </div>
      <div className="card-body">
        <h3 className="card-title">{site.name}</h3>
        <p className="card-desc">{site.description}</p>
      </div>
    </motion.a>
  );
}
