import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { registerSW } from './swRegister';

if (import.meta.env.PROD) {
  registerSW();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
