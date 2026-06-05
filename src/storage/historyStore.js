const HISTORY_KEY = 'random-life-supply:history';
const HISTORY_LIMIT = 20;

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function normalizeHistoryItem(card) {
  return {
    id: card.id,
    type: card.type,
    title: card.title,
    content: card.content,
    tags: card.tags,
    modes: card.modes,
    mode: card.mode,
    topic: card.topic,
    matched: card.matched,
    receivedAt: card.receivedAt ?? Date.now()
  };
}

export const historyStore = {
  list() {
    if (!canUseStorage()) return [];

    try {
      const raw = window.localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  save(items) {
    if (!canUseStorage()) return items;

    const nextItems = items.slice(0, HISTORY_LIMIT);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextItems));
    return nextItems;
  },

  add(card) {
    return this.save([normalizeHistoryItem(card), ...this.list()]);
  },

  clear() {
    if (canUseStorage()) {
      window.localStorage.removeItem(HISTORY_KEY);
    }

    return [];
  }
};
