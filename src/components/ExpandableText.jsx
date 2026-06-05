import { useState } from 'react';

export default function ExpandableText({ text, className = '', limit = 150 }) {
  const [expanded, setExpanded] = useState(false);
  const characters = Array.from(text ?? '');
  const canExpand = characters.length > limit;
  const displayText = !canExpand || expanded ? text : `${characters.slice(0, limit).join('')}...`;

  return (
    <div className={expanded ? 'expandable-text expanded' : 'expandable-text'}>
      <p className={className}>{displayText}</p>
      {canExpand && (
        <button className="detail-button" type="button" onClick={() => setExpanded((value) => !value)}>
          {expanded ? '收起' : '详情展开'}
        </button>
      )}
    </div>
  );
}
