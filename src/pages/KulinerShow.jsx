
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Utensils } from 'lucide-react'
import axios from 'axios'

const LARAVEL_URL = 'http://127.0.0.1:8000'

const decodeHtml = (value = '') =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")

const formatRupiah = (value) => {
  if (!value) return null

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export default function KulinerShow() {
  const { slug } = useParams()

  const [kuliner, setKuliner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchKuliner = async () => {
      try {
        setLoading(true)
        setError(false)

        const response = await axios.get(
          `${LARAVEL_URL}/api/kuliner/${slug}`
        )

        setKuliner(response.data.data)
      } catch (err) {
        console.error('Gagal mengambil detail kuliner:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchKuliner()
    }
  }, [slug])

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">

          <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">

            <div className="aspect-[4/3] animate-pulse rounded-[28px] bg-slate-100" />

            <div className="space-y-5 pt-4">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
              <div className="h-12 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />
              <div className="mt-8 h-16 w-40 animate-pulse rounded bg-slate-100" />
            </div>

          </div>
        </div>
      </main>
    )
  }

  // =========================
  // ERROR
  // =========================

  if (error || !kuliner) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Utensils
                size={28}
                className="text-slate-400"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Kuliner tidak ditemukan
            </h1>

            <p className="mt-2 text-slate-500">
              Data kuliner yang kamu cari tidak tersedia.
            </p>

            <Link
              to="/kuliner"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft size={17} />
              Kembali ke Kuliner
            </Link>

          </div>

        </div>
      </main>
    )
  }

  // =========================
  // DATA
  // =========================

  const nama = decodeHtml(kuliner.nama)
  const kategori = decodeHtml(kuliner.kategori || '')
  const lokasi = decodeHtml(kuliner.lokasi || '')
  const deskripsi = decodeHtml(kuliner.deskripsi || '')

  const hargaMulai = formatRupiah(kuliner.harga_mulai)

  const imageUrl = kuliner.gambar
    ? `${LARAVEL_URL}/storage/${kuliner.gambar}`
    : '/images/placeholder.jpg'

  // =========================
  // MULTI PARAGRAPH
  // =========================

  const paragraphs = deskripsi
    .split(/\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  // =========================
  // FRONTEND
  // =========================

  return (
    <main className="min-h-screen bg-white">

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-8 lg:px-8">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <Link
          to="/kuliner"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Kembali ke Kuliner
        </Link>


        {/* =========================
            HERO
        ========================= */}

        <section className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">

          {/* FOTO */}

          <div className="overflow-hidden rounded-[28px] bg-slate-100">

            <img
              src={imageUrl}
              alt={nama}
              className="aspect-[4/3] w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder.jpg'
              }}
            />

          </div>


          {/* INFORMASI KULINER */}

          <div>

            {/* KATEGORI */}

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5968F2]">
              {kategori || 'Kuliner Indramayu'}
            </p>


            {/* NAMA */}

            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {nama}
            </h1>


            {/* LOKASI */}

            {lokasi && (
              <div className="mt-5 flex items-center gap-2 text-slate-500">

                <MapPin
                  size={18}
                  className="shrink-0 text-[#5968F2]"
                />

                <span>
                  {lokasi}
                </span>

              </div>
            )}


            {/* HARGA */}

            {hargaMulai && (
              <div className="mt-10 border-t border-slate-200 pt-7">

                <p className="text-sm font-medium text-slate-400">
                  Harga mulai
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {hargaMulai}
                </p>

              </div>
            )}

          </div>

        </section>


        {/* =========================
            DESKRIPSI
        ========================= */}

        {paragraphs.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-12">

            <div className="max-w-3xl">

              {/* LABEL */}

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5968F2]">
                Tentang Kuliner
              </p>


              {/* HEADING */}

              <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                Mengenal {nama}
              </h2>


              {/* PARAGRAPH */}

              <div className="mt-8 space-y-7">

                {paragraphs.map((paragraph, index) => (

                  <p
                    key={index}
                    className={
                      index === 0
                        ? 'text-lg leading-8 text-slate-700 sm:text-xl sm:leading-9'
                        : 'text-base leading-8 text-slate-600 sm:text-lg sm:leading-9'
                    }
                  >
                    {paragraph}
                  </p>

                ))}

              </div>

            </div>

          </section>
        )}


        {/* =========================
            BOTTOM NAVIGATION
        ========================= */}

        <div className="mt-20 border-t border-slate-200 pt-8">

          <Link
            to="/kuliner"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-[#5968F2]"
          >

            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />

            Lihat Kuliner lainnya

          </Link>

        </div>

      </div>

    </main>
  )
}

