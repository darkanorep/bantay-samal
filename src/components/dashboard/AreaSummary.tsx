import { useMemo } from "react";

import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";

import {
  AssessmentOutlined,
  EmojiEventsOutlined,
  LocationOnOutlined,
  ShieldOutlined,
} from "@mui/icons-material";

import crimesData from "../../data/crimes.json";
import estimatedData from "../../data/crime-year-barangay.json";

import { DEFAULT_CRIME_COLOR, getCrimeColor } from "../../utils/crimeColors";

/* =========================================================
   BANTAY SAMAL - AREA SUMMARY
   =========================================================

   PURPOSE OF THIS COMPONENT

   This component gives the user a simple summary of crime
   statistics across the 14 barangays of Samal, Bataan.

   It answers questions such as:

   - How many cases are included in the current filters?
   - Which barangay has the highest number of cases?
   - How many cases are shown for the selected barangay?
   - What is the selected barangay's rank?
   - How do all 14 barangays compare with one another?


   SIMPLE EXAMPLE:

   User selects:

   Crime: Malicious Mischief
   Year: 2025

              ↓

   Area Summary calculates:

   Municipality Total
   Highest Barangay
   Selected Barangay
   Barangay Rank
   Complete Barangay Ranking


   IMPORTANT:

   This component does NOT determine whether a barangay is
   safe or dangerous.

   It only summarizes and compares the number of cases
   available under the selected filters.
========================================================= */

/* =========================================================
   DATA SOURCES
   =========================================================

   crimes.json

   Contains the reported crime statistics, including:

   - Municipality total
   - Yearly totals
   - Crime totals
   - Crime × Year totals
   - Crime × Barangay totals
   - Barangay totals


   crime-year-barangay.json

   Contains ESTIMATED allocations used when the user
   requests a specific:

   Crime × Year × Barangay

   combination.


   crimeColors.ts

   Provides the visual color assigned to the selected
   crime.

   The colors help keep the dashboard visually consistent.
========================================================= */

/* =========================================================
   COMPONENT INPUTS
   =========================================================

   These values come from the main dashboard.

   selectedYear
   → The year selected by the user.

   selectedCrimeId
   → The crime selected by the user.

   selectedBarangayId
   → The barangay selected by the user.

   onBarangayChange
   → Tells the dashboard when the user selects a barangay
     from this ranking.
========================================================= */

type AreaSummaryProps = {
  selectedYear: string;
  selectedCrimeId: string;
  selectedBarangayId: string;

  onBarangayChange: (barangayId: string) => void;
};

/* =========================================================
   DATA TYPES
   =========================================================

   These types tell TypeScript how the estimated allocation
   data is organized.

   BarangayCounts

   Example:

   {
     gugo: 3,
     ibaba: 1,
     lalawigan: 2
   }


   YearAllocations

   Example:

   {
     "2024": {...barangay counts...},
     "2025": {...barangay counts...},
     "2026": {...barangay counts...}
   }


   CrimeAllocations

   Stores the yearly allocations for every crime.
========================================================= */

type BarangayCounts = Record<string, number>;

type YearAllocations = Record<string, BarangayCounts>;

type CrimeAllocations = Record<string, YearAllocations>;

/*
   Get the estimated Crime × Year × Barangay allocation
   information from the JSON dataset.
*/

const allocations = estimatedData.allocations as CrimeAllocations;

/* =========================================================
   14 BARANGAYS OF SAMAL
   =========================================================

   This list gives the system the ID and readable name of
   every barangay included in Bantay Samal.

   The ID is used internally by the program.

   The name is what the user sees on the dashboard.
========================================================= */

const barangays = [
  {
    id: "east-calaguiman",
    name: "East Calaguiman",
  },
  {
    id: "east-daang-bago",
    name: "East Daang Bago",
  },
  {
    id: "gugo",
    name: "Gugo",
  },
  {
    id: "ibaba",
    name: "Ibaba",
  },
  {
    id: "imelda",
    name: "Imelda",
  },
  {
    id: "lalawigan",
    name: "Lalawigan",
  },
  {
    id: "palili",
    name: "Palili",
  },
  {
    id: "san-juan",
    name: "San Juan",
  },
  {
    id: "santa-lucia",
    name: "Santa Lucia",
  },
  {
    id: "sapa",
    name: "Sapa",
  },
  {
    id: "tabing-ilog",
    name: "Tabing Ilog",
  },
  {
    id: "west-calaguiman",
    name: "West Calaguiman",
  },
  {
    id: "west-daang-bago",
    name: "West Daang Bago",
  },
  {
    id: "san-roque",
    name: "San Roque",
  },
];

/* =========================================================
   MAIN AREA SUMMARY COMPONENT
========================================================= */

