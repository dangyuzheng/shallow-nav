import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoriteCount: number;
  onLogoClick: () => void;
}

export function Header({ showFavoritesOnly, onToggleFavorites, favoriteCount, onLogoClick }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-left" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
          <div className="logo">
            <img src="/logo.png" alt="浅途 Nav" className="logo-img" />
            <div className="logo-text">
              <h1>浅途 Nav</h1>
              <span className="slogan">轻浅行路，直达实用良站</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <motion.button
            className={`fav-filter-btn ${showFavoritesOnly ? 'active' : ''}`}
            onClick={onToggleFavorites}
            whileTap={{ scale: 0.92 }}
          >
            <Heart size={16} fill={showFavoritesOnly ? '#f43f5e' : 'none'} stroke={showFavoritesOnly ? '#f43f5e' : 'currentColor'} />
            <span>我的收藏</span>
            {favoriteCount > 0 && (
              <span className="fav-count">{favoriteCount}</span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
