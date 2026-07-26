import { createClient } from "@/lib/supabase/server";

interface GuestPhoto {
  photo_id: string;
  storage_path: string;
  thumbnail_path: string | null;
  caption: string | null;
  uploaded_at: string;
}

export default async function GuestEventPhotosPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data } = await supabase.rpc("get_event_photos", { token });
  const rows = (data ?? []) as GuestPhoto[];

  const photos = rows.map((row) => ({
    id: row.photo_id,
    url: supabase.storage.from("event-photos").getPublicUrl(row.storage_path)
      .data.publicUrl,
  }));

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold text-neutral-900 text-center mb-1">
          Yıldız Bahçesi
        </h1>
        <p className="text-sm text-neutral-500 text-center mb-8">
          Etkinlik Fotoğraflarınız
        </p>

        {photos.length === 0 ? (
          <div className="text-center bg-white border border-neutral-200 rounded-xl p-8">
            <p className="text-neutral-700 font-medium mb-1">
              Fotoğraf bulunamadı
            </p>
            <p className="text-sm text-neutral-500">
              Bu bağlantının süresi dolmuş olabilir veya henüz fotoğraf
              yüklenmemiş olabilir. Lütfen Yıldız Bahçesi ile iletişime geçin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <a
                key={photo.id}
                href={photo.url}
                download
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg overflow-hidden border border-neutral-200 bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt=""
                  className="w-full h-40 object-cover"
                />
              </a>
            ))}
          </div>
        )}

        <p className="text-xs text-neutral-400 text-center mt-8">
          Fotoğrafa dokunup indirebilirsiniz.
        </p>
      </div>
    </div>
  );
}
