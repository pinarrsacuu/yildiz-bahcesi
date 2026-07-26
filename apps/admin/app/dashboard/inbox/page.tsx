import { createClient } from "@/lib/supabase/server";
import { InboxRow } from "./InboxRow";
import type { AppointmentRequest } from "@yildiz-bahcesi/shared";

export default async function InboxPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointment_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const requests = (data ?? []) as AppointmentRequest[];

  return (
    <div>
      <h1 className="text-lg font-semibold text-neutral-900 mb-4">
        Randevu Talepleri
      </h1>

      {error && (
        <p className="text-sm text-red-600 mb-4">
          Talepler yüklenemedi: {error.message}
        </p>
      )}

      {requests.length === 0 && !error && (
        <p className="text-sm text-neutral-500">Henüz randevu talebi yok.</p>
      )}

      <div className="space-y-3">
        {requests.map((request) => (
          <InboxRow key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}
