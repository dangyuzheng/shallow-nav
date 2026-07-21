import { memo, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Menu, X } from 'lucide-react';
import type { Category } from '../types';

interface SideNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export const SideNav = memo(function SideNav({
  categories,
  activeCategory,
  onCategoryChange,
}: SideNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = useCallback((id: string) => {
    onCategoryChange(id);
    setMobileOpen(false);
    const el = document.getElementById(`category-${id}`);
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }, [onCategoryChange]);

  // Track active section on scroll - trigger when section reaches upper-middle area
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('category-', '');
            onCategoryChange(id);
          }
        });
      },
      {
        // Trigger when section top enters the area between 80px from top and 45% of viewport height
        rootMargin: '-80px 0px -55% 0px',
        threshold: 0,
      }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(`category-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories, onCategoryChange]);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="side-nav-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="side-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Side navigation */}
      <nav className={`side-nav ${mobileOpen ? 'mobile-open' : ''}`}>
        <ul className="side-nav-list">
          {categories.map((cat) => (
            <motion.li
              key={cat.id}
              whileTap={{ scale: 0.97 }}
            >
              <button
                className={`side-nav-item ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleClick(cat.id)}
              >
                <span className="side-nav-item-icon">{cat.icon}</span>
                <span className="side-nav-item-text">{cat.name}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>
    </>
  );
});
