"use client"

import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Custom icon using SVG
const customIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF0000" width="24" height="24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
})

const pollutedAreas = [
  { id: 1, name: "River A", lat: 3.139, lng: 101.6869, severity: "High" },
  { id: 2, name: "Lake B", lat: 3.1195, lng: 101.674, severity: "Medium" },
  { id: 3, name: "Stream C", lat: 3.1421, lng: 101.7041, severity: "Low" },
]

export function PollutionMap() {
  const [activeArea, setActiveArea] = useState(null)

  return (
    <MapContainer center={[3.139, 101.6869]} zoom={12} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {pollutedAreas.map((area) => (
        <Marker
          key={area.id}
          position={[area.lat, area.lng]}
          icon={customIcon}
          eventHandlers={{
            click: () => {
            //   setActiveArea(area)
            },
          }}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{area.name}</h3>
              <p>Pollution Severity: {area.severity}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

