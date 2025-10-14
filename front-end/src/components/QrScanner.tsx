// import { useEffect, useMemo, useRef, useState } from "react";
// import { Html5Qrcode, type Html5QrcodeCameraScanConfig } from "html5-qrcode";

// type Props = {
//   onDetected: (cardId: string, rawText: string) => void;
//   title?: string;
//   hint?: string;
//   preferBackCamera?: boolean; // try rear cam by default on phones
// };

// export default function QrScanner({
//   onDetected,
//   title = "Scan Card",
//   hint = "Align your card’s QR inside the frame",
//   preferBackCamera = true,
// }: Props) {
//   const containerId = useMemo(() => `qr-reader-${Math.random().toString(36).slice(2)}`, []);
//   const qrRef = useRef<Html5Qrcode | null>(null);
//   const [cameras, setCameras] = useState<{ id: string; label?: string }[]>([]);
//   const [cameraId, setCameraId] = useState<string | null>(null);
//   const [running, setRunning] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [lastText, setLastText] = useState<string | null>(null);

//   // 1) Load cameras once
//   useEffect(() => {
//     let mounted = true;
//     Html5Qrcode.getCameras()
//       .then((devices) => {
//         if (!mounted) return;
//         const cams = devices.map((d) => ({ id: d.id, label: d.label }));
//         setCameras(cams);
//         if (cams.length) {
//           if (preferBackCamera) {
//             const rear = cams.find((c) => /back|rear|environment/i.test(c.label || ""));
//             setCameraId((rear || cams[0]).id);
//           } else {
//             setCameraId(cams[0].id);
//           }
//         }
//       })
//       .catch((e) => mounted && setError(humanizeCameraError(e)));
//     return () => {
//       mounted = false;
//     };
//   }, [preferBackCamera]);

//   // 2) Cleanup on unmount: stop then clear ONCE
//   useEffect(() => {
//     return () => {
//       const q = qrRef.current;
//       qrRef.current = null;
//       if (!q) return;
//       (async () => {
//         try {
//           // If scanning, stop first
//           // @ts-expect-error runtime property
//           if (q.isScanning) await q.stop();
//         } catch {}
//         try {
//           await q.clear(); // Only here!
//         } catch {}
//       })();
//     };
//   }, []);

//   async function start() {
//     try {
//       if (!cameraId) return;
//       setError(null);
//       setLastText(null);

//       // Lazily create instance when user clicks Start (ensures container exists)
//       if (!qrRef.current) {
//         qrRef.current = new Html5Qrcode(containerId, /* verbose= */ false);
//       }

//       const config: Html5QrcodeCameraScanConfig = {
//         fps: 10,
//         qrbox: { width: 280, height: 280 },
//         // rememberLastUsedCamera: true,
//       };

//       await qrRef.current.start(cameraId, config, onSuccess, onScanError);
//       setRunning(true);
//     } catch (e: any) {
//       setError(humanizeCameraError(e));
//       setRunning(false);
//     }
//   }

//   async function stop() {
//     if (!qrRef.current) return;
//     try {
//       // Only stop – DO NOT clear here (clear removes internal child nodes)
//       // @ts-expect-error runtime property
//       if (qrRef.current.isScanning) {
//         await qrRef.current.stop();
//       }
//     } catch {}
//     setRunning(false);
//   }

//   // Switch camera by stopping then starting again (no clear)
//   async function switchCamera(newId: string) {
//     setCameraId(newId);
//     if (running) {
//       await stop();
//       await start();
//     }
//   }

//   function onSuccess(decodedText: string /*, decodedResult: any */) {
//     if (decodedText === lastText) return; // debounce duplicates
//     setLastText(decodedText);

//     const cardId = extractCardId(decodedText);
//     if (!cardId) {
//       setError("QR recognized but Card ID not found in payload");
//       return;
//     }
//     // Stop after first good read to avoid double-calls
//     stop();
//     onDetected(cardId, decodedText);
//   }

//   function onScanError(_err: string) {
//     // Normal during scanning — don't spam UI
//   }

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <div className="flex items-center justify-between gap-3">
//         <div className="text-xl font-semibold text-[#1A6C8C]">{title}</div>
//         <div className="flex items-center gap-2">
//           <select
//             className="h-10 rounded-lg border border-slate-300 px-2 bg-white"
//             value={cameraId ?? ""}
//             onChange={(e) => switchCamera(e.target.value)}
//           >
//             {cameras.length === 0 && <option value="">No camera</option>}
//             {cameras.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.label || `Camera ${c.id.slice(-4)}`}
//               </option>
//             ))}
//           </select>
//           {running ? (
//             <button
//               onClick={stop}
//               className="h-10 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-100"
//             >
//               Stop
//             </button>
//           ) : (
//             <button
//               onClick={start}
//               disabled={!cameraId}
//               className="h-10 px-4 rounded-lg bg-[#1E6E8D] text-white font-semibold disabled:opacity-50"
//             >
//               Start
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="grid md:grid-cols-[1fr_320px] gap-6 mt-3">
//         <div className="rounded-xl border border-dashed border-[#1E6E8D] p-2">
//           {/* html5-qrcode mounts the video/canvas inside this div */}
//           <div id={containerId} className="aspect-square grid place-items-center text-slate-500">
//             {!running && <span className="text-sm">Camera preview will appear here</span>}
//           </div>
//         </div>

//         <div className="rounded-xl border border-dashed border-[#1E6E8D] p-6 bg-[#F7FBFD]">
//           <div className="text-sm text-slate-700">{hint}</div>
//           <ul className="list-disc text-sm text-slate-600 mt-3 ml-5 space-y-1">
//             <li>Use the rear camera on mobile for best results.</li>
//             <li>Good lighting helps recognition.</li>
//             <li>Browser needs camera permission (HTTPS or localhost).</li>
//           </ul>

//           {error && (
//             <div className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
//               {error}
//             </div>
//           )}
//           {lastText && (
//             <div className="mt-3 text-xs text-slate-600">
//               Last read payload: <span className="font-mono break-all">{lastText}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------- helpers ---------- */

// function extractCardId(text: string): string | null {
//   if (!text) return null;
//   const t = text.trim();
//   if (/^[A-Za-z0-9\-_\/]+$/.test(t)) return t; // raw ID like "P-11234"
//   const m = t.match(/(?:^|[^A-Za-z])CARD[:=\s-]*([A-Za-z0-9\-_\/]+)/i); // CARD:P-11234
//   if (m?.[1]) return m[1];
//   try {
//     const obj = JSON.parse(t); // {"cardId":"P-11234"}
//     if (typeof obj?.cardId === "string") return obj.cardId;
//   } catch {}
//   return null;
// }

// function humanizeCameraError(e: any): string {
//   const s = String(e || "");
//   if (/NotAllowedError|Permission/i.test(s)) return "Camera permission was denied.";
//   if (/NotFoundError/i.test(s)) return "No camera device found.";
//   if (/NotReadableError|TrackStartError/i.test(s)) return "Camera is in use by another app.";
//   if (/InsecureContext/i.test(s)) return "Use HTTPS in production (localhost is allowed without HTTPS).";
//   return s || "Camera error.";
// }
