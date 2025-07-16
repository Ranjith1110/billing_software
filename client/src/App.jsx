import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login.jsx';
// import SignUp from './pages/SignUp.jsx'; // Only for testing, not linked in UI
import Dashboard from './pages/Dashboard.jsx';
import SaleBill from './pages/SaleBill.jsx';
import Items from './pages/Items.jsx';
import Customers from './pages/Customers.jsx';
import History from './pages/History.jsx';
import Quotation from './pages/Quotation.jsx';
import Settings from './pages/Settings.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        {/* Signup route for Postman only */}
        {/* <Route path="/signup" element={<SignUp />} /> */}

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sale-bill"
          element={
            <ProtectedRoute>
              <SaleBill />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotation"
          element={
            <ProtectedRoute>
              <Quotation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
