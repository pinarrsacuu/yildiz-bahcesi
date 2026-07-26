import { createClient } from "@/lib/supabase/server";
import { ContentSectionForm } from "./ContentSectionForm";

export interface VenueContent {
  id: string;
  section_key: string;
  title: string;
  body: string;
  images: string[];
}

export default async function IcerikPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("venue_content")
    .select("*")
    .order("section_key");

  const sections = (data ?? []) as VenueContent[];

  return (
    <div>
      <h1 className="text-lg font-semibold text-neutral-900 mb-4">
        Site İçeriği
      </h1>
      <div className="space-y-6">
        {sections.map((section) => (
          <ContentSectionForm key={section.id} content={section} />
        ))}
      </div>
    </div>
  );
}
