export type MissingTeamGroup = {
  team: string;
  codes: string[];
};

/** Límite conservador para `wa.me` / `whatsapp://` (el texto va en la URL). */
export const WHATSAPP_URL_TEXT_LIMIT = 2000;

const TITLE = "*Me faltan estas figuritas (Figus 2026):*\n\n";

export type ShareMissingResult =
  | "shared"
  | "whatsapp"
  | "file"
  | "copied"
  | "cancelled";

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

function isShareCancelled(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function openWhatsAppUrl(text: string): boolean {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  // En PWA / móvil, `window.open` suele bloquearse; `location` abre la app.
  if (window.matchMedia("(display-mode: standalone)").matches || "ontouchstart" in window) {
    window.location.assign(url);
    return true;
  }
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  return opened !== null;
}

function hasNativeShare(): boolean {
  return typeof navigator.share === "function";
}

async function shareAsTextFile(text: string): Promise<boolean> {
  if (!hasNativeShare() || typeof navigator.canShare !== "function") return false;

  const file = new File([text], "figus-faltan.txt", { type: "text/plain" });
  const payload = { files: [file], title: "Figus 2026 — Me faltan" };
  if (!navigator.canShare(payload)) return false;

  await navigator.share(payload);
  return true;
}

/**
 * Comparte el listado por WhatsApp.
 * 1) Web Share API (texto completo, ideal en Android/iOS).
 * 2) wa.me si el mensaje entra en la URL.
 * 3) Web Share API con archivo .txt.
 * 4) Portapapeles solo si nada más funciona en el dispositivo.
 */
export async function shareMissingList(
  teams: MissingTeamGroup[],
): Promise<ShareMissingResult> {
  const text = formatMissingMessage(teams);

  if (hasNativeShare()) {
    try {
      await navigator.share({ title: "Figus 2026 — Me faltan", text });
      return "shared";
    } catch (error) {
      if (isShareCancelled(error)) return "cancelled";
    }

    try {
      if (await shareAsTextFile(text)) return "file";
    } catch (error) {
      if (isShareCancelled(error)) return "cancelled";
    }
  }

  if (text.length <= WHATSAPP_URL_TEXT_LIMIT && openWhatsAppUrl(text)) {
    return "whatsapp";
  }

  await copyToClipboard(text);
  return "copied";
}
