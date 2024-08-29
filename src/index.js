import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Main from './main';
import Nova from './components/PDF/pdfme'; 


function App() {
  localStorage.setItem('orderByString', '');
  localStorage.setItem('SQLGeradoFinal', 'Nenhum SQL gerado no momento');
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
