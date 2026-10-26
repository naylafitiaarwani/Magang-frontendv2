import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  MapPin,
  Search,
  Store,
} from 'lucide-react'
import axios from 'axios'

const LARAVEL_URL = 'http://127.0.0.1:8000'

export default function Umkm() {
  const [umkm, setUmkm] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKategori, setSelectedKategori] = useState('Semua')
  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }
  useEffect(() => {
    
    const fetchUmkm = async () => {
      try {
        const response = await axios.get(
          `${LARAVEL_URL}/api/umkm`
        )

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || []
          console.log('DATA UMKM:', data)

          data.forEach((item) => {
            console.log({
              id: item.id,
              nama: item.nama,
              slug: item.slug,
            })
          })
        setUmkm(
          data.filter(
            (item) => item.is_active !== false
          )
        )
      } catch (err) {
        console.error(
          'Gagal mengambil data UMKM:',
          err
        )

        setError(
          'Data UMKM belum dapat dimuat.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchUmkm()
  }, [])

  /*
   * ============================================================
   * KATEGORI
   * ============================================================
   */

  const kategoriList = useMemo(() => {
    const categories = umkm
      .map((item) => item.kategori)
      .filter(Boolean)

    return [
      'Semua',
      ...new Set(categories),
    ]
  }, [umkm])

  /*
   * ============================================================
   * FILTER
   * ============================================================
   */

  const filteredUmkm = useMemo(() => {
    const keyword =
      searchQuery.trim().toLowerCase()

    return umkm.filter((item) => {
      const matchesSearch =
        keyword === '' ||
        item.nama
          ?.toLowerCase()
          .includes(keyword) ||
        item.lokasi
          ?.toLowerCase()
          .includes(keyword) ||
        item.kategori
          ?.toLowerCase()
          .includes(keyword) ||
        item.deskripsi
          ?.toLowerCase()
          .includes(keyword)

      const matchesKategori =
        selectedKategori === 'Semua' ||
        item.kategori === selectedKategori

      return (
        matchesSearch &&
        matchesKategori
      )
    })
  }, [
    umkm,
    searchQuery,
    selectedKategori,
  ])

  const featured = filteredUmkm[0]
  const remaining = filteredUmkm.slice(1)

  return (
    <main className="min-h-screen bg-white">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-slate-900 pb-24 pt-16 text-white">

        {/* Decorative glow */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

          <div className="max-w-3xl">



            {/* heading */}

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">

              Cerita dari
              <br />

              <span className="text-blue-400">
                usaha lokal.
              </span>

            </h1>


            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/70 sm:text-base lg:text-lg">

              Mengenal produk, karya, dan
              perjalanan para pelaku UMKM yang
              menjadi bagian dari kehidupan
              masyarakat Indramayu.

            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          SEARCH
      ====================================================== */}

      <section className="relative z-20 -mt-8 mx-auto max-w-7xl px-6 lg:px-8">

<div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between">




  {/* SEARCH */}

  <div className="relative sm:w-150">

    <Search
      className="
        absolute
        left-3.5
        top-1/2
        h-4
        w-4
        -translate-y-1/2
        text-slate-400
      "
    />

<input
  type="text"
  value={searchQuery}
  onChange={handleSearch}
  placeholder="Cari UMKM..."
  className="
    w-full
    rounded-xl
    border
    border-slate-200
    bg-slate-50
    py-2
    pl-9
    pr-4
    text-xs
    text-slate-900
    placeholder:text-slate-400
    focus:border-slate-400
    focus:bg-white
    focus:outline-none
  "
/>

  </div>

</div>

</section>


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <section className="px-6 py-20 lg:px-12 lg:py-28">

        <div className="mx-auto max-w-[1280px]">

          {/* Heading */}

          <div className="mb-12 flex items-end justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#5968F2]">
                Eksplorasi Lokal
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Temukan cerita mereka
              </h2>

            </div>


            {!loading &&
              !error &&
              filteredUmkm.length > 0 && (

                <span className="hidden text-xs text-slate-400 sm:block">
                  {filteredUmkm.length} UMKM
                </span>

              )}

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="grid gap-6 lg:grid-cols-2">

              {[1, 2, 3, 4].map(
                (item) => (

                  <div
                    key={item}
                    className="
                      overflow-hidden
                      rounded-3xl
                      bg-slate-50
                    "
                  >

                    <div className="aspect-[16/10] animate-pulse bg-slate-200" />

                    <div className="space-y-3 p-6">

                      <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

                      <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />

                      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />

                    </div>

                  </div>

                )
              )}

            </div>

          )}


          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && (

            <div className="py-20 text-center">

              <Store
                size={30}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 text-sm text-slate-500">
                {error}
              </p>

            </div>

          )}


          {/* ==================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            filteredUmkm.length === 0 && (

              <div className="py-20 text-center">

                <Search
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 font-semibold text-slate-800">
                  UMKM tidak ditemukan
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Coba gunakan kata kunci
                  atau kategori lain.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedKategori(
                      'Semua'
                    )
                  }}
                  className="
                    mt-5
                    text-xs
                    font-semibold
                    text-[#3542A5]
                    hover:underline
                  "
                >
                  Reset pencarian
                </button>

              </div>

            )}


          {/* ==================================================
              FEATURED
          ================================================== */}

          {!loading &&
            !error &&
            featured && (

              <FeaturedUmkm
                item={featured}
              />

            )}


          {/* ==================================================
              OTHER UMKM
          ================================================== */}

          {!loading &&
            !error &&
            remaining.length > 0 && (

              <div className="mt-20">

                <div className="mb-8 flex items-center gap-4">

                  <h3 className="text-xl font-bold text-slate-900">
                    UMKM lainnya
                  </h3>

                  <div className="h-px flex-1 bg-slate-200" />

                </div>


                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">

                  {remaining.map(
                    (item) => (

                      <UmkmCard
                        key={item.slug}
                        item={item}
                      />

                    )
                  )}

                </div>

              </div>

            )}

        </div>

      </section>

    </main>
  )
}


