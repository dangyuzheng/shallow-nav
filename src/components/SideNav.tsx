import { memo, useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
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
  const lastScrollY = useRef(0);
  const isScrollingToTarget = useRef(false);

  const handleClick = useCallback((id: string) => {
    onCategoryChange(id);
    setMobileOpen(false);
    const el = document.getElementById(`category-${id}`);
    if (el) {
      isScrollingToTarget.current = true;
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      // Reset flag after scroll animation completes
      setTimeout(() => {
        isScrollingToTarget.current = false;
      }, 800);
    }
  }, [onCategoryChange]);

  // Advanced scroll tracking with direction awareness
  useEffect(() => {
    const TRIGGER_OFFSET = 100; // Section top triggers when it reaches this px from viewport top

    const handleScroll = () => {
      if (isScrollingToTarget.current) return;

      const scrollY = window.scrollY;
      const scrollDirection = scrollY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = scrollY;

      // At the very top, activate first category
      if (scrollY <= 10) {
        if (categories.length > 0 && activeCategory !== categories[0].id) {
          onCategoryChange(categories[0].id);
        }
        return;
      }

      // At the very bottom, activate last category
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      if (scrollY + winHeight >= docHeight - 20) {
        if (categories.length > 0 && activeCategory !== categories[categories.length - 1].id) {
          onCategoryChange(categories[categories.length - 1].id);
        }
        return;
      }

      // Find the section that should be active based on scroll position
      let activeId = categories[0]?.id;

      for (const cat of categories) {
        const el = document.getElementById(`category-${cat.id}`);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const sectionTop = rect.top;

        // Section is considered "active" when its top has scrolled past the trigger offset
        if (scrollDirection === 'down') {
          // Scrolling down: activate when section top enters the trigger zone
          if (sectionTop <= TRIGGER_OFFSET) {
            activeId = cat.id;
          } else {
            break; // Once we find a section that hasn't reached the trigger, stop
          }
        } else {
          // Scrolling up: activate when section top is below the trigger zone
          if (sectionTop <= TRIGGER_OFFSET) {
            activeId = cat.id;
          } else {
            break;
          }
        }
      }

      if (activeId && activeCategory !== activeId) {
        onCategoryChange(activeId);
      }
    };

    // Activate first category on mount
    if (categories.length > 0 && window.scrollY <= 10) {
      onCategoryChange(categories[0].id);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, activeCategory, onCategoryChange]);

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
