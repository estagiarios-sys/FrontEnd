import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Main from './main';
import Login from './Login';


function App() {
  localStorage.setItem('orderByString', '');
  localStorage.setItem('SQLGeradoFinal', 'Nenhum SQL gerado no momento');
  localStorage.removeItem('loadedQuery');
  return (
    <Router>
      <Routes>
        <Route path="/reports" element={
          <>
            <Main />
          </>
        }
        />
        <Route path="reports/login" element={<Login />} />
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
