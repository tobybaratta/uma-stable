export default function Examples() {
  const images = [
    'brian-skills.png',
    'brian-post-game-sparks.png',
    'brian-sparks1.png',
    'brian-sparks2.png',
  ];

  return (
    <div className="flex justify-center gap-4 p-4">
      {images.map((src) => (
        <img
          key={src}
          src={src}
          alt={src.split('/').pop() || ''}
          className="pointer-events-none select-none hidden sm:block drop-shadow-[0_6px_0_rgba(255,255,255,0.9)] w-40 h-auto rounded-xl"
        />
      ))}
    </div>
  );
}
