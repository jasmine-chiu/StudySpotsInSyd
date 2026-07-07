import Header from "./layout/Header"
import Key from "./components/Key";
import Overlay from "./components/Overlay";
import Chat from "./components/Chat";
import Search from "./components/Search"

import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { IoIosRefreshCircle } from 'react-icons/io';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "./Client";
import logo from "./assets/logo.png";

const categories = [
  { id: 'misc',          file: './data/miscSpots.geojson',         icon: 'misc-icon', iconHover: 'misc-icon-hover' },
  { id: 'cafes',         file: './data/cafeSpots.geojson',         icon: 'cafe-icon', iconHover: 'cafe-icon-hover' },
  { id: 'starbucks',     file: './data/starbucksSpots.geojson',    icon: 'cafe-icon', iconHover: 'cafe-icon-hover' },
  { id: 'oliver-browns', file: './data/OBSpots.geojson',           icon: 'cafe-icon', iconHover: 'cafe-icon-hover' },
  { id: 'libraries',     file: './data/libSpots.geojson',          icon: 'lib-icon', iconHover: 'lib-icon-hover' },
];

const Map = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [spots, setSpots] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [resetKey, setResetKey] = useState(0);
  const [boxOpen, setBoxOpen] = useState(true);
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const selectedRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const loadImage = (mapInstance, url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; 
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error(`failed to load image resource at: ${url}`));
      img.src = url;
    });
  };

  useEffect(() => {
    const MB_TOKEN = import.meta.env.VITE_MB_TOKEN;
    mapboxgl.accessToken = MB_TOKEN;

    const bounds = [
      [150.86000, -34.12492], // SW
      [151.37828, -33.60665]  // NE
    ];

    const map = (mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [151.11913782513034, -33.86578478609183],
			zoom: 9.75,
      maxBounds: bounds,
      // minZoom: 8,
      maxZoom: 15,
    }));

    const fetchCategory = async (categoryId) => {
    try {
      const { data: categorySpots, error } = await supabase
        .from('spots')
        .select('name, suburb, lat, lng, category, has_wifi, has_outlets, has_toilets, hours, summary, reviews, rating, rating_count')
        .eq('category', categoryId); 

      if (error) throw error;

      return {
        type: 'FeatureCollection',
        features: (categorySpots || []).map(row => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [row.lng, row.lat]
          },
          properties: {
            ...row
          }
        }))
      };
    } catch (error) {
      console.error(`err: fetching category ${categoryId}:`, error);
      return { type: 'FeatureCollection', features: [] };
    }
  };

    map.on('load', async () => {
      const start = Date.now();

      const icon = [
        { name: 'misc-icon',       file: 'miscIcon.png'       },
        { name: 'misc-icon-hover', file: 'miscIconHover.png' },
        { name: 'cafe-icon',       file: 'cafeIcon.png'       },
        { name: 'cafe-icon-hover', file: 'cafeIconHover.png' },
        { name: 'lib-icon',        file: 'libIcon.png'        },
        { name: 'lib-icon-hover',  file: 'libIconHover.png'  },
        { name: 'icon',            file: 'icon.png'           },
        { name: 'icon-hover',      file: 'iconHover.png'      },
      ];

      try {
        await Promise.all(icon.map(async (icon) => {
          const { data } = supabase.storage
            .from('spots-icons')
            .getPublicUrl(icon.file);

        const publicUrl = data.publicUrl;
        const image = await loadImage(map, publicUrl);
        map.addImage(icon.name, image);
      }));

        
      const geojsonResults = await Promise.all(
        categories.map(cat => fetchCategory(cat.id))
      );

      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        const geojson = geojsonResults[i];

        // add sources + layers
        map.addSource(`src-${cat.id}`, {
          type: 'geojson',
          data: geojson,
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

      const { data: allSpots } = await supabase
        .from('spots')
        .select('name, suburb, lat, lng, has_wifi, has_outlets, has_toilets, hours, summary, reviews, rating, rating_count');
        
      setSpots(allSpots.map(row => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [row.lng, row.lat] },
        properties: row
      })));
      
      // potentially remove
      const elapsed = Date.now() - start;
      const minDelay = 1000;
      const remainder = Math.max(0, minDelay - elapsed);

      setTimeout(() => {
        setIsLoading(false);
      }, remainder);

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

          setBoxOpen(false);

          setSelected({
            name:     properties.name,
            suburb:   properties.suburb || 'Sydney, NSW',
            category: cat.id,
            outlets:  properties['has-outlets'] || '',
            wifi:     properties['has-wifi']    || '',
            toilets:  properties['has-toilets'] || '',
            hours:    parseHours(properties.hours),
            summary:  properties.summary || '',
            rating:   properties.rating,
            rating_count: properties.rating_count,
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
          map.easeTo({ zoom: 12 });
        });
      } catch (err) {
        console.error("Error loading icons:", err);
        setIsLoading(false); 
      }
    });

    return () => map.remove();
  }, []);
  
  useEffect(() => {
    if (!mapRef.current || isLoading || spots.length === 0) return;
    if (location.state?.initialSpot) {
      const initSpot = location.state.initialSpot;
      onSpotSelect(initSpot);
      window.history.replaceState({}, document.title);
    }
  }, [isLoading, spots, location.state]);

  const onSpotSelect = (spot) => {
    mapRef.current.flyTo({ 
      center: spot.geometry.coordinates,
      zoom: 15
    });

    setSelected({
      name:            spot.properties.name,
      suburb:          spot.properties.suburb || 'Sydney, NSW',
      rating:          spot.properties.rating,
      rating_count:    spot.properties.rating_count,
      hours:           parseHours(spot.properties.hours), 
      reviews:         spot.properties.reviews,
      outlets:         spot.properties['has_outlets'] || 'Unknown',
      wifi:            spot.properties['has_wifi']    || 'Unknown',
      toilets:         spot.properties['has_toilets'] || 'Unknown',
    });

    setBoxOpen(false);
  };

  const parseHours = (hours) => {
    if (!hours) {
      return {};
    } 
    if (typeof hours === 'object') {
      return hours; 
    }

    try {
      { return JSON.parse(hours); }
    } catch {
      return {};
    }
  };


  // apply filters to all layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const cat of categories) {
    if (!map.getLayer(`layer-${cat.id}`)) continue;

    let matchesCategory = true;
    if (activeCategory !== 'all') {
      if (activeCategory === 'café') {
        matchesCategory = cat.id.includes('cafe') || cat.id.includes('starbucks') || cat.id.includes('oliver-brown');
      } else if (activeCategory === 'library') {
        matchesCategory = cat.id === 'libraries';
      } else if (activeCategory === 'misc') {
        matchesCategory = cat.id === 'misc';
      }
    }

    if (!matchesCategory) {
      map.setFilter(`layer-${cat.id}`, ['boolean', false]);
      map.setFilter(`layer-${cat.id}-hover`, ['==', ['id'], '']);
      continue; 
    }

    if (activeFilters.length === 0) {
      map.setFilter(`layer-${cat.id}`, null);
    } else {
      map.setFilter(`layer-${cat.id}`, [
        'all', 
        ...activeFilters.map(f => ['==', ['get', f], 'TRUE'])
      ]);
    }
  }
}, [activeFilters, activeCategory]);

  const zoomIn = () => {
    const map = mapRef.current;
    if (map) {
      map.zoomIn({ duration: 300 });
    }
    };

  const zoomOut = () => {
    const map = mapRef.current;
    if (map) {
      map.zoomOut({ duration: 300 });
    }
  };

  const resetMap = () => {
    const map = mapRef.current;
    if (!map) return;

    setBoxOpen(true);

    map.flyTo({
      center: [151.11913782513034, -33.86578478609183],
			zoom: 9.75,
			essential: true,
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
    setActiveCategory("all");
    setResetKey(k => k + 1);
  };

  return (
    <div className="page">
      <div className={`loading-overlay ${!isLoading ? 'hidden' : ''}`}>
        <div className="loading-spinner" />
        <img
          className="loading-img"
          src={logo}
          alt="Loading"
        />
        <p><i>loading study spots...</i></p>
      </div>

      <div className="page-top">
        <Header
          isCompact={true}
          onChatToggle={() => setIsChatOpen(!isChatOpen)}
          isChatOpen={isChatOpen}
        />
        {isChatOpen && (
          <div className="chat-panel">
            <Chat spots={spots}/>
          </div>
        )}
      </div>
      <div className="page-title">
        <h1 className="page-heading"><i>STUDY SPOTS IN SYDNEY</i></h1>
        <div className="page-subheading">
          <span className="page-subheading-deco">✦</span>
            <span><i className="page-subheading-txt">  find a place to study near you  </i></span>
          <span className="page-subheading-deco">✦</span>
        </div>
      </div>
      <div className="page-content">
        <div className="total-content">
          <div className="left">
            <div>
              <Search 
                spots={spots} 
                onSpotSelect={onSpotSelect} 
                onSearchExecuted={() => setSelected(null)}
              />
            </div>
            <div>
              <div className="key-content">
                <Key
                  boxOpen={boxOpen}
                  setBoxOpen={setBoxOpen}
                  onFilterChange={setActiveFilters}
                  onCategoryChange={setActiveCategory}
                  onClearSelection={setSelected}
                  spots={spots}
                  onSpotSelect={onSpotSelect}
                  resetKey={resetKey}
                />
                {selected && <Overlay
                  isCompact={boxOpen}
                  selected={selected}
                />}
              </div>
            </div>
          </div>
          <div className='map-container' ref={mapContainerRef} />

        </div>
        <div className="map-btn-container">
          <div className="zoom-btn-container">
            <button className="zoom-btn plus-btn" onClick={zoomIn}>+</button>
            <button className="zoom-btn minus-btn" onClick={zoomOut}>-</button>
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