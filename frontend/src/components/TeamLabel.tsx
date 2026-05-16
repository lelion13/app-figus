import { getTeamFlag } from "../utils/teamFlags";

type Props = {
  team: string;
  className?: string;
};

/** Bandera al tamaño del texto + nombre del equipo en línea. */
export default function TeamLabel({ team, className = "" }: Props) {
  const flag = getTeamFlag(team);

  return (
    <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
      <span
        className="shrink-0 text-[1em] leading-none"
        aria-hidden
        role="img"
      >
        {flag}
      </span>
      <span className="truncate">{team}</span>
    </span>
  );
}
