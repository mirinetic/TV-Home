// Bridge to the Android app (TV Home APK). In a browser there is no bridge and these do nothing.
type Native = { launchApp(name: string): boolean; hasApp(name: string): boolean; exit(): void };
const native = (window as unknown as { TVHomeNative?: Native }).TVHomeNative;

export const isAndroidApp = !!native;

/** Opens the real TV app for a tile. Returns false when there is no such app (or no bridge). */
export function launchApp(name: string): boolean {
  try { return !!native?.launchApp(name); } catch { return false; }
}

export function hasApp(name: string): boolean {
  try { return !!native?.hasApp(name); } catch { return false; }
}
