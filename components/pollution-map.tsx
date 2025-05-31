"use client";
import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { CSSProperties, JSX } from "react";
import { supabase } from '@/utils/supabase/client'

// --- 1) Types
export type Severity = "Low" | "Medium" | "High";
interface Area {
  id: string;
  lat: number;
  lng: number;
  severity: Severity;
}

// weight by severity → controls heat intensity
const severityWeights: Record<Severity, number> = {
  Low: 0.3,
  Medium: 0.6,
  High: 1.0,
};

const userIcon = L.divIcon({
  html: `<div style="
    width: 12px;
    height: 12px;
    background: #4285F4;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0,0,0,0.25);
  "></div>`,
  className: "", // no extra wrapper class
  iconSize: [16, 16], // container size
  iconAnchor: [8, 8], // center it
});

// --- 2) Custom SVG Icon for markers
function getSeverityIcon(severity: Severity) {
  const colorMap: Record<Severity, string> = {
    Low: "#00cc66",
    Medium: "#ffcc00",
    High: "#ff3333",
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
    iconAnchor: [16, 16],
  });
}

// Location button component
function LocationButton({ onClick }: { onClick: () => void }) {
  const map = useMap();

  useEffect(() => {
    const locationButton = L.control({ position: "bottomright" });

    locationButton.onAdd = () => {
      const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
      div.innerHTML = `
        <button 
          type="button"
          title="Show my location" 
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: white;
            border: none;
            border-radius: 4px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.4);
            cursor: pointer;
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      `;

      div.onclick = (e) => {
        e.preventDefault();
        onClick();
        return false;
      };

      return div;
    };

    locationButton.addTo(map);

    return () => {
      map.removeControl(locationButton);
    };


  }, [map, onClick]);

  return null;
}

// User location component using React Leaflet
function UserLocation() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [accuracy, setAccuracy] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState(true);
  const map = useMap();
  const watchIdRef = useRef<number | null>(null);

  // Handle map events
  useMapEvents({
    dragstart: () => setIsFollowing(false),
    zoomstart: () => setIsFollowing(false),
  });

  // Center map on user location
  const centerOnUser = () => {
    if (position) {
      map.flyTo([position.lat, position.lng], 16, {
        animate: true,
        duration: 1,
      });
      setIsFollowing(true);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported");
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (location) => {
        const newPos = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        setPosition(newPos);
        setAccuracy(location.coords.accuracy || 0);

        // Center map on first location
        map.flyTo([newPos.lat, newPos.lng], 16);
      },
      (error) => {
        console.error("Error getting location:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );

    // Watch position changes
    watchIdRef.current = navigator.geolocation.watchPosition(
      (location) => {
        const newPos = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        setPosition(newPos);
        setAccuracy(location.coords.accuracy || 0);

        // Only follow if in following mode
        if (isFollowing) {
          map.panTo([newPos.lat, newPos.lng]);
        }
      },
      (error) => {
        console.error("Error watching location:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [map, isFollowing]);

  if (!position) return null;

  return position === null ? null : (
    <Marker position={[position.lat, position.lng]} icon={userIcon}>
      <Popup>
        <strong>Your Location</strong>
        <br />
        Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
        <br />
        {accuracy ? <>Accuracy: &plusmn;{Math.round(accuracy)} m</> : null}
      </Popup>
      {/* Location button */}
      <LocationButton onClick={centerOnUser} />
    </Marker>
  );
}

// fill the full viewport
const mapStyle: CSSProperties = {
  width: "100%",
  height: "100%",
};

export function PollutionMap(): JSX.Element {
  const [areas, setAreas] = useState<Area[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPredictions() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("water_quality_predictions")
          .select("id, latitude, longitude, severity");

        if (error) throw error;

        if (data) {
          setAreas(
            data.map((row) => ({
              id: row.id,
              lat: row.latitude,
              lng: row.longitude,
              severity: row.severity as Severity,
            }))
          );
        }
      } catch (error) {
        console.error("Supabase fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPredictions();
  }, []);

  // build heatmap points [lat, lng, intensity]
  const heatmapPoints = areas.map(
    (area) =>
      [area.lat, area.lng, severityWeights[area.severity]] as [
        number,
        number,
        number
      ]
  );

  // Default center position (fallback if geolocation fails)
  const defaultCenter: [number, number] = [3.139, 101.6869]; // Malaysia

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading map data...</p>
          </div>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={6}
        style={mapStyle}
        scrollWheelZoom={true}
        worldCopyJump={true}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <HeatmapLayer
          points={heatmapPoints}
          longitudeExtractor={(pt) => pt[1]}
          latitudeExtractor={(pt) => pt[0]}
          intensityExtractor={(pt) => pt[2]}
          max={1.0}
          radius={25}
          blur={20}
        />

        {areas.map((area : Area) => {
          if (area.lat && area.lng)return (
             <Marker
            key={area.id}
            position={[area.lat, area.lng]}
            icon={getSeverityIcon(area.severity)}
          >
            <Popup>
              <strong>Prediction ID:</strong> {area.id}
              <br />
              <strong>Severity:</strong> {area.severity}
            </Popup>
          </Marker>
          )
        } )}

        {/* User location component */}
        <UserLocation />
      </MapContainer>
    </div>
  );
}
