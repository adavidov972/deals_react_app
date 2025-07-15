import './App.css';


// export default App;
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SwalLoginForm from './components/SwalLoginForm'
import Dashboard from './components/Dashboard';
import DealForm from './components/DealForm';
import DealDetailsPage from './components/DealDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<SwalLoginForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path='/deal/:dealId' element={<DealForm />} />
      <Route path='/deal' element={<DealForm />} />
      <Route path='/dealpure' element={<DealDetailsPage />} />

      </Routes>
    </Router>
  );
}

export default App;