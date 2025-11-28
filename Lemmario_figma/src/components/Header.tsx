import logo from '../assets/logo.png';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-start gap-6">
        <img 
          src={logo} 
          alt="AtLiTeG Logo" 
          className="w-24 h-24 flex-shrink-0"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-gray-900 text-2xl font-semibold">
            Atlante della lingua e dei testi della cultura gastronomica italiana dall'età medievale all'Unità
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            PRIN 2017XRCZTM - PI professoressa Giovanna Frosini, Università per Stranieri di Siena. 
            Elaborato sui dati estrapolati dal "Vocabolario storico della lingua italiana della gastronomia (VoSLIG)", 
            in collaborazione con il Labgeo "Giuseppe Caraci", Università Roma Tre.
          </p>
        </div>
      </div>
    </header>
  );
}
