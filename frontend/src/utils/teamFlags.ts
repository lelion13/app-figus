/** Código ISO para flagcdn.com (minúsculas) o ícono local. */
const TEAM_FLAG_CODES: Record<string, string> = {
  "MÉXICO": "mx",
  "SUDÁFRICA": "za",
  "COREA DEL SUR": "kr",
  CHEQUIA: "cz",
  "CANADÁ": "ca",
  "BOSNIA Y HERZEGOVINA": "ba",
  CATAR: "qa",
  SUIZA: "ch",
  BRASIL: "br",
  MARRUECOS: "ma",
  "HAITÍ": "ht",
  ESCOCIA: "gb-sct",
  "ESTADOS UNIDOS": "us",
  PARAGUAY: "py",
  AUSTRALIA: "au",
  "TURQUÍA": "tr",
  ALEMANIA: "de",
  CURAZAO: "cw",
  "COSTA DE MARFIL": "ci",
  ECUADOR: "ec",
  "PAÍSES BAJOS": "nl",
  "JAPÓN": "jp",
  SUECIA: "se",
  "TÚNEZ": "tn",
  "BÉLGICA": "be",
  EGIPTO: "eg",
  "IRÁN": "ir",
  "NUEVA ZELANDA": "nz",
  "ESPAÑA": "es",
  "CABO VERDE": "cv",
  "ARABIA SAUDITA": "sa",
  URUGUAY: "uy",
  FRANCIA: "fr",
  SENEGAL: "sn",
  IRAK: "iq",
  NORUEGA: "no",
  ARGENTINA: "ar",
  ARGELIA: "dz",
  AUSTRIA: "at",
  JORDANIA: "jo",
  PORTUGAL: "pt",
  "REPÚBLICA DEMOCRÁTICA DEL CONGO": "cd",
  "UZBEKISTÁN": "uz",
  COLOMBIA: "co",
  INGLATERRA: "gb-eng",
  CROACIA: "hr",
  GHANA: "gh",
  "PANAMÁ": "pa",
};

const LOCAL_ICONS: Record<string, string> = {
  FWC: "/icons/team-fwc.svg",
  "COCA COLA": "/icons/team-coca.svg",
};

export type TeamFlagInfo =
  | { kind: "country"; code: string }
  | { kind: "local"; src: string }
  | { kind: "unknown" };

export function getTeamFlagInfo(team: string): TeamFlagInfo {
  const local = LOCAL_ICONS[team];
  if (local) return { kind: "local", src: local };

  const code = TEAM_FLAG_CODES[team];
  if (code) return { kind: "country", code };

  return { kind: "unknown" };
}

/** URL de bandera (PNG) visible en Windows, Android, iOS, etc. */
export function getFlagImageUrl(code: string, height = 24): string {
  return `https://flagcdn.com/h${height}/${code}.png`;
}
