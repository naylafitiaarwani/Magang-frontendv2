import { useEffect, useState } from 'react'

import { Link, useLocation } from 'react-router-dom'

import { Menu, UserCircle, X } from 'lucide-react'

import { useAuth } from '../context/AuthContext'

// URL CMS Laravel (Blade admin panel) — beda origin & beda sistem login
// (session, bukan JWT) dari frontend React ini. Ganti sesuai environment.
const CMS_ADMIN_URL = 'http://127.0.0.1:8000/admin/pengajuan-wisata'
const CMS_PENGELOLA_URL = 'http://127.0.0.1:8000/pengelola'

export default function Navbar() {

  const location = useLocation()

  const { user, logout, isAdmin } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menus = [
    {
      label: 'Beranda',
      path: '/',
    },
    {
      label: 'Sejarah',
      path: '/sejarah',
    },
    {
      label: 'Kuliner',
      path: '/kuliner',
    },
    {
      label: 'Wisata',
      path: '/wisata',
    },
    {
      label: 'UMKM',
      path: '/umkm',
    },
    {
      label: 'Budaya',
      path: '/budaya',
    },
  ]

  function isActive(path) {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 shadow-md backdrop-blur-md'
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-[1440px] mx-auto h-[70px] px-6 lg:px-10">
        <div className="h-full flex items-center justify-between">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="leading-[0.95]">
              <p className="text-[17px] font-bold text-[#123B55]">
                Indramayu
              </p>
              <p className="text-[17px] font-bold text-[#123B55]">
                Eksplor
              </p>
            </div>
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <nav className="hidden md:flex items-center gap-8">
            {menus.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className={`
                  relative
                  py-2
                  text-[14px]
                  font-medium
                  transition-colors
                  duration-200
                  ${
                    isActive(menu.path)
                      ? 'text-[#29256E]'
                      : 'text-gray-900 hover:text-[#29256E]'
                  }
                `}
              >
                {menu.label}
                {isActive(menu.path) && (
                  <span className="absolute left-0 right-0 -bottom-1 mx-auto h-[2px] rounded-full bg-[#5968F2] transition-all duration-300" />
                )}
              </Link>
            ))}

            {/* Ajukan wisata selalu tampil, tapi arahkan ke login dulu kalau belum masuk */}
            <Link
              to="/pengajuan-wisata"
              className="text-[14px] font-medium text-gray-900 hover:text-[#29256E]"
            >
              Ajukan Wisata
            </Link>
          </nav>

          {/* ================= USER ================= */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <UserCircle
                    size={24}
                    strokeWidth={1.7}
                    className="text-[#17145F]"
                  />
                  <span className="text-[13px] font-medium text-gray-900 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

                {/* Dropdown */}
                <div
                  className="
                  invisible
                  opacity-0
                  group-hover:visible
                  group-hover:opacity-100
                  absolute
                  right-0
                  top-full
                  mt-3
                  w-48
                  rounded-xl
                  bg-white
                  shadow-xl
                  border
                  border-gray-100
                  p-2
                  transition-all
                "
                >
                  <a
                    href={CMS_PENGELOLA_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:translate-x-1 hover:bg-gray-50"
                  >
                    Dashboard Saya (CMS)
                  </a>

                  <Link
                    to="/pesanan-tiket"
                    className="block rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:translate-x-1 hover:bg-gray-50"
                  >
                    Pesanan Tiket
                  </Link>

                  {isAdmin() && (
                    <a
                      href={CMS_ADMIN_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-[#3542A5] transition-all duration-200 hover:translate-x-1 hover:bg-gray-50"
                    >
                      Kelola Pengajuan (CMS)
                    </a>
                  )}

                  <button
                    onClick={logout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-all duration-200 hover:translate-x-1 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-[13px] font-medium text-gray-900 hover:text-[#29256E]"
              >
                <UserCircle
                  size={24}
                  strokeWidth={1.7}
                  className="text-[#17145F]"
                />
                <span>
                  Login
                </span>
              </Link>
            )}
          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-800 transition-transform duration-300 hover:scale-110"
          >
            {mobileOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-6 py-4 flex flex-col gap-1">
            {menus.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  px-4
                  py-3
                  rounded-lg
                  text-sm
                  ${
                    isActive(menu.path)
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-800'
                  }
                `}
              >
                {menu.label}
              </Link>
            ))}

            <Link
              to="/pengajuan-wisata"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-sm text-gray-800"
            >
              Ajukan Wisata
            </Link>

            <div className="border-t border-gray-100 mt-2 pt-2">
              {user ? (
                <>
                  <a
                    href={CMS_PENGELOLA_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm"
                  >
                    Dashboard Saya (CMS)
                  </a>

                  <Link
                    to="/pesanan-tiket"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm"
                  >
                    Pesanan Tiket
                  </Link>

                  {isAdmin() && (
                    <a
                      href={CMS_ADMIN_URL}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-[#3542A5]"
                    >
                      Kelola Pengajuan (CMS)
                    </a>
                  )}

                  <button
                    onClick={() => {
                      logout()
                      setMobileOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
