import React from 'react';
import { createRoot } from 'react-dom/client';
import { Projects } from './Projects';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Projects />);
}
