import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TabelaControlePerda from './TabelaControlePerda.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div
      style={{
        minHeight: '100vh',
        background: '#090d16',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 16px',
        boxSizing: 'border-box',
      }}
    >
      <TabelaControlePerda />
    </div>
  </StrictMode>,
);

