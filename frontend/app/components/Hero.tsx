"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#050505] text-white">

      <div className="absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[150px]" />

      </div>

      <div className="relative mx-auto max-w-7xl px-5 pt-24 lg:px-8">

        <p className="text-xs uppercase tracking-[0.4em] text-white/40">
          CINEMATIC VISUAL STUDIO
        </p>

        <h1 className="mt-6 text-[15vw] font-black leading-[0.8] tracking-[-0.08em] sm:text-[10rem]">

          MAKE

          <br />

          IT

          <br />

          <span className="text-white/30">
            LOOK
          </span>

          <br />

          <i>EPIC.</i>

        </h1>

        <p className="mt-10 max-w-xl text-lg text-white/45 leading-8">

          We transform moments into
          cinematic stories through
          professional photography,
          filmmaking and creative visuals.

        </p>

        <Link
          href="/booking"
          className="mt-10 inline-flex rounded-full border border-white/20 px-8 py-4 hover:bg-white hover:text-black transition"
        >
          BOOK YOUR SHOOT →
        </Link>

      </div>

    </section>
  );
}