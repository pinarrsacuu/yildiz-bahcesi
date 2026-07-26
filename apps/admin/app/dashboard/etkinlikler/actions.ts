"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import type { EventType } from "@yildiz-bahcesi/shared";

async function getSiteOrigin() {
  const h = await headers();
  const host = h.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();

  const customerName = String(formData.get("customer_name") ?? "");
  const eventType = String(formData.get("event_type") ?? "diger") as EventType;
  const eventDate = String(formData.get("event_date") ?? "");
  const expiryMonths = Number(formData.get("expiry_months") ?? 6);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const photosExpireAt = new Date();
  photosExpireAt.setMonth(photosExpireAt.getMonth() + expiryMonths);

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      customer_name: customerName,
      event_type: eventType,
      event_date: eventDate,
      photos_expire_at: photosExpireAt.toISOString(),
      created_by: user?.id ?? null,
    })
    .select()
    .single();

  if (error || !event) {
    revalidatePath("/dashboard/etkinlikler");
    return;
  }

  const origin = await getSiteOrigin();
  const guestUrl = `${origin}/etkinlik/${event.qr_token}`;
  const qrPngBuffer = await QRCode.toBuffer(guestUrl, {
    width: 600,
    margin: 2,
  });

  const qrPath = `${event.id}.png`;
  const { error: uploadError } = await supabase.storage
    .from("qr-codes")
    .upload(qrPath, qrPngBuffer, { contentType: "image/png", upsert: true });

  if (!uploadError) {
    await supabase
      .from("events")
      .update({ qr_image_path: qrPath })
      .eq("id", event.id);
  }

  revalidatePath("/dashboard/etkinlikler");
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/dashboard/etkinlikler");
}
