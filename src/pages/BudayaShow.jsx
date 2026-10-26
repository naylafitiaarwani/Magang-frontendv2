import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Landmark } from 'lucide-react'
import axios from 'axios'

const LARAVEL_URL = 'http://127.0.0.1:8000'

const decodeHtml = (value = '') =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")

export default function BudayaShow() {
  const { slug } = useParams()
  const [budaya, setBudaya] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchBudaya = async () => {
      try {
        setLoading(true)
        setError(false)
        const response = await axios.get(`${LARAVEL_URL}/api/budaya/${slug}`)
        setBudaya(response.data.data)
      } catch (err) {
        console.error('Gagal mengambil detail budaya:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchBudaya()
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div className="aspect-[4/3] animate-pulse rounded-[28px] bg-slate-100" />
            <div className="space-y-5 pt-4">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
              <div className="h-12 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !budaya) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Landmark size={28} className="text-slate-400" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Budaya tidak ditemukan
            </h1>
            <p className="mt-2 text-slate-500">
              Data budaya yang kamu cari tidak tersedia.
            </p>
            <Link
              to="/budaya"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft size={17} />
              Kembali ke Budaya
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const nama = decodeHtml(budaya.nama)
  const kategori = decodeHtml(budaya.kategori || '')
  const lokasi = decodeHtml(budaya.lokasi || '')
  const deskripsi = decodeHtml(budaya.deskripsi || '')
  const imageUrl = budaya.gambar
    ? `${LARAVEL_URL}/storage/${budaya.gambar}`
    : '/images/placeholder.jpg'

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-8 lg:px-8">
        <Link
          to="/budaya"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Kembali ke Budaya
        </Link>

        <section className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
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

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5968F2]">
              {kategori || 'Budaya Indramayu'}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {nama}
            </h1>
            {lokasi && (
              <div className="mt-5 flex items-center gap-2 text-slate-500">
                <MapPin size={18} className="shrink-0 text-[#5968F2]" />
                <span>{lokasi}</span>
              </div>
            )}
            {deskripsi && (
              <p className="mt-6 text-sm leading-7 text-slate-600">
                {deskripsi}
              </p>
            )}
          </div>
        </section>

        <div className="mt-16 border-t border-slate-200 pt-8">
          <Link
            to="/budaya"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-[#5968F2]"
          >
            <ArrowLeft size={17} className="transition-transform group-hover:-translate-x-1" />
            Lihat Budaya lainnya
          </Link>
        </div>
      </div>
    </main>
  )
}