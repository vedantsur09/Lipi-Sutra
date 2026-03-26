import { useEffect } from "react";

const GOOGLE_KEY = import.meta.env.VITE_MAPS_KEY || import.meta.env.VITE_VISION_KEY;

export default function MapSection({ locations, theme }) {
  useEffect(() => {
    const initMap = () => {
      if (!window.google) return;

      const map = new window.google.maps.Map(document.getElementById("heritage-map"), {
        center: { lat: 20.5937, lng: 78.9629 }, // Default India center
        zoom: 5,
        disableDefaultUI: true,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#0B1121" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#94A3B8" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#0B1121", weight: 2 }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#050810" }] },
          { featureType: "road", stylers: [{ visibility: "simplified" }, { color: "#1E293B" }] },
          { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#D4AF37", weight: 0.5 }] }
        ]
      });

      if (locations && locations.length > 0) {
        const geocoder = new window.google.maps.Geocoder();
        const bounds = new window.google.maps.LatLngBounds();
        let validLocations = 0;

        locations.forEach(loc => {
          geocoder.geocode({ address: loc }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const geometry = results[0].geometry;
              const marker = new window.google.maps.Marker({
                position: geometry.location,
                map,
                title: loc,
                icon: { 
                  path: window.google.maps.SymbolPath.CIRCLE, 
                  scale: 12,
                  fillColor: "#FCD34D", 
                  fillOpacity: 0.9, 
                  strokeColor: "#D4AF37", 
                  strokeWeight: 2 
                }
              });

              const info = new window.google.maps.InfoWindow({
                content: `<div style="background:#131A2B;color:#F8F9FA;padding:16px;border-radius:12px;border:1px solid rgba(212,175,55,0.3);font-family:'Inter',sans-serif">
                  <strong style="color:#D4AF37;font-size:15px;font-family:'Cinzel',serif">${loc}</strong>
                  <span style="font-size:12px;color:#94A3B8;margin-top:8px;display:block">Identified from document analysis</span>
                </div>`
              });

              marker.addListener("click", () => info.open(map, marker));

              bounds.extend(geometry.location);
              validLocations++;

              if (validLocations === 1) {
                map.setCenter(geometry.location);
                map.setZoom(8);
                info.open(map, marker);
              } else {
                map.fitBounds(bounds);
              }
            } else {
              console.error(`>>> [GEOCODER ERROR] Failed to find location: '${loc}'. Google Maps Status: ${status}`);
            }
          });
        });
      }
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&callback=initLipisutraMap`;
      script.async = true;
      window.initLipisutraMap = initMap;
      document.head.appendChild(script);
    }
  }, [locations]);

  return (
    <div className="rounded-xl overflow-hidden border shadow-xl" style={{ backgroundColor: theme.headerBg, borderColor: theme.border, boxShadow: theme.cardShadow }}>
      <div className="p-5 border-b flex justify-between items-center" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <div>
          <h2 className="text-lg font-heading mb-1" style={{ color: theme.accent }}>🗺️ Heritage Map</h2>
          <p className="text-xs" style={{ color: theme.subtext }}>
            {locations && locations.length > 0 ? `Displaying ${locations.length} origin sites via AI Auto-Pin.` : "Atlas overview of historical records."}
          </p>
        </div>
      </div>
      <div id="heritage-map" className="w-full h-[400px]" style={{ backgroundColor: theme.bg }} />
    </div>
  );
}