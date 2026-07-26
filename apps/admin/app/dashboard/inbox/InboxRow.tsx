"use client";

import { useState, useTransition } from "react";
import { updateAppointmentStatus } from "./actions";
import {
  EVENT_TYPE_LABELS,
  APPOINTMENT_STATUS_LABELS,
  type AppointmentRequest,
} from "@yildiz-bahcesi/shared";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-neutral-200 text-neutral-700",
};

export function InboxRow({ request }: { request: AppointmentRequest }) {
  const [note, setNote] = useState(request.staff_note ?? "");
  const [isPending, startTransition] = useTransition();

  function updateStatus(status: "approved" | "rejected" | "completed") {
    startTransition(() => {
      updateAppointmentStatus(request.id, status, note);
    });
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-neutral-900">
            {request.customer_name} — {EVENT_TYPE_LABELS[request.event_type]}
          </p>
          <p className="text-sm text-neutral-500">
            {request.phone} {request.email ? `· ${request.email}` : ""}
          </p>
          <p className="text-sm text-neutral-500">
            Tarih: {request.requested_date}
            {request.alternate_date
              ? ` (alternatif: ${request.alternate_date})`
              : ""}{" "}
            · {request.guest_count} kişi
          </p>
          {request.message && (
            <p className="text-sm text-neutral-600 mt-2 italic">
              &ldquo;{request.message}&rdquo;
            </p>
          )}
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
            STATUS_COLORS[request.status]
          }`}
        >
          {APPOINTMENT_STATUS_LABELS[request.status]}
        </span>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-center">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Personel notu (opsiyonel)"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
        />
        <div className="flex gap-2">
          <button
            disabled={isPending}
            onClick={() => updateStatus("approved")}
            className="text-sm px-3 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            Onayla
          </button>
          <button
            disabled={isPending}
            onClick={() => updateStatus("rejected")}
            className="text-sm px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            Reddet
          </button>
          <button
            disabled={isPending}
            onClick={() => updateStatus("completed")}
            className="text-sm px-3 py-1.5 rounded-md bg-neutral-800 text-white hover:bg-neutral-900 disabled:opacity-50"
          >
            Tamamlandı
          </button>
        </div>
      </div>
    </div>
  );
}
