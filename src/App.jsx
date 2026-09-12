import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import TryOutScreen from './screens/TryOutScreen';
import YdbbaScreen from './screens/YdbbaScreen';
import JwaraMap from './screens/jwara/JwaraMap';

export default function App() {
  const [mode, setMode] = useState('home');

  if (mode === 'tryout') return <TryOutScreen onExit={() => setMode('home')} />;
  if (mode === 'ydbba') return <YdbbaScreen onExit={() => setMode('home')} />;
  if (mode === 'jwara') return <JwaraMap onExit={() => setMode('home')} />;

  return <HomeScreen onSelect={setMode} />;
}
