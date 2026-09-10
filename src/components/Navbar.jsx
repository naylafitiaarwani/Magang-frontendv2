import { UserCircle, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const location = useLocation()

  const { user, logout } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)

  const menus = [
    {
      label: 'Beranda',
      path: '/',
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
    {
      label: 'Sejarah',
      path: '/sejarah',
    },
  ]

  function isActive(path) {
    if (path === '/') {
      return location.pathname === '/'
    }

    return location.pathname.startsWith(path)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">

      <div className="max-w-[1440px] mx-auto h-[70px] px-6 lg:px-10">

        <div className="h-full flex items-center justify-between">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="flex items-center gap-2"
          >

            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-yellow-400 via-green-500 to-blue-500 flex items-center justify-center text-lg">
              🥭
            </div>

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
                  <span className="absolute left-0 right-0 -bottom-1 mx-auto h-[2px] rounded-full bg-[#5968F2]" />
                )}

              </Link>

            ))}

          </nav>


          {/* ================= USER ================= */}
          <div className="hidden md:flex items-center">

            {user ? (

              <div className="relative group">

                <Link
                  to="/profile"
                  className="flex items-center gap-2"
                >

                  <UserCircle
                    size={24}
                    strokeWidth={1.7}
                    className="text-[#17145F]"
                  />

                  <span className="text-[13px] font-medium text-gray-900 max-w-[120px] truncate">
                    {user.name}
                  </span>

                </Link>


                {/* Dropdown */}
                <div className="
                  invisible
                  opacity-0
                  group-hover:visible
                  group-hover:opacity-100
                  absolute
                  right-0
                  top-full
                  mt-3
                  w-40
                  rounded-xl
                  bg-white
                  shadow-xl
                  border
                  border-gray-100
                  p-2
                  transition-all
                ">

                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
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
            className="md:hidden text-gray-800"
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


            <div className="border-t border-gray-100 mt-2 pt-2">

              {user ? (

                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm"
                  >
                    Profile
                  </Link>

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