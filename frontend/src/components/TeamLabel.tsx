import {
  getFlagImageUrl,
  getTeamFlagInfo,
} from "../utils/teamFlags";

type Props = {
  team: string;
  className?: string;
};

/** Bandera (imagen) al tamaño del texto + nombre del equipo. */
export default function TeamLabel({ team, className = "" }: Props) {
  const flag = getTeamFlagInfo(team);

  return (
    <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
      <FlagIcon flag={flag} />
      <span className="truncate">{team}</span>
    </span>
  );
}

function FlagIcon({ flag }: { flag: ReturnType<typeof getTeamFlagInfo> }) {
  const imgClass =
    "h-[1em] w-auto shrink-0 rounded-sm object-cover shadow-sm ring-1 ring-black/5";

  if (flag.kind === "country") {
    const h = 24;
    return (
      <img
        src={getFlagImageUrl(flag.code, h)}
        srcSet={`${getFlagImageUrl(flag.code, h * 2)} 2x`}
        alt=""
        width={Math.round(h * 1.33)}
        height={h}
        className={imgClass}
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (flag.kind === "local") {
    return (
      <img
        src={flag.src}
        alt=""
        className={`${imgClass} aspect-square !w-[1em] object-contain`}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <span
      className="flex h-[1em] w-[1em] shrink-0 items-center justify-center rounded-sm bg-slate-200 text-[0.55em] font-bold text-slate-500"
      aria-hidden
    >
      ?
    </span>
  );
}
