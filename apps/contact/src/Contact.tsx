import React, { useEffect } from 'react';
import { ContactForm } from './components/ContactForm';
import { SocialLinks } from './components/SocialLinks';
import { eventBus } from '@impossible-resume/event-bus';
import './styles/contact.css';

export function Contact() {
  useEffect(() => {
    eventBus.emit('module:viewed', 'contact', { section: 'contact' });
  }, []);

  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2 className="section-title">Get in Touch</h2>
        <p className="section-subtitle">Have a project in mind? Let's build something amazing together.</p>
        <div className="contact-layout">
          <ContactForm />
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}

export default Contact;
