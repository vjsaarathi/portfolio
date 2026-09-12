import React from 'react';

const socials = [
  { name: 'GitHub', url: 'https://github.com/vjsaarathi', icon: '🐙' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/nrssi', icon: '💼' },
  { name: 'Email', url: 'mailto:nrshyamsundariyanger@protonmail.com', icon: '✉️' },
];

export function SocialLinks() {
  return (
    <div className="social-links glass-card">
      <h3 className="social-links__title">Connect with me</h3>
      <div className="social-links__list">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-links__item"
          >
            <span className="social-links__icon">{social.icon}</span>
            <span className="social-links__name">{social.name}</span>
            <span className="social-links__arrow">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
