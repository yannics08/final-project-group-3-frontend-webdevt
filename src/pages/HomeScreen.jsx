import { useNavigate } from 'react-router-dom';
import Settings from '../components/Settings';
import StartButton from '../components/StartButton';
import './HomeScreen.css';

function HomeScreen() {
  const navigate = useNavigate();

  function handleStart() {
    navigate('/game');
  }

  return (
    <div className="home-container">
      <main className="game-screen" aria-label="Mad Coffee Game Screen">
        <Settings />
        <StartButton day={2} onClick={handleStart} />
      </main>
    </div>
  );
}

export default HomeScreen;
