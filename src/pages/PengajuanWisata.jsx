import { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { ArrowLeft, CheckCircle2, UploadCloud } from 'lucide-react'

import axios from 'axios'

import { useAuth } from '../context/AuthContext'

const LARAVEL_URL = 'http://127.0.0.1:8000'

const initialForm = {
  nama_wisata: '',
  alamat_wisata: '',
  deskripsi_wisata: '',
  nama_pengaju: '',
  jabatan_pengaju: '',
  no_hp_pengaju: '',
  email_pengaju: '',
  status_entitas: 'perorangan',
  nama_organisasi: '',
  active_online_tiket: 'Tidak Aktif',
}

export default function PengajuanWisata() {

  const navigate = useNavigate()

  const { user, authHeader, isLoggedIn } = useAuth()

  const [form, setForm] = useState(initialForm)

  const [fotoLokasi, setFotoLokasi] = useState([])
  const [fotoKtp, setFotoKtp] = useState(null)
  const [fotoSelfie, setFotoSelfie] = useState(null)
  const [dokumenNib, setDokumenNib] = useState([])

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/pengajuan-wisata' } })
    }
  }, [isLoggedIn, navigate])

  if (!isLoggedIn) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (fotoLokasi.length === 0) {
      setError('Upload minimal satu foto lokasi wisata.')
      return
    }

    if (form.status_entitas === 'perorangan' && (!fotoKtp || !fotoSelfie)) {
      setError('Upload foto KTP dan foto selfie kamu.')
      return
    }

    if (
      form.status_entitas === 'organisasi' &&
      (!form.nama_organisasi || dokumenNib.length === 0)
    ) {
      setError('Lengkapi nama organisasi dan dokumen NIB.')
      return
    }

    setLoading(true)

    try {
      const payload = new FormData()

      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, value)
      })

      fotoLokasi.forEach((file) => {
        payload.append('foto_lokasi_wisata[]', file)
      })

      if (form.status_entitas === 'perorangan') {
        payload.append('foto_ktp', fotoKtp)
        payload.append('foto_selfie', fotoSelfie)
      } else {
        dokumenNib.forEach((file) => {
          payload.append('dokumen_nib[]', file)
        })
      }

      await axios.post(
        `${LARAVEL_URL}/api/pengajuan/wisata`,
        payload,
        {
          headers: {
            ...authHeader(),
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setSuccess(true)

    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Gagal mengirim pengajuan. Periksa kembali data & file yang diupload.'
      setError(message)

    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl shadow-slate-900/5">
          <CheckCircle2 size={48} className="mx-auto text-green-500" />
          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Pengajuan terkirim!
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Tim kami akan meninjau pengajuan wisata kamu. Kamu bisa cek
            statusnya lewat dashboard.
          </p>
          <a
            href="http://127.0.0.1:8000/pengelola"
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#3542A5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2b3585]"
          >
            Ke Dashboard Saya (CMS)
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        <Link
          to="/wisata"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Kembali
        </Link>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-xl shadow-slate-900/5">
          <h1 className="text-2xl font-bold text-slate-900">
            Ajukan Wisata Baru
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Masuk sebagai {user?.name}. Isi data di bawah untuk mengajukan
            tempat wisata milikmu.
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">

            {/* DATA WISATA */}
            <fieldset className="space-y-4">
              <legend className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Data Wisata
              </legend>

              <input
                type="text"
                name="nama_wisata"
                required
                value={form.nama_wisata}
                onChange={handleChange}
                placeholder="Nama wisata"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:outline-none"
              />
              <input
                type="text"
                name="alamat_wisata"
                required
                value={form.alamat_wisata}
                onChange={handleChange}
                placeholder="Alamat lengkap"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:outline-none"
              />
              <textarea
                name="deskripsi_wisata"
                required
                rows={4}
                value={form.deskripsi_wisata}
                onChange={handleChange}
                placeholder="Deskripsikan wisata ini..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:outline-none"
              />

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <UploadCloud size={15} />
                  Foto lokasi wisata (boleh lebih dari satu)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => setFotoLokasi(Array.from(e.target.files))}
                  className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm"
                />
              </div>
            </fieldset>

            {/* DATA PENGAJU */}
            <fieldset className="space-y-4 border-t border-slate-100 pt-6">
              <legend className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Data Pengaju
              </legend>

              <input
                type="text"
                name="nama_pengaju"
                required
                value={form.nama_pengaju}
                onChange={handleChange}
                placeholder="Nama pengaju"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:outline-none"
              />
              <input
                type="text"
                name="jabatan_pengaju"
                required
                value={form.jabatan_pengaju}
                onChange={handleChange}
                placeholder="Jabatan (mis. Pengelola, Ketua Pokdarwis)"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:outline-none"
              />
              <input
                type="tel"
                name="no_hp_pengaju"
                required
                value={form.no_hp_pengaju}
                onChange={handleChange}
                placeholder="No. HP"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:outline-none"
              />
              <input
                type="email"
                name="email_pengaju"
                required
                value={form.email_pengaju}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:outline-none"
              />
            </fieldset>

            {/* STATUS ENTITAS */}
            <fieldset className="space-y-4 border-t border-slate-100 pt-6">
              <legend className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Status Pengaju
              </legend>

              <div className="flex gap-3">
                {['perorangan', 'organisasi'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, status_entitas: opt }))
                    }
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition ${
                      form.status_entitas === opt
                        ? 'border-[#3542A5] bg-[#3542A5]/10 text-[#3542A5]'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {form.status_entitas === 'perorangan' ? (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Foto KTP
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFotoKtp(e.target.files[0])}
                      className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Foto Selfie (memegang KTP)
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setFotoSelfie(e.target.files[0])}
                      className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="nama_organisasi"
                    value={form.nama_organisasi}
                    onChange={handleChange}
                    placeholder="Nama organisasi/badan usaha"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:outline-none"
                  />
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Dokumen NIB (boleh lebih dari satu)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) => setDokumenNib(Array.from(e.target.files))}
                      className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Aktifkan penjualan tiket online?
                    </label>
                    <div className="flex gap-3">
                      {['Aktif', 'Tidak Aktif'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              active_online_tiket: opt,
                            }))
                          }
                          className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                            form.active_online_tiket === opt
                              ? 'border-[#3542A5] bg-[#3542A5]/10 text-[#3542A5]'
                              : 'border-slate-200 text-slate-500'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#3542A5] py-3 text-sm font-semibold text-white transition hover:bg-[#2b3585] disabled:opacity-60"
            >
              {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
