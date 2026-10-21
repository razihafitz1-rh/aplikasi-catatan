import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './Components/App.jsx'; // <--- PASTIKAN BARIS INI BERUBAH

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> {/* <--- PASTIKAN TAG INI BERUBAH */}
  </StrictMode>,
)