const FAVORITES_KEY = 'random-life-supply:favorites';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function normalizeFavorite(card) {
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
    savedAt: card.savedAt ?? Date.now()
  };
}

export const favoriteStore = {
  list() {
    if (!canUseStorage()) return [];

    try {
      const raw = window.localStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  save(items) {
    if (!canUseStorage()) return items;

    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
    return items;
  },

  has(id) {
    return this.list().some((item) => item.id === id);
  },

  add(card) {
    const items = this.list();

    if (items.some((item) => item.id === card.id)) {
      return items;
    }

    return this.save([normalizeFavorite(card), ...items]);
  },

  remove(id) {
    const nextItems = this.list().filter((item) => item.id !== id);
    return this.save(nextItems);
  }
};
