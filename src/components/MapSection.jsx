import { useEffect } from "react";

const GOOGLE_KEY = import.meta.env.VITE_MAPS_KEY;

const SITES = [
  { name: "Sarkar Wada, Nashik", lat: 20.006, lng: 73.779,
    doc: "नाशिक परगणा फर्मान, इ.स. १७८२", desc: "Land grant document — Nashik district administration" },
  { name: "Shaniwar Wada, Pune", lat: 18.519, lng: 73.855,
    doc: "पेशवाई आदेश, बाजीराव द्वितीय", desc: "Administrative order from Peshwa era" },
  { name: "Raigad Fort", lat: 18.234, lng: 73.440,
    doc: "शिवकालीन दस्तऐवज, इ.स. १६७४", desc: "Royal decree — Chhatrapati Shivaji Maharaj era" }
];

export default function MapSection() {
  useEffect(() => {
    if (window.google) return;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&callback=initMap`;
    script.async = true;
    window.initMap = () => {
      const map = new window.google.maps.Map(document.getElementById("heritage-map"), {
        center: { lat: 18.8, lng: 73.9 }, zoom: 7,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#2a1800" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#D4A017" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a1628" }] },
          { featureType: "road", stylers: [{ visibility: "simplified" }] }
        ]
      });
      SITES.forEach(site => {
        const marker = new window.google.maps.Marker({
          position: { lat: site.lat, lng: site.lng }, map, title: site.name,
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 10,
            fillColor: "#D4A017", fillOpacity: 1, strokeColor: "#8B6914", strokeWeight: 2 }
        });
        const info = new window.google.maps.InfoWindow({
          content: `<div style="background:#2a1800;color:#f5e6c8;padding:14px;border-radius:8px;max-width:250px;border:1px solid #8B6914;font-family:Georgia,serif">
            <strong style="color:#D4A017;font-size:14px">${site.name}</strong><br/>
            <em style="font-size:12px;color:#FCD34D">${site.doc}</em><br/>
            <span style="font-size:11px;color:#c9a96e;margin-top:6px;display:block">${site.desc}</span>
          </div>`
        });
        marker.addListener("click", () => info.open(map, marker));
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ color: "#D4A017", marginBottom: 6 }}>🗺️ Heritage Sites Map</h2>
      <p style={{ color: "#c9a96e", fontSize: 12, marginBottom: 12 }}>
        Click any pin to see the decoded document from that location
      </p>
      <div id="heritage-map" style={{ width: "100%", height: 400, borderRadius: 12, border: "1px solid #8B6914" }} />
    </div>
  );
}