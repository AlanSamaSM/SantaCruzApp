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
      <NavigationControl position="top-right" showCompass={false} />
      <GeolocateControl
        position="top-right"
        trackUserLocation
        showUserHeading
      />

      {/* Santa Cruz home pin */}
      <Marker
        latitude={SANTA_CRUZ_COORDS.lat}
        longitude={SANTA_CRUZ_COORDS.lng}
        anchor="bottom"
      >
        <div className="flex flex-col items-center animate-marker-pop">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand shadow-lg ring-2 ring-brand-accent">
            <span className="text-base text-brand-accent font-bold">SC</span>
          </div>
          <div className="h-2 w-0.5 bg-brand" />
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
                duration: 600,
              });
            }}
          >
            <button
              className="group flex flex-col items-center outline-none animate-marker-pop"
              style={{ animationDelay: `${i * 40}ms` }}
              aria-label={`Ver ${biz.name}`}
            >
              <div className="relative">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-md transition-transform duration-150 group-hover:scale-110 group-active:scale-95 ${
                    biz.isFeatured
                      ? "bg-brand-accent ring-1 ring-brand-accent/50"
                      : "bg-brand ring-1 ring-brand/30"
                  }`}
                >
                  <span className="text-lg">{meta.emoji}</span>
                </div>
                {biz.promotion && (
                  <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-brand-accent ring-2 ring-white" />
                )}
              </div>
              <div className="mt-0.5 h-1.5 w-0.5 rounded-full bg-brand/40" />
            </button>
          </Marker>
        );
      })}
    </MapGL>
  );
}
