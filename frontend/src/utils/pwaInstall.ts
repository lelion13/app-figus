const BANNER_DISMISS_KEY = "figus-install-banner-until";
const BANNER_HIDE_DAYS = 7;

export type InstallPlatform =
  | "ios-safari"
  | "ios-other"
  | "android-chrome"
  | "android-other"
  | "desktop"
  | "installed";

export function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIos(): boolean {
  return (
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function isIosSafari(): boolean {
  if (!isIos()) return false;
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
}

export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

export function isInAppBrowser(): boolean {
  return /FBAN|FBAV|Instagram|Line\/|Twitter|LinkedInApp/i.test(navigator.userAgent);
}

export function getInstallPlatform(): InstallPlatform {
  if (isStandalone()) return "installed";
  if (isIos()) return isIosSafari() ? "ios-safari" : "ios-other";
  if (isAndroid()) {
    return /Chrome/i.test(navigator.userAgent) ? "android-chrome" : "android-other";
  }
  return "desktop";
}

export function isBannerDismissed(): boolean {
  const raw = localStorage.getItem(BANNER_DISMISS_KEY);
  if (!raw) return false;
  const until = Number(raw);
  return Number.isFinite(until) && Date.now() < until;
}

export function dismissBannerForAWhile(): void {
  const until = Date.now() + BANNER_HIDE_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(BANNER_DISMISS_KEY, String(until));
}

export function clearBannerDismiss(): void {
  localStorage.removeItem(BANNER_DISMISS_KEY);
}
