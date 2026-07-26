"use client";

import { useTransition } from "react";
import { togglePackageActive, deletePackage } from "./actions";
import type { Package } from "@yildiz-bahcesi/shared";

export function PackageRow({ pkg }: { pkg: Package }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-3">
        {pkg.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pkg.images[0]}
            alt={pkg.title}
            className="w-14 h-14 object-cover rounded-md"
          />
        )}
        <div>
          <p className="font-medium text-neutral-900">
            {pkg.title}{" "}
            <span className="text-xs text-neutral-400">
              ({pkg.category === "menu" ? "Menü" : "Paket"})
            </span>
          </p>
          <p className="text-sm text-neutral-500">{pkg.description}</p>
          {pkg.price_info && (
            <p className="text-xs text-neutral-400">{pkg.price_info}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(() => togglePackageActive(pkg.id, !pkg.is_active))
          }
          className={`text-xs px-2 py-1 rounded-full ${
            pkg.is_active
              ? "bg-green-100 text-green-800"
              : "bg-neutral-200 text-neutral-600"
          }`}
        >
          {pkg.is_active ? "Aktif" : "Pasif"}
        </button>
        <button
          disabled={isPending}
          onClick={() => startTransition(() => deletePackage(pkg.id))}
          className="text-xs text-red-600 hover:underline"
        >
          Sil
        </button>
      </div>
    </div>
  );
}
