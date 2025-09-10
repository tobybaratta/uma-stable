// // src/lib/umalatorCodec.ts
// import { gzip, ungzip } from 'pako';

// const toB64Url = (u8: Uint8Array) =>
//   btoa(String.fromCharCode(...u8))
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_')
//     .replace(/=+$/g, '');

// const fromB64Url = (s: string) => {
//   const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
//   const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
//   const bin = atob(b64 + pad);
//   const u8 = new Uint8Array(bin.length);
//   for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
//   return u8;
// };

// export function decodeUmalatorHash<T = unknown>(hash: string): T {
//   const token = hash.startsWith('#') ? hash.slice(1) : hash;
//   const json = new TextDecoder().decode(ungzip(fromB64Url(token)));
//   return JSON.parse(json) as T;
// }

// export function encodeUmalatorHash(payload: unknown): string {
//   const json = JSON.stringify(payload);
//   const gz = gzip(json);
//   return toB64Url(gz);
// }

// export function buildUmalatorUrl(payload: unknown) {
//   const h = encodeUmalatorHash(payload);
//   return `https://alpha123.github.io/uma-tools/umalator-global/#${h}`;
// }
