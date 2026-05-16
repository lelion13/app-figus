import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getInstallPlatform,
  isStandalone,
  type InstallPlatform,
} from "../utils/pwaInstall";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type PwaInstallContextValue = {
  platform: InstallPlatform;
  isInstalled: boolean;
  canNativeInstall: boolean;
  showInstallHelp: boolean;
  installNative: () => Promise<boolean>;
};

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatform] = useState<InstallPlatform>(() =>
    getInstallPlatform(),
  );
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Migrar cierre permanente antiguo: ahora el cartel vuelve a los 7 días.
    localStorage.removeItem("figus-install-dismissed");

    const update = () => setPlatform(getInstallPlatform());
    update();

    if (isStandalone()) return;

    const onBip = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", update);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", update);
    };
  }, []);

  const installNative = useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setPlatform(getInstallPlatform());
    return choice.outcome === "accepted";
  }, [deferredPrompt]);

  const value = useMemo<PwaInstallContextValue>(
    () => ({
      platform,
      isInstalled: platform === "installed",
      canNativeInstall: Boolean(deferredPrompt),
      showInstallHelp: platform !== "installed",
      installNative,
    }),
    [platform, deferredPrompt, installNative],
  );

  return (
    <PwaInstallContext.Provider value={value}>{children}</PwaInstallContext.Provider>
  );
}

export function usePwaInstall(): PwaInstallContextValue {
  const ctx = useContext(PwaInstallContext);
  if (!ctx) {
    throw new Error("usePwaInstall debe usarse dentro de PwaInstallProvider");
  }
  return ctx;
}
