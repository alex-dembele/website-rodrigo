import Image from 'next/image';

/** Monogramme « R » du client, détouré sur fond transparent. */
export function LogoMark({ className = 'h-9 w-auto' }: { className?: string }) {
  return (
    <Image
      src="/brand/mark.png"
      alt=""
      width={512}
      height={512}
      priority
      className={`${className} object-contain`}
    />
  );
}

/** Logo complet : monogramme + nom */
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 max-[359px]:gap-2">
      <LogoMark className="h-9 w-9 max-[359px]:h-8 max-[359px]:w-8 sm:h-10 sm:w-10" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-lg font-extrabold tracking-tight ${
            light ? 'text-white' : 'text-brand-ink'
          }`}
        >
          Rodrigo
        </span>
        <span className="whitespace-nowrap font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red max-[359px]:text-[10px]">
          Auto Services
        </span>
      </span>
    </span>
  );
}
