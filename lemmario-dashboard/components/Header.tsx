'use client';

export function Header() {
  return (
    <header
      className="relative shadow-sm overflow-hidden"
      style={{
        height: '96px',
        background: '#0B5FA5'
      }}
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url(/immagine-testata.jpg)',
          backgroundPosition: 'center center',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-container mx-auto px-lg h-full flex items-center">
        <div className="flex items-center gap-lg w-full">
          {/* Logo placeholder */}
          <div
            className="flex-shrink-0 bg-white rounded-md p-2 w-16 h-16 flex items-center justify-center shadow-md"
            role="img"
            aria-label="AtLiTeG logo"
          >
            <span className="text-primary font-bold text-lg leading-tight">AtLi<br/>TeG</span>
          </div>

          {/* Title and description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-text-inverse text-lg md:text-xl font-semibold mb-1 leading-tight">
              Atlante della lingua e dei testi della cultura gastronomica italiana dall'età medievale all'Unità
            </h1>
            <p className="text-text-inverse/90 text-xs leading-normal line-clamp-2">
              PRIN 2017X8CZTM - PI prof.essoressa Giovanna Frosini, Università per Stranieri di Siena. Elaborato sui dati estrapolati dal "Vocabolario storico della lingua italiana della gastronomia (VoSLIG)", in collaborazione con il Labego "Giuseppe Cerasa", Università Roma Tre.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
