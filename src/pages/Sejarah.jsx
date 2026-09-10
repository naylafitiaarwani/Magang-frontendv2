import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Landmark,
  BookOpen,
} from 'lucide-react'
import axios from 'axios'

const LARAVEL_URL = 'http://127.0.0.1:8000'

// 9 card = 3 kolom x 3 baris
const PER_PAGE = 9

export default function Sejarah() {
  const [sejarah, setSejarah] = useState([])
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
    'Cagar Budaya',
    'Tokoh',
    'Situs Bersejarah',
    'Tradisi',
  ]

  /*
   * ============================================================
   * FETCH DATA
   * ============================================================
   */

  useEffect(() => {
    const fetchSejarah = async () => {
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
          `${LARAVEL_URL}/api/sejarah`,
          {
            params,
          }
        )

        const responseData = response.data

        const data = Array.isArray(responseData)
          ? responseData
          : responseData.data || []

        setSejarah(
          data.filter(
            (item) => item.is_active !== false
          )
        )

        setPagination(
          responseData.meta || null
        )
      } catch (err) {
        console.error(
          'Gagal mengambil data sejarah:',
          err
        )

        setError(
          'Data sejarah belum dapat dimuat.'
        )

        setSejarah([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSejarah()
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

      <section className="relative overflow-hidden bg-slate-900 pb-28 pt-20 text-white">

        {/* Decorative glow */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

          <div className="max-w-3xl">

            {/* Label */}

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-1 text-xs font-medium text-slate-300">

              <Landmark className="h-3.5 w-3.5 text-amber-400" />

              <span>
                Warisan & Kronik Daerah
              </span>

            </div>


            {/* Heading */}

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">

              Napak Tilas Sejarah

              <br />

              <span className="text-blue-400">
                Bumi Wiralodra
              </span>

            </h1>


            {/* Description */}

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Telusuri berbagai cerita, tempat,
              dan peninggalan bersejarah yang
              menjadi bagian dari perjalanan
              Indramayu.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          SEARCH + FILTER
      ====================================================== */}

      <section className="relative z-20 -mt-8 mx-auto max-w-7xl px-6 lg:px-8">

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between">

          {/* CATEGORY */}

          <div className="flex flex-wrap items-center gap-1.5">

            {kategoriList.map((kategori) => (

              <button
                key={kategori}
                type="button"
                onClick={() =>
                  handleKategori(kategori)
                }
                className={`
                  rounded-xl
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  transition-all
                  ${
                    selectedKategori === kategori
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                {kategori}
              </button>

            ))}

          </div>


          {/* SEARCH */}

          <div className="relative sm:w-72">

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
              placeholder="Cari cerita sejarah..."
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

      <section className="px-6 py-16 md:py-20">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                Cerita di Balik Indramayu
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Mengenal berbagai cerita, tempat,
                tokoh, dan warisan sejarah yang
                menjadi bagian dari Indramayu.
              </p>

            </div>


            {/* TOTAL */}

            {!loading && pagination && (

              <p className="text-xs text-gray-500">

                Menampilkan{' '}

                <span className="font-semibold text-gray-700">
                  {pagination.from || 0}
                </span>

                {' - '}

                <span className="font-semibold text-gray-700">
                  {pagination.to || 0}
                </span>

                {' dari '}

                <span className="font-semibold text-gray-700">
                  {pagination.total || 0}
                </span>

                {' cerita'}

              </p>

            )}

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                (item) => (

                  <div
                    key={item}
                    className="
                      h-[480px]
                      animate-pulse
                      overflow-hidden
                      rounded-[28px]
                      border-[8px]
                      border-white
                      bg-white
                      shadow-sm
                    "
                  >

                    <div className="h-[250px] bg-gray-200" />

                    <div className="space-y-4 px-4 pt-5">

                      <div className="h-6 w-3/4 rounded bg-gray-200" />

                      <div className="h-4 w-1/2 rounded bg-gray-200" />

                      <div className="h-8 w-full rounded bg-gray-200" />

                      <div className="h-10 w-full rounded-full bg-gray-200" />

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

            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

              <BookOpen className="mx-auto mb-3 h-9 w-9 text-gray-400" />

              <p className="text-sm text-gray-500">
                {error}
              </p>

            </div>

          )}


          {/* ==================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            sejarah.length === 0 && (

              <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">

                <BookOpen className="mx-auto mb-3 h-9 w-9 text-gray-400" />

                <p className="text-sm text-gray-500">
                  Belum ada data sejarah yang
                  sesuai dengan pencarian.
                </p>

              </div>

            )}


          {/* ==================================================
              3 COLUMN CARD
          ================================================== */}

          {!loading &&
            !error &&
            sejarah.length > 0 && (

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                {sejarah.map((item) => (

                  <SejarahCard
                    key={item.id}
                    item={item}
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
   SEJARAH CARD
   STYLE CARD YANG KAMU SUKA
============================================================ */

function SejarahCard({ item }) {

  const [currentImage, setCurrentImage] = useState(0)

  /*
   * Support dua format gambar:
   *
   * gambar: "sejarah/gambar.jpg"
   *
   * atau:
   *
   * gambar: [
   *   "sejarah/gambar1.jpg",
   *   "sejarah/gambar2.jpg"
   * ]
   */

  const images = Array.isArray(item.gambar)
    ? item.gambar
    : item.gambar
      ? [item.gambar]
      : []


  const imageUrl =
    images.length > 0
      ? `${LARAVEL_URL}/storage/${images[currentImage]}`
      : null


  /*
   * ==========================================================
   * NEXT IMAGE
   * ==========================================================
   */

  const nextImage = () => {

    if (images.length <= 1) return

    setCurrentImage((prev) =>
      prev === images.length - 1
        ? 0
        : prev + 1
    )

  }


  /*
   * ==========================================================
   * PREVIOUS IMAGE
   * ==========================================================
   */

  const previousImage = () => {

    if (images.length <= 1) return

    setCurrentImage((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    )

  }


  return (

    <article
      className="
        group
        h-[480px]
        overflow-hidden
        rounded-[28px]
        border-[8px]
        border-white
        bg-white
        shadow-[0_10px_35px_rgba(0,0,0,0.08)]
        ring-1
        ring-gray-100
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]
      "
    >

      {/* ======================================================
          IMAGE
      ====================================================== */}

      <div className="relative h-[250px] overflow-hidden rounded-[20px] bg-gray-100">

        {imageUrl ? (

          <img
            src={imageUrl}
            alt={item.judul}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              group-hover:scale-105
            "
          />

        ) : (

          <div className="flex h-full items-center justify-center text-xs text-gray-400">

            Tidak ada gambar

          </div>

        )}


        {/* ==================================================
            CATEGORY
        ================================================== */}

        {item.kategori && (

          <span
            className="
              absolute
              left-3.5
              top-3.5
              rounded-full
              border
              border-white/30
              bg-white/80
              px-3
              py-1
              text-xs
              font-medium
              text-gray-700
              backdrop-blur-md
            "
          >

            {item.kategori}

          </span>

        )}


        {/* ==================================================
            IMAGE ARROWS
        ================================================== */}

        {images.length > 1 && (

          <>

            <button
              type="button"
              onClick={previousImage}
              aria-label="Gambar sebelumnya"
              className="
                absolute
                left-2.5
                top-1/2
                z-20
                flex
                h-8
                w-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/40
                bg-black/20
                text-white
                backdrop-blur-md
                transition
                hover:bg-black/40
              "
            >

              <ChevronLeft size={16} />

            </button>


            <button
              type="button"
              onClick={nextImage}
              aria-label="Gambar berikutnya"
              className="
                absolute
                right-2.5
                top-1/2
                z-20
                flex
                h-8
                w-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/40
                bg-black/20
                text-white
                backdrop-blur-md
                transition
                hover:bg-black/40
              "
            >

              <ChevronRight size={16} />

            </button>

          </>

        )}


        {/* ==================================================
            IMAGE DOTS
        ================================================== */}

        {images.length > 1 && (

          <div
            className="
              absolute
              bottom-3
              left-1/2
              z-20
              flex
              -translate-x-1/2
              items-center
              gap-1.5
              rounded-full
              bg-black/30
              px-2.5
              py-1
              backdrop-blur-md
            "
          >

            {images.map((_, index) => (

              <button
                key={index}
                type="button"
                onClick={() =>
                  setCurrentImage(index)
                }
                aria-label={`Gambar ${index + 1}`}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    index === currentImage
                      ? 'w-4 bg-white'
                      : 'w-1.5 bg-white/70'
                  }
                `}
              />

            ))}

          </div>

        )}

      </div>


      {/* ======================================================
          CARD CONTENT
      ====================================================== */}

      <div className="flex h-[214px] flex-col px-4 pb-2 pt-4">

        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900">

          {item.judul}

        </h3>


        {/* LOCATION */}

        {item.lokasi && (

          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">

            <MapPin size={14} />

            <span>
              {item.lokasi}
            </span>

          </div>

        )}


        {/* DESCRIPTION */}

        {item.deskripsi && (

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">

            {item.deskripsi}

          </p>

        )}


        {/* BUTTON */}

        <Link
          to={`/sejarah/${item.slug}`}
          className="
            mt-auto
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            bg-black
            px-4
            py-2.5
            text-xs
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-gray-800
          "
        >

          Baca Selengkapnya

          <ArrowRight
            size={15}
            className="
              transition-transform
              group-hover:translate-x-1
            "
          />

        </Link>

      </div>

    </article>

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


  /*
   * ==========================================================
   * PAGE NUMBERS
   * ==========================================================
   */

  const getPageNumbers = () => {

    const pages = []


    /*
     * Kalau total halaman <= 7,
     * tampilkan semuanya.
     */

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


    /*
     * Halaman pertama
     */

    pages.push(1)


    /*
     * Titik-titik kiri
     */

    if (currentPage > 4) {
      pages.push('...')
    }


    /*
     * Halaman sekitar halaman aktif
     */

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


    /*
     * Titik-titik kanan
     */

    if (
      currentPage <
      lastPage - 3
    ) {

      pages.push('...')

    }


    /*
     * Halaman terakhir
     */

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
          onPageChange(currentPage - 1)
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

      {pages.map((pageNumber, index) => {

        /*
         * Titik-titik
         */

        if (pageNumber === '...') {

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
          pageNumber === currentPage


        return (

          <button
            key={pageNumber}
            type="button"
            onClick={() =>
              onPageChange(pageNumber)
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

      })}


      {/* NEXT */}

      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        disabled={
          currentPage === lastPage
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