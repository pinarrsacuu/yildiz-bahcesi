import Link from "next/link";

const CARDS = [
  {
    href: "/dashboard/inbox",
    title: "Randevu Talepleri",
    description: "Gelen randevu taleplerini onaylayın veya reddedin.",
  },
  {
    href: "/dashboard/paketler",
    title: "Menü / Paketler",
    description: "Uygulamada gösterilecek menü ve organizasyon paketleri.",
  },
  {
    href: "/dashboard/etkinlikler",
    title: "Etkinlikler & QR",
    description: "Etkinlik oluşturun, QR kod üretin, fotoğraf yükleyin.",
  },
];

export default function DashboardHome() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="block rounded-xl border border-neutral-200 bg-white p-5 hover:border-neutral-400 transition"
        >
          <h2 className="font-medium text-neutral-900 mb-1">{card.title}</h2>
          <p className="text-sm text-neutral-500">{card.description}</p>
        </Link>
      ))}
    </div>
  );
}
