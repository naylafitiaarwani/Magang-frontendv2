import { useState } from 'react'

import { Link, useLocation, useNavigate } from 'react-router-dom'

import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react'

import axios from 'axios'

import { useAuth } from '../context/AuthContext'

const LARAVEL_URL = 'http://127.0.0.1:8000'

export default function Register() {

  const navigate = useNavigate()

  const location = useLocation()

  const { login } = useAuth()

  const redirectTo = location.state?.from || '/'

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        `${LARAVEL_URL}/api/register`,
        form
      )

      const { token, data } = response.data
      login(token, data)
      navigate(redirectTo, { replace: true })

    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Registrasi gagal. Coba periksa kembali data kamu.'
      setError(message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#3542A5]/10">
            <UserPlus size={22} className="text-[#3542A5]" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Buat akun baru
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Daftar dulu supaya bisa beli tiket atau mengajukan wisata.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Nama lengkap
            </label>
            <div className="relative">
              <User
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Nama kamu"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              No. HP
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#3542A5] py-3 text-sm font-semibold text-white transition hover:bg-[#2b3585] disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            state={{ from: redirectTo }}
            className="font-semibold text-[#3542A5] hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  )
}
