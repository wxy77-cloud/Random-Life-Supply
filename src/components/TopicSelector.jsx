export const CUSTOM_TOPIC = '自定义';

export default function TopicSelector({ options, value, customTopic, onChange, onCustomTopicChange }) {
  const isCustomSelected = value === CUSTOM_TOPIC;

  return (
    <section className="option-group" aria-labelledby="topic-title">
      <h2 id="topic-title">关注主题</h2>
      <div className="chip-list">
        {options.map((option) => (
          <button
            key={option}
            className={value === option ? 'chip selected' : 'chip'}
            type="button"
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
        <button
          className={isCustomSelected ? 'chip selected' : 'chip'}
          type="button"
          onClick={() => onChange(CUSTOM_TOPIC)}
        >
          自定义
        </button>
      </div>

      {isCustomSelected && (
        <input
          className="custom-topic-input"
          type="text"
          value={customTopic}
          onChange={(event) => onCustomTopicChange(event.target.value)}
          placeholder="例如：雨天、咖啡、宇宙、孤独、狐狸..."
          maxLength={30}
          autoFocus
        />
      )}
    </section>
  );
}
