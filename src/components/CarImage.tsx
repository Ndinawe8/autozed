// Deterministic gradient placeholder for listings without uploaded photos.
// Keeps the demo dependency-free (no external image hosts).

const GRADIENTS = [
  ["#1e3a8a", "#3b82f6"],
  ["#065f46", "#10b981"],
  ["#7c2d12", "#f97316"],
  ["#4c1d95", "#8b5cf6"],
  ["#831843", "#ec4899"],
  ["#134e4a", "#14b8a6"],
  ["#1e293b", "#475569"],
  ["#713f12", "#eab308"],
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function CarImage({
  make,
  model,
  className = "",
}: {
  make: string;
  model: string;
  className?: string;
}) {
  const [from, to] = GRADIENTS[hash(make + model) % GRADIENTS.length];
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <svg
        viewBox="0 0 100 40"
        className="absolute bottom-2 right-2 h-8 w-20 opacity-20"
        fill="white"
      >
        <path d="M10 28 L18 18 L40 16 L52 10 L72 12 L86 22 L90 28 Z" />
        <circle cx="28" cy="30" r="5" />
        <circle cx="74" cy="30" r="5" />
      </svg>
      <div className="z-10 px-4 text-center">
        <div className="text-xs font-medium uppercase tracking-widest text-white/70">
          {make}
        </div>
        <div className="text-lg font-bold leading-tight text-white">{model}</div>
      </div>
    </div>
  );
}
