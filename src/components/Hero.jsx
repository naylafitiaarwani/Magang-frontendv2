import { ArrowRight, MapPin, Star, Compass, Map } from 'lucide-react'

const LARAVEL_URL = 'http://127.0.0.1:8000'

export default function Hero() {
  return (
    <section
      id="tentang"
      className="relative min-h-[720px] overflow-hidden bg-white"
    >
      {/* =========================
          DECORATIVE BACKGROUND
      ========================== */}
      <div className="pointer-events-none absolute right-[8%] top-[12%] h-[420px] w-[420px] rounded-full bg-[#3542A5]/5 blur-3xl" />

      {/* =========================
          HERO IMAGE AREA
      ========================== */}
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[60%] lg:block">

        {/* soft circle behind image */}
        <div className="absolute right-[7%] top-[17%] h-[470px] w-[470px] rounded-full border border-[#3542A5]/10" />

        <div className="absolute right-[10%] top-[20%] h-[420px] w-[420px] rounded-full bg-[#3542A5]/5" />

        {/* MAIN IMAGE */}
        <img
          src={`${LARAVEL_URL}/images/home/oJWLiRMzJQE7O0pIyXEqK9wDMKN3O8g2v0539OyA.png`}
          alt="Destinasi wisata Indramayu"
          className="
            absolute
            right-[-70px]
            top-[20px]
            z-10
            h-[580px]
            w-[720px]
            max-w-none
            object-contain
            drop-shadow-[0_25px_45px_rgba(53,66,165,0.12)]
          "
        />

        {/* =========================
            FLOATING CARD - TOP
        ========================== */}
        <div
          className="
            absolute
            right-[60%]
            top-[20%]
            z-30
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-white/80
            bg-white/90
            px-4
            py-3
            shadow-[0_15px_40px_rgba(17,24,39,0.10)]
            backdrop-blur-md
            animate-[float_5s_ease-in-out_infinite]
          "
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3542A5]/10">
            <Compass
              size={19}
              strokeWidth={2}
              className="text-[#3542A5]"
            />
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-400">
              Destinasi
            </p>

            <p className="mt-0.5 text-sm font-bold text-gray-800">
              Pilihan Indramayu
            </p>
          </div>
        </div>

        {/* =========================
            FLOATING CARD - BOTTOM
        ========================== */}
        <div
          className="
            absolute
            bottom-[30%]
            right-[55%]
            z-30
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-white/80
            bg-white/90
            px-4
            py-3
            shadow-[0_15px_40px_rgba(17,24,39,0.10)]
            backdrop-blur-md
            animate-[float_6s_ease-in-out_infinite]
          "
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50">
            <Star
              size={18}
              strokeWidth={2}
              className="fill-yellow-400 text-yellow-400"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-800">
                4.8
              </span>

              <span className="text-[10px] text-gray-400">
                / 5.0
              </span>
            </div>

            <p className="text-[9px] font-medium text-gray-400">
              Pengalaman wisata
            </p>
          </div>
        </div>

        {/* =========================
            SMALL FLOATING BADGE
        ========================== */}
        <div
          className="
            absolute
            left-[10%]
            top-[43%]
            z-30
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-white
            bg-white/90
            shadow-[0_10px_30px_rgba(17,24,39,0.10)]
            backdrop-blur-md
            animate-[float_4s_ease-in-out_infinite]
          "
        >
  <Map
  size={17}
  strokeWidth={1.8}
  className="text-[#3542A5]"
/>
        </div>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <div className="relative z-20 mx-auto max-w-[1380px] px-6 sm:px-8 lg:px-10">
        <div className="flex min-h-[720px] items-center">

          <div className="w-full pb-12 pt-24 lg:w-[55%] lg:pb-10 lg:pt-16 xl:w-[54%]">

            {/* LABEL */}
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-11 bg-[#5968F2]" />

              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#3542A5]">
                Indramayu Eksplor
              </span>
            </div>

            {/* HEADING */}
            <h1
              className="
                max-w-[680px]
                text-[45px]
                font-bold
                leading-[1.02]
                tracking-[-0.045em]
                text-[#111827]
                sm:text-[51px]
                md:text-[56px]
                lg:text-[58px]
                xl:text-[66px]
              "
            >
              Temukan Pesona
              <br />

              <span className="text-[#3542A5]">
                Indramayu
              </span>

              <br />

              dalam Setiap
              <br />

              Perjalanan.
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-6
                max-w-[535px]
                text-[14px]
                leading-[1.9]
                text-gray-500
                sm:text-[15px]
                sm:leading-7
              "
            >
              Jelajahi destinasi wisata, budaya, kuliner,
              sejarah, dan UMKM lokal Indramayu dalam satu
              tempat. Temukan pengalaman baru dan cerita
              menarik di setiap sudutnya.
            </p>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">

              <a
                href="#destinasi"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2.5
                  rounded-full
                  bg-[#3542A5]
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-[#3542A5]/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#2d388f]
                  hover:shadow-xl
                  hover:shadow-[#3542A5]/25
                "
              >
                <span>Mulai Eksplorasi</span>

                <ArrowRight
                  size={17}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              <a
                href="#tentang"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  px-3
                  py-3.5
                  text-sm
                  font-semibold
                  text-gray-700
                  transition-all
                  duration-300
                  hover:text-[#3542A5]
                "
              >
                <span>Tentang Indramayu</span>

                <ArrowRight
                  size={15}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

            </div>

          </div>
        </div>
      </div>


      {/* FLOAT ANIMATION */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>

    </section>
  )
}