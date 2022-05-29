import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const container = document.getElementById('app');

if (!container) {
  throw new Error('Did not find an app container.');
}

const root = createRoot(container);

root.render(<App />);