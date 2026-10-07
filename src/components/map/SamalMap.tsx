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

/* =========================================================
   BANTAY SAMAL - INTERACTIVE CRIME MAP
   =========================================================

   PURPOSE

   This component displays crime statistics geographically
   across the barangays of Samal, Bataan.

   The map combines:

   1. Barangay boundaries
   2. Crime statistics
   3. Crime filters
   4. Year filters
   5. Barangay filters
   6. Crime colors
   7. Crime reference markers
   8. Information tooltips


   =========================================================
   IMPORTANT: NO FIXED CRIME-COUNT THRESHOLDS
   =========================================================

   The map does NOT divide crime counts into fixed ranges
   such as:

   Low = 1–3 cases
   Moderate = 4–5 cases
   High = 6–8 cases
   Highest = 9–10 cases

   It also does NOT display crime percentages.

   Instead, the ACTUAL NUMBER OF CASES is used.

   Example:

   Gugo             = 10 cases
   Lalawigan         = 5 cases
   Palili            = 3 cases
   East Calaguiman   = 2 cases

   The map still displays:

   10 cases
   5 cases
   3 cases
   2 cases

   The barangay with the highest displayed count receives
   the strongest color.

   Lower positive counts receive progressively lighter
   versions of the same color.

   Low / Moderate / High / Highest are used only as
   descriptive visual labels in the tooltip.

   They do NOT replace the actual number of cases.

   IMPORTANT:

   The internal comparison with the maximum count is used
   ONLY for visual comparison.

   It does NOT represent:

   - Crime probability
   - Crime rate
   - Safety level
   - Danger level
   - Victimization probability
   - Official hotspot classification

   A darker barangay simply has more displayed cases
   relative to other barangays under the current filters.
========================================================= */

/* =========================================================
   TYPES
========================================================= */

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

/* =========================================================
   PREPARE DATA
========================================================= */

const samalBarangays = samalBarangaysRaw as BarangayCollection;

const allocations = estimatedData.allocations as CrimeAllocations;

/* =========================================================
   AUTOMATIC MAP POSITION
========================================================= */

