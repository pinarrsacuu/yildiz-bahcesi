import Link from "next/link";
import { logout } from "./actions";

const NAV_ITEMS = [
  { href: "/dashboard/inbox", label: "Randevu Talepleri" },
  { href: "/dashboard/paketler", label: "Menü / Paketler" },
  { href: "/dashboard/etkinlikler", label: "Etkinlikler & QR" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="font-semibold text-neutral-900">
            Yıldız Bahçesi — Yönetim Paneli
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              Çıkış Yap
            </button>
          </form>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-4 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-2 border-b-2 border-transparent hover:border-neutral-900 text-neutral-600 hover:text-neutral-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
