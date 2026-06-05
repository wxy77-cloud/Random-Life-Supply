import { Leaf, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="page-layout narrow">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">About</p>
          <h1>关于页面</h1>
        </div>
        <Sparkles size={30} aria-hidden="true" />
      </div>

      <section className="about-panel">
        <Leaf size={28} aria-hidden="true" />
        <h2>随机人生补给站是什么？</h2>
        <p>
          “随机人生补给站”是一个轻量的小工具。它会根据你选择的当前模式、关注主题和补给类型，
          生成一张适合此刻查看的补给卡。
        </p>
        <p>
          第一个版本暂时不接入后端和大模型，只展示你的选择结果。之后可以继续扩展为真正的随机内容、
          本地存储收藏、AI 生成补给、标签筛选和每日提醒。
        </p>
      </section>
    </main>
  );
}