export default function AreaSummary({
  selectedYear,
  selectedCrimeId,
  selectedBarangayId,
  onBarangayChange,
}: AreaSummaryProps) {
  /* =======================================================
     FIND THE SELECTED CRIME
     =======================================================

     The dashboard stores the selected crime using an ID.

     Example:

     selectedCrimeId:
     "malicious-mischief"

              ↓

     The system searches crimes.json

              ↓

     It finds:

     Malicious Mischief


     If "all" is selected, there is no single crime record
     because the user is viewing all crimes together.
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
     ACTIVE CRIME COLOR
     =======================================================

     Every crime has an assigned dashboard color.

     Example:

     Malicious Mischief
              ↓
     Assigned crime color

     That color is used for:

     - Icons
     - Progress bars
     - Selected barangay
     - Ranking highlights

     If "All Crimes" is selected, the dashboard uses the
     default crime color.
  ======================================================= */

  const activeColor =
    selectedCrimeId === "all"
      ? DEFAULT_CRIME_COLOR
      : getCrimeColor(selectedCrimeId);

  /* =======================================================
     FIND THE SELECTED BARANGAY
     =======================================================

     Example:

     selectedBarangayId = "gugo"

              ↓

     Search the barangay list

              ↓

     Return:

     {
       id: "gugo",
       name: "Gugo"
     }


     If "All Barangays" is selected, no individual
     barangay is returned.
  ======================================================= */

  const selectedBarangay = useMemo(() => {
    return (
      barangays.find((barangay) => barangay.id === selectedBarangayId) ?? null
    );
  }, [selectedBarangayId]);

  /* =======================================================
     CALCULATE THE VALUE OF EVERY BARANGAY
     =======================================================

     This is one of the most important parts of the
     Area Summary.


     THERE ARE TWO SITUATIONS:


     1. ALL YEARS / 2024-2026

        Barangay values come from the REPORTED dataset.


     2. SPECIFIC YEAR

        Barangay values come from the ESTIMATED allocation
        dataset.


     WHY?

     The available reported data provides Crime × Barangay
     totals for the complete reporting period.

     However, it does not provide every exact:

     Crime × Year × Barangay

     combination.

     Therefore, specific-year barangay values use the
     estimated allocation dataset.
  ======================================================= */

  const barangayValues = useMemo(() => {
    /*
         Go through all 14 barangays.
      */

    return barangays.map((barangay) => {
      /*
             Start the barangay at zero cases.
          */

      let value = 0;

      /* =================================================
             SITUATION 1:
             ALL YEARS / 2024-2026
             =================================================

             These barangay values are based on reported
             totals.
          ================================================= */

      if (selectedYear === "all") {
        /* -----------------------------------------------
               ALL CRIMES + ALL YEARS

               Example:

               Crime:
               All Crimes

               Year:
               2024-2026

                        ↓

               Use the reported total for each barangay.
            ----------------------------------------------- */

        if (selectedCrimeId === "all") {
          value =
            crimesData.barangayTotals[
              barangay.id as keyof typeof crimesData.barangayTotals
            ] ?? 0;
        } else if (selectedCrime) {

        /* -----------------------------------------------
               SPECIFIC CRIME + ALL YEARS

               Example:

               Crime:
               Malicious Mischief

               Year:
               2024-2026

                        ↓

               Use the reported Crime × Barangay total.
            ----------------------------------------------- */
          const crimeBarangays = selectedCrime.barangays as Record<
            string,
            number
          >;

          value = crimeBarangays[barangay.id] ?? 0;
        }
      } else {

      /* =================================================
             SITUATION 2:
             SPECIFIC YEAR
             =================================================

             Barangay values are estimated because the exact
             Crime × Year × Barangay breakdown was not
             available as reported source data.
          ================================================= */
        /* -----------------------------------------------
               SPECIFIC CRIME + SPECIFIC YEAR

               Example:

               Crime:
               Malicious Mischief

               Year:
               2025

               Barangay:
               Gugo

                        ↓

               Use estimated allocation.
            ----------------------------------------------- */

        if (selectedCrimeId !== "all") {
          value =
            allocations[selectedCrimeId]?.[selectedYear]?.[barangay.id] ?? 0;
        } else {

        /* -----------------------------------------------
               ALL CRIMES + SPECIFIC YEAR

               Example:

               Crime:
               All Crimes

               Year:
               2025

                        ↓

               Add the estimated values from every crime
               category for this barangay.
            ----------------------------------------------- */
          value = Object.values(allocations).reduce(
            (total, crimeAllocation) => {
              return (
                total + (crimeAllocation[selectedYear]?.[barangay.id] ?? 0)
              );
            },
            0,
          );
        }
      }

      /*
             Return the barangay together with its
             calculated value.

             Example:

             {
               id: "gugo",
               name: "Gugo",
               value: 10
             }
          */

      return {
        ...barangay,
        value,
      };
    });
  }, [selectedYear, selectedCrimeId, selectedCrime]);

  /* =======================================================
     RANK THE BARANGAYS
     =======================================================

     The barangays are arranged from the highest case count
     to the lowest case count.


     EXAMPLE:

     Gugo               10
     Lalawigan            8
     East Calaguiman      5
     Ibaba                 2

              ↓

     Ranking:

     #1 Gugo
     #2 Lalawigan
     #3 East Calaguiman
     #4 Ibaba


     If two barangays have the same number of cases, their
     names are arranged alphabetically.


     IMPORTANT CRIMINOLOGY NOTE:

     Rank #1 means:

     "This barangay has the highest case count under the
     current filters."

     It does NOT automatically mean:

     "This is the most dangerous barangay."
  ======================================================= */

  const rankedBarangays = useMemo(() => {
    return [...barangayValues].sort((a, b) => {
      /*
           First sort by case count.
        */

      if (b.value !== a.value) {
        return b.value - a.value;
      }

      /*
           If the counts are equal, sort alphabetically.
        */

      return a.name.localeCompare(b.name);
    });
  }, [barangayValues]);

  /* =======================================================
     SELECTED BARANGAY VALUE
     =======================================================

     If the user selects a barangay, find how many cases
     are currently shown for that barangay.

     Example:

     Selected:
     Gugo

     Current filters:
     Malicious Mischief + 2025

              ↓

     Selected Value:
     3 cases


     If no individual barangay is selected, return null.
  ======================================================= */

  const selectedValue = useMemo(() => {
    if (!selectedBarangay) {
      return null;
    }

    return (
      barangayValues.find((barangay) => barangay.id === selectedBarangay.id)
        ?.value ?? 0
    );
  }, [barangayValues, selectedBarangay]);

  /* =======================================================
     SELECTED BARANGAY RANK
     =======================================================

     This finds the selected barangay's position in the
     ranking.

     Example:

     #1 Gugo
     #2 Lalawigan
     #3 Ibaba

     If Ibaba is selected:

     selectedRank = 3
  ======================================================= */

  const selectedRank = useMemo(() => {
    /*
         No barangay selected.
      */

    if (!selectedBarangay) {
      return null;
    }

    /*
         Find the selected barangay in the ranked list.
      */

    const index = rankedBarangays.findIndex(
      (barangay) => barangay.id === selectedBarangay.id,
    );

    /*
         Stop if it cannot be found.
      */

    if (index === -1) {
      return null;
    }

    /*
         Array positions start at 0.

         Human-readable rankings start at 1.

         Therefore:

         index 0 → Rank #1
         index 1 → Rank #2
         index 2 → Rank #3
      */

    return index + 1;
  }, [rankedBarangays, selectedBarangay]);

  /* =======================================================
     HIGHEST BARANGAY
     =======================================================

     Because rankedBarangays is already arranged from
     highest to lowest, the first barangay is the one with
     the highest case count.

     IMPORTANT:

     "Highest" refers only to the current filters.
  ======================================================= */

  const highestBarangay = rankedBarangays[0];

  /* =======================================================
     MAXIMUM VALUE FOR PROGRESS BARS
     =======================================================

     The highest barangay is used as the reference point
     for the progress bars.

     EXAMPLE:

     Highest barangay = 10 cases

     Gugo        10 → 100%
     Lalawigan    5 → 50%
     Ibaba         2 → 20%


     The progress bars are visual comparisons.

     They are NOT percentages of crime risk.
  ======================================================= */

  const maxBarangayValue = Math.max(highestBarangay?.value ?? 0, 1);

  /* =======================================================
     MUNICIPALITY-WIDE TOTAL
     =======================================================

     This number is handled differently from the detailed
     barangay allocation.

     The municipality total remains REPORTED because the
     source dataset directly provides:

     - Overall municipality total
     - Yearly municipality totals
     - Crime totals
     - Crime × Year totals


     Therefore, even if the individual barangay values for
     a specific year are estimated, the municipality-wide
     total can still use reported data.


     THIS IS AN IMPORTANT DISTINCTION:

     Example:

     Malicious Mischief + 2025

     Municipality total:
     REPORTED

     Individual barangay allocation:
     ESTIMATED
  ======================================================= */

  const municipalityTotal = useMemo(() => {
    /* ---------------------------------------------------
         ALL CRIMES + ALL YEARS

         Example:

         All Crimes
         2024-2026

         Use the reported overall total.
      --------------------------------------------------- */

    if (selectedCrimeId === "all" && selectedYear === "all") {
      return crimesData.meta.totalReportedCases;
    }

    /* ---------------------------------------------------
         ALL CRIMES + SPECIFIC YEAR

         Example:

         All Crimes
         2025

         Use the reported 2025 municipality total.
      --------------------------------------------------- */

    if (selectedCrimeId === "all" && selectedYear !== "all") {
      return (
        crimesData.yearlyTotals[
          selectedYear as keyof typeof crimesData.yearlyTotals
        ] ?? 0
      );
    }

    /* ---------------------------------------------------
         SPECIFIC CRIME + ALL YEARS

         Example:

         Malicious Mischief
         2024-2026

         Use the reported total for that crime.
      --------------------------------------------------- */

    if (selectedCrime && selectedYear === "all") {
      return selectedCrime.total;
    }

    /* ---------------------------------------------------
         SPECIFIC CRIME + SPECIFIC YEAR

         Example:

         Malicious Mischief
         2025

         Use the reported Crime × Year total.
      --------------------------------------------------- */

    if (selectedCrime && selectedYear !== "all") {
      return (
        selectedCrime.yearly[
          selectedYear as keyof typeof selectedCrime.yearly
        ] ?? 0
      );
    }

    /*
         Fallback value.
      */

    return 0;
  }, [selectedYear, selectedCrimeId, selectedCrime]);

  /* =======================================================
     DISPLAY LABELS
     =======================================================

     These values make the raw IDs easier for users to
     understand.
  ======================================================= */

  /*
     "all" becomes "2024–2026".

     Otherwise display the selected year.
  */

  const yearLabel = selectedYear === "all" ? "2024–2026" : selectedYear;

  /*
     Show the actual crime name.

     If no specific crime is selected:

     "All Crimes"
  */

  const crimeLabel = selectedCrime?.name ?? "All Crimes";

  /*
     If a specific year is selected, the barangay-level
     values are estimated.

     If all years are selected, the barangay values are
     reported.
  */

  const isBarangayDataEstimated = selectedYear !== "all";

  /* =======================================================
     SELECT A BARANGAY FROM THE RANKING
     =======================================================

     When a user clicks one of the barangays in the ranking:

     1. Tell the main dashboard which barangay was selected.
     2. Smoothly scroll back to the top of the page.

     This allows the map and other dashboard sections to
     update to the same barangay.
  ======================================================= */

  const handleBarangaySelect = (barangayId: string) => {
    /*
       Update the dashboard selection.
    */

    onBarangayChange(barangayId);

    /*
       Move the user back toward the top of the dashboard.
    */

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     USER INTERFACE
     =======================================================

     Everything below controls what the user actually sees.

     The Area Summary contains:

     1. Header
     2. Data-status label
     3. Municipality Total
     4. Highest Count
     5. Selected Barangay
     6. Barangay Rank
     7. Complete Barangay Ranking
     8. Methodology Notice
  ======================================================= */

  return (
    <Paper
      variant="outlined"
      sx={{
        mt: {
          xs: 2,
          sm: 2.5,
        },

        p: {
          xs: 1.5,
          sm: 2.5,
        },

        borderRadius: 3,

        minWidth: 0,

        overflow: "hidden",
      }}
    >
      {/* =================================================
          AREA SUMMARY HEADER

          Shows:

          - Section title
          - Selected crime
          - Selected year
          - Whether barangay values are reported or
            estimated
      ================================================= */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={{
          xs: 1.25,
          sm: 2,
        }}
        sx={{
          justifyContent: "space-between",

          alignItems: {
            xs: "stretch",
            sm: "center",
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            minWidth: 0,

            alignItems: "flex-start",
          }}
        >
          {/* Section icon */}

          <Box
            sx={{
              width: 38,
              height: 38,

              flexShrink: 0,

              display: "grid",

              placeItems: "center",

              borderRadius: 2,

              bgcolor: `${activeColor}12`,

              color: activeColor,
            }}
          >
            <AssessmentOutlined
              sx={{
                fontSize: 21,
              }}
            />
          </Box>

          {/* Section title */}

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,

                color: "text.primary",

                lineHeight: 1.3,
              }}
            >
              Area Summary
            </Typography>

            {/* Current crime and year */}

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",

                mt: 0.25,

                lineHeight: 1.4,

                overflowWrap: "anywhere",
              }}
            >
              {crimeLabel} • {yearLabel}
            </Typography>
          </Box>
        </Stack>

        {/* =================================================
            DATA STATUS

            Green:
            Reported Barangay Data

            Brown/Amber:
            Estimated Barangay Allocation

            This is important because the user should always
            know whether the barangay-level values are
            directly reported or estimated.
        ================================================= */}

        <Chip
          size="small"
          label={
            isBarangayDataEstimated
              ? "Estimated Barangay Allocation"
              : "Reported Barangay Data"
          }
          sx={{
            alignSelf: {
              xs: "flex-start",
              sm: "auto",
            },

            height: 24,

            fontSize: "0.68rem",

            fontWeight: 800,

            bgcolor: isBarangayDataEstimated
              ? "rgba(180,83,9,0.09)"
              : "rgba(15,118,110,0.09)",

            color: isBarangayDataEstimated ? "#92400E" : "#0F766E",

            border: "1px solid",

            borderColor: isBarangayDataEstimated
              ? "rgba(180,83,9,0.18)"
              : "rgba(15,118,110,0.18)",
          }}
        />
      </Stack>

      {/* Divider between header and summary */}

      <Divider
        sx={{
          my: {
            xs: 1.5,
            sm: 2,
          },
        }}
      />

      {/* =================================================
          SUMMARY CARDS

          These four cards give the user a quick overview:

          1. Municipality Total
          2. Highest Count
          3. Selected Barangay
          4. Barangay Rank
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",

            md: "repeat(4, minmax(0, 1fr))",
          },

          gap: {
            xs: 1,
            sm: 1.5,
          },
        }}
      >
        {/* =================================================
            CARD 1: MUNICIPALITY TOTAL

            This is the municipality-wide number of cases
            under the current filters.

            This value remains REPORTED.
        ================================================= */}

        <Box
          sx={{
            p: {
              xs: 1.25,
              sm: 2,
            },

            minWidth: 0,

            border: "1px solid",

            borderColor: "divider",

            borderRadius: 2.5,

            bgcolor: "background.paper",
          }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: "center",
            }}
          >
            <ShieldOutlined
              sx={{
                fontSize: 18,

                color: activeColor,
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                minWidth: 0,

                fontWeight: 700,

                lineHeight: 1.25,
              }}
            >
              Municipality Total
            </Typography>
          </Stack>

          {/* Reported total */}

          <Typography
            variant="h4"
            sx={{
              mt: 1,

              fontWeight: 900,

              color: "text.primary",

              fontSize: {
                xs: "1.55rem",
                sm: "2rem",
              },
            }}
          >
            {municipalityTotal}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",

              lineHeight: 1.3,
            }}
          >
            reported {municipalityTotal === 1 ? "case" : "cases"}
          </Typography>
        </Box>

        {/* =================================================
            CARD 2: HIGHEST BARANGAY COUNT

            Shows the largest barangay case count under the
            current filters.

            IMPORTANT:

            "Highest Count" does NOT automatically mean
            "Most Dangerous Barangay."
        ================================================= */}

        <Box
          sx={{
            p: {
              xs: 1.25,
              sm: 2,
            },

            minWidth: 0,

            border: "1px solid",

            borderColor: "divider",

            borderRadius: 2.5,

            bgcolor: "background.paper",
          }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: "center",
            }}
          >
            <EmojiEventsOutlined
              sx={{
                fontSize: 18,

                color: activeColor,
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                minWidth: 0,

                fontWeight: 700,

                lineHeight: 1.25,
              }}
            >
              Highest Count
            </Typography>
          </Stack>

          {/* Highest case count */}

          <Typography
            variant="h4"
            sx={{
              mt: 1,

              fontWeight: 900,

              color: activeColor,

              fontSize: {
                xs: "1.55rem",
                sm: "2rem",
              },
            }}
          >
            {highestBarangay?.value ?? 0}
          </Typography>

          {/* Name of the highest barangay */}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",

              overflow: "hidden",

              textOverflow: "ellipsis",

              whiteSpace: "nowrap",
            }}
          >
            {highestBarangay?.name ?? "No data"}
          </Typography>
        </Box>

        {/* =================================================
            CARD 3: SELECTED BARANGAY

            Shows the case count of the barangay currently
            selected by the user.

            If no barangay is selected:

            Value → —
            Name  → All Barangays
        ================================================= */}

        <Box
          sx={{
            p: {
              xs: 1.25,
              sm: 2,
            },

            minWidth: 0,

            border: "1px solid",

            borderColor: selectedBarangay ? activeColor : "divider",

            borderRadius: 2.5,

            bgcolor: selectedBarangay ? `${activeColor}08` : "background.paper",
          }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: "center",
            }}
          >
            <LocationOnOutlined
              sx={{
                fontSize: 18,

                color: selectedBarangay ? activeColor : "text.secondary",
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                minWidth: 0,

                fontWeight: 700,

                lineHeight: 1.25,
              }}
            >
              Selected Barangay
            </Typography>
          </Stack>

          {/* Selected barangay case count */}

          <Typography
            variant="h4"
            sx={{
              mt: 1,

              fontWeight: 900,

              color: selectedBarangay ? activeColor : "text.primary",

              fontSize: {
                xs: "1.55rem",
                sm: "2rem",
              },
            }}
          >
            {selectedBarangay ? selectedValue : "—"}
          </Typography>

          {/* Selected barangay name */}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",

              overflow: "hidden",

              textOverflow: "ellipsis",

              whiteSpace: "nowrap",
            }}
          >
            {selectedBarangay?.name ?? "All Barangays"}
          </Typography>
        </Box>

        {/* =================================================
            CARD 4: BARANGAY RANK

            Shows the selected barangay's position among
            the 14 barangays under the current filters.

            Example:

            #3
            among 14 barangays


            IMPORTANT:

            Ranking is based only on case count.

            It is NOT an official danger or safety ranking.
        ================================================= */}

        <Box
          sx={{
            p: {
              xs: 1.25,
              sm: 2,
            },

            minWidth: 0,

            border: "1px solid",

            borderColor: selectedBarangay ? activeColor : "divider",

            borderRadius: 2.5,

            bgcolor: selectedBarangay ? `${activeColor}08` : "background.paper",
          }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: "center",
            }}
          >
            <AssessmentOutlined
              sx={{
                fontSize: 18,

                color: selectedBarangay ? activeColor : "text.secondary",
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                minWidth: 0,

                fontWeight: 700,

                lineHeight: 1.25,
              }}
            >
              Barangay Rank
            </Typography>
          </Stack>

          {/* Rank number */}

          <Typography
            variant="h4"
            sx={{
              mt: 1,

              fontWeight: 900,

              color: selectedBarangay ? activeColor : "text.primary",

              fontSize: {
                xs: "1.55rem",
                sm: "2rem",
              },
            }}
          >
            {selectedRank ? `#${selectedRank}` : "—"}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",

              lineHeight: 1.3,
            }}
          >
            {selectedBarangay ? "among 14 barangays" : "Select a barangay"}
          </Typography>
        </Box>
      </Box>

      {/* =================================================
          COMPLETE BARANGAY RANKING

          This section lists all 14 barangays from the
          highest case count to the lowest case count.

          Users can click a barangay to select it.

          The progress bar provides a quick visual
          comparison with the highest barangay.

          IMPORTANT:

          The progress bar represents relative case count.

          It is NOT a crime-risk percentage.
      ================================================= */}

      <Box
        sx={{
          mt: {
            xs: 2.5,
            sm: 3,
          },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,

            color: "text.primary",
          }}
        >
          Barangay Ranking
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",

            mt: 0.25,

            lineHeight: 1.5,
          }}
        >
          Ranked by case count for the current crime and year filters.
        </Typography>

        <Stack
          spacing={0.85}
          sx={{
            mt: 1.75,
          }}
        >
          {rankedBarangays.map((barangay, index) => {
            /*
                 Check whether this row is the currently
                 selected barangay.
              */

            const isSelected = barangay.id === selectedBarangayId;

            /* ===========================================
                 PROGRESS BAR CALCULATION

                 Formula:

                 Barangay cases
                 ---------------- × 100
                 Highest cases


                 Example:

                 Highest = 10 cases

                 Barangay = 5 cases

                 5 ÷ 10 × 100 = 50%


                 If the barangay has cases but the calculated
                 bar would be extremely small, the system
                 displays at least 4% so it remains visible.


                 IMPORTANT:

                 This percentage is a VISUAL COMPARISON.

                 It is not a percentage of crime risk.
              =========================================== */

            const progress =
              barangay.value === 0
                ? 0
                : Math.max(4, (barangay.value / maxBarangayValue) * 100);

            return (
              <Box
                key={barangay.id}
                /*
                     Makes the row behave like a button.
                  */

                role="button"
                /*
                     Allows keyboard users to focus the row.
                  */

                tabIndex={0}
                /*
                     Accessibility description.
                  */

                aria-label={`Select ${barangay.name}, ${barangay.value} ${
                  barangay.value === 1 ? "case" : "cases"
                }`}
                /* ---------------------------------------
                     MOUSE SELECTION

                     Clicking the row selects the barangay.
                  --------------------------------------- */

                onClick={() => handleBarangaySelect(barangay.id)}
                /* ---------------------------------------
                     KEYBOARD SELECTION

                     Pressing Enter or Space also selects
                     the barangay.

                     This makes the dashboard more
                     accessible.
                  --------------------------------------- */

                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();

                    handleBarangaySelect(barangay.id);
                  }
                }}
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "30px minmax(0, 1fr) auto",

                    sm: "40px minmax(0, 1fr) auto",
                  },

                  alignItems: "center",

                  gap: {
                    xs: 0.8,
                    sm: 1.5,
                  },

                  px: {
                    xs: 1,
                    sm: 1.5,
                  },

                  py: {
                    xs: 1,
                    sm: 1.2,
                  },

                  minWidth: 0,

                  border: "1px solid",

                  borderColor: isSelected ? activeColor : "divider",

                  borderRadius: 2,

                  bgcolor: isSelected ? `${activeColor}08` : "background.paper",

                  cursor: "pointer",

                  transition:
                    "border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease",

                  /*
                       Highlight the row when the mouse
                       moves over it.
                    */

                  "&:hover": {
                    borderColor: activeColor,

                    bgcolor: `${activeColor}08`,

                    boxShadow: "0 3px 10px rgba(15,61,86,0.07)",
                  },

                  /*
                       Keyboard accessibility outline.
                    */

                  "&:focus-visible": {
                    outline: `2px solid ${activeColor}`,

                    outlineOffset: "2px",
                  },
                }}
              >
                {/* =====================================
                      RANK NUMBER

                      Example:

                      1
                      2
                      3
                      4
                  ===================================== */}

                <Box
                  sx={{
                    width: {
                      xs: 26,
                      sm: 32,
                    },

                    height: {
                      xs: 26,
                      sm: 32,
                    },

                    display: "grid",

                    placeItems: "center",

                    borderRadius: "50%",

                    /*
                         Give the #1 barangay a stronger
                         visual highlight.
                      */

                    bgcolor:
                      index === 0 ? `${activeColor}16` : "rgba(15,61,86,0.05)",

                    color: index === 0 ? activeColor : "text.secondary",

                    fontSize: {
                      xs: "0.68rem",
                      sm: "0.75rem",
                    },

                    fontWeight: 900,
                  }}
                >
                  {index + 1}
                </Box>

                {/* =====================================
                      BARANGAY INFORMATION

                      Contains:

                      - Location icon
                      - Barangay name
                      - Selected label
                      - Relative progress bar
                  ===================================== */}

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={0.7}
                    sx={{
                      minWidth: 0,

                      alignItems: "center",
                    }}
                  >
                    <LocationOnOutlined
                      sx={{
                        fontSize: 16,

                        flexShrink: 0,

                        color: isSelected ? activeColor : "text.secondary",
                      }}
                    />

                    {/* Barangay name */}

                    <Typography
                      variant="body2"
                      sx={{
                        minWidth: 0,

                        fontWeight: isSelected ? 800 : 600,

                        color: "text.primary",

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        whiteSpace: "nowrap",
                      }}
                    >
                      {barangay.name}
                    </Typography>

                    {/* Show "Selected" on desktop */}

                    {isSelected && (
                      <Chip
                        label="Selected"
                        size="small"
                        sx={{
                          display: {
                            xs: "none",
                            sm: "inline-flex",
                          },

                          height: 20,

                          flexShrink: 0,

                          fontSize: "0.63rem",

                          fontWeight: 800,

                          bgcolor: `${activeColor}14`,

                          color: activeColor,
                        }}
                      />
                    )}
                  </Stack>

                  {/* ===================================
                        RELATIVE PROGRESS BAR

                        The highest barangay gets the
                        longest bar.

                        Other barangays receive shorter
                        bars based on their case count.

                        This is for visual comparison only.
                    =================================== */}

                  <Box
                    sx={{
                      mt: 0.7,

                      height: 4,

                      width: "100%",

                      maxWidth: 420,

                      overflow: "hidden",

                      borderRadius: 99,

                      bgcolor: "rgba(15,61,86,0.07)",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${progress}%`,

                        height: "100%",

                        borderRadius: 99,

                        bgcolor:
                          barangay.value > 0 ? activeColor : "transparent",

                        transition: "width 0.25s ease",
                      }}
                    />
                  </Box>
                </Box>

                {/* =====================================
                      CASE COUNT

                      Displays the number of cases for
                      this barangay under the current
                      filters.
                  ===================================== */}

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  spacing={{
                    xs: 0,
                    sm: 0.75,
                  }}
                  sx={{
                    flexShrink: 0,

                    alignItems: {
                      xs: "flex-end",
                      sm: "center",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 900,

                      color:
                        barangay.value > 0 ? activeColor : "text.secondary",
                    }}
                  >
                    {barangay.value}
                  </Typography>

                  {/* Show case/cases text on larger screens */}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: {
                        xs: "none",
                        sm: "block",
                      },
                    }}
                  >
                    {barangay.value === 1 ? "case" : "cases"}
                  </Typography>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* =================================================
          METHODOLOGY / DATA STATUS NOTICE

          This notice explains where the barangay values
          came from.

          ALL YEARS:

          → Reported barangay data


          SPECIFIC YEAR:

          → Estimated barangay allocation


          IMPORTANT:

          Even when the barangay distribution is estimated,
          the municipality-wide total remains reported
          because the yearly municipality total is directly
          available in the source dataset.
      ================================================= */}

      <Box
        sx={{
          mt: {
            xs: 2,
            sm: 2.5,
          },

          p: {
            xs: 1.25,
            sm: 1.5,
          },

          bgcolor: isBarangayDataEstimated
            ? "rgba(180,83,9,0.06)"
            : "rgba(15,118,110,0.06)",

          border: "1px solid",

          borderColor: isBarangayDataEstimated
            ? "rgba(180,83,9,0.14)"
            : "rgba(15,118,110,0.14)",

          borderRadius: 2,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "flex-start",
          }}
        >
          {/* Small status indicator */}

          <Box
            sx={{
              width: 7,
              height: 7,

              mt: "5px",

              flexShrink: 0,

              borderRadius: "50%",

              bgcolor: isBarangayDataEstimated ? "#B45309" : "#0F766E",
            }}
          />

          {/* Data explanation */}

          <Typography
            variant="caption"
            sx={{
              display: "block",

              lineHeight: 1.55,

              color: isBarangayDataEstimated ? "#92400E" : "#0F766E",
            }}
          >
            {isBarangayDataEstimated
              ? `Barangay values for ${yearLabel} are estimated allocations. The municipality-wide total remains based on the reported ${yearLabel} data.`
              : "Barangay values are based on the reported 2024–2026 crime-by-barangay totals."}
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
}

/* =========================================================
   SIMPLE SUMMARY FOR CRIMINOLOGY STUDENTS
   =========================================================

   HOW DOES AREA SUMMARY WORK?


   STEP 1

   The user chooses:

   - Crime
   - Year
   - Barangay

              ↓


   STEP 2

   The system determines whether barangay-level values
   should use:

   REPORTED DATA

   or

   ESTIMATED ALLOCATION

              ↓


   STEP 3

   The system calculates the number of cases for all
   14 barangays.

              ↓


   STEP 4

   The barangays are arranged from the highest case count
   to the lowest case count.

              ↓


   STEP 5

   The system identifies:

   - Municipality total
   - Highest barangay count
   - Selected barangay count
   - Selected barangay rank

              ↓


   STEP 6

   The complete ranking is displayed.

              ↓


   STEP 7

   Users can click a barangay from the ranking to select
   it on the dashboard.


   =========================================================
   REPORTED VS ESTIMATED
   =========================================================

   ALL YEARS / 2024-2026

   Barangay values:
   REPORTED


   SPECIFIC YEAR

   Barangay values:
   ESTIMATED


   MUNICIPALITY-WIDE TOTAL

   Remains REPORTED because the dataset directly provides
   the municipality totals by year and crime.


   =========================================================
   HOW TO INTERPRET THE RANKING
   =========================================================

   A higher rank means that the barangay has a higher
   number of cases under the CURRENT filters.

   For example:

   #1 Gugo        = 10 cases
   #2 Lalawigan   = 8 cases
   #3 Ibaba       = 5 cases


   This DOES mean:

   "Gugo has the highest number of cases under the current
   crime and year filters."


   This DOES NOT automatically mean:

   "Gugo is the most dangerous barangay."


   Case count alone does not automatically measure:

   - Crime risk
   - Public safety
   - Population-adjusted crime rate
   - Probability of victimization
   - Official hotspot classification


   =========================================================
   PROGRESS BAR INTERPRETATION
   =========================================================

   The progress bar compares each barangay with the
   barangay having the highest case count.

   Example:

   Highest barangay:
   10 cases = 100%

   Another barangay:
   5 cases = 50%

   Another barangay:
   2 cases = 20%


   These percentages are VISUAL COMPARISONS.

   They are NOT crime-risk percentages.


   =========================================================
   FINAL CRIMINOLOGY EXPLANATION
   =========================================================

   The Area Summary component helps users compare the
   distribution of crime cases among the 14 barangays of
   Samal, Bataan.

   It identifies which barangays have higher or lower case
   counts under the selected crime and year filters and
   presents the information through totals, rankings, and
   progress bars.

   The component also distinguishes reported data from
   estimated barangay allocations.

   The rankings should be interpreted as comparisons of
   CASE COUNTS only and should not automatically be used
   to classify a barangay as safe, dangerous, or an
   official crime hotspot.

   The purpose of this component is to make crime
   statistics easier for criminology students, researchers,
   and other users to understand and compare.
========================================================= */
