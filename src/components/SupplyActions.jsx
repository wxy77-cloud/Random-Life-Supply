import { Lightbulb, MessageCircleQuestion, Shuffle, Sprout, WandSparkles } from 'lucide-react';

const icons = [Sprout, Lightbulb, WandSparkles, MessageCircleQuestion, Shuffle];

export default function SupplyActions({ supplyTypes, onGenerate }) {
  return (
    <section className="supply-actions" aria-labelledby="supply-action-title">
      <h2 id="supply-action-title">选择一份补给</h2>
      <div className="action-grid">
        {supplyTypes.map((item, index) => {
          const Icon = icons[index] ?? Shuffle;
          return (
            <button key={item.type} className="supply-button" type="button" onClick={() => onGenerate(item.type)}>
              <Icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
