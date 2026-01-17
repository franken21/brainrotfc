import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MessiVsRonaldo from './pages/MessiVsRonaldo';
import BrainrotFC from './pages/BrainrotFC';
import MatchPrototype from './pages/MatchPrototype';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/messi-vs-ronaldo" element={<MessiVsRonaldo />} />
      <Route path="/game" element={<BrainrotFC />} />
      <Route path="/prototype" element={<MatchPrototype />} />
    </Routes>
  );
}

export default App;
