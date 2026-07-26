import { createClient } from "@/lib/supabase/server";
import { createEvent } from "./actions";
import { EventRow } from "./EventRow";
import type { VenueEvent } from "@yildiz-bahcesi/shared";

export default async function EtkinliklerPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  const events = (data ?? []) as VenueEvent[];

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900 mb-4">
          Etkinlikler & QR
        </h1>
        {events.length === 0 && (
          <p className="text-sm text-neutral-500">Henüz etkinlik yok.</p>
        )}
        <div className="space-y-3">
          {events.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 h-fit">
        <h2 className="font-medium text-neutral-900 mb-4">
          Yeni Etkinlik Oluştur
        </h2>
        <form action={createEvent} className="space-y-3">
          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Müşteri Adı
            </label>
            <input
              name="customer_name"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Etkinlik Türü
            </label>
            <select
              name="event_type"
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
            >
              <option value="dogum_gunu">Doğum Günü</option>
              <option value="nisan">Nişan</option>
              <option value="dugun">Düğün</option>
              <option value="baby_shower">Baby Shower</option>
              <option value="soz">Söz</option>
              <option value="diger">Diğer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Etkinlik Tarihi
            </label>
            <input
              type="date"
              name="event_date"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Fotoğraflar kaç ay erişilebilir kalsın?
            </label>
            <select
              name="expiry_months"
              defaultValue="6"
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
            >
              <option value="6">6 ay</option>
              <option value="12">12 ay</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 text-white text-sm font-medium py-2 hover:bg-neutral-800"
          >
            Oluştur ve QR Üret
          </button>
        </form>
      </div>
    </div>
  );
}
