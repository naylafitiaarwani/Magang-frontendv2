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

      <section className="relative overflow-hidden bg-slate-900 pb-24 pt-16 text-white">

        {/* Decorative glow */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

          <div className="max-w-3xl">

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

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3542A5]">
                Koleksi Sejarah
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Cerita di Balik Indramayu
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Mengenal cerita, tempat, tokoh, dan warisan sejarah yang menjadi bagian
                dari perjalanan Indramayu.
              </p>
            </div>

            {!loading && pagination && (
              <p className="text-xs text-slate-500">
                Menampilkan{" "}
                <span className="font-semibold text-slate-700">
                  {pagination.from || 0} - {pagination.to || 0}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-slate-700">
                  {pagination.total || 0}
                </span>{" "}
                cerita
              </p>
            )}
          </div>

          {loading && (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="grid min-h-[250px] animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm sm:grid-cols-[256px_1fr]"
                  >
                    <div className="h-56 bg-slate-200 sm:h-full" />
                    <div className="space-y-4 p-6">
                      <div className="h-5 w-24 rounded bg-slate-200" />
                      <div className="h-7 w-4/5 rounded bg-slate-200" />
                      <div className="h-4 w-full rounded bg-slate-200" />
                      <div className="h-4 w-3/4 rounded bg-slate-200" />
                      <div className="h-9 w-36 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden space-y-4 lg:block">
                <div className="h-40 rounded-2xl bg-slate-200" />
                <div className="h-72 rounded-2xl bg-slate-200" />
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
              <BookOpen className="mx-auto mb-3 h-9 w-9 text-slate-400" />
              <p className="text-sm text-slate-500">{error}</p>
            </div>
          )}

          {!loading && !error && sejarah.length === 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
              <BookOpen className="mx-auto mb-3 h-9 w-9 text-slate-400" />
              <p className="text-sm text-slate-500">
                Belum ada data sejarah yang sesuai dengan pencarian.
              </p>
            </div>
          )}

          {!loading && !error && sejarah.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div className="grid gap-5 sm:grid-cols-2">
                {sejarah.map((item) => (
                  <SejarahCard
                    key={item.id}
                    item={item}
                    /* Pilihan style:
                       horizontal | featured | compact | overlay */
                    variant="horizontal"
                  />
                ))}
              </div>

              <aside className="space-y-5 lg:sticky lg:top-6">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-[#3542A5]">
                      <Landmark size={15} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Kategori
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {kategoriList.map((kategori) => {
                      const active = selectedKategori === kategori

                      return (
                        <button
                          key={kategori}
                          type="button"
                          onClick={() => handleKategori(kategori)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                            active
                              ? "bg-indigo-50 font-semibold text-[#3542A5]"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                active ? "bg-[#3542A5]" : "bg-slate-300"
                              }`}
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

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3542A5]">
                        Pilihan
                      </p>
                      <h3 className="mt-1 text-sm font-bold text-slate-900">
                        Cerita lainnya
                      </h3>
                    </div>
                    <BookOpen size={16} className="text-slate-300" />
                  </div>

                  <div className="space-y-4">
                    {sejarah.slice(0, 4).map((item) => (
                      <SidebarHistoryCard key={`side-${item.id}`} item={item} />
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}

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
   Redesain: kartu bergaya "arsip koleksi" — nomor akses,
   label kategori seperti stempel, judul serif, dan garis
   aksen yang muncul saat hover.
============================================================ */

function SejarahCard({ item, variant = "horizontal" }) {
  const [currentImage, setCurrentImage] = useState(0)

  const images = Array.isArray(item.gambar)
    ? item.gambar
    : item.gambar
      ? [item.gambar]
      : []

  const imageUrl =
    images.length > 0
      ? `${LARAVEL_URL}/storage/${images[currentImage]}`
      : null

  const nextImage = () => {
    if (images.length <= 1) return
    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const previousImage = () => {
    if (images.length <= 1) return
    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const imageControls = (
    <>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={previousImage}
            aria-label="Gambar sebelumnya"
            className="absolute left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-black/45"
          >
            <ChevronLeft size={15} />
          </button>

          <button
            type="button"
            onClick={nextImage}
            aria-label="Gambar berikutnya"
            className="absolute right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-black/45"
          >
            <ChevronRight size={15} />
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full bg-black/25 px-2 py-1 backdrop-blur">
            {images.map((_, imgIndex) => (
              <button
                key={imgIndex}
                type="button"
                onClick={() => setCurrentImage(imgIndex)}
                aria-label={`Gambar ${imgIndex + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  imgIndex === currentImage
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </>
  )

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]">

      {/* Aksen atas: muncul saat hover, menandai entri aktif */}
      <div className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[#3542A5] transition-transform duration-300 group-hover:scale-x-100" />

      {/* GAMBAR */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.judul}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            Tidak ada gambar
          </div>
        )}

        {/* Label kategori bergaya stempel arsip, menyatu di sudut */}
        {item.kategori && (
          <span className="absolute left-0 top-4 z-10 rounded-r-full bg-slate-900/85 py-1.5 pl-3 pr-4 text-[10px] font-semibold text-white backdrop-blur">
            {item.kategori}
          </span>
        )}

        {imageControls}
      </div>

      {/* KONTEN */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-2.5 flex items-baseline gap-3 border-b border-dashed border-slate-200 pb-2.5">
            <span className="text-[11px] text-slate-400">
              Arsip Sejarah Indramayu
            </span>
          </div>

          <h3 className="font-serif line-clamp-2 text-xl font-semibold leading-snug text-slate-900 sm:text-[22px]">
            {item.judul}
          </h3>

          {item.lokasi && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={13} className="shrink-0 text-[#3542A5]" />
              <span className="line-clamp-1">{item.lokasi}</span>
            </div>
          )}

          {item.deskripsi && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
              {item.deskripsi}
            </p>
          )}
        </div>

        <Link
          to={`/sejarah/${item.slug}`}
          className="mt-5 inline-flex w-fit items-center gap-1.5 border-b border-transparent pb-0.5 text-xs font-bold text-[#3542A5] transition group-hover:gap-2.5 group-hover:border-[#3542A5]"
        >
          Baca selengkapnya
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}


function SidebarHistoryCard({ item }) {
  const images = Array.isArray(item.gambar)
    ? item.gambar
    : item.gambar
      ? [item.gambar]
      : []

  const imageUrl =
    images.length > 0
      ? `${LARAVEL_URL}/storage/${images[0]}`
      : null

  return (
    <Link to={`/sejarah/${item.slug}`} className="group flex gap-3">
      <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.judul}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[9px] text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h4 className="line-clamp-2 text-xs font-bold leading-5 text-slate-800 transition group-hover:text-[#3542A5]">
          {item.judul}
        </h4>
        {item.lokasi && (
          <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
            <MapPin size={10} />
            <span className="truncate">{item.lokasi}</span>
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