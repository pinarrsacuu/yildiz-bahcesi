"use client";

import { useRef, useTransition } from "react";
import { uploadPhotos } from "./actions";

export function PhotoUploadForm({ eventId }: { eventId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await uploadPhotos(eventId, formData);
          formRef.current?.reset();
        });
      }}
      className="space-y-3"
    >
      <input
        type="file"
        name="photos"
        accept="image/*"
        multiple
        required
        className="block w-full text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-neutral-900 text-white text-sm font-medium px-4 py-2 hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? "Yükleniyor..." : "Fotoğrafları Yükle"}
      </button>
    </form>
  );
}
