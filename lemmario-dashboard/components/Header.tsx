'use client';

export function Header() {
  return (
    <header className="bg-[#5B6FE8] shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          {/* Logo placeholder - using a simple square with AtLiTeG text */}
          <div className="flex-shrink-0 bg-white rounded-md p-2 w-16 h-16 flex items-center justify-center">
            <span className="text-[#5B6FE8] font-bold text-lg leading-tight">AtLi<br/>TeG</span>
          </div>
          
          {/* Title and description */}
          <div className="flex-1">
            <h1 className="text-white text-xl md:text-2xl font-semibold mb-1">
              Atlante della lingua e dei testi della cultura gastronomica italiana dall&apos;età medievale all&apos;Unità
            </h1>
            <p className="text-white/90 text-xs md:text-sm">
              PRIN 2017X8CZTM - PI prof.essoressa Giovanna Frosini, Università per Stranieri di Siena. Elaborato sui dati estrapolati dal &quot;Vocabolario storico della lingua italiana della gastronomia (VoSLIG)&quot;, in collaborazione con il Labego &quot;Giuseppe Cerasa&quot;, Università Roma Tre.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
