import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">✕◯</span>
          <span className="logo-text">MiniTic</span>
        </Link>
        
        <nav className="navbar-links">
          <Link href="/play" className="nav-link active">Play</Link>
          <a href="https://github.com/Nitinverm70002/MiniTic" target="_blank" rel="noreferrer" className="nav-link">GitHub</a>
        </nav>
      </div>
    </header>
  );
};