function MapBoundsController({
  selectedBarangayId,
}: {
  selectedBarangayId: string;
}) {
  const map = useMap();

  useEffect(() => {
    /* -------------------------------------------------------
       ALL BARANGAYS
    ------------------------------------------------------- */

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

    /* -------------------------------------------------------
       ONE BARANGAY
    ------------------------------------------------------- */

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

/* =========================================================
   CRIME REFERENCE PINS
   =========================================================

   Pins appear only when ONE specific crime is selected.

   IMPORTANT:

   The pin is a barangay reference marker.

   It is NOT the exact incident location.
========================================================= */

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
  /* =======================================================
     CREATE BARANGAY REFERENCE LOCATIONS
  ======================================================= */

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
        /*
              Ignore malformed geographic information
              instead of crashing the entire map.
            */
      }
    });

    return result;
  }, []);

  /* =======================================================
     NO PINS FOR ALL CRIMES
  ======================================================= */

  if (selectedCrimeId === "all") {
    return null;
  }

  /* =======================================================
     SELECTED CRIME COLOR
  ======================================================= */

  const crimeColor = getCrimeColor(selectedCrimeId);

  /* =======================================================
     SHOW PINS ONLY WHERE CASES EXIST
  ======================================================= */

  const visibleMarkers = markers.filter((marker) => {
    const count = Number(barangayCounts[marker.id] ?? 0);

    return count > 0;
  });

  return (
    <>
      {visibleMarkers.map((marker, index) => {
        const count = Number(barangayCounts[marker.id] ?? 0);

        const isSelected = marker.id === selectedBarangayId;

        /* ===============================================
             CREATE MAP PIN
          =============================================== */

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
            {/* =========================================
                  CRIME PIN TOOLTIP

                  This tooltip displays the ACTUAL
                  number of cases.

                  The marker is a barangay reference,
                  not an exact crime location.
              ========================================= */}

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

                {/* ACTUAL CASE COUNT */}

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

                {/* REPORTED / ESTIMATED */}

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

                {/* LOCATION WARNING */}

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

/* =========================================================
   MAIN SAMAL CRIME MAP
========================================================= */

export default function SamalMap({
  selectedBarangayId,
  selectedCrimeId,
  selectedYear,
  onBarangayChange,
}: SamalMapProps) {
  /*
    Reference to the Leaflet GeoJSON layer.

    This allows the component to update polygon styles
    whenever filters change.
  */

  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  /* =======================================================
     FIND SELECTED CRIME
  ======================================================= */

  const selectedCrime = useMemo(() => {
    if (selectedCrimeId === "all") {
      return null;
    }

    return (
      crimesData.crimes.find((crime) => crime.id === selectedCrimeId) ?? null
    );
  }, [selectedCrimeId]);

  /* =======================================================
     REPORTED OR ESTIMATED?

     ALL YEARS
     → Reported barangay totals are available.

     SPECIFIC YEAR
     → Crime × Year × Barangay uses estimated allocation.
  ======================================================= */

  const isEstimated = selectedYear !== "all";

  /* =======================================================
     MAP TEXT LABELS
  ======================================================= */

  const crimeLabel = selectedCrime?.name ?? "All Crimes";

  const periodLabel = selectedYear === "all" ? "2024–2026" : selectedYear;

  /* =======================================================
     SELECTED CRIME COLOR
  ======================================================= */

  const activeCrimeColor = getCrimeColor(selectedCrimeId);

  /* =======================================================
     CALCULATE ACTUAL DISPLAYED CASE COUNTS
     =======================================================

     IMPORTANT:

     This preserves your existing reported/estimated
     calculation.
  ======================================================= */

  const barangayCounts = useMemo<BarangayCounts>(() => {
    const result: BarangayCounts = {};

    /* ===============================================
           ALL YEARS = REPORTED DATA
        =============================================== */

    if (selectedYear === "all") {
      /* ---------------------------------------------
             ALL CRIMES + ALL YEARS
          --------------------------------------------- */

      if (selectedCrimeId === "all") {
        Object.entries(crimesData.barangayTotals).forEach(
          ([barangayId, count]) => {
            result[barangayId] = Number(count);
          },
        );

        return result;
      }

      /* ---------------------------------------------
             ONE CRIME + ALL YEARS
          --------------------------------------------- */

      if (selectedCrime) {
        Object.entries(selectedCrime.barangays).forEach(
          ([barangayId, count]) => {
            result[barangayId] = Number(count);
          },
        );
      }

      return result;
    }

    /* ===============================================
           SPECIFIC YEAR = ESTIMATED DATA
        =============================================== */

    samalBarangays.features.forEach((feature) => {
      result[feature.properties.id] = 0;
    });

    /* ---------------------------------------------
           ONE CRIME + SPECIFIC YEAR
        --------------------------------------------- */

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

    /* ---------------------------------------------
           ALL CRIMES + SPECIFIC YEAR
        --------------------------------------------- */

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

  /* =======================================================
     FIND HIGHEST DISPLAYED CASE COUNT
     =======================================================

     This does NOT create a fixed threshold.

     Example:

     Gugo       = 10
     Lalawigan  = 5
     Palili     = 3

     maximumCount = 10

     The actual values remain 10, 5, and 3.
  ======================================================= */

  const maximumCount = useMemo(() => {
    const values = Object.values(barangayCounts);

    if (values.length === 0) {
      return 0;
    }

    return Math.max(...values, 0);
  }, [barangayCounts]);

  /* =======================================================
     GET ONE BARANGAY'S ACTUAL COUNT
  ======================================================= */

  const getBarangayCount = (barangayId: string) => {
    return barangayCounts[barangayId] ?? 0;
  };

  /* =======================================================
     RELATIVE INTENSITY LABEL
     =======================================================

     This is a descriptive tooltip label.

     IMPORTANT:

     The actual crime count is NOT changed.

     No fixed case-count range is assigned.

     No percentage is shown to the user.

     "Highest" has a clear meaning:

     → This barangay has the highest displayed case count
       under the current filters.

     Low / Moderate / High describe the barangay's
     relative position below the maximum.

     These labels should NOT be interpreted as official
     crime-risk classifications.
  ======================================================= */

  const getRelativeIntensityLabel = (count: number) => {
    /* NO CASES */

    if (count <= 0 || maximumCount <= 0) {
      return "No cases";
    }

    /* HIGHEST ACTUAL DISPLAYED COUNT */

    if (count === maximumCount) {
      return "Highest";
    }

    /*
      Internal comparison only.

      This is NOT displayed as a percentage.
    */

    const relativeStrength = count / maximumCount;

    /*
      These values are used only to choose a simple
      descriptive visual label.

      They do NOT change the count and they are NOT
      displayed as case-count ranges.
    */

    if (relativeStrength >= 0.67) {
      return "High";
    }

    if (relativeStrength >= 0.34) {
      return "Moderate";
    }

    return "Low";
  };

  /* =======================================================
     POLYGON COLOR
     =======================================================

     NO FIXED CRIME-COUNT THRESHOLDS.

     0 cases
     → Gray

     All crimes
     → Teal

     Specific crime
     → Assigned crime color

     The hue stays the same.

     Only color strength changes.
  ======================================================= */

  const getFillColor = (count: number) => {
    /* ZERO CASES */

    if (count <= 0) {
      return "#CBD5E1";
    }

    /* ALL CRIMES */

    if (selectedCrimeId === "all") {
      return "#0F766E";
    }

    /* SPECIFIC CRIME */

    return activeCrimeColor;
  };

  /* =======================================================
     CONTINUOUS COLOR STRENGTH
     =======================================================

     There are NO fixed case-count thresholds.

     Every actual count receives a continuous visual
     strength based on the highest currently displayed
     count.

     Example:

     Highest displayed = 10

     10 cases → strongest
      7 cases → lighter
      5 cases → lighter
      2 cases → lighter
      1 case  → lightest positive color

     count / maximumCount is used internally only.

     It is NOT displayed as a crime percentage.
  ======================================================= */

  const getFillOpacity = (count: number, _isSelected: boolean) => {
    /* NO CASES */

    if (count <= 0) {
      return 0.5;
    }

    /* SAFETY CHECK */

    if (maximumCount <= 0) {
      return 0.25;
    }

    /*
      Internal visual comparison only.
    */

    const relativeStrength = count / maximumCount;

    const minimumOpacity = 0.25;

    const maximumOpacity = 0.95;

    return (
      minimumOpacity + relativeStrength * (maximumOpacity - minimumOpacity)
    );
  };

  /* =======================================================
     UPDATE POLYGONS WHEN FILTERS CHANGE
     =======================================================

     Selection uses a yellow border.

     Selection does NOT increase the polygon opacity.

     Therefore the fill continues to represent only the
     displayed crime count.
  ======================================================= */

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
        /* SELECTED BORDER */

        color: isSelected ? "#FACC15" : "#FFFFFF",

        /* BORDER WIDTH */

        weight: isSelected ? 4.5 : 2.5,

        opacity: 1,

        /* CRIME COLOR */

        fillColor: getFillColor(count),

        /* CONTINUOUS COUNT-BASED STRENGTH */

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

  /* =======================================================
     DISPLAY MAP
  ======================================================= */

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 0,

        position: "relative",
        overflow: "hidden",

        /* ===============================================
           LEAFLET MAP
        =============================================== */

        "& .leaflet-container": {
          width: "100%",
          height: "100%",

          fontFamily: "inherit",

          backgroundColor: "#0b1820",
        },

        "& .leaflet-interactive": {
          cursor: "pointer",
        },

        /* ===============================================
           TOOLTIP
        =============================================== */

        "& .leaflet-tooltip": {
          border: "none",

          borderRadius: "10px",

          boxShadow: "0 6px 20px rgba(0,0,0,0.24)",

          padding: 0,
        },

        /* ===============================================
           LAYER CONTROL
        =============================================== */

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

        /* ===============================================
           CRIME PIN
        =============================================== */

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

        /* ===============================================
           PIN ANIMATION
        =============================================== */

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

        /* ===============================================
           MOBILE
        =============================================== */

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
      {/* =================================================
          MAIN LEAFLET MAP
      ================================================= */}

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
        {/* ===============================================
            BASE MAP OPTIONS
        =============================================== */}

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

        {/* ===============================================
            PLACE LABELS
        =============================================== */}

        <TileLayer
          attribution="Esri"
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
          opacity={0.9}
        />

        {/* ===============================================
            AUTOMATIC MAP POSITION
        =============================================== */}

        <MapBoundsController selectedBarangayId={selectedBarangayId} />

        {/* ===============================================
            BARANGAY BOUNDARIES
        =============================================== */}

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

            /* ===========================================
               GET ACTUAL CASE COUNT
            =========================================== */

            const count = getBarangayCount(id);

            /* ===========================================
               GET RELATIVE INTENSITY LABEL

               This adds:

               Low
               Moderate
               High
               Highest
               No cases

               It does NOT alter the actual case count.
            =========================================== */

            const intensityLabel = getRelativeIntensityLabel(count);

            /* ===========================================
               REPORTED / ESTIMATED
            =========================================== */

            const dataLabel = isEstimated ? "Estimated allocation" : "Reported";

            /* ===========================================
               BARANGAY TOOLTIP

               Shows:

               - Barangay
               - Crime
               - Actual number of cases
               - Relative intensity label
               - Highest displayed count
               - Reported / Estimated
               - Reporting period

               IMPORTANT:

               No fixed case-count range or percentage
               is displayed.
            =========================================== */

            layer.bindTooltip(
              `
                <div style="
                  min-width: 210px;
                  padding: 12px 14px;
                ">

                  <!-- BARANGAY NAME -->

                  <div style="
                    font-size: 15px;
                    font-weight: 800;
                    color: #0F3D56;
                    margin-bottom: 6px;
                  ">
                    ${name}
                  </div>


                  <!-- SELECTED CRIME -->

                  <div style="
                    font-size: 12px;
                    color: #60747D;
                    margin-bottom: 5px;
                  ">
                    ${crimeLabel}
                  </div>


                  <!-- ACTUAL CASE COUNT -->

                  <div style="
                    font-size: 20px;
                    line-height: 1.2;
                    font-weight: 800;
                    color: #172B35;
                  ">
                    ${count}
                    ${count === 1 ? "case" : "cases"}
                  </div>


                  <!-- RELATIVE INTENSITY LABEL -->

                  ${
                    count > 0
                      ? `
                        <div style="
                          margin-top: 7px;
                          display: inline-flex;
                          align-items: center;
                          gap: 5px;
                          padding: 4px 8px;
                          border-radius: 999px;

                          background-color:
                            ${
                              intensityLabel === "Highest"
                                ? "rgba(15,118,110,0.16)"
                                : intensityLabel === "High"
                                  ? "rgba(15,118,110,0.12)"
                                  : intensityLabel === "Moderate"
                                    ? "rgba(15,118,110,0.09)"
                                    : "rgba(15,118,110,0.06)"
                            };

                          color: #0F766E;

                          font-size: 11px;
                          line-height: 1.2;
                          font-weight: 800;
                        ">

                          <span style="
                            width: 7px;
                            height: 7px;
                            border-radius: 50%;
                            background-color: #0F766E;
                            display: inline-block;
                          "></span>

                          ${intensityLabel} intensity
                        </div>
                      `
                      : `
                        <div style="
                          margin-top: 7px;
                          display: inline-flex;
                          align-items: center;
                          gap: 5px;
                          padding: 4px 8px;
                          border-radius: 999px;
                          background-color: #F1F5F9;
                          color: #64748B;
                          font-size: 11px;
                          line-height: 1.2;
                          font-weight: 800;
                        ">

                          <span style="
                            width: 7px;
                            height: 7px;
                            border-radius: 50%;
                            background-color: #CBD5E1;
                            display: inline-block;
                          "></span>

                          No cases
                        </div>
                      `
                  }


                  <!-- HIGHEST DISPLAYED COUNT -->

                  ${
                    count > 0
                      ? `
                        <div style="
                          margin-top: 7px;
                          font-size: 11px;
                          line-height: 1.4;
                          color: #60747D;
                        ">
                          Highest displayed count:

                          <strong style="
                            color: #172B35;
                          ">
                            ${maximumCount}
                            ${maximumCount === 1 ? "case" : "cases"}
                          </strong>
                        </div>
                      `
                      : ""
                  }


                  <!-- DATA STATUS -->

                  <div style="
                    margin-top: 7px;
                    font-size: 11px;
                    font-weight: 700;
                    color:
                      ${isEstimated ? "#B45309" : "#0F766E"};
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
              },
            );

            /* ===========================================
               CLICK BARANGAY
            =========================================== */

            layer.on("click", () => {
              onBarangayChange(id);
            });

            /* ===========================================
               HOVER

               Hover changes ONLY the border.

               It does NOT change:

               - Case count
               - Fill color
               - Fill opacity
               - Relative intensity
            =========================================== */

            layer.on("mouseover", (event) => {
              const target = event.target as L.Path;

              const isSelected = id === selectedBarangayId;

              target.setStyle({
                color: "#FACC15",

                weight: isSelected ? 4.5 : 3.5,
              });

              target.bringToFront();
            });

            /* ===========================================
               MOUSE OUT
            =========================================== */

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

        {/* ===============================================
            CRIME REFERENCE PINS
        =============================================== */}

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

/* =========================================================
   SIMPLE EXPLANATION FOR CRIMINOLOGY STUDENTS
   =========================================================

   HOW DOES THE BANTAY SAMAL MAP WORK?


   STEP 1

   The system loads the geographic boundaries of the
   barangays of Samal.

                ↓


   STEP 2

   The system loads the crime statistics.

                ↓


   STEP 3

   The user selects:

   - Crime
   - Year
   - Barangay

                ↓


   STEP 4

   The system determines the ACTUAL NUMBER OF CASES that
   should be displayed for every barangay.

                ↓


   STEP 5

   The system determines whether the displayed value is:

   REPORTED

   or

   ESTIMATED

                ↓


   STEP 6

   The system finds the largest displayed barangay count.

   Example:

   Gugo       = 10
   Lalawigan  = 5
   Palili     = 3

   Highest displayed count = 10

                ↓


   STEP 7

   The map uses the highest displayed count to determine
   the visual strength of the polygon colors.

   There are NO fixed case-count thresholds.

                ↓


   STEP 8

   Each barangay keeps its ACTUAL number of cases.

   Example:

   Gugo
   → 10 cases

   Lalawigan
   → 5 cases

   Palili
   → 3 cases

                ↓


   STEP 9

   Higher counts receive stronger color.

   Lower positive counts receive lighter color.

   Zero cases receive gray.

   The color changes continuously according to the
   displayed counts.

                ↓


   STEP 10

   When the user hovers over a barangay, the tooltip
   displays:

   - Barangay name
   - Crime name
   - Actual number of cases
   - Relative intensity description
   - Highest displayed count
   - Reported / Estimated status
   - Reporting period


   =========================================================
   RELATIVE INTENSITY LABELS
   =========================================================

   The tooltip may display:

   Highest intensity
   High intensity
   Moderate intensity
   Low intensity
   No cases


   "Highest" has a direct meaning:

   It means the barangay has the highest displayed case
   count under the current filters.


   Example:

   Gugo = 10 cases

   Highest displayed count = 10 cases

   Gugo receives:

   Highest intensity


   Low, Moderate, and High are descriptive visual labels
   for values below the maximum.

   They do NOT replace the actual number of cases.

   They should NOT be interpreted as official crime-risk
   classifications.


   =========================================================
   HOW TO INTERPRET THE MAP
   =========================================================

   1. A stronger/darker polygon means the barangay has a
      higher displayed case count compared with the other
      barangays under the current filters.

   2. A lighter polygon means the barangay has a lower
      displayed case count.

   3. There are no fixed crime-count ranges such as:

      Low = 1–3
      Moderate = 4–5
      High = 6–8
      Highest = 9–10

   4. The map does not display the case counts as crime
      percentages.

   5. The actual number of cases remains visible.

   6. "Highest" means highest DISPLAYED COUNT under the
      current filters.

   7. Stronger color does NOT automatically mean that the
      barangay is dangerous, unsafe, or an official crime
      hotspot.

   8. Crime pins represent barangay reference locations.

   9. Crime pins are NOT exact incident locations.

   10. "Reported" means the displayed value comes from the
       available reported dataset.

   11. "Estimated allocation" means that a specific
       Crime × Year × Barangay value was estimated because
       that exact three-way breakdown was not available in
       the reported source data.


   =========================================================
   FINAL EXPLANATION
   =========================================================

   Bantay Samal is a crime-data visualization tool.

   Its purpose is to help criminology students,
   researchers, and other users understand how recorded
   crime cases are geographically distributed among the
   barangays of Samal, Bataan.

   The ACTUAL NUMBER OF CASES remains the main statistic.

   Color strength and the Low / Moderate / High / Highest
   descriptions are visual aids for comparing the displayed
   barangays.

   They should not be interpreted by themselves as official
   measurements of safety, danger, crime risk, or hotspot
   status.
========================================================= */
