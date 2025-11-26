import React from 'react';
import { createRoot } from 'react-dom/client';
// O nome do seu componente principal é NexusApp, então importamos ele
import NexusApp from './NexusApp.jsx'; 

// Encontra o elemento 'root' no public/index.html
const container = document.getElementById('root');
const root = createRoot(container);

// Renderiza o aplicativo principal
root.render(<NexusApp />);