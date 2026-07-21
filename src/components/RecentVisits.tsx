import { memo } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Site } from '../types';

interface RecentVisitsProps {
  sites: Site[];
  onClear: () => void;
}

export const RecentVisits = memo(function RecentVisits({ sites, onClear }: RecentVisitsProps) {
  if (sites.length === 0) return null;

  return (
    <motion.div
      className="recent-visits"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="recent-header">
        <div className="recent-title-wrap">
          <Clock size={14} className="recent-icon" />
          <span className="recent-title">最近访问</span>
        </div>
        <button className="recent-clear" onClick={onClear} title="清除记录">
          <Trash2 size={12} />
          <span>清除</span>
        </button>
      </div>
      <div className="recent-list">
        {sites.map(site => (
          <a
            key={site.id}
            className="recent-item"
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            <span className="recent-dot" />
            <span className="recent-name">{site.name}</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
});
