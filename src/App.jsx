import { useEffect, useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import BankSoalScreen from './screens/BankSoalScreen';
import HistoryScreen from './screens/HistoryScreen';
import PerModulScreen from './screens/PerModulScreen';
import BahanBacaanScreen from './screens/BahanBacaanScreen';
import { getStoredTheme, applyTheme } from './lib/theme';

export default function App() {
  const [mode, setMode] = useState('home');
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  if (mode === 'banksoal') return <BankSoalScreen onExit={() => setMode('home')} />;
  if (mode === 'history') return <HistoryScreen onExit={() => setMode('home')} />;
  if (mode === 'permodul') return <PerModulScreen onExit={() => setMode('home')} />;
  if (mode === 'bahanbacaan') return <BahanBacaanScreen onExit={() => setMode('home')} />;

  return <HomeScreen onSelect={setMode} theme={theme} onToggleTheme={toggleTheme} />;
}
