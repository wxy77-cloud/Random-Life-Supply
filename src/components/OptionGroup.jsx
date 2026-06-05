export default function OptionGroup({ label, options, value, onChange }) {
  return (
    <section className="option-group" aria-labelledby={`${label}-title`}>
      <h2 id={`${label}-title`}>{label}</h2>
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
      </div>
    </section>
  );
}
