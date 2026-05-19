export type MissingTeamGroup = {
  team: string;
  codes: string[];
};

export const WHATSAPP_TEXT_LIMIT = 3000;

const TITLE = "*Me faltan estas figuritas (Figus 2026):*\n\n";

export function formatMissingMessage(teams: MissingTeamGroup[]): string {
  const lines = teams.map((g) => `${g.team}: ${g.codes.join(", ")}`);
  return TITLE + lines.join("\n");
}

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

/** Abre WhatsApp o copia al portapapeles si el mensaje es largo o falla la apertura. */
export async function shareMissingList(
  teams: MissingTeamGroup[],
): Promise<"opened" | "copied"> {
  const text = formatMissingMessage(teams);

  if (text.length < WHATSAPP_TEXT_LIMIT) {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (opened) return "opened";
  }

  await copyToClipboard(text);
  return "copied";
}
