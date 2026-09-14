import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import YdbbaScreen from './screens/YdbbaScreen';
import JwaraMap from './screens/jwara/JwaraMap';
import HarianScreen from './screens/HarianScreen';
import BankSoalScreen from './screens/BankSoalScreen';
import HistoryScreen from './screens/HistoryScreen';
import PerModulScreen from './screens/PerModulScreen';

export default function App() {
  const [mode, setMode] = useState('home');

  if (mode === 'ydbba') return <YdbbaScreen onExit={() => setMode('home')} />;
  if (mode === 'jwara') return <JwaraMap onExit={() => setMode('home')} />;
  if (mode === 'harian') return <HarianScreen onExit={() => setMode('home')} />;
  if (mode === 'banksoal') return <BankSoalScreen onExit={() => setMode('home')} />;
  if (mode === 'history') return <HistoryScreen onExit={() => setMode('home')} />;
  if (mode === 'permodul') return <PerModulScreen onExit={() => setMode('home')} />;

  return <HomeScreen onSelect={setMode} />;
}
