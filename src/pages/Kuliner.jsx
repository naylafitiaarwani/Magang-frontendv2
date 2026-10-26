import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Utensils,
} from 'lucide-react'
import axios from 'axios'

const LARAVEL_URL = 'http://127.0.0.1:8000'

const PER_PAGE = 8

export default function Kuliner() {
  const [kuliner, setKuliner] = useState([])
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
    'Makanan',
    'Minuman',
    'Oleh-oleh',
    'Kuliner Tradisional',
  ]

  /*
   * ============================================================
   * FETCH DATA
   * ============================================================
   */

  useEffect(() => {
    const fetchKuliner = async () => {
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
          `${LARAVEL_URL}/api/kuliner`,
          {
            params,
          }
        )

        const responseData = response.data

        const data = Array.isArray(responseData)
          ? responseData
          : responseData.data || []

        setKuliner(
          data.filter(
            (item) => item.is_active !== false
          )
        )

        setPagination(
          responseData.meta || null
        )
      } catch (err) {
        console.error(
          'Gagal mengambil data kuliner:',
          err
        )

        setError(
          'Data kuliner belum dapat dimuat.'
        )

        setKuliner([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchKuliner()
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
    <main className="min-h-screen bg-slate-50/50">

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

              Kuliner Khas

              <br />

              <span className="text-blue-400">
                Indramayu
              </span>

            </h1>

            {/* Description */}

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              Nikmati beragam cita rasa khas Indramayu,
              mulai dari makanan tradisional hingga
              kuliner lokal yang menjadi bagian dari
              kekayaan daerah.
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
      placeholder="Cari kuliner..."
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

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3542A5]">
                Eksplorasi Kuliner
              </p>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3542A5]">
                Rasa Khas Indramayu
              </p>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Temukan berbagai makanan, minuman,
                dan kuliner lokal yang menjadi bagian
                dari kekayaan rasa Indramayu.
              </p>

            </div>

            {!loading && pagination && (
              <p className="text-xs text-slate-500">

                Menampilkan{' '}

                <span className="font-semibold text-slate-700">
                  {pagination.from || 0} - {pagination.to || 0}
                </span>{' '}

                dari{' '}

                <span className="font-semibold text-slate-700">
                  {pagination.total || 0}
                </span>{' '}

                kuliner

              </p>
            )}

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">

              <div className="grid gap-5 sm:grid-cols-2">

                {[1, 2, 3, 4].map((item) => (

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

                    <div className="aspect-[16/10] animate-pulse bg-slate-200" />

                    <div className="space-y-3 p-5">

                      <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />

                      <div className="h-6 w-4/5 animate-pulse rounded bg-slate-200" />

                      <div className="h-4 w-2/5 animate-pulse rounded bg-slate-200" />

                      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />

                    </div>

                  </div>

                ))}

              </div>


              <div className="hidden space-y-4 lg:block">

                <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />

                <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />

              </div>

            </div>

          )}


          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && (

            <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">

              <Utensils
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
            kuliner.length === 0 && (

              <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">

                <Utensils
                  className="mx-auto mb-3 h-9 w-9 text-slate-400"
                />

                <p className="text-sm text-slate-500">
                  Belum ada data kuliner yang sesuai
                  dengan pencarian.
                </p>

              </div>

            )}


          {/* ==================================================
              DATA
          ================================================== */}

          {!loading &&
            !error &&
            kuliner.length > 0 && (

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">

                {/* ===============================
                    CARD GRID
                =============================== */}

                <div className="grid gap-5 sm:grid-cols-2">

                  {kuliner.map((item) => (

                    <KulinerCard
                      key={item.id}
                      item={item}
                    />

                  ))}

                </div>


                {/* ===============================
                    SIDEBAR
                =============================== */}

                <aside className="space-y-5 lg:sticky lg:top-6">

                  {/* CATEGORY */}

                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

                    <div className="mb-4 flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-[#3542A5]">

                        <Utensils size={15} />

                      </div>

                      <h3 className="text-sm font-bold text-slate-900">
                        Kategori
                      </h3>

                    </div>


                    <div className="space-y-1">

                      {kategoriList.map((kategori) => {

                        const active =
                          selectedKategori === kategori

                        return (

                          <button
                            key={kategori}
                            type="button"
                            onClick={() =>
                              handleKategori(kategori)
                            }
                            className={`
                              flex
                              w-full
                              items-center
                              justify-between
                              rounded-xl
                              px-3
                              py-2.5
                              text-left
                              text-xs
                              transition
                              ${
                                active
                                  ? 'bg-indigo-50 font-semibold text-[#3542A5]'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                              }
                            `}
                          >

                            <span className="flex items-center gap-2">

                              <span
                                className={`
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  ${
                                    active
                                      ? 'bg-[#3542A5]'
                                      : 'bg-slate-300'
                                  }
                                `}
                              />

                              {kategori}

                            </span>


                            {active && (

                              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#3542A5]">
                                Aktif
                              </span>

                            )}

                          </button>

                        )

                      })}

                    </div>

                  </div>


                  {/* OTHER FOOD */}

                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

                    <div className="mb-4 flex items-center justify-between">

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3542A5]">
                          Pilihan
                        </p>

                        <h3 className="mt-1 text-sm font-bold text-slate-900">
                          Kuliner lainnya
                        </h3>

                      </div>

                      <Utensils
                        size={16}
                        className="text-slate-300"
                      />

                    </div>


                    <div className="space-y-4">

                      {kuliner
                        .slice(0, 4)
                        .map((item) => (

                          <SidebarKulinerCard
                            key={`side-${item.id}`}
                            item={item}
                          />

                        ))}

                    </div>

                  </div>

                </aside>

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
   KULINER CARD
============================================================ */

function KulinerCard({ item }) {

  const imageUrl = item.gambar
    ? `${LARAVEL_URL}/storage/${item.gambar}`
    : null

  return (

    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-slate-100
        bg-white
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >

      {/* IMAGE */}

      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">

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

          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            Tidak ada gambar
          </div>

        )}


        {/* CATEGORY */}

        {item.kategori && (

          <span
            className="
              absolute
              left-4
              top-4
              rounded-full
              border
              border-white/50
              bg-white/90
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

      <div className="flex min-h-[210px] flex-col p-5">

        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900">

          {item.nama}

        </h3>


        {/* LOCATION */}

        {item.lokasi && (

          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">

            <MapPin
              size={13}
              className="shrink-0 text-[#3542A5]"
            />

            <span className="truncate">
              {item.lokasi}
            </span>

          </div>

        )}


        {/* PRICE */}

        {item.harga_mulai && (

          <p className="mt-3 text-sm font-bold text-[#3542A5]">

            Mulai Rp{' '}

            {Number(
              item.harga_mulai
            ).toLocaleString('id-ID')}

          </p>

        )}


        {/* DESCRIPTION */}

        {item.deskripsi && (

          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">

            {item.deskripsi}

          </p>

        )}


        {/* DETAIL */}

        <Link
          to={`/kuliner/${item.slug}`}
          className="
            mt-auto
            inline-flex
            w-fit
            items-center
            gap-2
            pt-5
            text-xs
            font-bold
            text-[#3542A5]
            transition-all
            duration-300
            group-hover:gap-3
          "
        >

          Lihat detail

          <ArrowRight size={14} />

        </Link>

      </div>

    </article>

  )
}


/* ============================================================
   SIDEBAR CARD
============================================================ */

function SidebarKulinerCard({ item }) {

  const imageUrl = item.gambar
    ? `${LARAVEL_URL}/storage/${item.gambar}`
    : null

  return (

    <Link
      to={`/kuliner/${item.slug}`}
      className="group flex gap-3"
    >

      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">

        {imageUrl ? (

          <img
            src={imageUrl}
            alt={item.nama}
            className="
              h-full
              w-full
              object-cover
              transition
              duration-500
              group-hover:scale-105
            "
          />

        ) : (

          <div className="flex h-full items-center justify-center text-[9px] text-slate-400">
            No image
          </div>

        )}

      </div>


      <div className="min-w-0">

        <h4
          className="
            line-clamp-2
            text-xs
            font-bold
            leading-5
            text-slate-800
            transition
            group-hover:text-[#3542A5]
          "
        >
          {item.nama}
        </h4>


        {item.lokasi && (

          <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">

            <MapPin size={10} />

            <span className="truncate">
              {item.lokasi}
            </span>

          </p>

        )}

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
          border-gray-200
          bg-white
          text-gray-600
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
                  text-gray-400
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
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-[#5968F2] hover:text-[#3542A5]'
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
          border-gray-200
          bg-white
          text-gray-600
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