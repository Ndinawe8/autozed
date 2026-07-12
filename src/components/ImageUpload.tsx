"use client";

import { useRef, useState } from "react";

const MAX_IMAGES = 8;
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.75;

async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export default function ImageUpload({ name = "images" }: { name?: string }) {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError(`You can upload up to ${MAX_IMAGES} photos.`);
      return;
    }

    const selected = Array.from(files).slice(0, remaining);
    setBusy(true);
    try {
      const compressed = await Promise.all(selected.map(compressImage));
      setImages((prev) => [...prev, ...compressed]);
    } catch {
      setError("Couldn't process one of those photos. Try a different file.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(images)} />
      <label className="block cursor-pointer rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 hover:bg-slate-50">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={busy || images.length >= MAX_IMAGES}
        />
        {busy
          ? "Processing photos…"
          : `📷 Click to add photos (${images.length}/${MAX_IMAGES})`}
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-md border border-slate-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-xs text-white opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
