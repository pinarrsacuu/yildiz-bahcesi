"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function uploadPhotos(eventId: string, formData: FormData) {
  const supabase = await createClient();
  const files = formData.getAll("photos") as File[];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const path = `${eventId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("event-photos")
      .upload(path, file);

    if (!uploadError) {
      await supabase.from("photos").insert({
        event_id: eventId,
        storage_path: path,
        uploaded_by: user?.id ?? null,
      });
    }
  }

  revalidatePath(`/dashboard/etkinlikler/${eventId}`);
}

export async function deletePhoto(eventId: string, photoId: string, storagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("event-photos").remove([storagePath]);
  await supabase.from("photos").delete().eq("id", photoId);
  revalidatePath(`/dashboard/etkinlikler/${eventId}`);
}
