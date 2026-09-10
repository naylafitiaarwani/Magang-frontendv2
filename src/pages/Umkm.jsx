import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import axios from 'axios'

const LARAVEL_URL = 'http://127.0.0.1:8000'

export default function Umkm() {
  const [umkm, setUmkm] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUmkm = async () => {
      try {
        const response = await axios.get(`${LARAVEL_URL}/api/umkm`)

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || []

        setUmkm(data.filter((item) => item.is_active !== false))
      } catch (err) {
        console.error('Gagal mengambil data UMKM:', err)
        setError('Data UMKM belum dapat dimuat.')
      } finally {
        setLoading(false)
      }
    }

    fetchUmkm()
  }, [])

  return (
    <main className="min-h-screen bg-white">

      <section className="bg-[#3542A5] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            Jelajah Indramayu
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            UMKM Lokal Indramayu
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
            Temukan produk dan karya pelaku UMKM lokal Indramayu
            yang memiliki keunikan dan nilai budaya tersendiri.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#5968F2]">
              Produk Lokal
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Dukung Produk Indramayu
            </h2>
          </div>

          {loading && (
            <div className="py-20 text-center text-gray-500">
              Memuat data UMKM...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
              {error}
            </div>
          )}

          {!loading && !error && umkm.length === 0 && (
            <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
              Belum ada data UMKM.
            </div>
          )}

          {!loading && !error && umkm.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {umkm.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
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

                    {item.kategori && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#3542A5] backdrop-blur">
                        {item.kategori}
                      </span>
                    )}
                  </div>

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

                    {item.harga_mulai && (
                      <p className="mt-3 text-sm font-semibold text-[#3542A5]">
                        Mulai Rp {Number(item.harga_mulai).toLocaleString('id-ID')}
                      </p>
                    )}

                    {item.deskripsi && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                        {item.deskripsi}
                      </p>
                    )}

                    <Link
                      to={`/umkm/${item.slug}`}
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