import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#080A28] text-white">

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

          {/* TENTANG */}
          <div>

            <h3 className="text-base font-semibold mb-5">
              Tentang Kami
            </h3>

            <p className="text-sm leading-relaxed text-gray-300 max-w-[270px]">
              Temukan UMKM, kuliner, sejarah, dan budaya khas
              Indramayu di satu tempat. Indramayu, Jawa Barat.
            </p>

          </div>


          {/* KONTAK */}
          <div>

            <h3 className="text-base font-semibold mb-5">
              Kontak
            </h3>

            <p className="text-sm leading-relaxed text-gray-300">
              +62 89646396880
              <br />
              (822) 112224
            </p>

          </div>


          {/* PROFIL */}
          <div>

            <h3 className="text-base font-semibold mb-5">
              Profil
            </h3>

            <div className="flex flex-col gap-2 text-sm text-gray-300">

              <Link
                to="/tentang"
                className="hover:text-white transition"
              >
                Tentang Kami
              </Link>

              <Link
                to="/faq"
                className="hover:text-white transition"
              >
                FAQ
              </Link>

            </div>

          </div>


          {/* LINK */}
          <div>

            <h3 className="text-base font-semibold mb-5">
              Link Terkait
            </h3>

            <a
              href="#"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Portal Kota Indramayu
            </a>

          </div>

        </div>


        {/* COPYRIGHT */}
        <div className="mt-16 pt-8 border-t border-white/10">

          <p className="text-sm text-gray-300">
            © 2025 Indramayu Eksplor. Semua hak dilindungi.
          </p>

        </div>

      </div>

    </footer>
  )
}