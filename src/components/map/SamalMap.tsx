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

import type {
  Feature,
  FeatureCollection,
  Geometry,
} from "geojson";

import "leaflet/dist/leaflet.css";

import samalBarangaysRaw from "../../data/samal-barangays.json";
import crimesData from "../../data/crimes.json";
import estimatedData from "../../data/crime-year-barangay.json";

import { getCrimeColor } from "../../utils/crimeColors";

/* =========================================================
   BANTAY SAMAL - INTERACTIVE CRIME MAP
   =========================================================

   PURPOSE OF THIS FILE

   This file controls the interactive crime map used in
   Bantay Samal.

   The map combines:

   1. Barangay boundaries
   2. Crime statistics
   3. Crime filters
   4. Year filters
   5. Barangay filters
   6. Crime colors
   7. Map markers
   8. Information tooltips

   The main goal is to turn crime statistics into a
   geographic visualization that is easier to understand.

   Instead of reading only tables and numbers, users can
   see how recorded cases are distributed across the
   barangays of Samal, Bataan.


   IMPORTANT CRIMINOLOGY NOTE

   The words:

   - Low
   - Moderate
   - High
   - Very High

   describe RELATIVE CASE CONCENTRATION on the map.

   They do NOT automatically mean that a barangay is:

   - Safe
   - Dangerous
   - A crime hotspot
   - High risk
   - Low risk

   The classification only compares the number of cases
   in one barangay with the barangay having the highest
   number of cases under the current filters.
========================================================= */


/* =========================================================
   DATA USED BY THE MAP
   =========================================================

   samal-barangays.json

   Contains the geographic boundaries of the barangays.

   This tells the system where each barangay is located
   and what shape should be drawn on the map.


   crimes.json

   Contains the reported crime statistics.

   Examples of information stored here:

   - Crime names
   - Crime totals
   - Yearly totals
   - Barangay totals


   crime-year-barangay.json

   Contains the estimated Crime × Year × Barangay
   allocations.

   This is used when the original reported data does not
   contain the exact three-way breakdown requested by
   the user.


   crimeColors.ts

   Gives each crime type its assigned color.


   SIMPLE PROCESS

   Barangay boundaries
          +
   Crime statistics
          +
   Selected filters
          ↓
   Interactive crime map
========================================================= */


/* =========================================================
   TYPES

   These describe the structure of the information used
   by TypeScript.

   Think of them as rules that tell the program what kind
   of information it should expect.
========================================================= */


/*
   Information stored inside each barangay boundary.

   Example:

   id   = "gugo"
   name = "Gugo"
*/

type BarangayProperties = {
  id: string;
  name: string;
  psgcCode?: string;
  sourceName?: string;
};


/*
   Represents one barangay geographic feature.

   It contains:

   - The barangay boundary
   - The barangay information
*/

type BarangayFeature = Feature<
  Geometry,
  BarangayProperties
>;


/*
   Represents the complete collection of barangays.
*/

type BarangayCollection = FeatureCollection<
  Geometry,
  BarangayProperties
>;


/*
   Information that the SamalMap component receives
   from the dashboard.

   selectedBarangayId
   → Which barangay is selected.

   selectedCrimeId
   → Which crime is selected.

   selectedYear
   → Which year is selected.

   onBarangayChange
   → Tells the dashboard when the user selects another
     barangay.
*/

type SamalMapProps = {
  selectedBarangayId: string;
  selectedCrimeId: string;
  selectedYear: string;

  onBarangayChange: (
    barangayId: string,
  ) => void;
};


/*
   Stores the number of cases for each barangay.

   Simple example:

   {
     gugo: 10,
     ibaba: 3,
     lalawigan: 5
   }
*/

type BarangayCounts = Record<
  string,
  number
>;


/*
   Stores barangay counts for a particular year.
*/

type YearAllocations = Record<
  string,
  BarangayCounts
>;


/*
   Stores the estimated allocations for crimes,
   years, and barangays.
*/

type CrimeAllocations = Record<
  string,
  YearAllocations
>;


/*
   Information needed to place a crime marker on the map.
*/

type CrimeMarker = {
  id: string;
  name: string;
  position: L.LatLng;
};


/* =========================================================
   PREPARE THE BARANGAY AND ESTIMATED DATA
========================================================= */


/*
   Convert the imported barangay GeoJSON into the structure
   expected by this component.
*/

const samalBarangays =
  samalBarangaysRaw as BarangayCollection;


/*
   Get the estimated Crime × Year × Barangay allocations.
*/

const allocations =
  estimatedData.allocations as CrimeAllocations;


/* =========================================================
   AUTOMATIC MAP POSITION
   =========================================================

   This part controls where the map automatically moves.

   IF "ALL BARANGAYS" IS SELECTED:

   → Show the whole municipality.


   IF ONE BARANGAY IS SELECTED:

   → Move and zoom toward that barangay.


   EXAMPLE:

   User selects Gugo
          ↓
   System finds the boundary of Gugo
          ↓
   Map zooms toward Gugo


   IMPORTANT:

   This does NOT change crime statistics.

   It only changes what part of the map the user sees.
========================================================= */

