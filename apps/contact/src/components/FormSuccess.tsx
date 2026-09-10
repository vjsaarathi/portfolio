import React from 'react';

interface FormSuccessProps {
  onReset: () => void;
}

export function FormSuccess({ onReset }: FormSuccessProps) {
  return (
    <div className="contact-success glass-card animate-scale-in">
      <div className="contact-success__icon">✅</div>
      <h3 className="contact-success__title">Message Sent!</h3>
      <p className="contact-success__text">Thanks for reaching out. I'll get back to you soon.</p>
      <button className="contact-success__button" onClick={onReset}>
        Send another message
      </button>
    </div>
  );
}
