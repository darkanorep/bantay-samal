import { useEffect, useMemo, useRef } from "react";

import { Box } from "@mui/material";

import {
  GeoJSON,
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import type { Feature, FeatureCollection, Geometry } from "geojson";

import "leaflet/dist/leaflet.css";

import samalBarangaysRaw from "../../data/samal-barangays.json";
import crimesData from "../../data/crimes.json";
import estimatedData from "../../data/crime-year-barangay.json";

import { getCrimeColor } from "../../utils/crimeColors";

/* =========================================
   TYPES
========================================= */

type BarangayProperties = {
  id: string;
  name: string;
  psgcCode?: string;
  sourceName?: string;
};

type BarangayFeature = Feature<Geometry, BarangayProperties>;

type BarangayCollection = FeatureCollection<Geometry, BarangayProperties>;

type SamalMapProps = {
  selectedBarangayId: string;
  selectedCrimeId: string;
  selectedYear: string;

  onBarangayChange: (barangayId: string) => void;
};

type BarangayCounts = Record<string, number>;

type YearAllocations = Record<string, BarangayCounts>;

type CrimeAllocations = Record<string, YearAllocations>;

type CrimeMarker = {
  id: string;
  name: string;
  position: L.LatLng;
};

const samalBarangays = samalBarangaysRaw as BarangayCollection;

const allocations = estimatedData.allocations as CrimeAllocations;

/* =========================================
   MAP BOUNDS CONTROLLER
========================================= */

function MapBoundsController({
  selectedBarangayId,
}: {
  selectedBarangayId: string;
}) {
  const map = useMap();

  useEffect(() => {
    /* =====================================
       ALL BARANGAYS
    ===================================== */

    if (selectedBarangayId === "all") {
      const municipalityLayer = L.geoJSON(
        samalBarangays as GeoJSON.GeoJsonObject,
      );

      const bounds = municipalityLayer.getBounds();

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [35, 35],
        });
      }

      return;
    }

    /* =====================================
       SELECTED BARANGAY
    ===================================== */

    const selectedFeature = samalBarangays.features.find(
      (feature) => feature.properties.id === selectedBarangayId,
    );

    if (!selectedFeature) {
      return;
    }

    const selectedLayer = L.geoJSON(selectedFeature as GeoJSON.GeoJsonObject);

    const bounds = selectedLayer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [70, 70],
        maxZoom: 16,
      });
    }
  }, [map, selectedBarangayId]);

  return null;
}

/* =========================================
   BARANGAY CRIME PINS

   IMPORTANT:
   Pins are barangay reference locations.
   They are NOT exact incident coordinates.
========================================= */

type BarangayCrimePinsProps = {
  selectedCrimeId: string;
  selectedBarangayId: string;

  barangayCounts: BarangayCounts;

  crimeLabel: string;
  periodLabel: string;

  isEstimated: boolean;

  onBarangayChange: (barangayId: string) => void;
};

