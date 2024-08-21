import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Main from './main';
import Nova from './components/PDF/pdfme'; // Certifique-se de que o caminho está correto
import GerarRelatorio from './components/GerarRelatorio'; // Certifique-se de que o caminho está correto

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
            <>
              <Main />
            </>
          } 
        />
        <Route path="/pdfme" element={<Nova />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
