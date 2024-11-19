import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InitialView from './components/InitialView';
import CheckoutView from './components/CheckoutView';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitialView />} />
        <Route path="/checkout" element={<CheckoutView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;