export default function LivesBar({ lives, max = 5 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${lives} dari ${max} nyawa`}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`w-5 h-5 transition-transform ${i < lives ? 'scale-100' : 'scale-90 opacity-25'}`}
          fill={i < lives ? '#E15554' : '#5A6483'}
        >
          <path d="M12 21s-6.7-4.35-9.3-8.2C0.9 9.7 1.7 6 4.9 4.7 7.1 3.8 9.4 4.6 12 7c2.6-2.4 4.9-3.2 7.1-2.3 3.2 1.3 4 5 2.2 8.1C18.7 16.65 12 21 12 21z" />
        </svg>
      ))}
    </div>
  );
}
