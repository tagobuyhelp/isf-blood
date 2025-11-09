"use client";

import { useEffect, useRef, useState } from "react";

export default function DonorMap({ donors = [], center, radiusKm, onMarkerClick, heightClass = "h-64" }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [mapTheme, setMapTheme] = useState("light");

  // Load Leaflet assets on demand
  useEffect(() => {
    const ensureLeaflet = async () => {
      if (typeof window === "undefined") return;
      // Inject Leaflet CSS
      if (!document.querySelector('link[data-leaflet]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.setAttribute('data-leaflet', 'true');
        document.head.appendChild(link);
      }
      // Inject MarkerCluster CSS
      if (!document.querySelector('link[data-leaflet-cluster]')) {
        const link1 = document.createElement("link");
        link1.rel = "stylesheet";
        link1.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
        link1.setAttribute('data-leaflet-cluster', 'true');
        document.head.appendChild(link1);
        const link2 = document.createElement("link");
        link2.rel = "stylesheet";
        link2.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
        link2.setAttribute('data-leaflet-cluster', 'true');
        document.head.appendChild(link2);
      }
      const readyCheck = () => {
        if (window.L) {
          // Inject MarkerCluster JS if needed
          if (!window.L.markerClusterGroup && !document.getElementById("leaflet-cluster-js")) {
            const s = document.createElement("script");
            s.id = "leaflet-cluster-js";
            s.src = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";
            s.async = true;
            s.onload = () => setLeafletReady(true);
            document.body.appendChild(s);
            return;
          }
          setLeafletReady(true);
        } else if (!document.getElementById("leaflet-js")) {
          const script = document.createElement("script");
          script.id = "leaflet-js";
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.async = true;
          script.onload = readyCheck;
          document.body.appendChild(script);
        }
      };
      readyCheck();
    };
    ensureLeaflet();
  }, []);

  // Initialize or update map
  useEffect(() => {
    if (!leafletReady) return;
    const L = window.L;
    if (!L || !containerRef.current) return;

    // Determine center
    const firstDonorWithCoords = donors.find(d => d?.coords?.lat != null && d?.coords?.lng != null);
    const defaultCenter = firstDonorWithCoords
      ? [firstDonorWithCoords.coords.lat, firstDonorWithCoords.coords.lng]
      : [30.0444, 31.2357]; // Cairo fallback
    const centerLatLng = center && center.lat != null && center.lng != null
      ? [center.lat, center.lng]
      : defaultCenter;

    // Create map if missing
    const createMapIfNeeded = () => {
      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          center: centerLatLng,
          zoom: 12,
          scrollWheelZoom: false,
        });
        // Base layers
        const light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        });
        const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        });
        mapRef.current._baseLayers = { light, dark };
        (mapTheme === 'dark' ? dark : light).addTo(mapRef.current);
      } else {
        mapRef.current.setView(centerLatLng);
        // Switch theme layer
        if (mapRef.current._baseLayers) {
          const { light, dark } = mapRef.current._baseLayers;
          if (mapTheme === 'dark') {
            if (light && mapRef.current.hasLayer(light)) mapRef.current.removeLayer(light);
            if (dark && !mapRef.current.hasLayer(dark)) dark.addTo(mapRef.current);
          } else {
            if (dark && mapRef.current.hasLayer(dark)) mapRef.current.removeLayer(dark);
            if (light && !mapRef.current.hasLayer(light)) light.addTo(mapRef.current);
          }
        }
      }
    };
    createMapIfNeeded();

    // Clear previous markers
    if (mapRef.current._donorLayer) {
      mapRef.current.removeLayer(mapRef.current._donorLayer);
      mapRef.current._donorLayer = null;
    }
    if (mapRef.current._centerLayer) {
      mapRef.current.removeLayer(mapRef.current._centerLayer);
      mapRef.current._centerLayer = null;
    }

    const clusterAvailable = !!L.markerClusterGroup;
    const layer = clusterAvailable ? L.markerClusterGroup() : L.layerGroup();

    const makeIcon = (availability) => {
      const color = availability === 'available' ? '#16a34a' : (availability === 'emergency' ? '#dc2626' : '#6b7280');
      return L.divIcon({
        className: 'donor-div-icon',
        html: `<span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${color};box-shadow:0 0 0 2px #fff, 0 1px 6px rgba(0,0,0,0.25);"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -10],
      });
    };

    const bounds = [];
    donors.forEach((d) => {
      const lat = d?.coords?.lat;
      const lng = d?.coords?.lng;
      if (lat == null || lng == null) return;
      bounds.push([lat, lng]);
      const marker = L.marker([lat, lng], { icon: makeIcon(d.availability) });
      const title = `${d.name || 'Donor'} • ${d.bloodGroup || ''}`.trim();
      const dist = d.distance != null ? `${d.distance} km` : '';
      const availability = d.availability === 'available' ? 'Available' : (d.availability === 'emergency' ? 'Emergency Only' : 'Unavailable');
      marker.bindPopup(
        `<div style="font-size:13px;line-height:1.3">
          <strong>${title}</strong><br/>
          ${availability}${dist ? ` • ${dist}` : ''}<br/>
          ${d.address || ''}
        </div>`
      );
      marker.on('click', () => {
        if (typeof onMarkerClick === 'function') onMarkerClick(d);
      });
      layer.addLayer(marker);
    });

    layer.addTo(mapRef.current);
    mapRef.current._donorLayer = layer;

    // Center + radius overlay
    if (center && center.lat != null && center.lng != null) {
      const centerLayer = L.layerGroup();
      const centerMarker = L.circleMarker([center.lat, center.lng], {
        radius: 6,
        color: '#2563eb',
        weight: 2,
        fillColor: '#3b82f6',
        fillOpacity: 0.8,
      });
      centerLayer.addLayer(centerMarker);
      if (radiusKm && Number(radiusKm) > 0) {
        const circle = L.circle([center.lat, center.lng], {
          radius: Number(radiusKm) * 1000,
          color: '#2563eb',
          weight: 1.5,
          fillColor: '#60a5fa',
          fillOpacity: 0.15,
        });
        centerLayer.addLayer(circle);
      }
      centerLayer.addTo(mapRef.current);
      mapRef.current._centerLayer = centerLayer;
    }

    // Fit bounds to donors when available
    if (bounds.length >= 2) {
      const b = L.latLngBounds(bounds);
      mapRef.current.fitBounds(b, { padding: [20, 20] });
    }

    return () => {
      // no-op; let map persist across re-renders
    };
  }, [leafletReady, donors, center, radiusKm, onMarkerClick, mapTheme]);

  return (
    <div className={`relative rounded-isf overflow-hidden ${heightClass}`}>
      <div ref={containerRef} className="w-full h-full" aria-label="Donor map" />
      {/* Map theme controls */}
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur rounded-isf shadow-isf flex items-center space-x-1 p-1">
        <button
          onClick={() => setMapTheme('light')}
          className={`px-2 py-1 text-xs rounded-isf ${mapTheme === 'light' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          aria-label="Light map"
        >Light</button>
        <button
          onClick={() => setMapTheme('dark')}
          className={`px-2 py-1 text-xs rounded-isf ${mapTheme === 'dark' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          aria-label="Dark map"
        >Dark</button>
      </div>
    </div>
  );
}