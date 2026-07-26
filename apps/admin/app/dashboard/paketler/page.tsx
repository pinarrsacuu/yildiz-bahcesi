import { createClient } from "@/lib/supabase/server";
import { createPackage } from "./actions";
import { PackageRow } from "./PackageRow";
import type { Package } from "@yildiz-bahcesi/shared";

export default async function PaketlerPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("*")
    .order("display_order", { ascending: true });

  const packages = (data ?? []) as Package[];

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900 mb-4">
          Menü / Paketler
        </h1>
        {packages.length === 0 && (
          <p className="text-sm text-neutral-500">Henüz paket eklenmedi.</p>
        )}
        <div className="space-y-3">
          {packages.map((pkg) => (
            <PackageRow key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 h-fit">
        <h2 className="font-medium text-neutral-900 mb-4">Yeni Ekle</h2>
        <form action={createPackage} className="space-y-3">
          <div>
            <label className="block text-sm text-neutral-700 mb-1">Tür</label>
            <select
              name="category"
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
            >
              <option value="paket">Organizasyon Paketi</option>
              <option value="menu">Menü</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Başlık
            </label>
            <input
              name="title"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Açıklama
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Fiyat notu (opsiyonel)
            </label>
            <input
              name="price_info"
              placeholder="Kişi başı fiyatlandırma vb."
              className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-700 mb-1">
              Görsel (opsiyonel)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 text-white text-sm font-medium py-2 hover:bg-neutral-800"
          >
            Ekle
          </button>
        </form>
      </div>
    </div>
  );
}