function MapBoundsController({
  selectedBarangayId,
}: {
  selectedBarangayId: string;
}) {
  /*
     Get access to the Leaflet map.
  */

  const map = useMap();


  /*
     Run this whenever the selected barangay changes.
  */

  useEffect(() => {
    /* -----------------------------------------------------
       ALL BARANGAYS
       -----------------------------------------------------

       If no specific barangay is selected, show the entire
       municipality.
    */

    if (selectedBarangayId === "all") {
      /*
         Create a temporary Leaflet layer containing all
         barangay boundaries.
      */

      const municipalityLayer = L.geoJSON(
        samalBarangays as GeoJSON.GeoJsonObject,
      );


      /*
         Find the geographic limits of the municipality.
      */

      const bounds =
        municipalityLayer.getBounds();


      /*
         If the boundaries are valid, adjust the map so the
         whole municipality fits on screen.
      */

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [35, 35],
        });
      }

      return;
    }


    /* -----------------------------------------------------
       ONE BARANGAY SELECTED
       -----------------------------------------------------

       Find the barangay chosen by the user.
    */

    const selectedFeature =
      samalBarangays.features.find(
        (feature) =>
          feature.properties.id ===
          selectedBarangayId,
      );


    /*
       Stop if the barangay cannot be found.
    */

    if (!selectedFeature) {
      return;
    }


    /*
       Convert the selected barangay into a Leaflet layer.
    */

    const selectedLayer = L.geoJSON(
      selectedFeature as GeoJSON.GeoJsonObject,
    );


    /*
       Get the geographic boundary of the barangay.
    */

    const bounds =
      selectedLayer.getBounds();


    /*
       Zoom the map toward the selected barangay.
    */

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [70, 70],
        maxZoom: 16,
      });
    }
  }, [map, selectedBarangayId]);


  /*
     This component controls the map only.

     It does not display anything by itself.
  */

  return null;
}


/* =========================================================
   CRIME MAP PINS
   =========================================================

   Pins appear when ONE SPECIFIC CRIME is selected.

   Example:

   Malicious Mischief selected
          ↓
   Gugo has cases
          ↓
   A Malicious Mischief-colored pin appears in Gugo.


   VERY IMPORTANT:

   THE PIN IS NOT THE EXACT LOCATION OF A CRIME INCIDENT.

   The system places the marker around the geographic
   center of the barangay.

   Therefore:

   CORRECT INTERPRETATION:

   "This barangay has cases of the selected crime."


   WRONG INTERPRETATION:

   "A crime happened exactly where this pin is located."


   These pins are barangay reference markers only.
========================================================= */

