import { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryNav } from './components/CategoryNav';
import { SiteCard } from './components/SiteCard';
import { RecentVisits } from './components/RecentVisits';
import { Footer } from './components/Footer';
import { useFavorites } from './hooks/useFavorites';
import { useRecentVisits } from './hooks/useRecentVisits';
import { categories, sites, tagOptions } from './data/sites';
import { motion } from 'framer-motion';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { addVisit, getRecentSites, clearRecent } = useRecentVisits();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTagToggle = useCallback((tagId: string) => {
    setActiveTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  }, []);

  const handleClearTags = useCallback(() => {
    setActiveTags([]);
  }, []);

  const handleVisit = useCallback((siteId: string) => {
    addVisit(siteId);
  }, [addVisit]);

  const filteredSites = useMemo(() => {
    let result = sites;

    if (showFavoritesOnly) {
      result = result.filter(s => favorites.includes(s.id));
    }

    if (activeCategory !== 'all') {
      result = result.filter(s => s.category === activeCategory);
    }

    // Tag filtering (AND logic across groups, OR within group)
    if (activeTags.length > 0) {
      const costTags = activeTags.filter(t => tagOptions.find(o => o.id === t && o.group === 'cost'));
      const expTags = activeTags.filter(t => tagOptions.find(o => o.id === t && o.group === 'exp'));

      result = result.filter(s => {
        // Cost: match any selected cost tag
        const costMatch = costTags.length === 0 || (s.tags.cost && costTags.includes(s.tags.cost));
        // Exp: match all selected exp tags
        const expMatch = expTags.length === 0 || expTags.every(t => s.tags.exp?.includes(t));
        return costMatch && expMatch;
      });
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
  }, [searchQuery, activeCategory, showFavoritesOnly, favorites, activeTags]);

  const groupedSites = useMemo(() => {
    if (activeCategory !== 'all') {
      const cat = categories.find(c => c.id === activeCategory);
      return cat ? [{ category: cat, sites: filteredSites }] : [];
    }
    return categories
      .map(cat => ({
        category: cat,
        sites: filteredSites.filter(s => s.category === cat.id),
      }))
      .filter(g => g.sites.length > 0);
  }, [filteredSites, activeCategory]);

  const recentSites = useMemo(() => getRecentSites(sites), [getRecentSites]);

  return (
    <div className="app">
      <Header
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(v => !v)}
        favoriteCount={favorites.length}
      />

      <main className="main-content">
        <SearchBar onSearch={handleSearch} />
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          tagOptions={tagOptions}
          activeTags={activeTags}
          onTagToggle={handleTagToggle}
          onClearTags={handleClearTags}
        />

        {/* Recent visits */}
        {!showFavoritesOnly && !searchQuery && activeTags.length === 0 && (
          <RecentVisits sites={recentSites} onClear={clearRecent} />
        )}

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
              <section key={category.id} className="category-section">
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

      <Footer />
    </div>
  );
}

export default App;
