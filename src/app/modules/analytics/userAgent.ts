import { DeviceType } from "./analytics.interface";

/**
 * A deliberately small user-agent parser - enough for analytics buckets
 * (device / browser / OS) without adding a dependency. Order matters: Edge and
 * Opera include "Chrome", Chrome includes "Safari".
 */
export const parseUserAgent = (ua: string): { device: DeviceType; browser: string; os: string } => {
  const s = ua || "";

  const device: DeviceType = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(s)
    ? "tablet"
    : /Mobi|iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile/i.test(s)
      ? "mobile"
      : "desktop";

  const browser = /Edg\//.test(s)
    ? "Edge"
    : /OPR\/|Opera/.test(s)
      ? "Opera"
      : /SamsungBrowser/.test(s)
        ? "Samsung Internet"
        : /UCBrowser/.test(s)
          ? "UC Browser"
          : /Firefox|FxiOS/.test(s)
            ? "Firefox"
            : /Chrome|CriOS/.test(s)
              ? "Chrome"
              : /Safari/.test(s)
                ? "Safari"
                : "Other";

  const os = /Windows/.test(s)
    ? "Windows"
    : /iPhone|iPad|iPod/.test(s)
      ? "iOS"
      : /Mac OS X|Macintosh/.test(s)
        ? "macOS"
        : /Android/.test(s)
          ? "Android"
          : /CrOS/.test(s)
            ? "ChromeOS"
            : /Linux/.test(s)
              ? "Linux"
              : "Other";

  return { device, browser, os };
};

/** Crawlers, link unfurlers, monitors and scripts. */
export const BOT_UA =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|quora|whatsapp|telegram|discord|curl|wget|python|axios|node-fetch|headless|lighthouse|pingdom|uptime|monitor/i;
