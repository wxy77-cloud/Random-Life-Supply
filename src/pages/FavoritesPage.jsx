import { Heart, Trash2 } from 'lucide-react';

export default function FavoritesPage({ favorites, onRemoveFavorite }) {
  return (
    <main className="page-layout narrow">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Saved Supplies</p>
          <h1>收藏页面</h1>
        </div>
        <Heart size={28} aria-hidden="true" />
      </div>

      {favorites.length === 0 ? (
        <section className="empty-list">
          <h2>暂时还没有收藏</h2>
          <p>回到补给站抽取一张卡片，喜欢的话就把它留在这里。</p>
        </section>
      ) : (
        <section className="favorite-list" aria-label="收藏的补给卡">
          {favorites.map((card) => (
            <article className="favorite-card" key={card.id}>
              <div className="card-top">
                <span className="tag">{card.mode}</span>
                <span className="tag sage">{card.topic}</span>
              </div>
              <h2>{card.title}</h2>
              <p>{card.content}</p>
              <div className="card-tags" aria-label="补给标签">
                {card.tags.map((tag) => (
                  <span className="mini-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <button className="delete-favorite-button" type="button" onClick={() => onRemoveFavorite(card.id)}>
                <Trash2 size={17} aria-hidden="true" />
                <span>删除收藏</span>
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
