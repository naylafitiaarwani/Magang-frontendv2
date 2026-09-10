import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import axios from 'axios'

const LARAVEL_URL = 'http://127.0.0.1:8000'

export default function Budaya() {
  const [budaya, setBudaya] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBudaya = async () => {
      try {
        const response = await axios.get(`${LARAVEL_URL}/api/budaya`)

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || []

        setBudaya(data.filter((item) => item.is_active !== false))
      } catch (err) {
        console.error('Gagal mengambil data budaya:', err)
        setError('Data budaya belum dapat dimuat.')
      } finally {
        setLoading(false)
      }
    }

    fetchBudaya()
  }, [])

  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-[#3542A5] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            Jelajah Indramayu
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Budaya Lokal Indramayu
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
            Kenali kekayaan budaya, tradisi, seni, dan warisan lokal
            yang menjadi bagian dari identitas masyarakat Indramayu.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#5968F2]">
              Eksplorasi
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Temukan Budaya Indramayu
            </h2>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="py-20 text-center text-gray-500">
              Memuat data budaya...
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
              {error}
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && budaya.length === 0 && (
            <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
              Belum ada data budaya.
            </div>
          )}

          {/* GRID */}
          {!loading && !error && budaya.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {budaya.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* IMAGE */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

                    {item.gambar ? (
                      <img
                        src={`${LARAVEL_URL}/storage/${item.gambar}`}
                        alt={item.nama}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        Tidak ada gambar
                      </div>
                    )}

                    {/* CATEGORY */}
                    {item.kategori && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#3542A5] backdrop-blur">
                        {item.kategori}
                      </span>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="p-6">

                    <h3 className="text-xl font-bold text-gray-900">
                      {item.nama}
                    </h3>

                    {item.lokasi && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} />
                        <span>{item.lokasi}</span>
                      </div>
                    )}

                    {item.deskripsi && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                        {item.deskripsi}
                      </p>
                    )}

                    <Link
                      to={`/budaya/${item.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#3542A5] transition group-hover:gap-3"
                    >
                      Lihat detail
                      <ArrowRight size={16} />
                    </Link>

                  </div>
                </article>
              ))}

            </div>
          )}

        </div>
      </section>

    </main>
  )
}