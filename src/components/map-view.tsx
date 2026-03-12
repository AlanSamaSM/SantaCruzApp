"use client";

import { useRef, useCallback, useState } from "react";
import MapGL, {
  Marker,
  NavigationControl,
  GeolocateControl,
  type MapRef,
  type ViewStateChangeEvent,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { SANTA_CRUZ_COORDS, MAP_DEFAULT_ZOOM } from "@/lib/constants";
import { CATEGORY_META, type BusinessWithPromotion } from "@/lib/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface MapViewProps {
  businesses: BusinessWithPromotion[];
  onSelectBusiness: (business: BusinessWithPromotion) => void;
}

export function MapView({ businesses, onSelectBusiness }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

  const [viewState, setViewState] = useState({
    latitude: SANTA_CRUZ_COORDS.lat as number,
    longitude: SANTA_CRUZ_COORDS.lng as number,
    zoom: MAP_DEFAULT_ZOOM,
  });

  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

  return (
    <MapGL
      ref={mapRef}
      {...viewState}
      onMove={handleMove}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: "100%", height: "100%" }}
      maxZoom={18}
      minZoom={12}
      attributionControl={false}
    >
      {/* Navigation controls */}
      <NavigationControl position="top-right" showCompass={false} />
      <GeolocateControl
        position="top-right"
        trackUserLocation
        showUserHeading
      />

      {/* Santa Cruz Suites marker — home base */}
      <Marker
        latitude={SANTA_CRUZ_COORDS.lat}
        longitude={SANTA_CRUZ_COORDS.lng}
        anchor="bottom"
      >
        <div className="flex flex-col items-center animate-marker-drop">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-brand-accent/40 animate-pulse-ring" />
            <div className="relative rounded-full bg-gradient-to-br from-brand to-brand/80 p-2.5 shadow-xl ring-3 ring-white">
              <MapPin className="h-6 w-6 text-brand-accent" />
            </div>
          </div>
          <span className="mt-1.5 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow-lg">
            Santa Cruz
          </span>
        </div>
      </Marker>

      {/* Business markers */}
      {businesses.map((biz, i) => {
        const meta = CATEGORY_META[biz.category];
        return (
          <Marker
            key={biz.id}
            latitude={biz.lat}
            longitude={biz.lng}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onSelectBusiness(biz);
              mapRef.current?.flyTo({
                center: [biz.lng, biz.lat],
                zoom: 16.5,
                duration: 800,
              });
            }}
          >
            <button
              className="group flex flex-col items-center outline-none animate-marker-drop"
              style={{ animationDelay: `${i * 60}ms` }}
              aria-label={`Ver ${biz.name}`}
            >
              {/* Colored glow behind marker */}
              <div className="relative">
                <div
                  className="absolute -inset-1 rounded-full opacity-30 blur-sm transition-opacity group-hover:opacity-50"
                  style={{ backgroundColor: meta.color }}
                />
                <div
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-115 group-active:scale-95 ${
                    biz.isFeatured
                      ? "ring-2 ring-brand-accent ring-offset-2"
                      : "ring-2 ring-white/80"
                  }`}
                  style={{ backgroundColor: meta.color }}
                >
                  <span className="text-xl drop-shadow-sm">{meta.emoji}</span>
                </div>
              </div>
              {biz.promotion && (
                <span className="mt-1 rounded-full bg-gradient-to-r from-brand-accent to-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-brand shadow-md animate-bounce-subtle">
                  ✨ PROMO
                </span>
              )}
            </button>
          </Marker>
        );
      })}
    </MapGL>
  );
}
