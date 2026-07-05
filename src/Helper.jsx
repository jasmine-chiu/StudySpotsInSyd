const categories = [
  { id: 'misc',          file: './data/miscSpots.geojson',         icon: 'misc-icon', iconHover: 'misc-icon-hover' },
  { id: 'cafes',         file: './data/cafeSpots.geojson',         icon: 'cafe-icon', iconHover: 'cafe-icon-hover' },
  { id: 'starbucks',     file: './data/starbucksSpots.geojson',    icon: 'cafe-icon', iconHover: 'cafe-icon-hover' },
  { id: 'oliver-browns', file: './data/OBSpots.geojson',           icon: 'cafe-icon', iconHover: 'cafe-icon-hover' },
  { id: 'libraries',     file: './data/libSpots.geojson',          icon: 'lib-icon', iconHover: 'lib-icon-hover' },
];

export const loadData = (setSpots) => {
  Promise.all(
    categories.map(cat =>
      fetch(cat.file).then(r => r.json()).then(d => d.features)
    )
  ).then(allFeatures => setSpots(allFeatures.flat()));
};