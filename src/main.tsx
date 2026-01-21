import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AppUseId } from './hooks/user-id.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

createRoot(document.getElementById('root1')!, {
  identifierPrefix: 'my-first-app-'
}).render(
  <StrictMode>
    <AppUseId />
  </StrictMode>,
);

createRoot(document.getElementById('root2')!, {
  identifierPrefix: 'my-second-app-'
}).render(
  <StrictMode>
    <AppUseId />
  </StrictMode>,
);
