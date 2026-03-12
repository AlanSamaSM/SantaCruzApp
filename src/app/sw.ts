import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope & typeof globalThis;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,
    // Cache Mapbox tiles for offline map access
    {
      matcher: /^https:\/\/api\.mapbox\.com\//,
      handler: new CacheFirst({
        cacheName: "mapbox-tiles",
        matchOptions: { ignoreVary: true },
      }),
    },
    // Cache Mapbox static assets (sprites, glyphs, style)
    {
      matcher: /^https:\/\/(tiles|a|b|c)\.mapbox\.com\//,
      handler: new CacheFirst({
        cacheName: "mapbox-assets",
        matchOptions: { ignoreVary: true },
      }),
    },
  ],
});

serwist.addEventListeners();
