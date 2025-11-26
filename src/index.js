import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // <--- ESSA É A LINHA MÁGICA QUE TRAZ O DESIGN
import NexusApp from './NexusApp.jsx'; 

// Encontra o elemento 'root' no public/index.html para desenhar o app
const container = document.getElementById('root');
const root = createRoot(container);

// Renderiza o aplicativo principal
root.render(<NexusApp />);