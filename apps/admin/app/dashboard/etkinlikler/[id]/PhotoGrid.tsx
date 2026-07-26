"use client";

import { useTransition } from "react";
import { deletePhoto } from "./actions";

export function PhotoGrid({
  eventId,
  photos,
}: {
  eventId: string;
  photos: { id: string; storage_path: string; url: string }[];
}) {
  const [isPending, startTransition] = useTransition();

  if (photos.length === 0) {
    return <p className="text-sm text-neutral-500">Henüz fotoğraf yok.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt=""
            className="w-full h-32 object-cover rounded-md border border-neutral-200"
          />
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() =>
                deletePhoto(eventId, photo.id, photo.storage_path)
              )
            }
            className="absolute top-1 right-1 bg-white/90 text-red-600 text-xs px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition"
          >
            Sil
          </button>
        </div>
      ))}
    </div>
  );
}
