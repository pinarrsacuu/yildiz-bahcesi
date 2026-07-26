"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@yildiz-bahcesi/shared";

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  staffNote: string
) {
  const supabase = await createClient();
  await supabase
    .from("appointment_requests")
    .update({ status, staff_note: staffNote || null })
    .eq("id", id);

  revalidatePath("/dashboard/inbox");
}
