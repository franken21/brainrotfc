import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MessiVsRonaldo from './pages/MessiVsRonaldo';
import BrainrotV2 from './v2/BrainrotV2';
import MatchPrototype from './pages/MatchPrototype';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BrainrotV2 />} />
      <Route path="/game" element={<BrainrotV2 />} />
      <Route path="/messi-vs-ronaldo" element={<MessiVsRonaldo />} />
      <Route path="/prototype" element={<MatchPrototype />} />
      <Route path="*" element={<BrainrotV2 />} />
    </Routes>
  );
}
export default App;
