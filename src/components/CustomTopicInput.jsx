export default function CustomTopicInput({ value, onChange }) {
  return (
    <section className="option-group" aria-labelledby="custom-topic-title">
      <h2 id="custom-topic-title">自定义主题</h2>
      <input
        className="custom-topic-input"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="例如：雨天、咖啡、拖延、宇宙、毕业"
        maxLength={30}
      />
    </section>
  );
}
