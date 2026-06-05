import { Heart, Leaf, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import ExpandableText from './ExpandableText.jsx';

const loadingMessages = [
  '正在寻找一个不急着给出答案的答案...',
  '请稍等，一张小纸条正在靠近你...',
  '正在从今日的缝隙里打捞一点灵感…',
  '请稍等，随机命运正在排队结账...',
  '补给机正在轻轻运转…',
  '鸟儿正在从云端衔来一枚小小答案...',
  '故事还在路上，风已经先到了...',
  '今日补给正在装袋...',
  '请稍等，小票机正在思考人生，但不负责改变人生...',
  '灵感正在慢慢醒来...',
  '故事碎片正在海面上漂来...',
  '正在给今天开一扇很小的窗...',
  '请稍等，补给员正在摸鱼...'
];

export default function SupplyCard({ card, isFavorite, isGenerating, onFavorite, onRegenerate }) {
  if (isGenerating) {
    return <LoadingSupplyCard />;
  }

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
      <ExpandableText text={card.content} className={isAiCard ? 'ai-answer' : undefined} limit={190} />
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

function LoadingSupplyCard() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % loadingMessages.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="supply-card loading-card" aria-live="polite">
      <div className="receipt-loader" aria-hidden="true">
        <div className="loader-machine">
          <span />
          <span />
          <span />
        </div>
        <div className="loader-paper">
          <i />
          <i />
          <i />
        </div>
      </div>
      <h2>正在生成补给</h2>
      <p className="loading-message">{loadingMessages[messageIndex]}</p>
    </section>
  );
}
