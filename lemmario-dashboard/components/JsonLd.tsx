import React from 'react';

export const JsonLd = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.atliteg.org/#organization",
        "name": "AtLiTeG - Atlante della lingua e dei testi della cultura gastronomica italiana",
        "url": "https://www.atliteg.org",
        "logo": "https://atlante.atliteg.org/atliteg-logo.png",
        "sameAs": [
          "https://www.atliteg.org",
          "https://corpus.atliteg.org",
          "https://vocabolario.atliteg.org"
        ]
      },
      {
        "@type": "Dataset",
        "@id": "https://atlante.atliteg.org/#dataset",
        "name": "Vocabolario storico della lingua italiana della gastronomia (VoSLIG)",
        "description": "Dataset geolinguistico che mappa l'evoluzione storica e la distribuzione geografica della lingua gastronomica italiana dal Medioevo all'Unità.",
        "url": "https://atlante.atliteg.org",
        "creator": {
          "@id": "https://www.atliteg.org/#organization"
        },
        "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
        "isAccessibleForFree": true,
        "keywords": [
          "Gastronomia storica",
          "Linguistica italiana",
          "Geolinguistica",
          "Storia della lingua",
          "Cucina italiana"
        ]
      },
      {
        "@type": "WebApplication",
        "@id": "https://atlante.atliteg.org/#webapp",
        "name": "AtLiTeG Dashboard",
        "url": "https://atlante.atliteg.org",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR"
        },
        "featureList": "Mappa interattiva, Timeline storica, Filtri lessicografici, Schede etimologiche"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
