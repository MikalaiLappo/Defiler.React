import 'core-js';
import 'isomorphic-fetch';

import React from 'react';

import ReactDOMClient from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

import App from './components/App';

const root = ReactDOMClient.createRoot(
  document.getElementById('defiler') as Element,
);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
