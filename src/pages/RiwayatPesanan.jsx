import { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { ArrowLeft, Ticket } from 'lucide-react'

import axios from 'axios'

import { useAuth } from '../context/AuthContext'

const LARAVEL_URL = 'http://127.0.0.1:8000'

const formatRupiah = (value) => {
  if (!value) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

const STATUS_LABEL = {
  pending: { text: 'Menunggu pembayaran', className: 'bg-yellow-50 text-yellow-700' },
  paid: { text: 'Lunas', className: 'bg-green-50 text-green-700' },
  expired: { text: 'Kedaluwarsa', className: 'bg-slate-100 text-slate-500' },
  cancelled: { text: 'Dibatalkan', className: 'bg-red-50 text-red-600' },
  failed: { text: 'Gagal', className: 'bg-red-50 text-red-600' },
}

export default function RiwayatPesanan() {

  const navigate = useNavigate()

  const { authHeader, isLoggedIn } = useAuth()

  const [pesananList, setPesananList] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/pesanan-tiket' } })
      return
    }

    const fetchPesanan = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${LARAVEL_URL}/api/pesanan-tiket`,
          { headers: authHeader() }
        )
        setPesananList(response.data.data || [])

      } catch (err) {
        console.error('Gagal mengambil riwayat pesanan:', err)
        setError('Riwayat pesanan belum dapat dimuat.')

      } finally {
        setLoading(false)
      }
    }

    fetchPesanan()
  }, [navigate])

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">

        <Link
          to="/wisata"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Kembali ke Wisata
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Riwayat Pesanan Tiket
        </h1>

        {loading && (
          <div className="mt-10 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="mt-10 text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && pesananList.length === 0 && (
          <div className="mt-16 text-center">
            <Ticket size={32} className="mx-auto text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">
              Kamu belum punya pesanan tiket.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {pesananList.map((pesanan) => {
            const status =
              STATUS_LABEL[pesanan.status] || STATUS_LABEL.pending

            return (
              <div
                key={pesanan.kode_pesanan}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {pesanan.kode_pesanan}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {pesanan.wisata?.nama}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                  >
                    {status.text}
                  </span>
                </div>

                <div className="mt-4 space-y-1 border-t border-slate-100 pt-4">
                  {pesanan.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-slate-600"
                    >
                      <span>
                        {item.nama_tiket} x{item.jumlah}
                      </span>
                      <span>{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-sm font-bold text-slate-900">
                  <span>Total</span>
                  <span>{formatRupiah(pesanan.total_harga)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
