import { Heart, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface HeaderProps {
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoriteCount: number;
}

export function Header({ showFavoritesOnly, onToggleFavorites, favoriteCount }: HeaderProps) {
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-left">
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

      <AnimatePresence>
        {showBackTop && (
          <motion.button
            className="back-top-btn"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </header>
  );
}
