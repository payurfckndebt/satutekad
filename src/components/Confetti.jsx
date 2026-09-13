const COLORS = ['#FFFFFF', '#FDEEF0', '#FFD9DF', '#FFFFFF', '#F8C6CE'];

export default function Confetti({ count = 40 }) {
  const pieces = Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const duration = 1.8 + Math.random() * 1.2;
    const color = COLORS[i % COLORS.length];
    const size = 6 + Math.random() * 6;
    return (
      <span
        key={i}
        style={{
          position: 'fixed',
          top: '-5vh',
          left: `${left}%`,
          width: size,
          height: size * 0.4,
          background: color,
          animation: `confetti-fall ${duration}s ease-in ${delay}s forwards`,
          borderRadius: 2,
          zIndex: 60,
        }}
      />
    );
  });
  return <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">{pieces}</div>;
}
