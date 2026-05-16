import { useEffect, useState } from "react";

const DISMISS_KEY = "figus-install-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return (
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === "1",
  );
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone() || dismissed) return;

    if (isIos()) {
      setShowIosHint(true);
      return;
    }

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [dismissed]);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
    setShowIosHint(false);
    setDeferredPrompt(null);
  }

  async function installAndroid() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  }

  if (dismissed || isStandalone()) return null;

  if (deferredPrompt) {
    return (
      <aside className="rounded-2xl border border-green-200 bg-green-50 p-4 shadow-sm">
        <p className="mb-3 text-sm text-green-900">
          Instalá Figus 2026 en tu celular para acceder más rápido desde la pantalla de inicio.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={installAndroid}
            className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-bold text-white"
          >
            Instalar app
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 ring-1 ring-slate-200"
          >
            Ahora no
          </button>
        </div>
      </aside>
    );
  }

  if (showIosHint) {
    return (
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="mb-3 text-sm text-slate-700">
          En iPhone/iPad: tocá <strong>Compartir</strong>{" "}
          <span aria-hidden>(□↑)</span> y elegí{" "}
          <strong>Agregar a pantalla de inicio</strong>.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700"
        >
          Entendido
        </button>
      </aside>
    );
  }

  return null;
}
