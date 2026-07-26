import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EVENT_TYPE_LABELS, type VenueEvent, type EventPhoto } from "@yildiz-bahcesi/shared";
import { PhotoUploadForm } from "./PhotoUploadForm";
import { PhotoGrid } from "./PhotoGrid";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) notFound();

  const typedEvent = event as VenueEvent;

  const { data: photosData } = await supabase
    .from("photos")
    .select("*")
    .eq("event_id", id)
    .order("uploaded_at", { ascending: false });

  const photos = (photosData ?? []) as EventPhoto[];

  const photosWithUrls = await Promise.all(
    photos.map(async (photo) => {
      const { data } = await supabase.storage
        .from("event-photos")
        .createSignedUrl(photo.storage_path, 60 * 60);
      return { id: photo.id, storage_path: photo.storage_path, url: data?.signedUrl ?? "" };
    })
  );

  const qrPublicUrl = typedEvent.qr_image_path
    ? supabase.storage.from("qr-codes").getPublicUrl(typedEvent.qr_image_path)
        .data.publicUrl
    : null;

  return (
    <div>
      <Link
        href="/dashboard/etkinlikler"
        className="text-sm text-neutral-500 hover:text-neutral-900"
      >
        ← Etkinliklere dön
      </Link>

      <h1 className="text-lg font-semibold text-neutral-900 mt-2 mb-6">
        {typedEvent.customer_name} — {EVENT_TYPE_LABELS[typedEvent.event_type]}
        <span className="ml-2 text-sm font-normal text-neutral-500">
          {typedEvent.event_date}
        </span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
          <h2 className="font-medium text-neutral-900 mb-3">
            Misafir QR Kartı
          </h2>
          {qrPublicUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrPublicUrl}
                alt="Etkinlik QR kodu"
                className="mx-auto w-48 h-48"
              />
              <a
                href={qrPublicUrl}
                download
                className="inline-block mt-3 text-sm text-neutral-700 underline"
              >
                QR görselini indir / yazdır
              </a>
            </>
          ) : (
            <p className="text-sm text-neutral-500">QR kodu oluşturuluyor…</p>
          )}
          <p className="text-xs text-neutral-400 mt-3">
            Fotoğraflar {new Date(typedEvent.photos_expire_at ?? "").toLocaleDateString(
              "tr-TR"
            )}{" "}
            tarihine kadar erişilebilir.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="font-medium text-neutral-900 mb-3">
            Etkinlik Fotoğrafları
          </h2>
          <div className="mb-5">
            <PhotoUploadForm eventId={id} />
          </div>
          <PhotoGrid eventId={id} photos={photosWithUrls} />
        </div>
      </div>
    </div>
  );
}
