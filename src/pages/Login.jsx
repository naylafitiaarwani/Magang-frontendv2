import { useState } from 'react'

import { Link, useLocation, useNavigate } from 'react-router-dom'

import { LogIn, Mail, Lock } from 'lucide-react'

import axios from 'axios'

import { useAuth } from '../context/AuthContext'

const LARAVEL_URL = 'http://127.0.0.1:8000'

export default function Login() {

  const navigate = useNavigate()

  const location = useLocation()

  const { login } = useAuth()

  const redirectTo = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '' })

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
        `${LARAVEL_URL}/api/login`,
        form
      )

      const { token, data } = response.data
      login(token, data)
      navigate(redirectTo, { replace: true })

    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Login gagal. Periksa kembali email dan password kamu.'
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
            <LogIn size={22} className="text-[#3542A5]" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Masuk ke akun kamu
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Login diperlukan untuk beli tiket atau mengajukan wisata.
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
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#3542A5] py-3 text-sm font-semibold text-white transition hover:bg-[#2b3585] disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link
            to="/register"
            state={{ from: redirectTo }}
            className="font-semibold text-[#3542A5] hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  )
}
