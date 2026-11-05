"use client";

import { useRef, type ChangeEvent, type DragEvent } from "react";
import { ALLOWED_IMAGE_TYPES } from "@/lib/upload";
import CloseIcon from "../icons/CloseIcon";
import ImageIcon from "../icons/ImageIcon";

type Props = {
  preview: string | null;
  uploading: boolean;
  disabled?: boolean;
  busyLabel?: string;
  previewClassName?: string;
  placeholderClassName?: string;
  onPick: (file: File) => void;
  onClear: () => void;
};

export default function ImageDropzone({
  preview,
  uploading,
  disabled = false,
  busyLabel = "Uploading…",
  previewClassName = "mx-auto block max-h-80 w-auto max-w-full object-contain",
  placeholderClassName = "h-56",
  onPick,
  onClear,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (file) onPick(file);
  }

  function handleDrop(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onPick(file);
  }

  return (
    <div>
      {preview ? (
        <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
          <img src={preview} alt="Selected image preview" className={previewClassName} />

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-[14px] font-medium text-neutral-700">
              <span className="animate-pulse">{busyLabel}</span>
            </div>
          )}

          {!uploading && !disabled && (
            <button
              type="button"
              aria-label="Remove image"
              onClick={onClear}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/75"
            >
              <CloseIcon size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-[#faf9f8] text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 ${placeholderClassName}`}
        >
          <ImageIcon />
          <span className="text-[15px] font-medium">Click or drop an image</span>
          <span className="text-[13px] text-neutral-400">JPG, PNG or WebP</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}