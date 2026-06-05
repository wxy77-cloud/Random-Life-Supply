import { supplies } from '../data/supplies.js';

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)] ?? null;
}

function pickRandomWithoutCurrent(items, currentId) {
  const nextItems = items.length > 1 ? items.filter((item) => item.id !== currentId) : items;
  return pickRandom(nextItems);
}

export function createSupplyCard({ type, mode, topic, currentId }) {
  const sameType = supplies.filter((item) => item.type === type);
  const matched = sameType.filter((item) => item.modes.includes(mode) && item.tags.includes(topic));
  const candidates = matched.length > 0 ? matched : sameType;
  const supply = pickRandomWithoutCurrent(candidates, currentId);

  if (!supply) return null;

  return {
    ...supply,
    mode,
    topic,
    matched: matched.length > 0,
    generatedAt: Date.now()
  };
}
