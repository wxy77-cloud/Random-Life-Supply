import { useState } from 'react';
import Header from './components/Header.jsx';
import AboutPage from './pages/AboutPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import StationPage from './pages/StationPage.jsx';
import { modes, topics } from './data/options.js';
import { generateSupply } from './services/supplyApi.js';
import { favoriteStore } from './storage/favoriteStore.js';
import { historyStore } from './storage/historyStore.js';

export default function App() {
  const [currentPage, setCurrentPage] = useState('station');
  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [currentCard, setCurrentCard] = useState(null);
  const [favorites, setFavorites] = useState(() => favoriteStore.list());
  const [history, setHistory] = useState(() => historyStore.list());
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate(type) {
    await requestSupply({ type, mode: selectedMode, topic: getActiveTopic() });
  }

  async function handleRegenerate() {
    if (!currentCard) return;

    await requestSupply({
      type: currentCard.type,
      mode: selectedMode,
      topic: getActiveTopic(),
      currentId: currentCard.id
    });
  }

  function getActiveTopic() {
    return customTopic.trim() || selectedTopic;
  }

  async function requestSupply(params) {
    setIsGenerating(true);

    try {
      const card = await generateSupply(params);
      receiveSupply(card);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  function receiveSupply(card) {
    if (!card) return;

    setCurrentCard(card);
    setHistory(historyStore.add(card));
  }

  function renderPage() {
    if (currentPage === 'favorites') {
      return <FavoritesPage favorites={favorites} onRemoveFavorite={handleRemoveFavorite} />;
    }

    if (currentPage === 'about') {
      return <AboutPage />;
    }

    return (
      <StationPage
        selectedMode={selectedMode}
        selectedTopic={selectedTopic}
        customTopic={customTopic}
        currentCard={currentCard}
        favorites={favorites}
        history={history}
        isGenerating={isGenerating}
        onModeChange={setSelectedMode}
        onTopicChange={setSelectedTopic}
        onCustomTopicChange={setCustomTopic}
        onGenerate={handleGenerate}
        onRegenerate={handleRegenerate}
        onToggleFavorite={handleToggleFavorite}
        onViewHistory={handleViewHistory}
        onFavoriteHistory={handleFavoriteHistory}
        onClearHistory={handleClearHistory}
      />
    );
  }

  function handleToggleFavorite() {
    if (!currentCard) return;

    const exists = favorites.some((item) => item.id === currentCard.id);
    setFavorites(exists ? favoriteStore.remove(currentCard.id) : favoriteStore.add(currentCard));
  }

  function handleRemoveFavorite(id) {
    setFavorites(favoriteStore.remove(id));
  }

  function handleViewHistory(card) {
    setCurrentCard({ ...card, generatedAt: Date.now() });
  }

  function handleFavoriteHistory(card) {
    setFavorites(favoriteStore.add(card));
  }

  function handleClearHistory() {
    setHistory(historyStore.clear());
  }

  return (
    <div className="app-shell">
      <Header currentPage={currentPage} onChangePage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}
