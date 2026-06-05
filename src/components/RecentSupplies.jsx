import { Eye, Heart, Trash2 } from 'lucide-react';
import ExpandableText from './ExpandableText.jsx';

export default function RecentSupplies({ history, favorites, onView, onFavorite, onClear }) {
  if (history.length === 0) {
    return (
      <section className="recent-panel">
        <div className="recent-heading">
          <div>
            <p className="eyebrow">Recent Supplies</p>
            <h2>近期补给</h2>
          </div>
        </div>
        <p className="recent-empty">生成过的补给会自动出现在这里，最多保留最近 20 条。</p>
      </section>
    );
  }

  return (
    <section className="recent-panel">
      <div className="recent-heading">
        <div>
          <p className="eyebrow">Recent Supplies</p>
          <h2>近期补给</h2>
        </div>
        <button className="text-tool-button" type="button" onClick={onClear}>
          <Trash2 size={16} aria-hidden="true" />
          <span>清空</span>
        </button>
      </div>

      <div className="recent-list" aria-label="最近收到的补给">
        {history.map((card) => {
          const isFavorite = favorites.some((item) => item.id === card.id);

          return (
            <article className="recent-card" key={`${card.receivedAt}-${card.id}`}>
              <div className="card-top compact">
                <span className="tag">{card.mode}</span>
                <span className="tag sage">{card.topic}</span>
              </div>
              <h3>{card.title}</h3>
              <ExpandableText text={card.content} limit={90} />
              <div className="recent-card-actions">
                <button className="small-tool-button" type="button" onClick={() => onView(card)}>
                  <Eye size={16} aria-hidden="true" />
                  <span>查看</span>
                </button>
                <button
                  className={isFavorite ? 'small-tool-button saved' : 'small-tool-button'}
                  type="button"
                  onClick={() => onFavorite(card)}
                  disabled={isFavorite}
                >
                  <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
                  <span>{isFavorite ? '已收藏' : '收藏'}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
