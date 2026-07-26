"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPackage(formData: FormData) {
  const supabase = await createClient();

  const category = String(formData.get("category") ?? "paket");
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const priceInfo = String(formData.get("price_info") ?? "");
  const imageFile = formData.get("image") as File | null;

  const images: string[] = [];

  if (imageFile && imageFile.size > 0) {
    const path = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("package-images")
      .upload(path, imageFile);

    if (!uploadError) {
      const { data } = supabase.storage
        .from("package-images")
        .getPublicUrl(path);
      images.push(data.publicUrl);
    }
  }

  await supabase.from("packages").insert({
    category,
    title,
    description,
    price_info: priceInfo || null,
    images,
  });

  revalidatePath("/dashboard/paketler");
}

export async function togglePackageActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  await supabase.from("packages").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/dashboard/paketler");
}

export async function deletePackage(id: string) {
  const supabase = await createClient();
  await supabase.from("packages").delete().eq("id", id);
  revalidatePath("/dashboard/paketler");
}
