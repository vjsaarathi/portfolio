import React from 'react';
import { createRoot } from 'react-dom/client';
import { Landing } from './Landing';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Landing />);
}