function BarangayCrimePins({
  selectedCrimeId,
  selectedBarangayId,
  barangayCounts,
  crimeLabel,
  periodLabel,
  isEstimated,
  onBarangayChange,
}: BarangayCrimePinsProps) {
  /* =====================================
     BARANGAY REFERENCE POINTS
  ===================================== */

  const markers = useMemo<CrimeMarker[]>(() => {
    const result: CrimeMarker[] = [];

    samalBarangays.features.forEach((feature) => {
      try {
        const layer = L.geoJSON(feature as GeoJSON.GeoJsonObject);

        const bounds = layer.getBounds();

        if (!bounds.isValid()) {
          return;
        }

        result.push({
          id: feature.properties.id,

          name: feature.properties.name,

          position: bounds.getCenter(),
        });
      } catch {
        // Ignore malformed geometry.
      }
    });

    return result;
  }, []);

  /* =====================================
     ALL CRIMES = NO PINS
  ===================================== */

  if (selectedCrimeId === "all") {
    return null;
  }

  /* =====================================
     CRIME COLOR
  ===================================== */

  const crimeColor = getCrimeColor(selectedCrimeId);

  /* =====================================
     ONLY BARANGAYS WITH CASES
  ===================================== */

  const visibleMarkers = markers.filter((marker) => {
    const count = Number(barangayCounts[marker.id] ?? 0);

    return count > 0;
  });

  return (
    <>
      {visibleMarkers.map((marker, index) => {
        const count = Number(barangayCounts[marker.id] ?? 0);

        const isSelected = marker.id === selectedBarangayId;

        /* =============================
             CUSTOM LEAFLET PIN
          ============================= */

        const markerIcon = L.divIcon({
          className: "samal-crime-marker",

          html: `
                <div
                  class="samal-crime-pin-wrapper"
                  style="
                    animation-delay:
                    ${index * 55}ms;
                  "
                >
                  <div
                    class="samal-crime-pin"
                    style="
                      background-color:
                      ${crimeColor};

                      ${
                        isSelected
                          ? `
                              box-shadow:
                                0 0 0 3px #FACC15,
                                0 7px 16px rgba(0,0,0,0.35);
                            `
                          : ""
                      }
                    "
                  >
                    <div
                      class="samal-crime-pin-center"
                    ></div>
                  </div>

                  <div
                    class="samal-crime-pin-shadow"
                  ></div>
                </div>
              `,

          iconSize: [38, 46],

          iconAnchor: [19, 42],

          tooltipAnchor: [0, -38],
        });

        return (
          <Marker
            key={`${selectedCrimeId}-${marker.id}-${periodLabel}`}
            position={marker.position}
            icon={markerIcon}
            zIndexOffset={isSelected ? 1000 : 500}
            eventHandlers={{
              click: () => {
                onBarangayChange(marker.id);
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={0.98}>
              <div
                style={{
                  minWidth: "180px",

                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",

                    fontWeight: 800,

                    lineHeight: 1.25,

                    color: "#0F3D56",

                    marginBottom: "4px",
                  }}
                >
                  {marker.name}
                </div>

                <div
                  style={{
                    fontSize: "11px",

                    lineHeight: 1.4,

                    color: "#60747D",

                    marginBottom: "5px",
                  }}
                >
                  {crimeLabel}
                </div>

                <div
                  style={{
                    fontSize: "18px",

                    lineHeight: 1.2,

                    fontWeight: 800,

                    color: crimeColor,
                  }}
                >
                  {count} {count === 1 ? "case" : "cases"}
                </div>

                <div
                  style={{
                    marginTop: "6px",

                    fontSize: "11px",

                    lineHeight: 1.4,

                    fontWeight: 700,

                    color: isEstimated ? "#B45309" : "#0F766E",
                  }}
                >
                  {isEstimated ? "Estimated allocation" : "Reported"}
                  {" • "}
                  {periodLabel}
                </div>

                <div
                  style={{
                    marginTop: "7px",

                    paddingTop: "7px",

                    borderTop: "1px solid #E2E8F0",

                    fontSize: "10px",

                    lineHeight: 1.35,

                    color: "#64748B",
                  }}
                >
                  Barangay reference location — not an exact incident location.
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}

/* =========================================
   MAP
========================================= */

export default function SamalMap({
  selectedBarangayId,
  selectedCrimeId,
  selectedYear,
  onBarangayChange,
}: SamalMapProps) {
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  /* =========================================
     SELECTED CRIME
  ========================================= */

  const selectedCrime = useMemo(() => {
    if (selectedCrimeId === "all") {
      return null;
    }

    return (
      crimesData.crimes.find((crime) => crime.id === selectedCrimeId) ?? null
    );
  }, [selectedCrimeId]);

  /* =========================================
     DATA MODE
  ========================================= */

  const isEstimated = selectedYear !== "all";

  /* =========================================
     LABELS
  ========================================= */

  const crimeLabel = selectedCrime?.name ?? "All Crimes";

  const periodLabel = selectedYear === "all" ? "2024–2026" : selectedYear;

  /* =========================================
     ACTIVE CRIME COLOR

     Same color used by:
     - Crime pins
     - Polygon fills
     - Analytics graphs
  ========================================= */

  const activeCrimeColor = getCrimeColor(selectedCrimeId);

  /* =========================================
     BARANGAY COUNTS
  ========================================= */

  const barangayCounts = useMemo<BarangayCounts>(() => {
    const result: BarangayCounts = {};

    /* ===================================
           REPORTED MODE
        =================================== */

    if (selectedYear === "all") {
      /* ALL CRIMES */

      if (selectedCrimeId === "all") {
        Object.entries(crimesData.barangayTotals).forEach(
          ([barangayId, count]) => {
            result[barangayId] = Number(count);
          },
        );

        return result;
      }

      /* SPECIFIC CRIME */

      if (selectedCrime) {
        Object.entries(selectedCrime.barangays).forEach(
          ([barangayId, count]) => {
            result[barangayId] = Number(count);
          },
        );
      }

      return result;
    }

    /* ===================================
           ESTIMATED MODE
        =================================== */

    samalBarangays.features.forEach((feature) => {
      result[feature.properties.id] = 0;
    });

    /* SPECIFIC CRIME + YEAR */

    if (selectedCrimeId !== "all") {
      const crimeAllocation = allocations[selectedCrimeId];

      const yearAllocation = crimeAllocation?.[selectedYear];

      if (!yearAllocation) {
        return result;
      }

      Object.entries(yearAllocation).forEach(([barangayId, count]) => {
        result[barangayId] = Number(count);
      });

      return result;
    }

    /* ALL CRIMES + YEAR */

    Object.values(allocations).forEach((crimeAllocation) => {
      const yearAllocation = crimeAllocation[selectedYear];

      if (!yearAllocation) {
        return;
      }

      Object.entries(yearAllocation).forEach(([barangayId, count]) => {
        result[barangayId] = (result[barangayId] ?? 0) + Number(count);
      });
    });

    return result;
  }, [selectedYear, selectedCrimeId, selectedCrime]);

  /* =========================================
     MAXIMUM COUNT
  ========================================= */

  const maximumCount = useMemo(() => {
    const values = Object.values(barangayCounts);

    return Math.max(...values, 1);
  }, [barangayCounts]);

  /* =========================================
     GET BARANGAY COUNT
  ========================================= */

  const getBarangayCount = (barangayId: string) => {
    return barangayCounts[barangayId] ?? 0;
  };

  /* =========================================
     GET INTENSITY
  ========================================= */

  const getIntensity = (count: number) => {
    if (count <= 0) {
      return 0;
    }

    return count / maximumCount;
  };

  /* =========================================
     GET FILL COLOR

     ALL CRIMES:
     Original teal choropleth.

     SPECIFIC CRIME:
     Selected crime color.
  ========================================= */

  const getFillColor = (count: number) => {
    /* NO CASES */

    if (count === 0) {
      return "#CBD5E1";
    }

    /* =====================================
       ALL CRIMES
    ===================================== */

    if (selectedCrimeId === "all") {
      const intensity = getIntensity(count);

      if (intensity <= 0.25) {
        return "#99F6E4";
      }

      if (intensity <= 0.5) {
        return "#2DD4BF";
      }

      if (intensity <= 0.75) {
        return "#0F766E";
      }

      return "#134E4A";
    }

    /* =====================================
       SPECIFIC CRIME

       The selected crime color is used
       for every barangay with cases.

       Relative intensity is represented
       by polygon opacity.
    ===================================== */

    return activeCrimeColor;
  };

  /* =========================================
     GET FILL OPACITY

     SPECIFIC CRIME:
     Low       = 30%
     Moderate  = 48%
     High      = 68%
     Very High = 88%
  ========================================= */

  const getFillOpacity = (count: number, isSelected: boolean) => {
    /* =====================================
       NO CASES
    ===================================== */

    if (count === 0) {
      return isSelected ? 0.75 : 0.5;
    }

    /* =====================================
       ALL CRIMES

       Keep original teal choropleth
       appearance.
    ===================================== */

    if (selectedCrimeId === "all") {
      return isSelected ? 0.95 : 0.82;
    }

    /* =====================================
       SPECIFIC CRIME
    ===================================== */

    const intensity = getIntensity(count);

    let opacity = 0.3;

    /* LOW */

    if (intensity <= 0.25) {
      opacity = 0.3;
    } else if (intensity <= 0.5) {

    /* MODERATE */
      opacity = 0.48;
    } else if (intensity <= 0.75) {

    /* HIGH */
      opacity = 0.68;
    } else {

    /* VERY HIGH */
      opacity = 0.88;
    }

    /* =====================================
       SELECTED BARANGAY

       Slightly strengthen selected polygon.
    ===================================== */

    if (isSelected) {
      return Math.min(opacity + 0.1, 0.98);
    }

    return opacity;
  };

  /* =========================================
     UPDATE LEAFLET STYLES
  ========================================= */

  useEffect(() => {
    const geoJsonLayer = geoJsonRef.current;

    if (!geoJsonLayer) {
      return;
    }

    geoJsonLayer.eachLayer((layer) => {
      const featureLayer = layer as L.Path & {
        feature?: BarangayFeature;
      };

      const feature = featureLayer.feature;

      if (!feature) {
        return;
      }

      const barangayId = feature.properties.id;

      const count = getBarangayCount(barangayId);

      const isSelected = barangayId === selectedBarangayId;

      featureLayer.setStyle({
        color: isSelected ? "#FACC15" : "#FFFFFF",

        weight: isSelected ? 4.5 : 2.5,

        opacity: 1,

        fillColor: getFillColor(count),

        fillOpacity: getFillOpacity(count, isSelected),
      });

      if (isSelected) {
        featureLayer.bringToFront();
      }
    });
  }, [
    selectedBarangayId,
    selectedCrimeId,
    barangayCounts,
    maximumCount,
    activeCrimeColor,
  ]);

  /* =========================================
     MAP UI
  ========================================= */

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",

        minHeight: 0,

        position: "relative",

        overflow: "hidden",

        /* =====================================
           LEAFLET MAP
        ===================================== */

        "& .leaflet-container": {
          width: "100%",
          height: "100%",

          fontFamily: "inherit",

          backgroundColor: "#0b1820",
        },

        "& .leaflet-interactive": {
          cursor: "pointer",
        },

        /* =====================================
           TOOLTIPS
        ===================================== */

        "& .leaflet-tooltip": {
          border: "none",

          borderRadius: "10px",

          boxShadow: "0 6px 20px rgba(0,0,0,0.24)",

          padding: 0,
        },

        /* =====================================
           LEAFLET LAYER CONTROL
        ===================================== */

        "& .leaflet-control-layers": {
          border: "none",

          borderRadius: "12px",

          boxShadow: "0 4px 14px rgba(15,61,86,0.18)",

          overflow: "hidden",
        },

        "& .leaflet-control-layers-toggle": {
          width: "38px",

          height: "38px",

          backgroundSize: "20px 20px",
        },

        "& .leaflet-control-layers-expanded": {
          padding: "10px 12px",

          color: "#172B35",

          fontSize: "12px",

          fontWeight: 600,

          backgroundColor: "rgba(255,255,255,0.96)",
        },

        /* =====================================
           CRIME PIN
        ===================================== */

        "& .samal-crime-marker": {
          background: "transparent",

          border: "none",
        },

        "& .samal-crime-pin-wrapper": {
          position: "relative",

          width: 38,

          height: 46,

          transformOrigin: "center bottom",

          animation: "samalPinDrop 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        },

        "& .samal-crime-pin": {
          position: "absolute",

          top: 0,

          left: 5,

          width: 28,

          height: 28,

          borderRadius: "50% 50% 50% 0",

          transform: "rotate(-45deg)",

          border: "2px solid #FFFFFF",

          boxShadow: "0 7px 16px rgba(0,0,0,0.30)",

          display: "grid",

          placeItems: "center",

          transition: "transform 160ms ease, box-shadow 160ms ease",
        },

        "& .samal-crime-pin-center": {
          width: 8,

          height: 8,

          borderRadius: "50%",

          backgroundColor: "#FFFFFF",

          transform: "rotate(45deg)",

          boxShadow: "0 1px 3px rgba(0,0,0,0.20)",
        },

        "& .samal-crime-pin-shadow": {
          position: "absolute",

          left: 10,

          bottom: 0,

          width: 18,

          height: 6,

          borderRadius: "50%",

          backgroundColor: "rgba(0,0,0,0.30)",

          filter: "blur(1px)",

          animation: "samalPinShadow 0.55s ease-out both",
        },

        "& .samal-crime-marker:hover .samal-crime-pin": {
          transform: "rotate(-45deg) scale(1.12)",
        },

        "@keyframes samalPinDrop": {
          "0%": {
            opacity: 0,

            transform: "translateY(-28px) scale(0.8)",
          },

          "65%": {
            opacity: 1,

            transform: "translateY(3px) scale(1.05)",
          },

          "100%": {
            opacity: 1,

            transform: "translateY(0) scale(1)",
          },
        },

        "@keyframes samalPinShadow": {
          "0%": {
            opacity: 0,

            transform: "scale(0.45)",
          },

          "100%": {
            opacity: 1,

            transform: "scale(1)",
          },
        },

        /* =====================================
           MOBILE
        ===================================== */

        "@media (max-width: 600px)": {
          "& .leaflet-control-zoom a": {
            width: "32px",

            height: "32px",

            lineHeight: "32px",

            fontSize: "18px",
          },

          "& .leaflet-control-layers-expanded": {
            padding: "8px 10px",

            fontSize: "11px",
          },
        },
      }}
    >
      {/* =================================
          LEAFLET MAP
      ================================= */}

      <MapContainer
        center={[14.76, 120.54]}
        zoom={13}
        minZoom={11}
        maxZoom={19}
        scrollWheelZoom
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {/* =================================
            BASE MAP OPTIONS
        ================================= */}

        <LayersControl position="topright" collapsed={false}>
          {/* SATELLITE */}

          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              attribution="Sources: Esri and imagery providers"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          {/* STREET MAP */}

          <LayersControl.BaseLayer name="Street Map">
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* =================================
            PLACE LABELS
        ================================= */}

        <TileLayer
          attribution="Esri"
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
          opacity={0.9}
        />

        {/* =================================
            MAP BOUNDS
        ================================= */}

        <MapBoundsController selectedBarangayId={selectedBarangayId} />

        {/* =================================
            BARANGAY CHOROPLETH
        ================================= */}

        <GeoJSON
          key={`${selectedCrimeId}-${selectedYear}`}
          ref={geoJsonRef}
          data={samalBarangays as GeoJSON.GeoJsonObject}
          style={(feature) => {
            const barangay = feature as BarangayFeature;

            const id = barangay.properties.id;

            const count = getBarangayCount(id);

            const isSelected = id === selectedBarangayId;

            return {
              color: isSelected ? "#FACC15" : "#FFFFFF",

              weight: isSelected ? 4.5 : 2.5,

              opacity: 1,

              fillColor: getFillColor(count),

              fillOpacity: getFillOpacity(count, isSelected),
            };
          }}
          onEachFeature={(feature, layer) => {
            const barangay = feature as BarangayFeature;

            const { id, name } = barangay.properties;

            const count = getBarangayCount(id);

            const intensity = getIntensity(count);

            const intensityLabel =
              count === 0
                ? "No cases"
                : intensity <= 0.25
                  ? "Low"
                  : intensity <= 0.5
                    ? "Moderate"
                    : intensity <= 0.75
                      ? "High"
                      : "Very High";

            const dataLabel = isEstimated ? "Estimated allocation" : "Reported";

            /* =============================
               TOOLTIP
            ============================= */

            layer.bindTooltip(
              `
                <div style="
                  min-width: 200px;
                  padding: 12px 14px;
                ">

                  <div style="
                    font-size: 15px;
                    font-weight: 800;
                    color: #0F3D56;
                    margin-bottom: 6px;
                  ">
                    ${name}
                  </div>

                  <div style="
                    font-size: 12px;
                    color: #60747D;
                    margin-bottom: 5px;
                  ">
                    ${crimeLabel}
                  </div>

                  <div style="
                    font-size: 20px;
                    line-height: 1.2;
                    font-weight: 800;
                    color: #172B35;
                  ">
                    ${count}
                    ${count === 1 ? "case" : "cases"}
                  </div>

                  <div style="
                    margin-top: 6px;
                    font-size: 11px;
                    font-weight: 800;
                    color: ${count === 0 ? "#64748B" : getFillColor(count)};
                  ">
                    ${intensityLabel}
                    intensity
                  </div>

                  <div style="
                    margin-top: 7px;
                    font-size: 11px;
                    font-weight: 700;
                    color: ${isEstimated ? "#B45309" : "#0F766E"};
                  ">
                    ${dataLabel} •
                    ${periodLabel}
                  </div>

                </div>
              `,
              {
                sticky: true,
                direction: "top",
                opacity: 0.98,
              },
            );

            /* =============================
               CLICK
            ============================= */

            layer.on("click", () => {
              onBarangayChange(id);
            });

            /* =============================
               HOVER

               IMPORTANT:
               Hover changes ONLY the
               polygon outline.

               fillColor and fillOpacity
               are intentionally untouched.
            ============================= */

            layer.on("mouseover", (event) => {
              const target = event.target as L.Path;

              const isSelected = id === selectedBarangayId;

              target.setStyle({
                color: "#FACC15",

                weight: isSelected ? 4.5 : 3.5,
              });

              target.bringToFront();
            });

            /* =============================
               MOUSE OUT

               Restore the normal polygon
               border and original fill.
            ============================= */

            layer.on("mouseout", (event) => {
              const target = event.target as L.Path;

              const isSelected = id === selectedBarangayId;

              target.setStyle({
                color: isSelected ? "#FACC15" : "#FFFFFF",

                weight: isSelected ? 4.5 : 2.5,

                opacity: 1,

                fillColor: getFillColor(count),

                fillOpacity: getFillOpacity(count, isSelected),
              });

              if (isSelected) {
                target.bringToFront();
              }
            });
          }}
        />

        {/* =================================
            CRIME PINS
        ================================= */}

        <BarangayCrimePins
          selectedCrimeId={selectedCrimeId}
          selectedBarangayId={selectedBarangayId}
          barangayCounts={barangayCounts}
          crimeLabel={crimeLabel}
          periodLabel={periodLabel}
          isEstimated={isEstimated}
          onBarangayChange={onBarangayChange}
        />
      </MapContainer>
    </Box>
  );
}
