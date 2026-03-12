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
      mapStyle="mapbox://styles/mapbox/light-v11"
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
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-brand p-2 shadow-lg ring-2 ring-white">
            <MapPin className="h-5 w-5 text-brand-accent" />
          </div>
          <span className="mt-1 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white shadow">
            Santa Cruz
          </span>
        </div>
      </Marker>

      {/* Business markers */}
      {businesses.map((biz) => {
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
              className="group flex flex-col items-center outline-none"
              aria-label={`Ver ${biz.name}`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full shadow-md transition-transform group-hover:scale-110 group-active:scale-95 ${
                  biz.isFeatured
                    ? "ring-2 ring-brand-accent ring-offset-2"
                    : ""
                }`}
                style={{ backgroundColor: meta.color }}
              >
                <span className="text-lg">{meta.emoji}</span>
              </div>
              {biz.promotion && (
                <span className="mt-0.5 rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-bold text-brand shadow-sm">
                  PROMO
                </span>
              )}
            </button>
          </Marker>
        );
      })}
    </MapGL>
  );
}
