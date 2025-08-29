import { useState } from "react";
import type { ImageGridProps, FeedbackImageGridProps } from "../types/components";

// Grid cu lightbox pentru galerie (aspect ratio fix)
export function ImageGrid({ images }: ImageGridProps) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  if (!images?.length) return null;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {images.map((img: string, i: number) => (
          <button
            type="button"
            key={i}
            onClick={() => {
              setSrc(img);
              setOpen(true);
            }}
            className="group relative rounded-xl overflow-hidden bg-white/5 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] focus:ring-offset-2"
          >
            <img
              src={img}
              alt={`Galerie imagine ${i + 1}`}
              className="w-full h-full object-cover"
              style={{ aspectRatio: "4 / 3" }}
              loading="lazy"
            />
            <span className="absolute inset-0 ring-1 ring-white/5 group-hover:ring-[var(--fa-orange)]/40 transition-all duration-200" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full transition-opacity duration-200">
                Vezi imagine
              </span>
            </div>
          </button>
        ))}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 p-4 flex items-center justify-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Previzualizare imagine"
        >
          <div className="relative max-w-[92vw] max-h-[92vh]">
            <img
              src={src}
              alt="Previzualizare"
              className="max-w-full max-h-full rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Închide previzualizarea"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Grid cu lightbox pentru feedback (imagini la dimensiune naturală)
export function FeedbackImageGrid({ images }: FeedbackImageGridProps) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  if (!images?.length) return null;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {images.map((img: string, i: number) => (
          <button
            type="button"
            key={i}
            onClick={() => {
              setSrc(img);
              setOpen(true);
            }}
            className="group relative rounded-xl overflow-hidden bg-white/5 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--fa-orange)] focus:ring-offset-2"
          >
            <img
              src={img}
              alt={`Feedback imagine ${i + 1}`}
              className="w-full h-auto object-contain filter brightness-90 contrast-90"
              loading="lazy"
            />
            <span className="absolute inset-0 ring-1 ring-white/5 group-hover:ring-[var(--fa-orange)]/40 transition-all duration-200" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-all duration-200 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full transition-opacity duration-200">
                Vezi imagine
              </span>
            </div>
          </button>
        ))}
      </div>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 p-4 flex items-center justify-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="Previzualizare imagine"
        >
          <div className="relative max-w-[92vw] max-h-[92vh]">
            <img
              src={src}
              alt="Previzualizare"
              className="max-w-full max-h-full rounded-xl shadow-2xl filter brightness-90 contrast-90"
            />
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Închide previzualizarea"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
