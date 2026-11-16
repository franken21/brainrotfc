import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MessiVsRonaldo from './pages/MessiVsRonaldo';
import BrainrotV2 from './v2/BrainrotV2';
import MatchPrototype from './pages/MatchPrototype';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/messi-vs-ronaldo" element={<MessiVsRonaldo />} />
      <Route path="/game" element={<BrainrotV2 />} />
      <Route path="/prototype" element={<MatchPrototype />} />
    </Routes>
  );
}
export default App;
