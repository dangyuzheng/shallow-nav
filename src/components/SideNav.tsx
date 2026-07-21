import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

  // Close mobile menu on category click
  const handleClick = (id: string) => {
    onCategoryChange(id);
    setMobileOpen(false);
    // Smooth scroll to section
    const el = document.getElementById(`category-${id}`);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Track active section on scroll
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
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
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
      {mobileOpen && (
        <div
          className="side-nav-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Side navigation */}
      <nav className={`side-nav ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="side-nav-header">
          <Compass size={18} className="side-nav-icon" />
          <span className="side-nav-title">分类导航</span>
        </div>
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
                {activeCategory === cat.id && (
                  <motion.div
                    className="side-nav-indicator"
                    layoutId="side-nav-indicator"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>
    </>
  );
});
