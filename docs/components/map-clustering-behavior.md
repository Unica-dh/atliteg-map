# Comportamento del Clustering sulla Mappa

## Panoramica

La mappa geografica del progetto AtLiTeG utilizza un sistema di **clustering sempre attivo** che visualizza tutti i marker come **cerchi circolari** a qualsiasi livello di zoom. Non esistono pin individuali tradizionali.

## Caratteristiche Principali

### 1. Cerchi Circolari Sempre Visibili

- **Tutti i marker** vengono renderizzati come cerchi circolari con numeri all'interno
- **Non esistono pin individuali** a forma di goccia o altri shape tradizionali
- **Anche marker singoli** (con un solo lemma) vengono visualizzati come cerchi
- Il **numero all'interno** rappresenta la somma delle occorrenze (campo `Frequenza`) dei lemmi in quella posizione

### 2. Codifica Colori per Frequenza

I cerchi utilizzano colori differenti in base alla frequenza totale:

| Frequenza Totale | Dimensione | Colore | Classe CSS |
|-----------------|------------|---------|------------|
| ≤ 20 | Small | Blu (`rgba(59, 130, 246, 0.6)`) | `marker-cluster-small` |
| 21 - 100 | Medium | Arancione (`rgba(251, 146, 60, 0.6)`) | `marker-cluster-medium` |
| > 100 | Large | Rosso (`rgba(239, 68, 68, 0.6)`) | `marker-cluster-large` |

### 3. Clustering Dinamico

Il clustering si comporta in modo dinamico rispetto allo zoom:

- **Zoom Out**: I cerchi vicini si **aggregano** mostrando la somma totale delle occorrenze
- **Zoom In**: I cluster si **espandono** mostrando cerchi più piccoli o singoli
- **Click su Cluster**: Esegue uno zoom automatico sulla zona del cluster
- **Nessun Livello di Disabilitazione**: Il clustering rimane attivo a qualsiasi livello di zoom (incluso il massimo)

## Implementazione Tecnica

### Configurazione leaflet.markercluster

```typescript
const markerClusterGroup = L.markerClusterGroup({
  // CLUSTERING SEMPRE ATTIVO
  maxClusterRadius: 120,           // Raggio ampio per aggregare anche a zoom elevati
  disableClusteringAtZoom: 25,     // Oltre il max zoom (18) = mai disabilitato
  spiderfyOnMaxZoom: false,        // Non esplodere cluster in pin individuali
  singleMarkerMode: false,         // Non mostrare mai pin singoli

  // PERFORMANCE
  chunkedLoading: true,
  chunkInterval: 200,
  chunkDelay: 50,

  // COMPORTAMENTO
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  animate: false,
  animateAddingMarkers: false,

  // ICONE PERSONALIZZATE
  iconCreateFunction: function(cluster) {
    // Calcola somma frequenze
    let totalFrequency = 0;
    cluster.getAllChildMarkers().forEach(marker => {
      marker.options.customData.lemmi.forEach(lemma => {
        totalFrequency += parseInt(lemma.Frequenza) || 0;
      });
    });

    // Ritorna icona cluster con colore basato su frequenza
    return createClusterIcon(totalFrequency);
  }
});
```

### Creazione Icone Marker

Ogni marker individuale utilizza la funzione `createClusterLikeIcon()`:

```typescript
const createClusterLikeIcon = (totalFrequency: number, highlighted = false, selected = false) => {
  // Determina colore e dimensione
  let size = 'small';
  if (totalFrequency > 100) size = 'large';
  else if (totalFrequency > 20) size = 'medium';

  return L.divIcon({
    html: `<div><span>${totalFrequency}</span></div>`,
    className: `marker-cluster marker-cluster-${size}`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};
```

## Calcolo della Frequenza Totale

Per ogni marker, la frequenza totale viene calcolata come:

```typescript
let totalFrequency = 0;
marker.lemmi.forEach((lemma: any) => {
  const freq = parseInt(lemma.Frequenza) || 0;
  totalFrequency += freq;
});
```

**Esempio**:
- Località: **Milano**
- Lemmi presenti: `julienne` (freq: 33)
- Cerchio mostrato: **33** (blu, small)

**Esempio cluster**:
- Cluster che aggrega 3 località
- Frequenze: 15 + 25 + 80 = 120
- Cerchio mostrato: **120** (rosso, large)

## Evidenziazione e Selezione

I cerchi supportano stati di evidenziazione:

- **Normale**: Colori standard (blu/arancione/rosso)
- **Highlighted**: Colore blu intenso `rgba(37, 99, 235, 0.7)` quando il lemma è evidenziato
- **Selected**: Colore blu più intenso quando il marker è selezionato

## File Coinvolti

| File | Descrizione |
|------|-------------|
| `components/GeographicalMap.tsx` | Componente principale della mappa con logica clustering |
| `app/globals.css` | Stili CSS per classi `.marker-cluster-*` |
| `styles/map-animations.css` | Animazioni e transizioni per i marker |

## Vantaggi di Questo Approccio

1. **Consistenza Visiva**: Stesso aspetto a qualsiasi livello di zoom
2. **Informazione Immediata**: Il numero mostra subito la quantità di occorrenze
3. **Riduzione Clutter**: Evita sovrapposizione di pin tradizionali
4. **Performance**: Clustering ottimizzato per dataset grandi
5. **UX Intuitiva**: Click per espandere, colori per importanza

## Note per Sviluppatori

- Non modificare `disableClusteringAtZoom` a valori < 20 (riattiverebbe i pin individuali)
- La funzione `createClusterLikeIcon()` deve essere usata per TUTTI i marker
- Le soglie di frequenza (20, 100) possono essere personalizzate modificando le condizioni in `createClusterLikeIcon()`

## Riferimenti

- [Leaflet.markercluster Documentation](https://github.com/Leaflet/Leaflet.markercluster)
- [Leaflet Documentation](https://leafletjs.com/)
- Componente: `lemmario-dashboard/components/GeographicalMap.tsx`
