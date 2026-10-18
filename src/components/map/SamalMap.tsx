
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

/*
=========================================================
BANTAY SAMAL — INTERACTIVE CRIME MAP
=========================================================

This component:
1. Displays barangay boundaries.
2. Shows recorded and estimated crime counts.
3. Supports crime, year, and barangay filters.
4. Uses high-contrast polygon colors.
5. Displays barangay reference pins.
6. Supports satellite and street map layers.

IMPORTANT:
- Polygon colors represent relative case counts.
- Pins are barangay references, not incident locations.
- Year-specific barangay allocations are labeled estimated.
=========================================================
*/

type BarangayProperties = {
  id: string;
  name: string;
  psgcCode?: string;
  sourceName?: string;
};

type BarangayFeature = Feature<Geometry, BarangayProperties>;

type BarangayCollection = FeatureCollection<
  Geometry,
  BarangayProperties
>;

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

const samalBarangays =
  samalBarangaysRaw as BarangayCollection;

const allocations =
  estimatedData.allocations as CrimeAllocations;

/*
=========================================================
1. MAP BOUNDS CONTROLLER
=========================================================

Automatically adjusts the map view.

"all":
  Fits the complete municipality.

Specific barangay:
  Zooms to that barangay's geographic boundary.
=========================================================
*/

function MapBoundsController({
  selectedBarangayId,
}: {
  selectedBarangayId: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedBarangayId === "all") {
      const municipalityLayer = L.geoJSON(
        samalBarangays as GeoJSON.GeoJsonObject
      );

      const bounds = municipalityLayer.getBounds();

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [35, 35],
        });
      }

      return;
    }

    const selectedFeature = samalBarangays.features.find(
      (feature) =>
        feature.properties.id === selectedBarangayId
    );

    if (!selectedFeature) return;

    const selectedLayer = L.geoJSON(
      selectedFeature as GeoJSON.GeoJsonObject
    );

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

