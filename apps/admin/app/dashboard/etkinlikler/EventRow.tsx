"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteEvent } from "./actions";
import { EVENT_TYPE_LABELS, type VenueEvent } from "@yildiz-bahcesi/shared";

export function EventRow({ event }: { event: VenueEvent }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      <Link href={`/dashboard/etkinlikler/${event.id}`} className="flex-1">
        <p className="font-medium text-neutral-900">
          {event.customer_name} — {EVENT_TYPE_LABELS[event.event_type]}
        </p>
        <p className="text-sm text-neutral-500">{event.event_date}</p>
      </Link>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => deleteEvent(event.id))}
        className="text-xs text-red-600 hover:underline shrink-0"
      >
        Sil
      </button>
    </div>
  );
}
