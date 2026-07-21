import { memo, useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Site } from "../types";

interface SiteCardProps {
  site: Site;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onVisit: (id: string) => void;
  index: number;
}

export const SiteCard = memo(function SiteCard({
  site,
  isFavorite,
  onToggleFavorite,
  onVisit,
  index,
}: SiteCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleFavorite(site.id);
    },
    [site.id, onToggleFavorite],
  );

  const handleCardClick = useCallback(() => {
    onVisit(site.id);
  }, [site.id, onVisit]);

  const costLabel =
    site.tags.cost === "free"
      ? "免费"
      : site.tags.cost === "paid"
        ? "付费"
        : "部分免费";
  const costClass = site.tags.cost || "";

  return (
    <motion.a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="site-card"
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
    >
      {/* Card body */}
      <div className="card-body">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="card-logo">
            {imgError ? (
              <div
                className="logo-fallback"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                }}
              >
                {site.name.charAt(0)}
              </div>
            ) : (
              <img
                src={site.logo}
                alt={site.name}
                onError={() => setImgError(true)}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          {/* Favorite button */}
          <button
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "取消收藏" : "收藏"}
          >
            <Heart size={16} fill={isFavorite ? "#f43f5e" : "none"} />
          </button>
        </div>
        <div className="card-info">
          <h3 className="card-name">{site.name}</h3>
          <p className="card-desc">{site.description}</p>
          <div className="card-tags">
            {costLabel && (
              <span className={`card-tag cost-${costClass}`}>{costLabel}</span>
            )}
            {site.tags.speed?.includes("slow") && (
              <span className="card-tag speed-slow">慢速</span>
            )}
            {site.tags.exp?.includes("install") && (
              <span className="card-tag install">需要安装</span>
            )}
          </div>
        </div>
      </div>
    </motion.a>
  );
});
