const R_PATH =
  'M5 5 H30 C44 5 52 14 52 27 C52 38 45 46 34 48 L54 93 H36 L20 52 V93 H5 Z M19 18 V37 H29 C35 37 38 33 38 27.5 C38 22 35 18 29 18 Z';

/** Monogramme "double R" (R noir + R rouge) — net à toutes les tailles */
export function LogoMark({ className = 'h-9 w-auto' }: { className?: string }) {
  return (
    <svg viewBox="0 0 104 98" className={className} role="img" aria-label="Rodrigo Services">
      <g transform="translate(-2,2)" fill="#151517" fillRule="evenodd">
        <g transform="translate(54,0) scale(-1,1)">
          <path d={R_PATH} />
        </g>
      </g>
      <g transform="translate(52,2)" fill="#D12630" fillRule="evenodd">
        <path d={R_PATH} />
      </g>
    </svg>
  );
}

/** Logo complet : monogramme + nom */
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="h-9 w-auto sm:h-10" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-extrabold tracking-tight ${
            light ? 'text-white' : 'text-brand-ink'
          }`}
        >
          Rodrigo
        </span>
        <span className="font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-red">
          Services
        </span>
      </span>
    </span>
  );
}
