import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientPage from './ClientPage';
import EmpresaPage from './EmpresaPage';
import HomePage from './HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cliente" element={<ClientPage />} />
        <Route path="/empresa" element={<EmpresaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
