import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MessiVsRonaldo from './pages/MessiVsRonaldo';
import BrainrotFC from './pages/BrainrotFC';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/messi-vs-ronaldo" element={<MessiVsRonaldo />} />
      <Route path="/game" element={<BrainrotFC />} />
    </Routes>
  );
}

export default App;
