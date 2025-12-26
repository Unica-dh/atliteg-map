'use client';

import Image from 'next/image';

export function Header() {
  return (
    <header
      className="relative shadow-md overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0B5FA5 0%, #0D4A8F 100%)'
      }}
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: 'url(/immagine-testata.jpg)',
          backgroundPosition: 'center center',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 md:px-6 py-2 md:py-1">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-6">
          {/* Logo AtLiTeG */}
          <Image
            src="/AtLiTeG_logo.webp"
            alt="AtLiTeG Logo"
            width={100}
            height={110}
            priority
            className="flex-shrink-0 object-contain w-16 h-auto md:w-[100px]"
          />

          {/* Title and full information */}
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h1 className="text-white text-base md:text-xl lg:text-2xl font-bold leading-tight">
              Atlante della lingua e dei testi della cultura gastronomica italiana dall'età medievale all'Unità
            </h1>
            <p className="text-white/95 text-xs md:text-sm leading-relaxed mt-1">
              <strong>PRIN 2017XRCZTM</strong> - P.I. prof.ssa Giovanna Frosini, Università per Stranieri di Siena
            </p>
            <p className="text-white/95 text-[10px] md:text-xs leading-relaxed hidden md:block">
              Unità di ricerca: Università di Cagliari, Università di Napoli "Federico II", Università di Salerno. L'Atlante è elaborato sui dati del VoSLIG (Vocabolario storico della lingua italiana della gastronomia)
            </p>
            <p className="text-white/95 text-[10px] md:text-xs leading-relaxed hidden md:block">
              Responsabili Atlante e VoSLIG: Giovanni Urraci e Monica Alba - Partner informatici: DH Unica, diretto da: prof. Giampaolo Salice, Università di Cagliari
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
