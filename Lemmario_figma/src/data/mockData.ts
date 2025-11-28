export interface Lemma {
  IdLemma: number;
  Lemma: string;
  Forma: string;
  CollGeografica: string;
  TipoCollGeografica: string;
  Anno: number;
  Periodo: string;
  IDPeriodo: number;
  Datazione: string;
  Categoria: string;
  Frequenza: number;
  URL: string;
  lat?: number;
  lng?: number;
}

// Italian cities coordinates
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Firenze': { lat: 43.7696, lng: 11.2558 },
  'Roma': { lat: 41.9028, lng: 12.4964 },
  'Milano': { lat: 45.4642, lng: 9.1900 },
  'Venezia': { lat: 45.4408, lng: 12.3155 },
  'Napoli': { lat: 40.8518, lng: 14.2681 },
  'Torino': { lat: 45.0703, lng: 7.6869 },
  'Bologna': { lat: 44.4949, lng: 11.3426 },
  'Siena': { lat: 43.3188, lng: 11.3308 },
  'Pisa': { lat: 43.7228, lng: 10.4017 },
  'Genova': { lat: 44.4056, lng: 8.9463 },
  'Verona': { lat: 45.4384, lng: 10.9916 },
  'Padova': { lat: 45.4064, lng: 11.8768 },
};

