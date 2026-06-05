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
          这里不负责改变人生，也不急着给出答案。你不必立刻振作，也不必证明今天很有意义。只要按下按钮，领取一点好奇、一点灵感，和一点继续停留在世界里的理由。
        </p>
      </section>
    </main>
  );
}
