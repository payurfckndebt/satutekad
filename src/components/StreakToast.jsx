export default function StreakToast({ streak }) {
  if (streak < 3) return null;
  const label = streak >= 5 ? 'On Fire!' : `${streak}x Beruntun!`;
  const emoji = streak >= 5 ? '🔥' : '⚡';
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-pop">
      <div className="flex items-center gap-2 rounded-full bg-tekad-red px-4 py-2 text-white font-display font-bold shadow-lg text-sm">
        <span className="text-lg leading-none">{emoji}</span>
        {label}
      </div>
    </div>
  );
}
