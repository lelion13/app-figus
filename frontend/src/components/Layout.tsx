import { useState, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { usePwaInstall } from "../hooks/PwaInstallContext";
import InstallHelpModal from "./InstallHelpModal";

type Props = {
  title: ReactNode;
  children: ReactNode;
  onBack?: () => void;
};

export default function Layout({ title, children, onBack }: Props) {
  const { logout } = useAuth();
  const { showInstallHelp } = usePwaInstall();
  const [installOpen, setInstallOpen] = useState(false);

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="shrink-0 rounded-xl bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-slate-200"
            >
              ← Volver
            </button>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="shrink-0 rounded-xl bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-slate-200"
            >
              Salir
            </button>
          )}
          {showInstallHelp && (
            <button
              type="button"
              onClick={() => setInstallOpen(true)}
              className="shrink-0 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
              title="Instalar en el celular o PC"
            >
              Instalar
            </button>
          )}
          <h1 className="min-w-0 flex-1 text-lg font-bold leading-tight">{title}</h1>
        </div>
      </header>
      <main className="flex-1 px-4 py-4">{children}</main>
      <InstallHelpModal open={installOpen} onClose={() => setInstallOpen(false)} />
    </div>
  );
}
