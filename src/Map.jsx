import Header from "./Header"
import Use from "./Use";
import Key from "./Key";
import Overlay from "./Overlay";

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { IoIosRefreshCircle } from 'react-icons/io';
import 'mapbox-gl/dist/mapbox-gl.css';

const categories = [
  { id: 'cafes',         file: './data/cafeSpots.geojson',         icon: 'cafe-icon', iconHover: 'cafe-icon-hover' },
  { id: 'starbucks',     file: './data/starbucksSpots.geojson',     icon: 'icon-hover', iconHover: 'icon-hover' },
  { id: 'oliver-browns', file: './data/OBSpots.geojson',            icon: 'icon', iconHover: 'icon-hover' },
  { id: 'libraries',     file: './data/libSpots.geojson',   icon: 'lib-icon', iconHover: 'lib-icon-hover' },
];

const Map = () => {
  const [selected, setSelected]       = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [spots, setSpots]             = useState([]);
  const [resetKey, setResetKey]       = useState(0);
  const mapRef          = useRef();
  const mapContainerRef = useRef();
  const selectedRef     = useRef(null);

  const loadImage = (map, url) => new Promise((resolve, reject) => {
    map.loadImage(url, (error, image) => error ? reject(error) : resolve(image));
  });

  useEffect(() => {
    const MB_TOKEN = 'pk.eyJ1IjoianFzbWluYyIsImEiOiJjbW44bGF3MmcwYndvMnJwejI1ejd4NndqIn0.ts5PTb2BHeScF9oA3SSkfQ';
    mapboxgl.accessToken = MB_TOKEN;

    const map = (mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      zoom: 10.5,
      center: [151.14882147065683, -33.8819969622573],
    }));

    map.on('load', async () => {
      const icons = [
				{ name: 'cafe-icon',       url: '/icons/cafeIcon.png'       },
        { name: 'cafe-icon-hover', url: '/icons/cafeIconHover.png' },
				{ name: 'lib-icon',       url: '/icons/libIcon.png'       },
        { name: 'lib-icon-hover', url: '/icons/libIconHover.png' },
				{ name: 'icon',       url: '/icons/icon.png'       },
        { name: 'icon-hover', url: '/icons/iconHover.png' },
        { name: 'xcafe-icon',       url: '/icons/cafe-icon.png'       },
        { name: 'xcafe-icon-hover', url: '/icons/cafe-icon-hover.png' },
        { name: 'search', url: '/icons/search.png' }
      ];

      try {
        await Promise.all(icons.map(async (icon) => {
          const image = await loadImage(map, icon.url);
          map.addImage(icon.name, image);
        }));

        // add sources + layers
        for (const cat of categories) {
          map.addSource(`src-${cat.id}`, {
            type: 'geojson',
            data: cat.file,
            generateId: true
          });

          map.addLayer({
            id: `layer-${cat.id}`,
            type: 'symbol',
            source: `src-${cat.id}`,
            layout: { 'icon-image': cat.icon, 'icon-size': 0.14, 'icon-allow-overlap': true }
          });

          map.addLayer({
            id: `layer-${cat.id}-hover`,
            type: 'symbol',
            source: `src-${cat.id}`,
            filter: ['==', ['id'], ''],
            layout: { 'icon-image': cat.iconHover, 'icon-size': 0.15, 'icon-allow-overlap': true }
          });
        }

        // load spots for search
        Promise.all(
          categories.map(cat =>
            fetch(cat.file).then(r => r.json()).then(d => d.features)
          )
        ).then(allFeatures => setSpots(allFeatures.flat()));

        let justClickedFeature = false;

        for (const cat of categories) {
          map.on('click', `layer-${cat.id}`, (e) => {
            justClickedFeature = true;
            const feature    = e.features[0];
            const properties = feature.properties;

            // clear previous hover layer if different category
            if (selectedRef.current && selectedRef.current.hoverLayer !== `layer-${cat.id}-hover`) {
              map.setFilter(selectedRef.current.hoverLayer, ['==', ['id'], '']);
            }

            selectedRef.current = {
              id: feature.id,
              source: `src-${cat.id}`,
              hoverLayer: `layer-${cat.id}-hover`
            };

            map.setFilter(`layer-${cat.id}-hover`, ['==', ['id'], feature.id]);
            map.setFeatureState(
              { source: `src-${cat.id}`, id: feature.id },
              { selected: true }
            );

            setSelected({
              name:    properties.name,
              suburb:  properties.suburb || 'Sydney, NSW',
              category: cat.id,
              outlets: properties['has-outlets'] || 'Unknown',
              wifi:    properties['has-wifi']    || 'Unknown',
              toilets: properties['has-toilets'] || 'Unknown',
            });

            map.flyTo({ center: feature.geometry.coordinates, zoom: 15 });
          });

          map.on('mousemove', `layer-${cat.id}`, (e) => {
            if (!e.features?.length) return;
            const hoveredId  = e.features[0].id;
            const selectedId = selectedRef.current?.source === `src-${cat.id}`
              ? selectedRef.current.id : '';

            map.setFilter(`layer-${cat.id}-hover`, [
              'any',
              ['==', ['id'], hoveredId],
              ['==', ['id'], selectedId]
            ]);
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', `layer-${cat.id}`, () => {
            const selectedId = selectedRef.current?.source === `src-${cat.id}`
              ? selectedRef.current.id : '';
            map.setFilter(`layer-${cat.id}-hover`, ['==', ['id'], selectedId]);
            map.getCanvas().style.cursor = '';
          });
        }

        map.on('click', () => {
          if (justClickedFeature) { justClickedFeature = false; return; }
          if (selectedRef.current) {
            map.setFeatureState(
              { source: selectedRef.current.source, id: selectedRef.current.id },
              { selected: false }
            );
            map.setFilter(selectedRef.current.hoverLayer, ['==', ['id'], '']);
            selectedRef.current = null;
            setSelected(null);
          }
          map.easeTo({ zoom: 10.5 });
        });

      } catch (err) {
        console.error("Error loading icons:", err);
      }
    });

    return () => map.remove();
  }, []);

  // apply filters to all layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const cat of categories) {
      if (!map.getLayer(`layer-${cat.id}`)) continue;
      if (activeFilters.length === 0) {
        map.setFilter(`layer-${cat.id}`, null);
      } else {
        map.setFilter(`layer-${cat.id}`, [
          'all', ...activeFilters.map(f => ['==', ['get', f], 'TRUE'])
        ]);
      }
    }
  }, [activeFilters]);

  const onSpotSelect = (spot) => {
    mapRef.current.flyTo({ center: spot.geometry.coordinates, zoom: 15 });
    setSelected({
      name:     spot.properties.name,
      suburb:   spot.properties.suburb || 'Sydney, NSW',
      outlets:  spot.properties['has-outlets'] || 'Unknown',
      wifi:     spot.properties['has-wifi']    || 'Unknown',
      toilets:  spot.properties['has-toilets'] || 'Unknown',
    });
  };

  const resetMap = () => {
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
			center: [151.14882147065683, -33.8819969622573],
			zoom: 10.5,
			essential: true
		});

    for (const cat of categories) {
      if (map.getLayer(`layer-${cat.id}`))       map.setFilter(`layer-${cat.id}`, null);
      if (map.getLayer(`layer-${cat.id}-hover`)) map.setFilter(`layer-${cat.id}-hover`, ['==', ['id'], '']);
    }

    if (selectedRef.current) {
      map.setFeatureState(
        { source: selectedRef.current.source, id: selectedRef.current.id },
        { selected: false }
      );
    }

    selectedRef.current = null;
    setSelected(null);
    setActiveFilters([]);
    setResetKey(k => k + 1);
  };

  return (
    <div className="page">
      <div className="page-top">
        <Header isCompact={true} />
        <Use isCompact={true} />
      </div>
      <div className="page-title">
        <h1>Study Spots in Sydney</h1>
      </div>
      <div className="page-content">
        <div className="map-content">
          <div className="key-content">
            <Key
              isCompact={false}
              onFilterChange={setActiveFilters}
              spots={spots}
              onSpotSelect={onSpotSelect}
              resetKey={resetKey}
            />
            {selected && <Overlay selected={selected} />}
          </div>
          <div className='map-container' ref={mapContainerRef} />
        </div>
        <div className="map-btn-container">
          <div className="zoom-btn-container">
            <button className="zoom-btn plus-btn">+</button>
            <button className="zoom-btn minus-btn">-</button>
          </div>
          <button className="reset-btn" onClick={resetMap}>
            <IoIosRefreshCircle className="icon-img" title="Refresh Map" color="#9AA7FF" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Map;