/*
=========================================================
2. CRIME REFERENCE PINS
=========================================================

Pins are displayed only when:
- A specific crime is selected.
- The barangay has at least one displayed case.

The marker position is the center of the
barangay's bounding rectangle.

It is NOT an exact crime incident location.
=========================================================
*/

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
  const markers = useMemo<CrimeMarker[]>(() => {
    const result: CrimeMarker[] = [];

    samalBarangays.features.forEach((feature) => {
      try {
        const layer = L.geoJSON(
          feature as GeoJSON.GeoJsonObject
        );

        const bounds = layer.getBounds();

        if (!bounds.isValid()) return;

        result.push({
          id: feature.properties.id,
          name: feature.properties.name,
          position: bounds.getCenter(),
        });
      } catch {
        // Ignore malformed geographic features.
      }
    });

    return result;
  }, []);

  const crimeColor = getCrimeColor(selectedCrimeId);

  if (selectedCrimeId === "all") {
    return null;
  }

  const visibleMarkers = markers.filter(
    (marker) =>
      Number(barangayCounts[marker.id] ?? 0) > 0
  );

  return (
    <>
      {visibleMarkers.map((marker, index) => {
        const count = Number(
          barangayCounts[marker.id] ?? 0
        );

        const isSelected =
          marker.id === selectedBarangayId;

        /*
        Create a custom animated Leaflet pin.
        Selected pins receive a yellow outline.
        */

        const markerIcon = L.divIcon({
          className: "samal-crime-marker",
          html: `
            <div
              class="samal-crime-pin-wrapper"
              style="animation-delay:${index * 55}ms"
            >
              <div
                class="samal-crime-pin"
                style="
                  background-color:${crimeColor};
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
                <div class="samal-crime-pin-center"></div>
              </div>

              <div class="samal-crime-pin-shadow"></div>
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
            <Tooltip
              direction="top"
              offset={[0, -4]}
              opacity={0.98}
            >
              <div
                style={{
                  minWidth: 180,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#0F3D56",
                    marginBottom: 4,
                  }}
                >
                  {marker.name}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "#60747D",
                    marginBottom: 5,
                  }}
                >
                  {crimeLabel}
                </div>

                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: crimeColor,
                  }}
                >
                  {count} {count === 1 ? "case" : "cases"}
                </div>

                <div
                  style={{
                    marginTop: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    color: isEstimated
                      ? "#B45309"
                      : "#0F766E",
                  }}
                >
                  {isEstimated
                    ? "Estimated allocation"
                    : "Reported"}
                  {" • "}
                  {periodLabel}
                </div>

                <div
                  style={{
                    marginTop: 7,
                    paddingTop: 7,
                    borderTop: "1px solid #E2E8F0",
                    fontSize: 10,
                    color: "#64748B",
                  }}
                >
                  Barangay reference location — not an
                  exact incident location.
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}

/*
=========================================================
3. MAIN SAMAL MAP COMPONENT
=========================================================
*/

export default function SamalMap({
  selectedBarangayId,
  selectedCrimeId,
  selectedYear,
  onBarangayChange,
}: SamalMapProps) {
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  /*
  =======================================================
  4. SELECTED CRIME AND REPORTING PERIOD
  =======================================================
  */

  const selectedCrime = useMemo(() => {
    if (selectedCrimeId === "all") {
      return null;
    }

    return (
      crimesData.crimes.find(
        (crime) => crime.id === selectedCrimeId
      ) ?? null
    );
  }, [selectedCrimeId]);

  const isEstimated = selectedYear !== "all";

  const crimeLabel = selectedCrime?.name ?? "All Crimes";

  const periodLabel =
    selectedYear === "all"
      ? "2024–2026"
      : selectedYear;

  const activeCrimeColor =
    getCrimeColor(selectedCrimeId);

  /*
  =======================================================
  5. CALCULATE BARANGAY COUNTS
  =======================================================

  All years:
    Uses the reported barangay totals.

  Specific year:
    Uses the crime-year-barangay allocation file.

  Year-specific values are estimated allocations
  unless the underlying data is independently
  verified as reported.

  No new case counts are invented here.
  =======================================================
  */

  const barangayCounts = useMemo<BarangayCounts>(() => {
    const result: BarangayCounts = {};

    // All years, all crimes
    if (selectedYear === "all") {
      if (selectedCrimeId === "all") {
        Object.entries(
          crimesData.barangayTotals
        ).forEach(([barangayId, count]) => {
          result[barangayId] = Number(count);
        });

        return result;
      }

      // All years, one selected crime
      if (selectedCrime) {
        Object.entries(
          selectedCrime.barangays
        ).forEach(([barangayId, count]) => {
          result[barangayId] = Number(count);
        });
      }

      return result;
    }

    // Initialize every barangay with zero.
    samalBarangays.features.forEach((feature) => {
      result[feature.properties.id] = 0;
    });

    // Specific year and specific crime
    if (selectedCrimeId !== "all") {
      const crimeAllocation =
        allocations[selectedCrimeId];

      const yearAllocation =
        crimeAllocation?.[selectedYear];

      if (!yearAllocation) {
        return result;
      }

      Object.entries(yearAllocation).forEach(
        ([barangayId, count]) => {
          result[barangayId] = Number(count);
        }
      );

      return result;
    }

    // Specific year, all crimes
    Object.values(allocations).forEach(
      (crimeAllocation) => {
        const yearAllocation =
          crimeAllocation[selectedYear];

        if (!yearAllocation) return;

        Object.entries(yearAllocation).forEach(
          ([barangayId, count]) => {
            result[barangayId] =
              (result[barangayId] ?? 0) +
              Number(count);
          }
        );
      }
    );

    return result;
  }, [
    selectedYear,
    selectedCrimeId,
    selectedCrime,
  ]);

  /*
  =======================================================
  6. FIND THE HIGHEST DISPLAYED CASE COUNT
  =======================================================

  Used only for relative visual comparison.

  Example:
    Barangay A: 10
    Barangay B: 5
    Barangay C: 2

  maximumCount = 10

  This does not calculate a crime rate or
  population-adjusted risk.
  =======================================================
  */

  const maximumCount = useMemo(() => {
    const values = Object.values(barangayCounts);

    return values.length > 0
      ? Math.max(...values, 0)
      : 0;
  }, [barangayCounts]);

  const getBarangayCount = (barangayId: string) =>
    barangayCounts[barangayId] ?? 0;

  /*
  =======================================================
  7. RELATIVE INTENSITY LABELS
  =======================================================

  These labels describe the displayed count
  relative to the highest barangay count.

  They are not official crime risk categories.
  =======================================================
  */

  const getRelativeIntensityLabel = (
    count: number
  ) => {
    if (count <= 0 || maximumCount <= 0) {
      return "No cases";
    }

    if (count === maximumCount) {
      return "Highest";
    }

    const relativeStrength =
      count / maximumCount;

    if (relativeStrength >= 0.67) {
      return "High";
    }

    if (relativeStrength >= 0.34) {
      return "Moderate";
    }

    return "Low";
  };

  /*
  =======================================================
  8. HIGH-CONTRAST POLYGON COLORS — UPDATED
  =======================================================

  This is the main visual improvement.

  Instead of changing opacity alone, the map
  also changes the color's lightness.

  LOW:
    Light tint of the selected crime color.

  MODERATE:
    Stronger and more saturated shade.

  HIGH:
    Close to the original crime color.

  HIGHEST:
    Full selected crime color.

  The color changes continuously according
  to the actual relative case count.

  No fixed case-count thresholds are introduced.
  =======================================================
  */

  const getFillColor = (count: number) => {
    if (count <= 0) {
      return "#CBD5E1";
    }

    const baseColor =
      selectedCrimeId === "all"
        ? "#25e086"
        : activeCrimeColor;

    const strength =
      maximumCount > 0
        ? Math.max(
            0,
            Math.min(1, count / maximumCount)
          )
        : 0;

    // Nonlinear adjustment improves the
    // visual separation of lower case counts.
    const colorStrength = Math.pow(
      strength,
      0.85
    );

    // Low counts are mixed with more white.
    // Highest count uses the full crime color.
    const whiteMix =
      0.72 * (1 - colorStrength);

    const hex = baseColor.replace("#", "");

    // Preserve non-hex configured colors.
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
      return baseColor;
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const blend = (channel: number) =>
      Math.round(
        channel +
        (255 - channel) * whiteMix
      );

    return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
  };

  /*
  =======================================================
  9. HIGH-CONTRAST OPACITY — UPDATED
  =======================================================

  Previous:
    Approximately 0.18–0.65

  New:
    Approximately 0.88–0.98

  This makes polygon colors much more visible
  on green satellite imagery.

  Selection does not change fill opacity.

  The selected barangay is distinguished by
  its yellow boundary instead.
  =======================================================
  */

  const getFillOpacity = (
    count: number,
    _isSelected: boolean
  ) => {
    if (count <= 0) {
      return 0.06;
    }

    if (maximumCount <= 0) {
      return 0.88;
    }

    const strength = Math.max(
      0,
      Math.min(1, count / maximumCount)
    );

    const minimumOpacity = 0.88;
    const maximumOpacity = 0.98;

    return (
      minimumOpacity +
      strength *
        (maximumOpacity - minimumOpacity)
    );
  };

  /*
  =======================================================
  10. UPDATE POLYGON STYLES
  =======================================================

  When crime, year, or barangay selection
  changes, Leaflet updates polygon colors.

  Yellow:
    Selected barangay boundary.

  White:
    Unselected barangay boundary.

  The actual crime counts are unchanged.
  =======================================================
  */

  useEffect(() => {
    const geoJsonLayer = geoJsonRef.current;

    if (!geoJsonLayer) return;

    geoJsonLayer.eachLayer((layer) => {
      const featureLayer = layer as L.Path & {
        feature?: BarangayFeature;
      };

      const feature = featureLayer.feature;

      if (!feature) return;

      const barangayId = feature.properties.id;

      const count =
        getBarangayCount(barangayId);

      const isSelected =
        barangayId === selectedBarangayId;

      featureLayer.setStyle({
        color: isSelected
          ? "#FACC15"
          : "#FFFFFF",

        weight: isSelected ? 4.5 : 2.5,

        opacity: 1,

        fillColor: getFillColor(count),

        fillOpacity: getFillOpacity(
          count,
          isSelected
        ),
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

  /*
  =======================================================
  11. RENDER MAP
  =======================================================
  */

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        position: "relative",
        overflow: "hidden",

        "& .leaflet-container": {
          width: "100%",
          height: "100%",
          fontFamily: "inherit",
          backgroundColor: "#0b1820",
        },

        "& .leaflet-interactive": {
          cursor: "pointer",
        },

        "& .leaflet-tooltip": {
          border: "none",
          borderRadius: "10px",
          boxShadow:
            "0 6px 20px rgba(0,0,0,0.24)",
          padding: 0,
        },

        "& .leaflet-control-layers": {
          border: "none",
          borderRadius: "12px",
          boxShadow:
            "0 4px 14px rgba(15,61,86,0.18)",
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
          backgroundColor:
            "rgba(255,255,255,0.96)",
        },

        /*
        ===============================================
        CUSTOM PIN STYLES
        ===============================================
        */

        "& .samal-crime-marker": {
          background: "transparent",
          border: "none",
        },

        "& .samal-crime-pin-wrapper": {
          position: "relative",
          width: 38,
          height: 46,
          transformOrigin: "center bottom",
          animation:
            "samalPinDrop 0.55s cubic-bezier(0.22,1,0.36,1) both",
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
          boxShadow:
            "0 7px 16px rgba(0,0,0,0.30)",
          display: "grid",
          placeItems: "center",
          transition:
            "transform 160ms ease, box-shadow 160ms ease",
        },

        "& .samal-crime-pin-center": {
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          transform: "rotate(45deg)",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.20)",
        },

        "& .samal-crime-pin-shadow": {
          position: "absolute",
          left: 10,
          bottom: 0,
          width: 18,
          height: 6,
          borderRadius: "50%",
          backgroundColor:
            "rgba(0,0,0,0.30)",
          filter: "blur(1px)",
          animation:
            "samalPinShadow 0.55s ease-out both",
        },

        "& .samal-crime-marker:hover .samal-crime-pin": {
          transform:
            "rotate(-45deg) scale(1.12)",
        },

        /*
        ===============================================
        PIN ANIMATIONS
        ===============================================
        */

        "@keyframes samalPinDrop": {
          "0%": {
            opacity: 0,
            transform:
              "translateY(-28px) scale(0.8)",
          },

          "65%": {
            opacity: 1,
            transform:
              "translateY(3px) scale(1.05)",
          },

          "100%": {
            opacity: 1,
            transform:
              "translateY(0) scale(1)",
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

        /*
        ===============================================
        MOBILE RESPONSIVENESS
        ===============================================
        */

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
        {/*
        ===============================================
        12. SATELLITE AND STREET MAP LAYERS
        ===============================================

        Satellite is selected by default.
        ===============================================
        */}

        <LayersControl
          position="topright"
          collapsed={false}
        >
          <LayersControl.BaseLayer
            checked
            name="Satellite"
          >
            <TileLayer
              attribution="Sources: Esri and imagery providers"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer
            name="Street Map"
          >
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/*
        ===============================================
        13. REFERENCE LABEL LAYER
        ===============================================
        */}

        <TileLayer
          attribution="Esri"
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
          opacity={0.9}
        />

        {/*
        ===============================================
        14. AUTOMATIC MAP ZOOM
        ===============================================
        */}

        <MapBoundsController
          selectedBarangayId={
            selectedBarangayId
          }
        />

        {/*
        ===============================================
        15. BARANGAY GEOJSON POLYGONS
        ===============================================
        */}

        <GeoJSON
          key={`${selectedCrimeId}-${selectedYear}`}
          ref={geoJsonRef}
          data={
            samalBarangays as GeoJSON.GeoJsonObject
          }
          style={(feature) => {
            const barangay =
              feature as BarangayFeature;

            const id = barangay.properties.id;

            const count =
              getBarangayCount(id);

            const isSelected =
              id === selectedBarangayId;

            return {
              color: isSelected
                ? "#FACC15"
                : "#FFFFFF",

              weight: isSelected ? 4.5 : 2.5,

              opacity: 1,

              fillColor: getFillColor(count),

              fillOpacity: getFillOpacity(
                count,
                isSelected
              ),
            };
          }}
          onEachFeature={(feature, layer) => {
            const barangay =
              feature as BarangayFeature;

            const { id, name } =
              barangay.properties;

            const count =
              getBarangayCount(id);

            const intensityLabel =
              getRelativeIntensityLabel(count);

            const dataLabel = isEstimated
              ? "Estimated allocation"
              : "Reported";

            /*
            ===========================================
            16. BARANGAY INFORMATION TOOLTIP
            ===========================================

            Displays:
            - Barangay name
            - Selected crime
            - Case count
            - Relative intensity
            - Highest displayed count
            - Data status
            - Reporting period
            ===========================================
            */

            layer.bindTooltip(
              `
              <div style="
                min-width:210px;
                padding:12px 14px;
              ">
                <div style="
                  font-size:15px;
                  font-weight:800;
                  color:#0F3D56;
                  margin-bottom:6px;
                ">
                  ${name}
                </div>

                <div style="
                  font-size:12px;
                  color:#60747D;
                  margin-bottom:5px;
                ">
                  ${crimeLabel}
                </div>

                <div style="
                  font-size:20px;
                  font-weight:800;
                  color:#172B35;
                ">
                  ${count}
                  ${count === 1 ? "case" : "cases"}
                </div>

                ${
                  count > 0
                    ? `
                    <div style="
                      margin-top:7px;
                      display:inline-flex;
                      align-items:center;
                      gap:5px;
                      padding:4px 8px;
                      border-radius:999px;
                      background:rgba(15,118,110,0.12);
                      color:#0F766E;
                      font-size:11px;
                      font-weight:800;
                    ">
                      <span style="
                        width:7px;
                        height:7px;
                        border-radius:50%;
                        background:#0F766E;
                        display:inline-block;
                      "></span>

                      ${intensityLabel} intensity
                    </div>

                    <div style="
                      margin-top:7px;
                      font-size:11px;
                      color:#60747D;
                    ">
                      Highest displayed count:

                      <strong style="
                        color:#172B35;
                      ">
                        ${maximumCount}
                        ${
                          maximumCount === 1
                            ? "case"
                            : "cases"
                        }
                      </strong>
                    </div>
                    `
                    : `
                    <div style="
                      margin-top:7px;
                      display:inline-block;
                      padding:4px 8px;
                      border-radius:999px;
                      background:#F1F5F9;
                      color:#64748B;
                      font-size:11px;
                      font-weight:800;
                    ">
                      No cases
                    </div>
                    `
                }

                <div style="
                  margin-top:7px;
                  font-size:11px;
                  font-weight:700;
                  color:${
                    isEstimated
                      ? "#B45309"
                      : "#0F766E"
                  };
                ">
                  ${dataLabel}
                  •
                  ${periodLabel}
                </div>
              </div>
              `,
              {
                sticky: true,
                direction: "top",
                opacity: 0.98,
              }
            );

            /*
            ===========================================
            17. BARANGAY CLICK
            ===========================================
            */

            layer.on("click", () => {
              onBarangayChange(id);
            });

            /*
            ===========================================
            18. BARANGAY HOVER
            ===========================================

            Hover changes only the outline.

            Fill color and fill opacity
            remain based on the case count.
            ===========================================
            */

            layer.on("mouseover", (event) => {
              const target =
                event.target as L.Path;

              const isSelected =
                id === selectedBarangayId;

              target.setStyle({
                color: "#FACC15",
                weight: isSelected
                  ? 4.5
                  : 3.5,
              });

              target.bringToFront();
            });

            /*
            ===========================================
            19. RESTORE STYLE ON MOUSE LEAVE
            ===========================================
            */

            layer.on("mouseout", (event) => {
              const target =
                event.target as L.Path;

              const isSelected =
                id === selectedBarangayId;

              target.setStyle({
                color: isSelected
                  ? "#FACC15"
                  : "#FFFFFF",

                weight: isSelected
                  ? 4.5
                  : 2.5,

                opacity: 1,

                fillColor: getFillColor(count),

                fillOpacity: getFillOpacity(
                  count,
                  isSelected
                ),
              });

              if (isSelected) {
                target.bringToFront();
              }
            });
          }}
        />

        {/*
        ===============================================
        20. CRIME REFERENCE MARKERS
        ===============================================

        These are barangay reference pins,
        not exact crime incident locations.
        ===============================================
        */}

        <BarangayCrimePins
          selectedCrimeId={
            selectedCrimeId
          }
          selectedBarangayId={
            selectedBarangayId
          }
          barangayCounts={
            barangayCounts
          }
          crimeLabel={
            crimeLabel
          }
          periodLabel={
            periodLabel
          }
          isEstimated={
            isEstimated
          }
          onBarangayChange={
            onBarangayChange
          }
        />
      </MapContainer>
    </Box>
  );
}

/*
=========================================================
END OF BANTAY SAMAL MAP COMPONENT
=========================================================

HIGH-CONTRAST CHANGES:

1. Polygon opacity increased to 0.88–0.98.

2. Polygon colors use a continuous gradient
   with stronger visual contrast.

3. Low case counts use lighter shades.

4. Moderate case counts use stronger shades.

5. Highest case counts use the full crime color.

6. Yellow selection outlines are preserved.

7. Crime totals and filtering remain unchanged.

8. Estimated values remain labeled estimated.

IMPORTANT:
Relative color intensity is not an official
crime risk or safety classification.

=========================================================
*/
