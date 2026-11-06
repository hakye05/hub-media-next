"use client";

import Cropper, { type Area, type Point } from "react-easy-crop";
import CloseIcon from "../../icons/CloseIcon";
import { BANNER_ASPECT } from "./constants";
import ZoomSlider from "@/components/ui/ZoomSlider";

type Props = {
  src: string;
  position: Point;
  zoom: number;
  disabled: boolean;
  onPositionChange: (position: Point) => void;
  onZoomChange: (zoom: number) => void;
  onAreaChange: (area: Area) => void;
  onRemove: () => void;
};

export default function BannerCropper({
  src,
  position,
  zoom,
  disabled,
  onPositionChange,
  onZoomChange,
  onAreaChange,
  onRemove,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-56 overflow-hidden rounded-2xl bg-neutral-900">
        <Cropper
          image={src}
          crop={position}
          zoom={zoom}
          aspect={BANNER_ASPECT}
          showGrid={false}
          onCropChange={onPositionChange}
          onZoomChange={onZoomChange}
          onCropComplete={(_, areaPixels) => onAreaChange(areaPixels)}
        />

        {!disabled && (
          <button
            type="button"
            aria-label="Remove image"
            onClick={onRemove}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/75"
          >
            <CloseIcon size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <ZoomSlider value={zoom} disabled={disabled} onChange={onZoomChange} />
    </div>
  );
}