type BarangayCrimePinsProps = {
  selectedCrimeId: string;
  selectedBarangayId: string;

  barangayCounts: BarangayCounts;

  crimeLabel: string;
  periodLabel: string;

  isEstimated: boolean;

  onBarangayChange: (
    barangayId: string,
  ) => void;
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
  /* -----------------------------------------------------
     CREATE BARANGAY REFERENCE LOCATIONS
     -----------------------------------------------------

     The system finds the geographic center of every
     barangay boundary.

     That center becomes the reference location for
     the crime pin.
  */

  const markers =
    useMemo<CrimeMarker[]>(() => {
      const result: CrimeMarker[] = [];


      /*
         Go through every barangay.
      */

      samalBarangays.features.forEach(
        (feature) => {
          try {
            /*
               Convert the barangay boundary into a
               Leaflet layer.
            */

            const layer = L.geoJSON(
              feature as GeoJSON.GeoJsonObject,
            );


            /*
               Find the geographic boundary.
            */

            const bounds =
              layer.getBounds();


            /*
               Skip invalid geographic data.
            */

            if (!bounds.isValid()) {
              return;
            }


            /*
               Save the barangay and its geographic center.
            */

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
        },
      );

      return result;
    }, []);


  /* -----------------------------------------------------
     DO NOT SHOW PINS FOR "ALL CRIMES"
     -----------------------------------------------------

     Pins are only useful when the user selects one
     specific crime.
  */

  if (selectedCrimeId === "all") {
    return null;
  }


  /* -----------------------------------------------------
     GET THE COLOR OF THE SELECTED CRIME
  ----------------------------------------------------- */

  const crimeColor =
    getCrimeColor(selectedCrimeId);


  /* -----------------------------------------------------
     SHOW PINS ONLY WHERE CASES EXIST
     -----------------------------------------------------

     Barangays with zero cases do not receive a pin.
  */

  const visibleMarkers =
    markers.filter((marker) => {
      const count = Number(
        barangayCounts[marker.id] ?? 0,
      );

      return count > 0;
    });


  /*
     Display the crime markers.
  */

  return (
    <>
      {visibleMarkers.map(
        (marker, index) => {
          /*
             Get the number of cases for this barangay.
          */

          const count = Number(
            barangayCounts[marker.id] ?? 0,
          );


          /*
             Check whether this barangay is currently
             selected.
          */

          const isSelected =
            marker.id ===
            selectedBarangayId;


          /* -------------------------------------------------
             CREATE THE VISUAL MAP PIN

             The pin uses the color assigned to the
             selected crime.

             A selected barangay also receives a yellow
             highlight around its pin.
          ------------------------------------------------- */

          const markerIcon = L.divIcon({
            className:
              "samal-crime-marker",

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


          /*
             Display the marker on the map.
          */

          return (
            <Marker
              key={`${selectedCrimeId}-${marker.id}-${periodLabel}`}
              position={marker.position}
              icon={markerIcon}
              zIndexOffset={
                isSelected
                  ? 1000
                  : 500
              }

              /*
                 Clicking the marker selects the barangay.
              */

              eventHandlers={{
                click: () => {
                  onBarangayChange(
                    marker.id,
                  );
                },
              }}
            >
              {/* --------------------------------------------
                  PIN INFORMATION BOX

                  When the user hovers over the marker,
                  this shows:

                  - Barangay
                  - Crime
                  - Cases
                  - Reported/Estimated status
                  - Reporting period
                  - Location warning
              -------------------------------------------- */}

              <Tooltip
                direction="top"
                offset={[0, -4]}
                opacity={0.98}
              >
                <div
                  style={{
                    minWidth: "180px",
                    padding: "10px 12px",
                  }}
                >
                  {/* Barangay name */}

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


                  {/* Selected crime */}

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


                  {/* Number of cases */}

                  <div
                    style={{
                      fontSize: "18px",
                      lineHeight: 1.2,
                      fontWeight: 800,
                      color: crimeColor,
                    }}
                  >
                    {count}{" "}
                    {count === 1
                      ? "case"
                      : "cases"}
                  </div>


                  {/* Reported or Estimated status */}

                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "11px",
                      lineHeight: 1.4,
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


                  {/* Important warning about pin location */}

                  <div
                    style={{
                      marginTop: "7px",
                      paddingTop: "7px",

                      borderTop:
                        "1px solid #E2E8F0",

                      fontSize: "10px",
                      lineHeight: 1.35,
                      color: "#64748B",
                    }}
                  >
                    Barangay reference
                    location — not an exact
                    incident location.
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        },
      )}
    </>
  );
}


/* =========================================================
   MAIN SAMAL CRIME MAP

   Everything below controls the main interactive map.
========================================================= */

export default function SamalMap({
  selectedBarangayId,
  selectedCrimeId,
  selectedYear,
  onBarangayChange,
}: SamalMapProps) {
  /*
     This gives React access to the Leaflet GeoJSON layer.

     It is used later when polygon styles need to be
     updated.
  */

  const geoJsonRef =
    useRef<L.GeoJSON | null>(null);


  /* =======================================================
     FIND THE SELECTED CRIME
     =======================================================

     Example:

     selectedCrimeId = "malicious-mischief"

     The system searches crimes.json and gets the complete
     Malicious Mischief record.
  ======================================================= */

  const selectedCrime = useMemo(() => {
    /*
       "all" means the user is not viewing one specific
       crime.
    */

    if (selectedCrimeId === "all") {
      return null;
    }


    /*
       Search for the selected crime.
    */

    return (
      crimesData.crimes.find(
        (crime) =>
          crime.id === selectedCrimeId,
      ) ?? null
    );
  }, [selectedCrimeId]);


  /* =======================================================
     REPORTED DATA OR ESTIMATED DATA?
     =======================================================

     This is very important for interpreting the map.

     ALL YEARS / 2024-2026

     → The system can use the reported barangay totals.


     SPECIFIC YEAR

     → The system uses the estimated Crime × Year ×
       Barangay allocation.


     IMPORTANT:

     Estimated values are NOT presented as actual reported
     incident counts.
  ======================================================= */

  const isEstimated =
    selectedYear !== "all";


  /* =======================================================
     TEXT LABELS USED ON THE MAP
  ======================================================= */


  /*
     Example:

     "Malicious Mischief"

     If no specific crime is selected:

     "All Crimes"
  */

  const crimeLabel =
    selectedCrime?.name ?? "All Crimes";


  /*
     Show either:

     2024
     2025
     2026

     or

     2024–2026
  */

  const periodLabel =
    selectedYear === "all"
      ? "2024–2026"
      : selectedYear;


  /* =======================================================
     SELECTED CRIME COLOR
     =======================================================

     Each crime has an assigned color.

     The SAME crime color is used for:

     - Map pins
     - Barangay polygon fills
     - Other visualizations using crimeColors.ts

     Example:

     If Malicious Mischief is orange, all barangays
     displaying Malicious Mischief remain orange.

     Intensity is shown using opacity, not by changing the
     crime into a different color.
  ======================================================= */

  const activeCrimeColor =
    getCrimeColor(selectedCrimeId);


  /* =======================================================
     CALCULATE CASES FOR EACH BARANGAY
     =======================================================

     This is one of the most important sections.

     The system determines how many cases should be shown
     in every barangay based on the selected filters.
  ======================================================= */

  const barangayCounts =
    useMemo<BarangayCounts>(() => {
      /*
         This object will store the final counts.

         Example:

         {
           gugo: 10,
           ibaba: 3,
           lalawigan: 5
         }
      */

      const result: BarangayCounts = {};


      /* ---------------------------------------------------
         REPORTED DATA MODE
         ---------------------------------------------------

         If "All Years" is selected, use reported totals.
      */

      if (selectedYear === "all") {
        /* -------------------------------------------------
           ALL CRIMES + ALL YEARS

           Use the reported municipality barangay totals.
        ------------------------------------------------- */

        if (
          selectedCrimeId === "all"
        ) {
          Object.entries(
            crimesData.barangayTotals,
          ).forEach(
            ([barangayId, count]) => {
              result[barangayId] =
                Number(count);
            },
          );

          return result;
        }


        /* -------------------------------------------------
           ONE CRIME + ALL YEARS

           Example:

           Malicious Mischief
                  +
           2024–2026
                  ↓
           Use the reported crime-by-barangay totals.
        ------------------------------------------------- */

        if (selectedCrime) {
          Object.entries(
            selectedCrime.barangays,
          ).forEach(
            ([barangayId, count]) => {
              result[barangayId] =
                Number(count);
            },
          );
        }

        return result;
      }


      /* ---------------------------------------------------
         ESTIMATED DATA MODE

         A specific year was selected.

         First, give every barangay a starting value of 0.
      --------------------------------------------------- */

      samalBarangays.features.forEach(
        (feature) => {
          result[
            feature.properties.id
          ] = 0;
        },
      );


      /* ---------------------------------------------------
         SPECIFIC CRIME + SPECIFIC YEAR

         Example:

         Malicious Mischief
                +
         2025
                +
         Barangay
                ↓
         Use estimated allocation.
      --------------------------------------------------- */

      if (
        selectedCrimeId !== "all"
      ) {
        /*
           Find the estimated information for the
           selected crime.
        */

        const crimeAllocation =
          allocations[selectedCrimeId];


        /*
           Find the selected year.
        */

        const yearAllocation =
          crimeAllocation?.[
            selectedYear
          ];


        /*
           Stop if no allocation exists.
        */

        if (!yearAllocation) {
          return result;
        }


        /*
           Copy the estimated values into the result.
        */

        Object.entries(
          yearAllocation,
        ).forEach(
          ([barangayId, count]) => {
            result[barangayId] =
              Number(count);
          },
        );

        return result;
      }


      /* ---------------------------------------------------
         ALL CRIMES + SPECIFIC YEAR

         Example:

         All Crimes
             +
         2025

         The system adds the estimated counts from all
         crime types for every barangay.
      --------------------------------------------------- */

      Object.values(
        allocations,
      ).forEach(
        (crimeAllocation) => {
          /*
             Get the selected year from this crime.
          */

          const yearAllocation =
            crimeAllocation[
              selectedYear
            ];


          /*
             Skip if no information exists.
          */

          if (!yearAllocation) {
            return;
          }


          /*
             Add this crime's estimated cases to the
             barangay total.
          */

          Object.entries(
            yearAllocation,
          ).forEach(
            ([barangayId, count]) => {
              result[barangayId] =
                (result[
                  barangayId
                ] ?? 0) +
                Number(count);
            },
          );
        },
      );

      return result;
    }, [
      selectedYear,
      selectedCrimeId,
      selectedCrime,
    ]);


  /* =======================================================
     FIND THE HIGHEST BARANGAY CASE COUNT
     =======================================================

     The system needs the highest number of cases so it
     can compare the other barangays against it.

     EXAMPLE:

     Gugo              = 10
     Lalawigan         = 5
     East Calaguiman   = 2

     Highest value = 10
  ======================================================= */

  const maximumCount =
    useMemo(() => {
      /*
         Get all barangay counts.
      */

      const values =
        Object.values(
          barangayCounts,
        );


      /*
         Find the largest value.

         The minimum fallback is 1 to avoid dividing
         by zero later.
      */

      return Math.max(
        ...values,
        1,
      );
    }, [barangayCounts]);


  /* =======================================================
     GET ONE BARANGAY'S CASE COUNT
     =======================================================

     Example:

     getBarangayCount("gugo")

     might return:

     10
  ======================================================= */

  const getBarangayCount = (
    barangayId: string,
  ) => {
    return (
      barangayCounts[
        barangayId
      ] ?? 0
    );
  };


  /* =======================================================
     CALCULATE RELATIVE CRIME INTENSITY
     =======================================================

     FORMULA:

          Barangay cases
     -------------------------
     Highest barangay cases

     EXAMPLE:

     Highest barangay = 10 cases

     Gugo = 10

     10 ÷ 10 = 1.00
             = 100%


     Another barangay = 5

     5 ÷ 10 = 0.50
            = 50%


     Another barangay = 2

     2 ÷ 10 = 0.20
            = 20%


     CLASSIFICATION:

     0% - 25%
     → Low

     More than 25% - 50%
     → Moderate

     More than 50% - 75%
     → High

     More than 75% - 100%
     → Very High


     IMPORTANT CRIMINOLOGY NOTE:

     This is RELATIVE CASE CONCENTRATION.

     It is NOT an official measurement of:

     - Crime risk
     - Safety
     - Danger
     - Victimization probability
     - Official crime hotspot status
  ======================================================= */

  const getIntensity = (
    count: number,
  ) => {
    /*
       Zero cases means zero intensity.
    */

    if (count <= 0) {
      return 0;
    }


    /*
       Compare the barangay with the highest barangay.
    */

    return (
      count / maximumCount
    );
  };


  /* =======================================================
     CHOOSE THE POLYGON COLOR
     =======================================================

     ALL CRIMES:

     Uses different teal shades.


     SPECIFIC CRIME:

     Uses ONE assigned crime color.

     Example:

     Malicious Mischief = Orange

     Low        → Orange
     Moderate   → Orange
     High       → Orange
     Very High  → Orange

     The actual crime color stays the same.

     For a specific crime, intensity is shown mainly
     through opacity.
  ======================================================= */

  const getFillColor = (
    count: number,
  ) => {
    /* ---------------------------------------------------
       NO CASES

       Gray means there are no cases under the current
       filters.
    --------------------------------------------------- */

    if (count === 0) {
      return "#CBD5E1";
    }


    /* ---------------------------------------------------
       ALL CRIMES

       Use the existing teal choropleth colors.
    --------------------------------------------------- */

    if (
      selectedCrimeId === "all"
    ) {
      /*
         Calculate the relative intensity.
      */

      const intensity =
        getIntensity(count);


      /*
         LOW
      */

      if (
        intensity <= 0.25
      ) {
        return "#99F6E4";
      }


      /*
         MODERATE
      */

      if (
        intensity <= 0.5
      ) {
        return "#2DD4BF";
      }


      /*
         HIGH
      */

      if (
        intensity <= 0.75
      ) {
        return "#0F766E";
      }


      /*
         VERY HIGH
      */

      return "#134E4A";
    }


    /* ---------------------------------------------------
       SPECIFIC CRIME

       Keep exactly the same crime color for all
       barangays.

       The strength of the color will be controlled
       separately through opacity.
    --------------------------------------------------- */

    return activeCrimeColor;
  };


  /* =======================================================
     CONTROL HOW STRONG THE COLOR APPEARS
     =======================================================

     This controls OPACITY.

     Opacity means how transparent or strong a color looks.


     SPECIFIC CRIME INTENSITY:

     LOW
     0% - 25%
     → 38% opacity


     MODERATE
     >25% - 50%
     → 62% opacity


     HIGH
     >50% - 75%
     → 82% opacity


     VERY HIGH
     >75% - 100%
     → 96% opacity


     SIMPLE EXPLANATION:

     Lower relative concentration
              ↓
     More transparent color


     Higher relative concentration
              ↓
     Stronger / darker-looking color


     IMPORTANT:

     We are NOT changing the crime's assigned color.

     We are changing only how strongly that same color
     appears over the satellite or street map.
  ======================================================= */

  const getFillOpacity = (
    count: number,
    isSelected: boolean,
  ) => {
    /* ---------------------------------------------------
       NO CASES
    --------------------------------------------------- */

    if (count === 0) {
      return isSelected
        ? 0.75
        : 0.5;
    }


    /* ---------------------------------------------------
       ALL CRIMES

       Keep the existing All Crimes appearance.
    --------------------------------------------------- */

    if (
      selectedCrimeId === "all"
    ) {
      return isSelected
        ? 0.95
        : 0.82;
    }


    /* ---------------------------------------------------
       SPECIFIC CRIME

       Calculate the barangay's relative intensity.
    --------------------------------------------------- */

    const intensity =
      getIntensity(count);


    /*
       Start with LOW intensity.
    */

    let opacity = 0.38;


    /* ---------------------------------------------------
       LOW

       0% - 25%
    --------------------------------------------------- */

    if (
      intensity <= 0.25
    ) {
      opacity = 0.38;
    }


    /* ---------------------------------------------------
       MODERATE

       >25% - 50%
    --------------------------------------------------- */

    else if (
      intensity <= 0.5
    ) {
      opacity = 0.62;
    }


    /* ---------------------------------------------------
       HIGH

       >50% - 75%
    --------------------------------------------------- */

    else if (
      intensity <= 0.75
    ) {
      opacity = 0.82;
    }


    /* ---------------------------------------------------
       VERY HIGH

       >75% - 100%
    --------------------------------------------------- */

    else {
      opacity = 0.96;
    }


    /* ---------------------------------------------------
       SELECTED BARANGAY

       A selected barangay receives only a very small
       increase in opacity.

       WHY?

       Because we do not want a selected LOW barangay
       to suddenly look like MODERATE just because the
       user clicked it.

       The yellow outline is the main visual indicator
       that the barangay is selected.
    --------------------------------------------------- */

    if (isSelected) {
      return Math.min(
        opacity + 0.04,
        0.98,
      );
    }


    /*
       Return the final opacity.
    */

    return opacity;
  };


  /* =======================================================
     UPDATE THE MAP WHEN FILTERS CHANGE
     =======================================================

     Whenever the user changes:

     - Barangay
     - Crime
     - Year

     the polygon styles need to update.

     This section updates:

     - Border color
     - Border thickness
     - Crime color
     - Color intensity


     SELECTED BARANGAY:

     Yellow border


     NORMAL BARANGAY:

     White border
  ======================================================= */

  useEffect(() => {
    /*
       Get the current GeoJSON map layer.
    */

    const geoJsonLayer =
      geoJsonRef.current;


    /*
       Stop if the layer is not ready.
    */

    if (!geoJsonLayer) {
      return;
    }


    /*
       Go through every barangay polygon.
    */

    geoJsonLayer.eachLayer(
      (layer) => {
        /*
           Treat the current layer as a barangay feature.
        */

        const featureLayer =
          layer as L.Path & {
            feature?: BarangayFeature;
          };


        /*
           Get the geographic feature.
        */

        const feature =
          featureLayer.feature;


        /*
           Skip if no feature exists.
        */

        if (!feature) {
          return;
        }


        /*
           Get the barangay ID.
        */

        const barangayId =
          feature.properties.id;


        /*
           Get its number of cases.
        */

        const count =
          getBarangayCount(
            barangayId,
          );


        /*
           Check if this is the barangay selected by
           the user.
        */

        const isSelected =
          barangayId ===
          selectedBarangayId;


        /*
           Apply the visual style.
        */

        featureLayer.setStyle({
          /*
             Yellow = selected
             White  = normal
          */

          color: isSelected
            ? "#FACC15"
            : "#FFFFFF",


          /*
             Selected barangay gets a thicker border.
          */

          weight: isSelected
            ? 4.5
            : 2.5,


          /*
             Keep the border fully visible.
          */

          opacity: 1,


          /*
             Choose the crime/polygon color.
          */

          fillColor:
            getFillColor(count),


          /*
             Choose how strong the color should appear.
          */

          fillOpacity:
            getFillOpacity(
              count,
              isSelected,
            ),
        });


        /*
           Put the selected barangay visually above
           neighboring polygons.
        */

        if (isSelected) {
          featureLayer.bringToFront();
        }
      },
    );
  }, [
    selectedBarangayId,
    selectedCrimeId,
    barangayCounts,
    maximumCount,
    activeCrimeColor,
  ]);


  /* =======================================================
     DISPLAY THE MAP
     =======================================================

     Everything below creates the visual interface that
     the user sees.
  ======================================================= */

  return (
    <Box
      sx={{
        /*
           Make the map use the available container space.
        */

        width: "100%",
        height: "100%",
        minHeight: 0,

        position: "relative",
        overflow: "hidden",


        /* -------------------------------------------------
           LEAFLET MAP CONTAINER
        ------------------------------------------------- */

        "& .leaflet-container": {
          width: "100%",
          height: "100%",

          fontFamily: "inherit",

          backgroundColor:
            "#0b1820",
        },


        /*
           Show a pointer cursor when the user moves over
           an interactive map feature.
        */

        "& .leaflet-interactive": {
          cursor: "pointer",
        },


        /* -------------------------------------------------
           TOOLTIP DESIGN
        ------------------------------------------------- */

        "& .leaflet-tooltip": {
          border: "none",

          borderRadius: "10px",

          boxShadow:
            "0 6px 20px rgba(0,0,0,0.24)",

          padding: 0,
        },


        /* -------------------------------------------------
           MAP LAYER CONTROL

           This is the small menu used to switch between:

           - Satellite
           - Street Map
        ------------------------------------------------- */

        "& .leaflet-control-layers": {
          border: "none",

          borderRadius: "12px",

          boxShadow:
            "0 4px 14px rgba(15,61,86,0.18)",

          overflow: "hidden",
        },


        /*
           Size of the layer-control button.
        */

        "& .leaflet-control-layers-toggle":
          {
            width: "38px",
            height: "38px",

            backgroundSize:
              "20px 20px",
          },


        /*
           Design of the expanded layer menu.
        */

        "& .leaflet-control-layers-expanded":
          {
            padding: "10px 12px",

            color: "#172B35",

            fontSize: "12px",

            fontWeight: 600,

            backgroundColor:
              "rgba(255,255,255,0.96)",
          },


        /* -------------------------------------------------
           CRIME PIN DESIGN
        ------------------------------------------------- */

        "& .samal-crime-marker": {
          background:
            "transparent",

          border: "none",
        },


        /*
           Container for the animated map pin.
        */

        "& .samal-crime-pin-wrapper":
          {
            position: "relative",

            width: 38,
            height: 46,

            transformOrigin:
              "center bottom",

            animation:
              "samalPinDrop 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
          },


        /*
           Main colored pin.
        */

        "& .samal-crime-pin": {
          position: "absolute",

          top: 0,
          left: 5,

          width: 28,
          height: 28,

          borderRadius:
            "50% 50% 50% 0",

          /*
             Rotating the shape creates the familiar
             map-pin appearance.
          */

          transform:
            "rotate(-45deg)",

          border:
            "2px solid #FFFFFF",

          boxShadow:
            "0 7px 16px rgba(0,0,0,0.30)",

          display: "grid",

          placeItems: "center",

          transition:
            "transform 160ms ease, box-shadow 160ms ease",
        },


        /*
           Small white circle inside the pin.
        */

        "& .samal-crime-pin-center":
          {
            width: 8,
            height: 8,

            borderRadius: "50%",

            backgroundColor:
              "#FFFFFF",

            transform:
              "rotate(45deg)",

            boxShadow:
              "0 1px 3px rgba(0,0,0,0.20)",
          },


        /*
           Small shadow underneath the map pin.
        */

        "& .samal-crime-pin-shadow":
          {
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


        /*
           Make the pin slightly larger when the user
           places the mouse over it.
        */

        "& .samal-crime-marker:hover .samal-crime-pin":
          {
            transform:
              "rotate(-45deg) scale(1.12)",
          },


        /* -------------------------------------------------
           PIN ENTRANCE ANIMATION

           Makes the marker appear to drop onto the map.
        ------------------------------------------------- */

        "@keyframes samalPinDrop":
          {
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


        /*
           Animate the small shadow underneath the pin.
        */

        "@keyframes samalPinShadow":
          {
            "0%": {
              opacity: 0,

              transform:
                "scale(0.45)",
            },

            "100%": {
              opacity: 1,

              transform:
                "scale(1)",
            },
          },


        /* -------------------------------------------------
           MOBILE PHONE ADJUSTMENTS

           Make map controls slightly smaller on phones.
        ------------------------------------------------- */

        "@media (max-width: 600px)":
          {
            "& .leaflet-control-zoom a":
              {
                width: "32px",

                height: "32px",

                lineHeight: "32px",

                fontSize: "18px",
              },

            "& .leaflet-control-layers-expanded":
              {
                padding:
                  "8px 10px",

                fontSize: "11px",
              },
          },
      }}
    >
      {/* =================================================
          MAIN LEAFLET MAP

          This creates the actual interactive map.
      ================================================= */}

      <MapContainer
        /*
           Starting position of the map.
        */

        center={[14.76, 120.54]}

        /*
           Starting zoom level.
        */

        zoom={13}

        /*
           Prevent zooming too far out.
        */

        minZoom={11}

        /*
           Allow detailed zooming.
        */

        maxZoom={19}

        /*
           Allow mouse-wheel zoom.
        */

        scrollWheelZoom

        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {/* ===============================================
            BASE MAP OPTIONS

            Users can choose between:

            1. Satellite
            2. Street Map
        =============================================== */}

        <LayersControl
          position="topright"
          collapsed={false}
        >
          {/* ---------------------------------------------
              SATELLITE MAP

              This is the default background map.

              It helps users recognize actual geographic
              features such as roads, fields, coastlines,
              and developed areas.
          --------------------------------------------- */}

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


          {/* ---------------------------------------------
              STREET MAP

              Provides a simpler map view based mainly on
              roads and mapped places.
          --------------------------------------------- */}

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


        {/* ===============================================
            PLACE LABELS

            Adds geographic names and boundaries over the
            base map.
        =============================================== */}

        <TileLayer
          attribution="Esri"
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
          opacity={0.9}
        />


        {/* ===============================================
            AUTOMATIC ZOOM / POSITION

            Moves the map when the selected barangay
            changes.
        =============================================== */}

        <MapBoundsController
          selectedBarangayId={
            selectedBarangayId
          }
        />


        {/* ===============================================
            BARANGAY CRIME MAP

            GeoJSON draws the actual barangay boundaries.

            Every barangay receives:

            - Border
            - Fill color
            - Color intensity
            - Case information
            - Tooltip
            - Click behavior
            - Hover behavior
        =============================================== */}

        <GeoJSON
          /*
             Re-create the GeoJSON layer whenever the
             selected crime or year changes.
          */

          key={`${selectedCrimeId}-${selectedYear}`}


          /*
             Save a reference to this layer.
          */

          ref={geoJsonRef}


          /*
             Use the Samal barangay geographic boundaries.
          */

          data={
            samalBarangays as GeoJSON.GeoJsonObject
          }


          /* ---------------------------------------------
             DEFAULT STYLE FOR EACH BARANGAY
          --------------------------------------------- */

          style={(feature) => {
            /*
               Treat this geographic feature as a barangay.
            */

            const barangay =
              feature as BarangayFeature;


            /*
               Get its ID.
            */

            const id =
              barangay.properties.id;


            /*
               Get the number of cases.
            */

            const count =
              getBarangayCount(id);


            /*
               Check whether it is selected.
            */

            const isSelected =
              id ===
              selectedBarangayId;


            /*
               Return the visual style.
            */

            return {
              /*
                 Yellow border = selected barangay

                 White border = normal barangay
              */

              color: isSelected
                ? "#FACC15"
                : "#FFFFFF",


              /*
                 Selected barangay has a thicker border.
              */

              weight: isSelected
                ? 4.5
                : 2.5,


              /*
                 Border remains fully visible.
              */

              opacity: 1,


              /*
                 Determine the polygon color.
              */

              fillColor:
                getFillColor(count),


              /*
                 Determine the strength of the color.
              */

              fillOpacity:
                getFillOpacity(
                  count,
                  isSelected,
                ),
            };
          }}


          /* ---------------------------------------------
             ADD INTERACTION TO EVERY BARANGAY
          --------------------------------------------- */

          onEachFeature={(
            feature,
            layer,
          ) => {
            /*
               Treat this feature as a barangay.
            */

            const barangay =
              feature as BarangayFeature;


            /*
               Get its ID and name.
            */

            const {
              id,
              name,
            } = barangay.properties;


            /*
               Get its case count.
            */

            const count =
              getBarangayCount(id);


            /*
               Calculate its relative intensity.
            */

            const intensity =
              getIntensity(count);


            /* -------------------------------------------
               TURN THE NUMBER INTO A SIMPLE LABEL

               No cases
               Low
               Moderate
               High
               Very High
            ------------------------------------------- */

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


            /*
               Tell the user whether the value comes from
               reported data or an estimated allocation.
            */

            const dataLabel =
              isEstimated
                ? "Estimated allocation"
                : "Reported";


            /* ===========================================
               BARANGAY INFORMATION TOOLTIP

               When the user hovers over a barangay,
               display:

               - Barangay name
               - Selected crime
               - Number of cases
               - Relative intensity
               - Reported/Estimated status
               - Reporting period
            =========================================== */

            layer.bindTooltip(
              `
                <div style="
                  min-width: 200px;
                  padding: 12px 14px;
                ">

                  <!-- Barangay name -->

                  <div style="
                    font-size: 15px;
                    font-weight: 800;
                    color: #0F3D56;
                    margin-bottom: 6px;
                  ">
                    ${name}
                  </div>


                  <!-- Selected crime -->

                  <div style="
                    font-size: 12px;
                    color: #60747D;
                    margin-bottom: 5px;
                  ">
                    ${crimeLabel}
                  </div>


                  <!-- Number of cases -->

                  <div style="
                    font-size: 20px;
                    line-height: 1.2;
                    font-weight: 800;
                    color: #172B35;
                  ">
                    ${count}
                    ${
                      count === 1
                        ? "case"
                        : "cases"
                    }
                  </div>


                  <!-- Relative intensity -->

                  <div style="
                    margin-top: 6px;
                    font-size: 11px;
                    font-weight: 800;
                    color: ${
                      count === 0
                        ? "#64748B"
                        : getFillColor(
                            count,
                          )
                    };
                  ">
                    ${intensityLabel}
                    intensity
                  </div>


                  <!-- Data source status -->

                  <div style="
                    margin-top: 7px;
                    font-size: 11px;
                    font-weight: 700;
                    color: ${
                      isEstimated
                        ? "#B45309"
                        : "#0F766E"
                    };
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


            /* ===========================================
               CLICKING A BARANGAY

               When the user clicks a polygon:

               → Select that barangay.

               The dashboard can then update its other
               information based on the selected barangay.
            =========================================== */

            layer.on(
              "click",
              () => {
                onBarangayChange(
                  id,
                );
              },
            );


            /* ===========================================
               HOVERING OVER A BARANGAY

               When the mouse moves over a barangay:

               → Make the outline yellow.
               → Make the outline slightly thicker.


               VERY IMPORTANT:

               Hovering DOES NOT change:

               - Number of cases
               - Crime color
               - Relative intensity
               - Fill opacity

               Only the OUTLINE changes.

               This prevents the user from thinking the
               crime intensity changed simply because the
               mouse moved over the barangay.
            =========================================== */

            layer.on(
              "mouseover",
              (event) => {
                /*
                   Get the polygon being hovered.
                */

                const target =
                  event.target as L.Path;


                /*
                   Check whether it is already selected.
                */

                const isSelected =
                  id ===
                  selectedBarangayId;


                /*
                   Change only the border.
                */

                target.setStyle({
                  color:
                    "#FACC15",

                  weight:
                    isSelected
                      ? 4.5
                      : 3.5,
                });


                /*
                   Put the hovered polygon visually above
                   neighboring polygons.
                */

                target.bringToFront();
              },
            );


            /* ===========================================
               WHEN THE MOUSE LEAVES THE BARANGAY

               Restore its normal appearance.

               Selected barangay:
               → Yellow border

               Normal barangay:
               → White border

               The original crime color and intensity are
               also restored.
            =========================================== */

            layer.on(
              "mouseout",
              (event) => {
                /*
                   Get the polygon.
                */

                const target =
                  event.target as L.Path;


                /*
                   Check whether this barangay is selected.
                */

                const isSelected =
                  id ===
                  selectedBarangayId;


                /*
                   Restore its correct style.
                */

                target.setStyle({
                  color:
                    isSelected
                      ? "#FACC15"
                      : "#FFFFFF",

                  weight:
                    isSelected
                      ? 4.5
                      : 2.5,

                  opacity: 1,

                  fillColor:
                    getFillColor(
                      count,
                    ),

                  fillOpacity:
                    getFillOpacity(
                      count,
                      isSelected,
                    ),
                });


                /*
                   Keep the selected barangay visually
                   above neighboring polygons.
                */

                if (isSelected) {
                  target.bringToFront();
                }
              },
            );
          }}
        />


        {/* ===============================================
            CRIME REFERENCE PINS

            Pins appear only when a specific crime is
            selected and the barangay has cases.

            Remember:

            These pins represent BARANGAY REFERENCE
            LOCATIONS.

            They are NOT exact crime incident locations.
        =============================================== */}

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


/* =========================================================
   SIMPLE SUMMARY FOR CRIMINOLOGY STUDENTS
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

   - A crime
   - A year
   - A barangay

              ↓


   STEP 4

   The system determines how many cases should be shown
   for each barangay.

              ↓


   STEP 5

   The system determines whether the displayed value is:

   REPORTED

   or

   ESTIMATED

              ↓


   STEP 6

   The system finds the barangay with the highest number
   of cases under the current filters.

              ↓


   STEP 7

   Every other barangay is compared with that highest
   barangay.

              ↓


   STEP 8

   The system classifies the RELATIVE concentration as:

   Low
   Moderate
   High
   Very High

              ↓


   STEP 9

   The result is displayed geographically using polygon
   color and color intensity.

              ↓


   STEP 10

   The user can hover or click barangays to examine the
   information.


   =========================================================
   HOW TO INTERPRET THE MAP CORRECTLY
   =========================================================

   1. A darker/stronger polygon means a higher RELATIVE
      concentration under the current filters.

   2. A lighter polygon means a lower RELATIVE
      concentration.

   3. Low, Moderate, High, and Very High are visualization
      categories.

   4. They are NOT official crime-risk classifications.

   5. A crime pin does NOT show the exact place where an
      incident happened.

   6. The pin only represents the barangay.

   7. "Reported" means the value comes from the available
      reported dataset.

   8. "Estimated allocation" means the detailed
      Crime × Year × Barangay value was estimated because
      that exact three-way breakdown was not available as
      reported source data.


   =========================================================
   FINAL EXPLANATION
   =========================================================

   Bantay Samal is a crime data visualization tool.

   It helps students, researchers, and other users better
   understand how recorded crime cases are geographically
   distributed among the barangays of Samal, Bataan.

   The interactive map makes statistical information easier
   to interpret by combining crime counts with geographic
   boundaries.

   However, the visualization should not be used by itself
   to declare that a barangay is safe, dangerous, or an
   official crime hotspot.

   The map is intended to SUPPORT the understanding and
   analysis of crime patterns while clearly communicating
   the limitations of the available data.
========================================================= */