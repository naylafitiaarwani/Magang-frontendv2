import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  ArrowUpRight,
  Star,
  Search,
  Compass,
  SlidersHorizontal,
} from 'lucide-react'
import axios from 'axios'

const LARAVEL_URL = 'http://127.0.0.1:8000'

export default function Wisata() {
  const [wisata, setWisata] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKategori, setSelectedKategori] = useState('Semua')

  useEffect(() => {
    const fetchWisata = async () => {
      try {
        const response = await axios.get(
          `${LARAVEL_URL}/api/wisata`
        )

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || []

        setWisata(
          data.filter(
            (item) => item.is_active !== false
          )
        )
      } catch (err) {
        console.error(
          'Gagal mengambil data wisata:',
          err
        )

        setError(
          'Data wisata belum dapat dimuat.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchWisata()
  }, [])

  const kategoriList = useMemo(() => {
    const categories = wisata
      .map((item) => item.kategori)
      .filter(Boolean)

    return [
      'Semua',
      ...new Set(categories),
    ]
  }, [wisata])

  const filteredWisata = useMemo(() => {
    const keyword =
      searchQuery.trim().toLowerCase()

    return wisata.filter((item) => {
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
    wisata,
    searchQuery,
    selectedKategori,
  ])

  return (
    <main className="min-h-screen bg-[#F8FAFC]">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-slate-900 pb-24 pt-16 text-white">

        {/* Decorative glow */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

          <div className="max-w-3xl">

            {/* Heading */}

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">

              Temukan Tempat

              <br />

              <span className="text-blue-400">
                untuk Dijelajahi
              </span>

            </h1>


            {/* Description */}

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Dari pesisir utara hingga ruang rekreasi
              keluarga, temukan berbagai destinasi yang
              menyimpan keindahan dan cerita khas
              Indramayu.
            </p>

          </div>

        </div>

      </section>


      {/* ============================================================
          SEARCH + FILTER
      ============================================================ */}

      <section className="relative z-20 mx-auto -mt-8 max-w-7xl px-6 lg:px-8">

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_15px_50px_rgba(15,23,42,0.08)]">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

            {/* Search */}

            <div className="relative flex-1">

              <Search
                size={17}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Cari destinasi, lokasi, atau kategori..."
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-11
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-[#8DB8E8]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#8DB8E8]/10
                "
              />

            </div>


            {/* Category */}

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">

              <div className="hidden h-10 w-px bg-slate-200 lg:block" />

              <SlidersHorizontal
                size={16}
                className="hidden shrink-0 text-slate-400 sm:block"
              />

              {kategoriList.map((kategori) => {

                const active =
                  selectedKategori === kategori

                return (
                  <button
                    key={kategori}
                    type="button"
                    onClick={() =>
                      setSelectedKategori(kategori)
                    }
                    className={`
                      shrink-0
                      rounded-full
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      transition-all
                      duration-200
                      ${
                        active
                          ? 'bg-[#172554] text-white shadow-sm'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                      }
                    `}
                  >
                    {kategori}
                  </button>
                )
              })}

            </div>

          </div>

        </div>

      </section>


      {/* ============================================================
          CONTENT
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-24">

        {/* Section heading */}

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-3 flex items-center gap-3">

              <span className="h-px w-8 bg-[#8DB8E8]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#5278A8]">
                Jelajahi
              </p>

            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Destinasi wisata
            </h2>

          </div>

          {!loading &&
            !error &&
            filteredWisata.length > 0 && (

              <p className="text-xs text-slate-400">
                Menampilkan{' '}
                <span className="font-semibold text-slate-600">
                  {filteredWisata.length}
                </span>{' '}
                destinasi
              </p>

            )}

        </div>


        {/* ============================================================
            LOADING
        ============================================================ */}

        {loading && (

          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (

                <div
                  key={item}
                  className="overflow-hidden"
                >

                  <div className="aspect-[4/3] animate-pulse rounded-[24px] bg-slate-200" />

                  <div className="space-y-3 px-1 pt-5">

                    <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />

                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />

                    <div className="h-3 w-full animate-pulse rounded bg-slate-200" />

                  </div>

                </div>

              )
            )}

          </div>

        )}


        {/* ============================================================
            ERROR
        ============================================================ */}

        {!loading && error && (

          <div className="rounded-3xl border border-slate-200 bg-white py-24 text-center">

            <Compass
              size={38}
              strokeWidth={1.5}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              Belum dapat memuat destinasi
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {error}
            </p>

          </div>

        )}


        {/* ============================================================
            EMPTY
        ============================================================ */}

        {!loading &&
          !error &&
          filteredWisata.length === 0 && (

            <div className="rounded-3xl border border-slate-200 bg-white py-24 text-center">

              <Search
                size={38}
                strokeWidth={1.5}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-5 text-lg font-semibold text-slate-800">
                Destinasi tidak ditemukan
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Coba gunakan kata kunci lain atau
                pilih kategori yang berbeda.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedKategori('Semua')
                }}
                className="
                  mt-6
                  rounded-full
                  bg-[#172554]
                  px-5
                  py-2.5
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#263B78]
                "
              >
                Reset pencarian
              </button>

            </div>

          )}


        {/* ============================================================
            DESTINATION GRID
        ============================================================ */}

        {!loading &&
          !error &&
          filteredWisata.length > 0 && (

            <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">

              {filteredWisata.map((item) => (

                <WisataCard
                  key={item.id}
                  item={item}
                />

              ))}

            </div>

          )}

      </section>

    </main>
  )
}


/* ============================================================
   WISATA CARD
============================================================ */

function WisataCard({ item }) {

  const imageUrl = item.gambar
    ? `${LARAVEL_URL}/storage/${item.gambar}`
    : null

  return (

    <Link
      to={`/wisata/${item.slug}`}
      className="group block"
    >

      {/* IMAGE */}

      <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] bg-slate-200">

        {imageUrl ? (

          <img
            src={imageUrl}
            alt={item.nama}
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.055]
            "
          />

        ) : (

          <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-400">
            Tidak ada gambar
          </div>

        )}


        {/* Image overlay */}

        <div className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/45
          via-transparent
          to-transparent
          opacity-70
          transition-opacity
          duration-500
          group-hover:opacity-100
        " />


        {/* CATEGORY */}

        {item.kategori && (

          <span className="
            absolute
            left-4
            top-4
            rounded-full
            border
            border-white/30
            bg-white/90
            px-3.5
            py-2
            text-[9px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-[#294B78]
            shadow-sm
            backdrop-blur-md
          ">
            {item.kategori}
          </span>

        )}


        {/* RATING */}

        {item.rating && (

          <span className="
            absolute
            right-4
            top-4
            flex
            items-center
            gap-1.5
            rounded-full
            bg-black/35
            px-3
            py-2
            text-[10px]
            font-semibold
            text-white
            backdrop-blur-md
          ">

            <Star
              size={11}
              className="fill-current"
            />

            {item.rating}

          </span>

        )}


        {/* Hover arrow */}

        <div className="
          absolute
          bottom-4
          right-4
          flex
          h-10
          w-10
          translate-y-2
          items-center
          justify-center
          rounded-full
          bg-white
          text-slate-800
          opacity-0
          shadow-lg
          transition-all
          duration-300
          group-hover:translate-y-0
          group-hover:opacity-100
        ">

          <ArrowUpRight
            size={17}
            className="transition-transform duration-300 group-hover:rotate-6"
          />

        </div>

      </div>


      {/* CONTENT */}

      <div className="px-1 pt-5">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <h3 className="
              truncate
              text-xl
              font-semibold
              tracking-tight
              text-slate-900
              transition-colors
              duration-300
              group-hover:text-[#5278A8]
            ">
              {item.nama}
            </h3>

            {item.lokasi && (

              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">

                <MapPin
                  size={13}
                  strokeWidth={1.8}
                />

                <span className="truncate">
                  {item.lokasi}
                </span>

              </div>

            )}

          </div>


          {/* Arrow */}

          <div className="
            mt-0.5
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-slate-200
            text-slate-400
            transition-all
            duration-300
            group-hover:border-[#8DB8E8]
            group-hover:bg-[#8DB8E8]
            group-hover:text-[#172554]
          ">

            <ArrowUpRight size={15} />

          </div>

        </div>


        {/* DESCRIPTION */}

        {item.deskripsi && (

          <p className="
            mt-3
            line-clamp-2
            max-w-[95%]
            text-xs
            leading-5
            text-slate-500
          ">
            {item.deskripsi}
          </p>

        )}


        {/* PRICE */}

        {item.harga_mulai && (

          <div className="mt-4 flex items-baseline gap-1.5">

            <span className="text-[10px] text-slate-400">
              Mulai
            </span>

            <span className="text-sm font-semibold text-[#5278A8]">
              Rp{' '}
              {Number(
                item.harga_mulai
              ).toLocaleString('id-ID')}
            </span>

          </div>

        )}

      </div>

    </Link>

  )
}