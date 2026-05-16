import type { ReactNode } from "react";
import { usePwaInstall } from "../hooks/PwaInstallContext";
import type { InstallPlatform } from "../utils/pwaInstall";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function InstallHelpModal({ open, onClose }: Props) {
  const { platform, canNativeInstall, installNative } = usePwaInstall();

  if (!open) return null;

  async function handleNativeInstall() {
    const ok = await installNative();
    if (ok) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-title"
      onClick={onClose}
    >
      <div
        className="max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="install-title" className="mb-1 text-xl font-bold text-slate-900">
          Instalar Figus 2026
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          Podés seguir usando la app en el navegador. Instalarla agrega un ícono en tu
          pantalla de inicio, como una app más.
        </p>

        {canNativeInstall && (
          <button
            type="button"
            onClick={handleNativeInstall}
            className="mb-4 w-full rounded-xl bg-green-600 py-4 text-base font-bold text-white"
          >
            Instalar ahora
          </button>
        )}

        <InstallSteps platform={platform} showNativeHint={canNativeInstall} />

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function InstallSteps({
  platform,
  showNativeHint,
}: {
  platform: InstallPlatform;
  showNativeHint: boolean;
}) {
  switch (platform) {
    case "ios-safari":
      return (
        <ol className="space-y-3 text-sm text-slate-800">
          <Step n={1}>
            Usá <strong>Safari</strong> (el ícono azul con brújula).
          </Step>
          <Step n={2}>
            Tocá <strong>Compartir</strong> abajo (□ con flecha ↑).
          </Step>
          <Step n={3}>
            Elegí <strong>Agregar a pantalla de inicio</strong>.
          </Step>
          <Step n={4}>
            Tocá <strong>Agregar</strong>. Buscá el ícono <strong>Figus 2026</strong>.
          </Step>
        </ol>
      );

    case "ios-other":
      return (
        <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">
          <p className="font-semibold">Abrí esta página en Safari</p>
          <p className="mt-1">
            En iPhone la instalación solo funciona en Safari. Si estás en Chrome o
            dentro de WhatsApp, copiá el enlace y abrilo en Safari. Después: Compartir →
            Agregar a pantalla de inicio.
          </p>
        </div>
      );

    case "android-chrome":
      return (
        <ol className="space-y-3 text-sm text-slate-800">
          <Step n={1}>
            Usá <strong>Chrome</strong>. No abras el enlace desde Instagram o WhatsApp.
          </Step>
          {showNativeHint ? (
            <Step n={2}>
              Tocá el botón verde <strong>Instalar ahora</strong> de arriba.
            </Step>
          ) : (
            <Step n={2}>
              Menú <strong>⋮</strong> (arriba a la derecha) →{" "}
              <strong>Instalar aplicación</strong> o <strong>Agregar a inicio</strong>.
            </Step>
          )}
          <Step n={3}>
            Confirmá. El ícono <strong>Figus 2026</strong> aparecerá en tu pantalla de
            inicio.
          </Step>
        </ol>
      );

    case "android-other":
      return (
        <ol className="space-y-3 text-sm text-slate-800">
          <Step n={1}>
            Abrí <strong>Chrome</strong> y entrá a figus.lionapp.cloud
          </Step>
          <Step n={2}>
            Menú <strong>⋮</strong> → <strong>Instalar aplicación</strong> o{" "}
            <strong>Agregar a inicio</strong>.
          </Step>
          <Step n={3}>
            Si no aparece la opción, instalá Google Chrome desde Play Store.
          </Step>
        </ol>
      );

    case "desktop":
      return (
        <ol className="space-y-3 text-sm text-slate-800">
          <Step n={1}>
            En Edge o Chrome: buscá el ícono <strong>Instalar</strong> en la barra de
            direcciones.
          </Step>
          <Step n={2}>
            O menú <strong>⋮</strong> → <strong>Aplicaciones</strong> → Instalar Figus.
          </Step>
        </ol>
      );

    default:
      return (
        <p className="text-sm text-green-700">
          Ya tenés Figus instalada. Abrila desde el ícono en tu inicio.
        </p>
      );
  }
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
        {n}
      </span>
      <span className="pt-0.5">{children}</span>
    </li>
  );
}
