import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pokedex from './pages/Pokedex';
import Share from './pages/Share';
import SharedLanding from './pages/SharedLanding';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokedex" element={<Pokedex />} />
      <Route path="/share" element={<Share />} />
      <Route path="/c/:characterId" element={<SharedLanding />} />
    </Routes>
  );
}
