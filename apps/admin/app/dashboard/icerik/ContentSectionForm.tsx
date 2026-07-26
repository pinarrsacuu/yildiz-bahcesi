"use client";

import { useTransition } from "react";
import { updateVenueContent, removeVenueImage } from "./actions";
import type { VenueContent } from "./page";

const SECTION_LABELS: Record<string, string> = {
  anasayfa: "Anasayfa",
  biz_kimiz: "Biz Kimiz",
  neler_yapiyoruz: "Neler Yapıyoruz",
};

export function ContentSectionForm({ content }: { content: VenueContent }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <h2 className="font-medium text-neutral-900 mb-4">
        {SECTION_LABELS[content.section_key] ?? content.section_key}
      </h2>
      <form action={updateVenueContent} className="space-y-3">
        <input type="hidden" name="section_key" value={content.section_key} />
        <div>
          <label className="block text-sm text-neutral-700 mb-1">Başlık</label>
          <input
            name="title"
            defaultValue={content.title}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-700 mb-1">Metin</label>
          <textarea
            name="body"
            defaultValue={content.body}
            rows={4}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          />
        </div>

        {content.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {content.images.map((url) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="w-20 h-20 object-cover rounded-md border border-neutral-200"
                />
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() =>
                      removeVenueImage(content.section_key, url)
                    )
                  }
                  className="absolute -top-1.5 -right-1.5 bg-white text-red-600 text-xs w-5 h-5 rounded-full border border-neutral-200"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-sm text-neutral-700 mb-1">
            Görsel Ekle (opsiyonel)
          </label>
          <input type="file" name="image" accept="image/*" className="text-sm" />
        </div>

        <button
          type="submit"
          className="rounded-md bg-neutral-900 text-white text-sm font-medium px-4 py-2 hover:bg-neutral-800"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
