import { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SideNav } from './components/SideNav';
import { SiteCard } from './components/SiteCard';
import { RecentVisits } from './components/RecentVisits';
import { Footer } from './components/Footer';
import { useFavorites } from './hooks/useFavorites';
import { useRecentVisits } from './hooks/useRecentVisits';
import { categories, sites } from './data/sites';
import { motion } from 'framer-motion';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { addVisit, getRecentSites, clearRecent } = useRecentVisits();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleVisit = useCallback((siteId: string) => {
    addVisit(siteId);
  }, [addVisit]);

  const filteredSites = useMemo(() => {
    let result = sites;

    if (showFavoritesOnly) {
      result = result.filter(s => favorites.includes(s.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, showFavoritesOnly, favorites]);

  const groupedSites = useMemo(() => {
    return categories
      .map(cat => ({
        category: cat,
        sites: filteredSites.filter(s => s.category === cat.id),
      }))
      .filter(g => g.sites.length > 0);
  }, [filteredSites]);

  const recentSites = useMemo(() => getRecentSites(sites), [getRecentSites]);

  return (
    <div className="app">
      <Header
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(v => !v)}
        favoriteCount={favorites.length}
      />

      <div className="app-body">
        <SideNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <main className="main-content">
          {/* Hero section: search + recent visits + background placeholder */}
          <section className="hero-section">
            <div className="hero-bg-placeholder" />
            <div className="hero-content">
              <SearchBar onSearch={handleSearch} />
              {!showFavoritesOnly && !searchQuery && (
                <RecentVisits sites={recentSites} onClear={clearRecent} />
              )}
            </div>
          </section>

          {/* Sites grid */}
          <div className="sites-container">
            {groupedSites.length === 0 ? (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="empty-icon">
                  {showFavoritesOnly ? '💫' : '🔍'}
                </div>
                <p className="empty-title">
                  {showFavoritesOnly ? '还没有收藏的站点' : '没有找到匹配的站点'}
                </p>
                <p className="empty-desc">
                  {showFavoritesOnly ? '点击卡片上的爱心图标收藏喜欢的站点' : '试试其他关键词或分类'}
                </p>
              </motion.div>
            ) : (
              groupedSites.map(({ category, sites: catSites }) => (
                <section key={category.id} id={`category-${category.id}`} className="category-section">
                  <div className="section-header">
                    <span className="section-icon">{category.icon}</span>
                    <h2 className="section-title">{category.name}</h2>
                    <span className="section-count">{catSites.length}</span>
                  </div>
                  <div className="sites-grid">
                    {catSites.map((site, i) => (
                      <SiteCard
                        key={site.id}
                        site={site}
                        isFavorite={isFavorite(site.id)}
                        onToggleFavorite={toggleFavorite}
                        onVisit={handleVisit}
                        index={i}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
