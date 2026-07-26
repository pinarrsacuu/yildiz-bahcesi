"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateVenueContent(formData: FormData) {
  const supabase = await createClient();

  const sectionKey = String(formData.get("section_key") ?? "");
  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "");
  const imageFile = formData.get("image") as File | null;

  const { data: existing } = await supabase
    .from("venue_content")
    .select("images")
    .eq("section_key", sectionKey)
    .single();

  const images: string[] = existing?.images ?? [];

  if (imageFile && imageFile.size > 0) {
    const path = `${sectionKey}-${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("venue-content")
      .upload(path, imageFile);

    if (!uploadError) {
      const { data } = supabase.storage.from("venue-content").getPublicUrl(path);
      images.push(data.publicUrl);
    }
  }

  await supabase
    .from("venue_content")
    .update({ title, body, images })
    .eq("section_key", sectionKey);

  revalidatePath("/dashboard/icerik");
}

export async function removeVenueImage(sectionKey: string, imageUrl: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("venue_content")
    .select("images")
    .eq("section_key", sectionKey)
    .single();

  const images = (existing?.images ?? []).filter((url: string) => url !== imageUrl);

  await supabase
    .from("venue_content")
    .update({ images })
    .eq("section_key", sectionKey);

  revalidatePath("/dashboard/icerik");
}
