import { Heart, Info, Sparkles } from 'lucide-react';

const navItems = [
  { id: 'station', label: '补给站', icon: Sparkles },
  { id: 'favorites', label: '收藏', icon: Heart },
  { id: 'about', label: '关于', icon: Info }
];

export default function Header({ currentPage, onChangePage }) {
  return (
    <header className="site-header">
      <button className="brand" type="button" onClick={() => onChangePage('station')}>
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 64 64" focusable="false">
            <path className="bag-handle" d="M18 23c0-6.6 5.4-12 12-12h4c6.6 0 12 5.4 12 12v2h-6v-2c0-3.3-2.7-6-6-6h-4c-3.3 0-6 2.7-6 6v2h-6v-2Z" />
            <path className="bag-body" d="M15 24h34l-3 27H18l-3-27Z" />
            <path className="bag-line" d="M23 34h18M25 42h14" />
            <path className="bag-spark" d="M43 13l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" />
          </svg>
        </span>
        <span>
          <strong>随机人生补给站</strong>
          <small>一点温柔，一点新鲜</small>
        </span>
      </button>

      <nav className="nav-tabs" aria-label="主导航">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={currentPage === item.id ? 'nav-tab active' : 'nav-tab'}
              type="button"
              onClick={() => onChangePage(item.id)}
              title={item.label}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
