
import { ArrowRight } from 'lucide-react'

const LARAVEL_URL = 'http://127.0.0.1:8000'

export default function Hero() {
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-white lg:min-h-[700px]">

      {/* =========================
          HERO IMAGE AREA
      ========================== */}
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[60%] lg:block">

        {/* MAIN IMAGE */}
        <img
          src={`${LARAVEL_URL}/images/home/oJWLiRMzJQE7O0pIyXEqK9wDMKN3O8g2v0539OyA.png`}
          alt="Destinasi wisata Indramayu"
          className="
            absolute
            right-[-95px]
            top-[8px]
            z-10
            h-[590px]
            w-[735px]
            max-w-none
            object-contain
            drop-shadow-[0_25px_45px_rgba(53,66,165,0.12)]
          "
        />

      </div>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <div className="relative z-20 mx-auto max-w-[1380px] px-6 sm:px-8 lg:px-10">
        <div className="flex min-h-[680px] items-center lg:min-h-[700px]">

          <div className="w-full pb-10 pt-24 lg:w-[55%] lg:pb-8 lg:pt-10 xl:w-[54%]">

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

              {/* PRIMARY CTA */}
              <a
                href="#eksplorasi"
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
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </a>

              {/* SECONDARY CTA */}
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
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </a>

            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
