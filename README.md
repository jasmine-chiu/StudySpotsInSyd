# 📍 Study Spots in Sydney

An interactive, map-based web application for discovering locations to study at across Sydney — cafés, libraries, and chain coffee spots, including filtering by amenities, search by name or suburb, and a chatbot for personalised recommendations.

**[Live Site →](https://jas-chiu.github.io/studyspotsinsyd)**

---

## Features

- **Interactive map** — Mapbox GL JS with custom hand-drawn markers per location category
- **Multi-category layers** — independent café, library, Starbucks, and Oliver Brown layers with hover/select states
- **Amenity filtering** — filter by Wi-Fi, power outlets, and nearby toilets
- **Search** — live search-as-you-type by name or suburb with dropdown suggestions
- **Spot overlay** — click any marker to see opening hours (today's), rating, amenities, and reviews
- **Chatbot** — conversational recommendations via the Anthropic API
- **Responsive** — mobile and desktop layouts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Mapbox GL JS, HTML/CSS |
| Database | Supabase (PostgreSQL) |
| Data pipeline | Python, Google Places API |
| Chatbot | Anthropic API |
| Deployment | Vercel / Railway |

---

## Project Structure

```
study-spots-sydney/
├── public/
│   ├── icons/                  # Custom hand-drawn map marker icons
│   │   ├── cafeIcon.png
│   │   ├── cafeIconHover.png
│   │   ├── libIcon.png
│   │   └── ...
│   └── data/                   # Legacy static GeoJSON (replaced by Supabase)
│       ├── cafeSpots.geojson
│       ├── starbucksSpots.geojson
│       ├── libSpots.geojson
│       └── OBSpots.geojson
│
├── src/
│   ├── components/
│   │   ├── Map.jsx             # Main map view, Mapbox setup, layer management
│   │   ├── Key.jsx             # Sidebar: search, filters, legend
│   │   ├── Overlay.jsx         # Selected spot info panel
│   │   ├── Header.jsx          # Nav header with compact/expanded modes
│   │   └── Use.jsx             # Usage instructions panel
│   ├── supabaseClient.js       # Supabase client initialisation
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── scripts/                    # Python data pipeline
│   ├── getLibraryDetails.py    # Scrape libraries via Places API grid search
│   ├── toGeoJSON.py            # Convert enriched JSON → GeoJSON
│   ├── addAmenities.py         # Merge amenity CSV into GeoJSON
│   ├── setAmenity.py           # Set a single amenity field across all spots
│   ├── findSpot.py             # Search + add a single spot by name
│   ├── removeSpot.py           # Remove a spot by name from a GeoJSON
│   └── pushToSupabase.py       # Upsert GeoJSON into Supabase
│
├── .env                        # API keys (never committed)
├── .env.example                # Key names without values
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- A [Mapbox](https://mapbox.com) account (free tier)
- A [Supabase](https://supabase.com) project
- A [Google Cloud](https://console.cloud.google.com) project with Places API enabled

### Installation

```bash
git clone https://github.com/jasmine-chiu/study-spots-sydney
cd study-spots-sydney
npm install
```

Create a `.env` file:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

```bash
npm run dev
```

---

## Data Pipeline

Spot data is sourced from the Google Places API and stored in Supabase. To re-run or extend:

### 1. Scrape a category

```bash
# all libraries in Sydney
python3 scripts/getLibraryDetails.py

# a specific chain
python3 scripts/getLibraryDetails.py  # edit query/type for other categories
```

### 2. Convert to GeoJSON

```bash
python3 scripts/toGeoJSON.py cafeSpots.json cafes
```

### 3. Add amenity data

```bash
# from a CSV with has-wifi, has-outlets, has-toilets columns
python3 scripts/addAmenities.py cafeSpots.geojson cafeSpots.csv

# or set a field across an entire file
python3 scripts/setAmenity.py starbucksSpots.geojson has-outlets TRUE
```

### 4. Push to Supabase

```bash
python3 scripts/pushToSupabase.py cafeSpots.geojson cafes
python3 scripts/pushToSupabase.py starbucksSpots.geojson starbucks
python3 scripts/pushToSupabase.py OBSpots.geojson oliver-browns
python3 scripts/pushToSupabase.py libSpots.geojson libraries
```

### Add or remove individual spots

```bash
python3 scripts/findSpot.py "Starbucks Westmead" starbucksSpots.geojson
python3 scripts/removeSpot.py starbucksSpots.geojson Westmead
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_MAPBOX_TOKEN` | Mapbox public token |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

---

## Acknowledgements

- Location data sourced from [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- Map rendering via [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- Database via [Supabase](https://supabase.com)
- Custom map markers hand-drawn in Procreate

---

## Roadmap

- [ ] User-submitted reviews and amenity corrections
- [ ] Opening hours filter (open now / open late)
- [ ] Distance-based sorting from user location
- [ ] More categories (coworking spaces, university libraries)
- [ ] iOS/Android PWA support
