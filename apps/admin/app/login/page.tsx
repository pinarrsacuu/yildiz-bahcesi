import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <h1 className="text-xl font-semibold text-neutral-900 mb-1">
          Yıldız Bahçesi
        </h1>
        <p className="text-sm text-neutral-500 mb-6">Personel Girişi</p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            E-posta veya şifre hatalı.
          </p>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 text-white text-sm font-medium py-2 hover:bg-neutral-800 transition"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
