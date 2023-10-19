import 'core-js';
import 'isomorphic-fetch';
import { PersistGate } from 'redux-persist/integration/react';

import ReactDOMClient from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';

import App from './components/App';
import store, { persistor } from './store/store';

const root = ReactDOMClient.createRoot(
  document.getElementById('defiler') as Element,
);
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
