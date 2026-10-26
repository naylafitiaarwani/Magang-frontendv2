import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Landmark,
  MapPin,
} from 'lucide-react'
import axios from 'axios'

const LARAVEL_URL = 'http://127.0.0.1:8000'

const PER_PAGE = 8

export default function Budaya() {
  const [budaya, setBudaya] = useState([])
  const [pagination, setPagination] = useState(null)

  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKategori, setSelectedKategori] = useState('Semua')

  /*
   * ============================================================
   * KATEGORI
   * ============================================================
   */

  const kategoriList = [
    'Semua',
    'Kesenian',
    'Tradisi',
    'Adat',
    'Budaya Lokal',
  ]

  /*
   * ============================================================
   * FETCH DATA
   * ============================================================
   */

  useEffect(() => {
    const fetchBudaya = async () => {
      setLoading(true)
      setError('')

      try {
        const params = {
          page,
          per_page: PER_PAGE,
        }

        if (searchQuery.trim() !== '') {
          params.search = searchQuery.trim()
        }

        if (selectedKategori !== 'Semua') {
          params.kategori = selectedKategori
        }

        const response = await axios.get(
          `${LARAVEL_URL}/api/budaya`,
          {
            params,
          }
        )

        const responseData = response.data

        const data = Array.isArray(responseData)
          ? responseData
          : responseData.data || []

        setBudaya(
          data.filter(
            (item) => item.is_active !== false
          )
        )

        setPagination(
          responseData.meta || null
        )
      } catch (err) {
        console.error(
          'Gagal mengambil data budaya:',
          err
        )

        setError(
          'Data budaya belum dapat dimuat.'
        )

        setBudaya([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBudaya()
  }, [
    page,
    searchQuery,
    selectedKategori,
  ])

  /*
   * ============================================================
   * SEARCH
   * ============================================================
   */

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
    setPage(1)
  }

  /*
   * ============================================================
   * KATEGORI
   * ============================================================
   */

  const handleKategori = (kategori) => {
    setSelectedKategori(kategori)
    setPage(1)
  }

  /*
   * ============================================================
   * PAGINATION
   * ============================================================
   */

  const handlePageChange = (targetPage) => {
    if (!pagination) return

    if (
      targetPage < 1 ||
      targetPage > pagination.last_page ||
      targetPage === page
    ) {
      return
    }

    setPage(targetPage)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

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



            {/* Heading */}

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">

              Budaya Lokal

              <br />

              <span className="text-blue-400">
                Indramayu
              </span>

            </h1>


            {/* Description */}

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">

              Mengenal lebih dekat berbagai
              kesenian, tradisi, adat, dan warisan
              budaya yang menjadi bagian dari
              identitas masyarakat Indramayu.

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
      placeholder="Cari cerita Budaya..."
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

      <section className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#3542A5]">
                Eksplorasi Budaya
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Warisan yang Tetap Hidup
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Jelajahi kekayaan budaya Indramayu
                melalui cerita, kesenian, tradisi,
                dan warisan lokal.
              </p>

            </div>


            {!loading && pagination && (

              <p className="text-xs text-slate-500">

                {pagination.total || 0} koleksi budaya

              </p>

            )}

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="grid gap-5 lg:grid-cols-4">

              {[1, 2, 3, 4, 5, 6, 7, 8].map(
                (item) => (

                  <div
                    key={item}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-100
                      bg-white
                      shadow-sm
                    "
                  >

                    <div className="aspect-[4/3] animate-pulse bg-slate-200" />

                    <div className="space-y-3 p-5">

                      <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />

                      <div className="h-6 w-4/5 animate-pulse rounded bg-slate-200" />

                      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />

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

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">

              <Landmark
                className="mx-auto mb-3 h-9 w-9 text-slate-400"
              />

              <p className="text-sm text-slate-500">
                {error}
              </p>

            </div>

          )}


          {/* ==================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            budaya.length === 0 && (

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">

                <Landmark
                  className="mx-auto mb-3 h-9 w-9 text-slate-400"
                />

                <p className="text-sm text-slate-500">
                  Belum ada budaya yang sesuai
                  dengan pencarian.
                </p>

              </div>

            )}


          {/* ==================================================
              MOSAIC GALLERY
          ================================================== */}

          {!loading &&
            !error &&
            budaya.length > 0 && (

              <div className="grid gap-5 lg:grid-cols-4">

                {budaya.map((item, index) => (

                  <BudayaCard
                    key={item.id}
                    item={item}
                    featured={
                      index === 0 ||
                      index === 5
                    }
                  />

                ))}

              </div>

            )}


          {/* ==================================================
              PAGINATION
          ================================================== */}

          {!loading &&
            !error &&
            pagination &&
            pagination.last_page > 1 && (

              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />

            )}

        </div>

      </section>

    </main>
  )
}


/* ============================================================
   BUDAYA CARD
============================================================ */

function BudayaCard({
  item,
  featured = false,
}) {

  const imageUrl = item.gambar
    ? `${LARAVEL_URL}/storage/${item.gambar}`
    : null

  return (

    <Link
      to={`/budaya/${item.slug}`}
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        bg-slate-900
        shadow-sm
        transition
        duration-500
        hover:-translate-y-1
        hover:shadow-2xl
        ${
          featured
            ? 'lg:col-span-2 lg:row-span-2'
            : ''
        }
      `}
    >

      {/* IMAGE */}

      <div
        className={`
          relative
          overflow-hidden
          ${
            featured
              ? 'aspect-[4/3] lg:h-full lg:min-h-[430px]'
              : 'aspect-[4/3]'
          }
        `}
      >

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

          <div className="flex h-full items-center justify-center bg-slate-100 text-xs text-slate-400">
            Tidak ada gambar
          </div>

        )}


        {/* GRADIENT */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />


        {/* CATEGORY */}

        {item.kategori && (

          <span
            className="
              absolute
              left-4
              top-4
              rounded-full
              border
              border-white/30
              bg-black/20
              px-3
              py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-white
              backdrop-blur-md
            "
          >
            {item.kategori}
          </span>

        )}


        {/* CONTENT */}

        <div
          className={`
            absolute
            inset-x-0
            bottom-0
            p-5
            ${
              featured
                ? 'lg:p-7'
                : ''
            }
          `}
        >

          <h3
            className={`
              font-bold
              leading-tight
              text-white
              ${
                featured
                  ? 'text-2xl sm:text-3xl'
                  : 'text-lg'
              }
            `}
          >
            {item.nama}
          </h3>


          {item.lokasi && (

            <div className="mt-2 flex items-center gap-1.5 text-xs text-white/70">

              <MapPin
                size={13}
                className="shrink-0"
              />

              <span className="truncate">
                {item.lokasi}
              </span>

            </div>

          )}


          {featured && item.deskripsi && (

            <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-white/70">

              {item.deskripsi}

            </p>

          )}


          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white">

            <span>
              Lihat cerita
            </span>

            <ArrowRight
              size={14}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />

          </div>

        </div>

      </div>

    </Link>

  )
}


/* ============================================================
   PAGINATION
============================================================ */

function Pagination({
  pagination,
  onPageChange,
}) {

  const currentPage =
    pagination.current_page

  const lastPage =
    pagination.last_page


  const getPageNumbers = () => {

    const pages = []


    if (lastPage <= 7) {

      for (
        let i = 1;
        i <= lastPage;
        i++
      ) {

        pages.push(i)

      }

      return pages

    }


    pages.push(1)


    if (currentPage > 4) {

      pages.push('...')

    }


    const start = Math.max(
      2,
      currentPage - 1
    )

    const end = Math.min(
      lastPage - 1,
      currentPage + 1
    )


    for (
      let i = start;
      i <= end;
      i++
    ) {

      pages.push(i)

    }


    if (
      currentPage <
      lastPage - 3
    ) {

      pages.push('...')

    }


    pages.push(lastPage)

    return pages

  }


  const pages = getPageNumbers()


  return (

    <nav
      className="
        mt-12
        flex
        flex-wrap
        items-center
        justify-center
        gap-2
      "
      aria-label="Pagination"
    >

      {/* PREVIOUS */}

      <button
        type="button"
        onClick={() =>
          onPageChange(
            currentPage - 1
          )
        }
        disabled={currentPage === 1}
        aria-label="Halaman sebelumnya"
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-slate-200
          bg-white
          text-slate-600
          transition
          hover:border-[#5968F2]
          hover:text-[#3542A5]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >

        <ChevronLeft size={18} />

      </button>


      {/* PAGE NUMBERS */}

      {pages.map(
        (pageNumber, index) => {

          if (
            pageNumber === '...'
          ) {

            return (

              <span
                key={`dots-${index}`}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  text-sm
                  text-slate-400
                "
              >
                ...
              </span>

            )

          }


          const isActive =
            pageNumber ===
            currentPage


          return (

            <button
              key={pageNumber}
              type="button"
              onClick={() =>
                onPageChange(
                  pageNumber
                )
              }
              className={`
                flex
                h-10
                min-w-10
                items-center
                justify-center
                rounded-full
                px-3
                text-sm
                font-medium
                transition
                ${
                  isActive
                    ? 'bg-[#3542A5] text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-[#5968F2] hover:text-[#3542A5]'
                }
              `}
            >

              {pageNumber}

            </button>

          )

        }
      )}


      {/* NEXT */}

      <button
        type="button"
        onClick={() =>
          onPageChange(
            currentPage + 1
          )
        }
        disabled={
          currentPage ===
          lastPage
        }
        aria-label="Halaman berikutnya"
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-slate-200
          bg-white
          text-slate-600
          transition
          hover:border-[#5968F2]
          hover:text-[#3542A5]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >

        <ChevronRight size={18} />

      </button>

    </nav>

  )
  
}