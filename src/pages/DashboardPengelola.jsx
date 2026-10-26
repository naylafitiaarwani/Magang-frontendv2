import { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import {
  ArrowLeft,
  Compass,
  Pencil,
  Plus,
  Ticket,
  Trash2,
} from 'lucide-react'

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

const emptyForm = { nama_tiket: '', harga: '', deskripsi: '' }

export default function DashboardPengelola() {

  const navigate = useNavigate()

  const { authHeader, isLoggedIn } = useAuth()

  const [wisataList, setWisataList] = useState([])
  const [selectedWisata, setSelectedWisata] = useState(null)

  const [tiketList, setTiketList] = useState([])
  const [pesananList, setPesananList] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formTiket, setFormTiket] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [savingTiket, setSavingTiket] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/dashboard' } })
      return
    }

    const fetchWisataSaya = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${LARAVEL_URL}/api/pengelola/wisata`,
          { headers: authHeader() }
        )

        const list = response.data.data || []
        setWisataList(list)

        if (list.length > 0) {
          setSelectedWisata(list[0])
        }

      } catch (err) {
        console.error('Gagal mengambil wisata saya:', err)
        setError('Gagal memuat data wisata kamu.')

      } finally {
        setLoading(false)
      }
    }

    fetchWisataSaya()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  useEffect(() => {
    if (!selectedWisata) return

    const fetchTiketDanPesanan = async () => {
      try {
        const [tiketRes, pesananRes] = await Promise.all([
          axios.get(`${LARAVEL_URL}/api/wisata/${selectedWisata.slug}/tiket`),
          axios.get(
            `${LARAVEL_URL}/api/wisata/${selectedWisata.id}/pesanan-tiket`,
            { headers: authHeader() }
          ),
        ])

        setTiketList(tiketRes.data.data || [])
        setPesananList(pesananRes.data.data || [])

      } catch (err) {
        console.error('Gagal mengambil tiket/pesanan:', err)
      }
    }

    fetchTiketDanPesanan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWisata])

  const resetForm = () => {
    setFormTiket(emptyForm)
    setEditingId(null)
  }

  const handleSubmitTiket = async (event) => {
    event.preventDefault()
    if (!selectedWisata) return

    setSavingTiket(true)

    try {
      if (editingId) {
        const response = await axios.put(
          `${LARAVEL_URL}/api/wisata/${selectedWisata.id}/tiket/${editingId}`,
          formTiket,
          { headers: authHeader() }
        )

        setTiketList((prev) =>
          prev.map((t) => (t.id === editingId ? response.data.data : t))
        )

      } else {
        const response = await axios.post(
          `${LARAVEL_URL}/api/wisata/${selectedWisata.id}/tiket`,
          formTiket,
          { headers: authHeader() }
        )

        setTiketList((prev) => [response.data.data, ...prev])
      }

      resetForm()

    } catch (err) {
      alert(
        err.response?.data?.message || 'Gagal menyimpan jenis tiket.'
      )

    } finally {
      setSavingTiket(false)
    }
  }

  const handleEditTiket = (tiket) => {
    setEditingId(tiket.id)
    setFormTiket({
      nama_tiket: tiket.nama_tiket,
      harga: tiket.harga,
      deskripsi: tiket.deskripsi || '',
    })
  }

  const handleDeleteTiket = async (tiket) => {
    if (!confirm(`Hapus jenis tiket "${tiket.nama_tiket}"?`)) return

    try {
      await axios.delete(
        `${LARAVEL_URL}/api/wisata/${selectedWisata.id}/tiket/${tiket.id}`,
        { headers: authHeader() }
      )
      setTiketList((prev) => prev.filter((t) => t.id !== tiket.id))

    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus tiket.')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Beranda
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Dashboard Pengelola
        </h1>

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}

        {wisataList.length === 0 && !error ? (
          <div className="mt-16 text-center">
            <Compass size={32} className="mx-auto text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">
              Kamu belum punya wisata yang disetujui. Ajukan dulu tempat
              wisata kamu.
            </p>
            <Link
              to="/pengajuan-wisata"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#3542A5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b3585]"
            >
              Ajukan Wisata
            </Link>
          </div>
        ) : (
          <>
            {/* Selector kalau punya lebih dari satu wisata */}
            {wisataList.length > 1 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {wisataList.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWisata(w)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedWisata?.id === w.id
                        ? 'bg-[#3542A5] text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {w.nama}
                  </button>
                ))}
              </div>
            )}

            {selectedWisata && (
              <div className="mt-8 grid gap-8 lg:grid-cols-2">

                {/* KELOLA TIKET */}
                <section className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Ticket size={18} className="text-[#3542A5]" />
                    <h2 className="text-lg font-bold text-slate-900">
                      Jenis Tiket — {selectedWisata.nama}
                    </h2>
                  </div>

                  {!selectedWisata.is_tiket_aktif ? (
                    <p className="mt-4 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-700">
                      Wisata ini belum mengaktifkan penjualan tiket online.
                      Hubungi admin untuk mengaktifkannya.
                    </p>
                  ) : (
                    <>
                      <form
                        onSubmit={handleSubmitTiket}
                        className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4"
                      >
                        <input
                          type="text"
                          required
                          placeholder="Nama tiket (mis. Dewasa)"
                          value={formTiket.nama_tiket}
                          onChange={(e) =>
                            setFormTiket((prev) => ({
                              ...prev,
                              nama_tiket: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="Harga"
                          value={formTiket.harga}
                          onChange={(e) =>
                            setFormTiket((prev) => ({
                              ...prev,
                              harga: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />
                        <textarea
                          placeholder="Deskripsi (opsional)"
                          rows={2}
                          value={formTiket.deskripsi}
                          onChange={(e) =>
                            setFormTiket((prev) => ({
                              ...prev,
                              deskripsi: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        />

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={savingTiket}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#3542A5] py-2 text-sm font-semibold text-white transition hover:bg-[#2b3585] disabled:opacity-60"
                          >
                            <Plus size={15} />
                            {editingId ? 'Simpan Perubahan' : 'Tambah Tiket'}
                          </button>

                          {editingId && (
                            <button
                              type="button"
                              onClick={resetForm}
                              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
                            >
                              Batal
                            </button>
                          )}
                        </div>
                      </form>

                      <div className="mt-5 space-y-3">
                        {tiketList.length === 0 && (
                          <p className="text-sm text-slate-400">
                            Belum ada jenis tiket.
                          </p>
                        )}

                        {tiketList.map((tiket) => (
                          <div
                            key={tiket.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {tiket.nama_tiket}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatRupiah(tiket.harga)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditTiket(tiket)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteTiket(tiket)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </section>

                {/* PESANAN MASUK */}
                <section className="rounded-2xl bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900">
                    Pesanan Masuk
                  </h2>

                  <div className="mt-4 space-y-3">
                    {pesananList.length === 0 && (
                      <p className="text-sm text-slate-400">
                        Belum ada pesanan masuk.
                      </p>
                    )}

                    {pesananList.map((pesanan) => (
                      <div
                        key={pesanan.kode_pesanan}
                        className="rounded-xl border border-slate-200 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">
                            {pesanan.nama_pemesan}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              pesanan.status === 'paid'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-yellow-50 text-yellow-700'
                            }`}
                          >
                            {pesanan.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {pesanan.kode_pesanan}
                        </p>
                        <p className="mt-2 text-sm font-bold text-slate-900">
                          {formatRupiah(pesanan.total_harga)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
