import React, { useState, FormEvent } from 'react';
import { eventBus } from '@impossible-resume/event-bus';
import { FormSuccess } from './FormSuccess';

export function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    eventBus.emit('contact:form_submit', 'contact', { timestamp: Date.now() });

    try {
      const response = await fetch('https://formspree.io/f/xyzformid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        eventBus.emit('contact:form_success', 'contact', {});
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return <FormSuccess onReset={() => setStatus('idle')} />;
  }

  return (
    <form className="contact-form glass-card" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="contact-form__label" htmlFor="name">Name</label>
        <input
          id="name"
          className="contact-form__input"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
          placeholder="Your name"
        />
      </div>
      <div className="form-group">
        <label className="contact-form__label" htmlFor="email">Email</label>
        <input
          id="email"
          className="contact-form__input"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          required
          placeholder="your@email.com"
        />
      </div>
      <div className="form-group">
        <label className="contact-form__label" htmlFor="message">Message</label>
        <textarea
          id="message"
          className="contact-form__textarea"
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          required
          placeholder="Tell me about your project..."
          rows={5}
        />
      </div>
      <button type="submit" className="contact-form__submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
      {status === 'error' && <p className="contact-form__error">Failed to send. Please try again.</p>}
    </form>
  );
}