export const mockLemmas: Lemma[] = [
  {
    IdLemma: 2105,
    Lemma: 'aarìso',
    Forma: 'aariso',
    CollGeografica: 'Firenze',
    TipoCollGeografica: 'Città',
    Anno: 1325,
    Periodo: 'I quarto del XIV secolo',
    IDPeriodo: 13,
    Datazione: 'Sec. XIV primo quarto',
    Categoria: 'Brodi brodetti minestre zuppe',
    Frequenza: 2,
    URL: 'https://www.atliteg.org/lemmi/aarso/2105',
    ...cityCoordinates['Firenze']
  },
  {
    IdLemma: 2106,
    Lemma: 'abbruscare',
    Forma: 'abruscare',
    CollGeografica: 'Roma',
    TipoCollGeografica: 'Città',
    Anno: 1350,
    Periodo: 'II quarto del XIV secolo',
    IDPeriodo: 14,
    Datazione: 'Sec. XIV secondo quarto',
    Categoria: 'Cottura tecniche e termini',
    Frequenza: 5,
    URL: 'https://www.atliteg.org/lemmi/abbruscare/2106',
    ...cityCoordinates['Roma']
  },
  {
    IdLemma: 2107,
    Lemma: 'agliata',
    Forma: 'alleata',
    CollGeografica: 'Napoli',
    TipoCollGeografica: 'Città',
    Anno: 1398,
    Periodo: 'I quarto del XV secolo',
    IDPeriodo: 15,
    Datazione: 'Sec. XV primo quarto',
    Categoria: 'Condimenti',
    Frequenza: 12,
    URL: 'https://www.atliteg.org/lemmi/aceto/2107',
    ...cityCoordinates['Napoli']
  },
  {
    IdLemma: 2108,
    Lemma: 'agliata',
    Forma: 'agliata',
    CollGeografica: 'Bologna',
    TipoCollGeografica: 'Città',
    Anno: 1300,
    Periodo: 'I quarto del XIV secolo',
    IDPeriodo: 13,
    Datazione: 'Sec. XIV primo quarto',
    Categoria: 'Salse',
    Frequenza: 8,
    URL: 'https://www.atliteg.org/lemmi/agliata/2108',
    ...cityCoordinates['Bologna']
  },
  {
    IdLemma: 2109,
    Lemma: 'arrosto',
    Forma: 'arosta',
    CollGeografica: 'Milano',
    TipoCollGeografica: 'Città',
    Anno: 1375,
    Periodo: 'III quarto del XIV secolo',
    IDPeriodo: 14,
    Datazione: 'Sec. XIV terzo quarto',
    Categoria: 'Cottura tecniche e termini',
    Frequenza: 15,
    URL: 'https://www.atliteg.org/lemmi/arrosto/2109',
    ...cityCoordinates['Milano']
  },
  {
    IdLemma: 2110,
    Lemma: 'brodetto',
    Forma: 'brodetto',
    CollGeografica: 'Napoli',
    TipoCollGeografica: 'Città',
    Anno: 1450,
    Periodo: 'II quarto del XV secolo',
    IDPeriodo: 16,
    Datazione: 'Sec. XV secondo quarto',
    Categoria: 'Brodi brodetti minestre zuppe',
    Frequenza: 7,
    URL: 'https://www.atliteg.org/lemmi/brodetto/2110',
    ...cityCoordinates['Napoli']
  },
  {
    IdLemma: 2111,
    Lemma: 'cavolo',
    Forma: 'cavolo',
    CollGeografica: 'Siena',
    TipoCollGeografica: 'Città',
    Anno: 1320,
    Periodo: 'I quarto del XIV secolo',
    IDPeriodo: 13,
    Datazione: 'Sec. XIV primo quarto',
    Categoria: 'Verdure erbaggi',
    Frequenza: 10,
    URL: 'https://www.atliteg.org/lemmi/cavolo/2111',
    ...cityCoordinates['Siena']
  },
  {
    IdLemma: 2112,
    Lemma: 'cipolla',
    Forma: 'cipolla',
    CollGeografica: 'Firenze',
    TipoCollGeografica: 'Città',
    Anno: 1330,
    Periodo: 'I quarto del XIV secolo',
    IDPeriodo: 13,
    Datazione: 'Sec. XIV primo quarto',
    Categoria: 'Verdure erbaggi',
    Frequenza: 18,
    URL: 'https://www.atliteg.org/lemmi/cipolla/2112',
    ...cityCoordinates['Firenze']
  },
  {
    IdLemma: 2113,
    Lemma: 'dolce',
    Forma: 'dolce',
    CollGeografica: 'Torino',
    TipoCollGeografica: 'Città',
    Anno: 1380,
    Periodo: 'III quarto del XIV secolo',
    IDPeriodo: 14,
    Datazione: 'Sec. XIV terzo quarto',
    Categoria: 'Dolci',
    Frequenza: 9,
    URL: 'https://www.atliteg.org/lemmi/dolce/2113',
    ...cityCoordinates['Torino']
  },
  {
    IdLemma: 2114,
    Lemma: 'frittata',
    Forma: 'frittata',
    CollGeografica: 'Pisa',
    TipoCollGeografica: 'Città',
    Anno: 1410,
    Periodo: 'I quarto del XV secolo',
    IDPeriodo: 15,
    Datazione: 'Sec. XV primo quarto',
    Categoria: 'Uova e frittate',
    Frequenza: 6,
    URL: 'https://www.atliteg.org/lemmi/frittata/2114',
    ...cityCoordinates['Pisa']
  },
  {
    IdLemma: 2115,
    Lemma: 'olio',
    Forma: 'olio',
    CollGeografica: 'Genova',
    TipoCollGeografica: 'Città',
    Anno: 1340,
    Periodo: 'II quarto del XIV secolo',
    IDPeriodo: 14,
    Datazione: 'Sec. XIV secondo quarto',
    Categoria: 'Condimenti',
    Frequenza: 22,
    URL: 'https://www.atliteg.org/lemmi/olio/2115',
    ...cityCoordinates['Genova']
  },
  {
    IdLemma: 2116,
    Lemma: 'pepe',
    Forma: 'pepe',
    CollGeografica: 'Verona',
    TipoCollGeografica: 'Città',
    Anno: 1360,
    Periodo: 'II quarto del XIV secolo',
    IDPeriodo: 14,
    Datazione: 'Sec. XIV secondo quarto',
    Categoria: 'Spezie aromi',
    Frequenza: 20,
    URL: 'https://www.atliteg.org/lemmi/pepe/2116',
    ...cityCoordinates['Verona']
  },
  {
    IdLemma: 2117,
    Lemma: 'sale',
    Forma: 'sale',
    CollGeografica: 'Padova',
    TipoCollGeografica: 'Città',
    Anno: 1310,
    Periodo: 'I quarto del XIV secolo',
    IDPeriodo: 13,
    Datazione: 'Sec. XIV primo quarto',
    Categoria: 'Condimenti',
    Frequenza: 25,
    URL: 'https://www.atliteg.org/lemmi/sale/2117',
    ...cityCoordinates['Padova']
  },
  {
    IdLemma: 2118,
    Lemma: 'zafferano',
    Forma: 'zafferano',
    CollGeografica: 'Roma',
    TipoCollGeografica: 'Città',
    Anno: 1390,
    Periodo: 'III quarto del XIV secolo',
    IDPeriodo: 14,
    Datazione: 'Sec. XIV terzo quarto',
    Categoria: 'Spezie aromi',
    Frequenza: 11,
    URL: 'https://www.atliteg.org/lemmi/zafferano/2118',
    ...cityCoordinates['Roma']
  },
  {
    IdLemma: 2119,
    Lemma: 'zucchero',
    Forma: 'zucchero',
    CollGeografica: 'Venezia',
    TipoCollGeografica: 'Città',
    Anno: 1420,
    Periodo: 'I quarto del XV secolo',
    IDPeriodo: 15,
    Datazione: 'Sec. XV primo quarto',
    Categoria: 'Condimenti',
    Frequenza: 14,
    URL: 'https://www.atliteg.org/lemmi/zucchero/2119',
    ...cityCoordinates['Venezia']
  }
];

export const categories = [
  'Brodi brodetti minestre zuppe',
  'Cottura tecniche e termini',
  'Condimenti',
  'Salse',
  'Verdure erbaggi',
  'Dolci',
  'Uova e frittate',
  'Spezie aromi'
];

export const timePeriods = [
  'I quarto del XIV secolo',
  'II quarto del XIV secolo',
  'III quarto del XIV secolo',
  'I quarto del XV secolo',
  'II quarto del XV secolo'
];
