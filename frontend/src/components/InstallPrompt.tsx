import { useState } from "react";
import { usePwaInstall } from "../hooks/PwaInstallContext";
import { dismissBannerForAWhile, isBannerDismissed, isInAppBrowser } from "../utils/pwaInstall";
import InstallHelpModal from "./InstallHelpModal";

/** Cartel inicial (se puede ocultar 7 días). La ayuda sigue en el botón Instalar. */
export default function InstallPrompt() {
  const { platform, showInstallHelp, canNativeInstall } = usePwaInstall();
  const [modalOpen, setModalOpen] = useState(false);
  const [hidden, setHidden] = useState(() => isBannerDismissed());

  if (!import.meta.env.PROD || !showInstallHelp || hidden) {
    return null;
  }

  if (isInAppBrowser()) {
    return (
      <>
        <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Abrí en el navegador</p>
          <p className="mt-1">
            Para instalar Figus, abrí figus.lionapp.cloud en Chrome (Android) o Safari
            (iPhone), no desde Instagram o WhatsApp.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-3 w-full rounded-xl bg-amber-600 py-3 font-semibold text-white"
          >
            Ver cómo instalar
          </button>
        </aside>
        <InstallHelpModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  function dismiss() {
    dismissBannerForAWhile();
    setHidden(true);
  }

  return (
    <>
      <aside className="rounded-2xl border border-green-200 bg-green-50 p-4 shadow-sm">
        <p className="mb-3 text-sm text-green-900">
          {platform === "ios-safari"
            ? "Podés agregar Figus a tu pantalla de inicio (como una app)."
            : canNativeInstall
              ? "Podés instalar Figus en tu celular con un toque."
              : "Podés instalar Figus desde el menú del navegador."}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-bold text-white"
          >
            Cómo instalar
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
      <InstallHelpModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
