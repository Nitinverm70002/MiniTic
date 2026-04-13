import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">MiniTic Agent</h1>
        <p className="hero-subtitle">The Unbeatable AI Tic-Tac-Toe Experience</p>
        <Link href="/play" className="primary-btn pulse" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Play Now
        </Link>
      </div>
    </div>
  );
}
