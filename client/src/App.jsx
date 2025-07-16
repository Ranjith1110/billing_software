import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SaleBill from './pages/SaleBill.jsx';
import Items from './pages/Items.jsx';
import Customers from './pages/Customers.jsx';
import History from './pages/History.jsx';
import Quotation from './pages/Quotation.jsx';
import Settings from './pages/Settings.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sale-bill" element={<SaleBill />} />
        <Route path="/items" element={<Items />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/history" element={<History />} />
        <Route path="/quotation" element={<Quotation />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
