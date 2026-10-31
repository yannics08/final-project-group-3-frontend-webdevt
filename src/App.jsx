import { Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import GameScreen from './pages/GameScreen';
import LatteDesign from './components/LatteDesign';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/latte-design" element={<LatteDesign />} />
      </Routes>
    </GameProvider>
  );
}

export default App;