/* ============================================================
   FEATURED
============================================================ */

function FeaturedUmkm({ item }) {

  const imageUrl = item.gambar
    ? `${LARAVEL_URL}/storage/${item.gambar}`
    : null

  return (

    <Link
      to={`/umkm/${item.slug}`}
      className="
        group
        grid
        overflow-hidden
        rounded-[30px]
        bg-slate-950
        lg:grid-cols-[1.35fr_0.65fr]
      "
    >

      {/* IMAGE */}

      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[500px]">

        {imageUrl ? (

          <img
            src={imageUrl}
            alt={item.nama}
            className="
              h-full
              w-full
              object-cover
              transition
              duration-700
              group-hover:scale-105
            "
          />

        ) : (

          <div className="flex h-full items-center justify-center bg-slate-800 text-sm text-slate-500">
            Tidak ada gambar
          </div>

        )}


        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />


        {/* Badge */}

        <div className="absolute left-6 top-6 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md">
          Pilihan Lokal
        </div>

      </div>


      {/* CONTENT */}

      <div className="flex flex-col justify-center p-7 text-white sm:p-10 lg:p-12">

        {item.kategori && (

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9eacff]">
            {item.kategori}
          </p>

        )}


        <h3 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">

          {item.nama}

        </h3>


        {item.lokasi && (

          <div className="mt-5 flex items-center gap-2 text-sm text-white/60">

            <MapPin size={15} />

            <span>
              {item.lokasi}
            </span>

          </div>

        )}


        {item.deskripsi && (

          <p className="mt-6 line-clamp-4 text-sm leading-7 text-white/55">

            {item.deskripsi}

          </p>

        )}


        {item.harga_mulai && (

          <div className="mt-7">

            <p className="text-[10px] uppercase tracking-wider text-white/40">
              Harga mulai
            </p>

            <p className="mt-1 text-xl font-bold text-white">

              Rp{' '}
              {Number(
                item.harga_mulai
              ).toLocaleString('id-ID')}

            </p>

          </div>

        )}


        <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-white">

          <span>
            Jelajahi UMKM
          </span>

          <ArrowRight
            size={16}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />

        </div>

      </div>

    </Link>

  )
}


/* ============================================================
   UMKM CARD
============================================================ */

function UmkmCard({ item }) {

  const imageUrl = item.gambar
    ? `${LARAVEL_URL}/storage/${item.gambar}`
    : null

  return (

    <Link
      to={`/umkm/${item.slug}`}
      className="group block"
    >

      {/* IMAGE */}

      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-slate-100">

        {imageUrl ? (

          <img
            src={imageUrl}
            alt={item.nama}
            className="
              h-full
              w-full
              object-cover
              transition
              duration-700
              group-hover:scale-105
            "
          />

        ) : (

          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Tidak ada gambar
          </div>

        )}


        {/* Category */}

        {item.kategori && (

          <span
            className="
              absolute
              left-4
              top-4
              rounded-full
              bg-white/95
              px-3
              py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-[#3542A5]
              shadow-sm
              backdrop-blur
            "
          >
            {item.kategori}
          </span>

        )}

      </div>


      {/* CONTENT */}

      <div className="px-1 pt-5">

        <div className="flex items-start justify-between gap-4">

          <h3 className="text-lg font-bold leading-tight text-slate-900 transition-colors group-hover:text-[#3542A5]">

            {item.nama}

          </h3>

          <div
            className="
              mt-0.5
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              text-slate-400
              transition
              duration-300
              group-hover:border-[#3542A5]
              group-hover:bg-[#3542A5]
              group-hover:text-white
            "
          >

            <ArrowRight size={14} />

          </div>

        </div>


        {item.lokasi && (

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">

            <MapPin size={13} />

            <span>
              {item.lokasi}
            </span>

          </div>

        )}


        {item.harga_mulai && (

          <p className="mt-3 text-sm font-semibold text-[#3542A5]">

            Mulai Rp{' '}
            {Number(
              item.harga_mulai
            ).toLocaleString('id-ID')}

          </p>

        )}


        {item.deskripsi && (

          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">

            {item.deskripsi}

          </p>

        )}

      </div>

    </Link>

  )
}