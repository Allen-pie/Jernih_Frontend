"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CSSProperties } from "react";

// --- 1) Types
type Severity = "Low" | "Medium" | "High";

interface Area {
  id: number;
  name: string;
  lat: number;
  lng: number;
  severity: Severity;
}

// --- 2) Data
const pollutedAreas: Area[] = [
  { id: 1, name: "River A", lat: 3.139, lng: 101.6869, severity: "High" },
  { id: 2, name: "Lake B", lat: 3.1195, lng: 101.674, severity: "Medium" },
  { id: 3, name: "Stream C", lat: 3.1421, lng: 101.7041, severity: "Low" },
];

// weight by severity → controls heat intensity
const severityWeights: Record<Severity, number> = {
  Low: 0.3,
  Medium: 0.6,
  High: 1.0,
};

// --- 3) Custom SVG Icon for markers
// 🎯 Create colored SVG icons based on severity
function getSeverityIcon(severity: Severity) {
  const colorMap: Record<Severity, string> = {
    Low: "#00cc66", // green
    Medium: "#ffcc00", // yellow
    High: "#ff3333", // red
  };

  return L.divIcon({
    html: `
      <div style="
        background-color: ${colorMap[severity]};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: black;
        font-weight: bold;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.4);
      ">
        ${severity === "Low" ? "L" : severity === "Medium" ? "M" : "H"}
      </div>
    `,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16], // center it
  });
}

// optional map container style
const mapStyle: CSSProperties = {
  width: "100%",
  height: "100%",
};

export function PollutionMap(): JSX.Element {
  // prepare heatmap points: [lat, lng, intensity]
  const heatmapPoints = pollutedAreas.map(
    (area) =>
      [area.lat, area.lng, severityWeights[area.severity]] as [
        number,
        number,
        number
      ]
  );

  return (
    <MapContainer center={[3.139, 101.6869]} zoom={12} style={mapStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* ─── Heatmap ───────────────────────────────────── */}
      <HeatmapLayer
        fitBoundsOnLoad
        fitBoundsOnUpdate
        points={heatmapPoints}
        longitudeExtractor={(pt) => pt[1]}
        latitudeExtractor={(pt) => pt[0]}
        intensityExtractor={(pt) => pt[2]}
        max={1.0}
        radius={25}
        blur={20}
      />

      {/* ─── Markers on top ─────────────────────────────── */}
      {pollutedAreas.map((area) => (
        <Marker
          key={area.id}
          position={[area.lat, area.lng]}
          icon={getSeverityIcon(area.severity)} // 🔥 Severity-based icon
        >
          <Popup>
            <h3 className="font-bold">{area.name}</h3>
            <p>Pollution Severity: {area.severity}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
