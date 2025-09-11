import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from './swRegister';
import Home from './pages/Home';

// If trying to run in an actual proper webpage too.
if (import.meta.env.PROD) {
  registerSW();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
);
