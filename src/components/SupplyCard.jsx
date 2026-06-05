import { Heart, Leaf, RefreshCw } from 'lucide-react';

export default function SupplyCard({ card, isFavorite, isGenerating, onFavorite, onRegenerate }) {
  if (!card) {
    return (
      <section className="supply-card empty">
        <Leaf size={28} aria-hidden="true" />
        <h2>{isGenerating ? '正在从后端取一张补给' : '还没有抽取补给'}</h2>
        <p>{isGenerating ? '便利店小票机正在轻轻转动。' : '先选择此刻的模式和关注主题，再点击一个补给按钮。'}</p>
      </section>
    );
  }

  const isAiCard = card.source === 'openai';

  return (
    <section className="supply-card">
      <div className="card-top">
        <span className="tag">{card.mode}</span>
        <span className="tag sage">{card.topic}</span>
        {isAiCard && <span className="tag subtle">AI 生成</span>}
        {!card.matched && <span className="tag subtle">同类型随机</span>}
      </div>
      <h2>{card.title}</h2>
      <p className={isAiCard ? 'ai-answer' : undefined}>{card.content}</p>
      {!isAiCard && (
        <div className="card-tags" aria-label="补给标签">
          {card.tags.map((tag) => (
            <span className="mini-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="card-actions">
        <button className="favorite-button" type="button" onClick={onRegenerate}>
          <RefreshCw size={18} aria-hidden="true" />
          <span>{isGenerating ? '生成中' : '再来一张'}</span>
        </button>
        <button className={isFavorite ? 'favorite-button saved' : 'favorite-button'} type="button" onClick={onFavorite}>
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
          <span>{isFavorite ? '已收藏' : '收藏当前卡片'}</span>
        </button>
      </div>
    </section>
  );
}
