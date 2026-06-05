import CustomTopicInput from '../components/CustomTopicInput.jsx';
import OptionGroup from '../components/OptionGroup.jsx';
import RecentSupplies from '../components/RecentSupplies.jsx';
import SupplyActions from '../components/SupplyActions.jsx';
import SupplyCard from '../components/SupplyCard.jsx';
import { modes, supplyTypes, topics } from '../data/options.js';

export default function StationPage({
  selectedMode,
  selectedTopic,
  customTopic,
  currentCard,
  favorites,
  history,
  isGenerating,
  onModeChange,
  onTopicChange,
  onCustomTopicChange,
  onGenerate,
  onRegenerate,
  onToggleFavorite,
  onViewHistory,
  onFavoriteHistory,
  onClearHistory
}) {
  const isFavorite = currentCard ? favorites.some((item) => item.id === currentCard.id) : false;

  return (
    <main className="page-layout">
      <div className="intro-panel">
        <p className="eyebrow">Random Life Supply</p>
        <h1>随机人生补给站</h1>
        <p>为当下的你抽一张轻轻的生活补给卡。</p>
      </div>

      <div className="station-grid">
        <div className="control-panel">
          <OptionGroup label="当前模式" options={modes} value={selectedMode} onChange={onModeChange} />
          <OptionGroup label="关注主题" options={topics} value={selectedTopic} onChange={onTopicChange} />
          <CustomTopicInput value={customTopic} onChange={onCustomTopicChange} />
          <SupplyActions supplyTypes={supplyTypes} onGenerate={onGenerate} />
        </div>

        <SupplyCard
          key={currentCard?.generatedAt ?? 'empty-card'}
          card={currentCard}
          isFavorite={isFavorite}
          isGenerating={isGenerating}
          onFavorite={onToggleFavorite}
          onRegenerate={onRegenerate}
        />
      </div>

      <RecentSupplies
        history={history}
        favorites={favorites}
        onView={onViewHistory}
        onFavorite={onFavoriteHistory}
        onClear={onClearHistory}
      />
    </main>
  );
}
