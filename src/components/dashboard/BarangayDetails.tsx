import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  AssessmentOutlined,
  CloseOutlined,
  FilterAltOutlined,
  LocationOnOutlined,
  ShieldOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

import crimesData from "../../data/crimes.json";
import estimatedData from "../../data/crime-year-barangay.json";

import { DEFAULT_CRIME_COLOR, getCrimeColor } from "../../utils/crimeColors";

/* =========================================================
   BANTAY SAMAL - BARANGAY DETAILS
   =========================================================

   PURPOSE OF THIS COMPONENT

   BarangayDetails shows a detailed profile of ONE selected
   barangay in Samal, Bataan.

   When the user clicks or selects a barangay, this dialog
   opens and answers questions such as:

   - How many cases are shown under the current filters?
   - Is that number reported or estimated?
   - How many total reported cases does the barangay have?
   - What crime types were recorded in the barangay?
   - Which crime type has the highest recorded count?
   - How are the recorded crimes distributed?


   SIMPLE EXAMPLE:

   User selects:

   Barangay: Gugo
   Crime: Malicious Mischief
   Year: 2025

                ↓

   BarangayDetails opens

                ↓

   It shows:

   Gugo
   Malicious Mischief
   2025
   Estimated value

   It also shows Gugo's complete reported 2024–2026
   barangay profile.


   IMPORTANT:

   This component does NOT automatically classify a
   barangay as:

   - Dangerous
   - Safe
   - High risk
   - Crime hotspot

   It only presents the crime statistics available in
   the Bantay Samal dataset.
========================================================= */

/* =========================================================
   DATA SOURCES
   =========================================================

   crimes.json

   Contains the REPORTED information used by this component:

   - Barangay totals
   - Crime totals
   - Crime × Barangay totals
   - Crime legal information


   crime-year-barangay.json

   Contains ESTIMATED allocations.

   These are needed because the original source data does
   not directly provide every:

   Crime × Year × Barangay

   combination.


   crimeColors.ts

   Gives every crime category its own dashboard color.

   These colors are only for visualization and do not
   represent crime severity.
========================================================= */

/* =========================================================
   COMPONENT INPUTS
   =========================================================

   open
   → Controls whether the dialog is visible.

   barangayId
   → The barangay selected by the user.

   selectedYear
   → The currently selected year.

   selectedCrimeId
   → The currently selected crime.

   onClose
   → Function used to close the dialog.
========================================================= */

type BarangayDetailsProps = {
  open: boolean;

  barangayId: string;

  selectedYear: string;

  selectedCrimeId: string;

  onClose: () => void;
};

/* =========================================================
   ESTIMATED DATA TYPES
   =========================================================

   These types describe how the estimated allocation JSON
   is structured.


   BarangayCounts

   Example:

   {
     gugo: 3,
     ibaba: 1,
     sapa: 2
   }


   YearAllocations

   Example:

   {
     "2024": {...},
     "2025": {...},
     "2026": {...}
   }


   CrimeAllocations

   Example:

   {
     "malicious-mischief": {
       "2024": {...},
       "2025": {...},
       "2026": {...}
     }
   }
========================================================= */

type BarangayCounts = Record<string, number>;

type YearAllocations = Record<string, BarangayCounts>;

type CrimeAllocations = Record<string, YearAllocations>;

/*
   Store the estimated allocation data in a form that
   TypeScript understands.
*/

const allocations = estimatedData.allocations as CrimeAllocations;

/* =========================================================
   BARANGAY NAMES
   =========================================================

   The program normally works with IDs.

   Example:

   "east-calaguiman"

   But users should see:

   "East Calaguiman"


   This object converts the internal ID into a readable
   barangay name.
========================================================= */

const barangayNames: Record<string, string> = {
  "east-calaguiman": "East Calaguiman",

  "east-daang-bago": "East Daang Bago",

  gugo: "Gugo",

  ibaba: "Ibaba",

  imelda: "Imelda",

  lalawigan: "Lalawigan",

  palili: "Palili",

  "san-juan": "San Juan",

  "santa-lucia": "Santa Lucia",

  sapa: "Sapa",

  "tabing-ilog": "Tabing Ilog",

  "west-calaguiman": "West Calaguiman",

  "west-daang-bago": "West Daang Bago",

  "san-roque": "San Roque",
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function BarangayDetails({
  open,
  barangayId,
  selectedYear,
  selectedCrimeId,
  onClose,
}: BarangayDetailsProps) {
  /* =======================================================
     CHECK IF THE BARANGAY IS VALID
     =======================================================

     This dialog should only appear when ONE actual
     barangay is selected.

     If the user has:

     All Barangays

     selected, there is no individual barangay profile
     to display.

     The same applies if an unknown barangay ID somehow
     reaches the component.
  ======================================================= */

  if (barangayId === "all" || !barangayNames[barangayId]) {
    return null;
  }

  /*
     Convert the barangay ID into its readable name.

     Example:

     "gugo"

          ↓

     "Gugo"
  */

  const barangayName = barangayNames[barangayId];

  /* =======================================================
     FIND THE SELECTED CRIME
     =======================================================

     Example:

     selectedCrimeId:
     "malicious-mischief"

              ↓

     Search crimes.json

              ↓

     Find the Malicious Mischief record.


     If "All Crimes" is selected, there is no single
     crime record, so selectedCrime becomes null.
  ======================================================= */

  const selectedCrime =
    selectedCrimeId === "all"
      ? null
      : (crimesData.crimes.find((crime) => crime.id === selectedCrimeId) ??
        null);

  /*
     Get a readable crime name.

     If all crimes are selected, display:

     "All Crimes"
  */

  const selectedCrimeName = selectedCrime?.name ?? "All Crimes";

  /*
     Convert the "all" year option into the actual
     reporting period.
  */

  const selectedYearLabel = selectedYear === "all" ? "2024–2026" : selectedYear;

  /* =======================================================
     ACTIVE CRIME COLOR
     =======================================================

     The selected crime determines the visual color used
     in parts of this dialog.

     Example:

     Malicious Mischief
              ↓
     Orange crime color


     If All Crimes is selected, the default dashboard
     crime color is used.


     IMPORTANT:

     These colors are for visualization only.

     A darker or different color does NOT mean that the
     crime is legally more serious.
  ======================================================= */

  const activeColor =
    selectedCrimeId === "all"
      ? DEFAULT_CRIME_COLOR
      : getCrimeColor(selectedCrimeId);

  /* =======================================================
     REPORTED BARANGAY TOTAL
     =======================================================

     This gets the complete reported number of cases for
     the selected barangay during 2024–2026.

     Example:

     Gugo

              ↓

     Look inside:

     crimesData.barangayTotals

              ↓

     Return Gugo's total reported cases.


     This is REPORTED data.
  ======================================================= */

  const totalCases =
    crimesData.barangayTotals[
      barangayId as keyof typeof crimesData.barangayTotals
    ] ?? 0;

  /* =======================================================
     CURRENT FILTER VALUE
     =======================================================

     This number changes depending on the filters selected
     by the user.

     There are FOUR possible situations.


     -------------------------------------------------------
     SITUATION 1

     ALL YEARS + ALL CRIMES

     Example:

     Gugo
     All Crimes
     2024–2026

     RESULT:
     Reported barangay total


     -------------------------------------------------------
     SITUATION 2

     ALL YEARS + SPECIFIC CRIME

     Example:

     Gugo
     Malicious Mischief
     2024–2026

     RESULT:
     Reported Crime × Barangay total


     -------------------------------------------------------
     SITUATION 3

     SPECIFIC YEAR + ALL CRIMES

     Example:

     Gugo
     All Crimes
     2025

     RESULT:
     Estimated Year × Barangay value


     -------------------------------------------------------
     SITUATION 4

     SPECIFIC YEAR + SPECIFIC CRIME

     Example:

     Gugo
     Malicious Mischief
     2025

     RESULT:
     Estimated Crime × Year × Barangay value


     WHY ARE SPECIFIC-YEAR BARANGAY VALUES ESTIMATED?

     Because the original reported source does not contain
     the complete year-by-barangay cross-tabulation needed
     to answer those combinations directly.
  ======================================================= */

  /*
     Start with zero cases.
  */

  let currentFilterValue = 0;

  /*
     Start by assuming the value is reported.

     This becomes true when a specific year is selected.
  */

  let currentFilterEstimated = false;

  /* =======================================================
     ALL YEARS SELECTED
     =======================================================

     Because the complete 2024–2026 barangay totals are
     available in the reported dataset, we can use
     reported data.
  ======================================================= */

  if (selectedYear === "all") {
    /* -----------------------------------------------------
       ALL CRIMES + ALL YEARS

       Use the directly reported barangay total.
    ----------------------------------------------------- */

    if (selectedCrimeId === "all") {
      currentFilterValue = totalCases;
    } else if (selectedCrime) {

    /* -----------------------------------------------------
       SPECIFIC CRIME + ALL YEARS

       Use the reported Crime × Barangay total.
    ----------------------------------------------------- */
      const barangays = selectedCrime.barangays as Record<string, number>;

      currentFilterValue = barangays[barangayId] ?? 0;
    }
  } else {

  /* =======================================================
     SPECIFIC YEAR SELECTED
     =======================================================

     The year-by-barangay distribution is not directly
     reported.

     Therefore these barangay values use the estimated
     allocation dataset.
  ======================================================= */
    currentFilterEstimated = true;

    /* -----------------------------------------------------
       SPECIFIC CRIME + SPECIFIC YEAR

       Example:

       Gugo
       Malicious Mischief
       2025

       Look directly inside the estimated allocation:

       Crime
          ↓
       Year
          ↓
       Barangay
          ↓
       Estimated value
    ----------------------------------------------------- */

    if (selectedCrimeId !== "all") {
      currentFilterValue =
        allocations[selectedCrimeId]?.[selectedYear]?.[barangayId] ?? 0;
    } else {

    /* -----------------------------------------------------
       ALL CRIMES + SPECIFIC YEAR

       Example:

       Gugo
       All Crimes
       2025

       There is no single crime to look up.

       Therefore, add together the estimated value of every
       crime category for:

       2025 + Gugo
    ----------------------------------------------------- */
      currentFilterValue = Object.values(allocations).reduce(
        (total, crimeAllocation) => {
          const value = crimeAllocation[selectedYear]?.[barangayId] ?? 0;

          return total + value;
        },
        0,
      );
    }
  }

  /* =======================================================
     REPORTED CRIME DISTRIBUTION
     =======================================================

     This section creates the complete crime profile of the
     selected barangay.

     IMPORTANT:

     This does NOT use the estimated year-by-barangay data.

     It uses the directly reported:

     Crime × Barangay

     totals for the complete 2024–2026 reporting period.


     EXAMPLE:

     Gugo

     Malicious Mischief        10
     Alarm and Scandal          5
     Physical Injuries          5
     Falsification              3
     Qualified Trespass         1


     The program then:

     1. Removes crimes with zero cases.
     2. Sorts the remaining crimes from highest to lowest.
  ======================================================= */

  const crimeDistribution = crimesData.crimes

    /*
         Go through every crime category.
      */

    .map((crime) => {
      const barangays = crime.barangays as Record<string, number>;

      return {
        id: crime.id,

        name: crime.name,

        legalBasis: crime.legalBasis,

        /*
             Get this crime's reported count for the
             selected barangay.
          */

        value: barangays[barangayId] ?? 0,

        /*
             Get the crime's visual color.
          */

        color: getCrimeColor(crime.id),
      };
    })

    /*
         Do not display crime categories that have
         zero reported cases in this barangay.
      */

    .filter((crime) => crime.value > 0)

    /*
         Highest recorded crime count appears first.
      */

    .sort((a, b) => b.value - a.value);

  /* =======================================================
     HIGHEST RECORDED CRIME
     =======================================================

     Because crimeDistribution is already sorted from
     highest to lowest, the first item has the highest
     reported count.

     IMPORTANT:

     "Highest Recorded Crime Type" means:

     The crime category with the largest recorded count
     in this barangay during 2024–2026.

     It does NOT automatically mean:

     - Most dangerous crime
     - Most serious crime
     - Crime with the highest legal penalty
  ======================================================= */

  const highestCrime = crimeDistribution[0];

  /*
     The highest count is used as the reference value for
     the progress bars.
  */

  const maxCrimeValue = highestCrime?.value ?? 1;

  /*
     Get the visual color of the highest crime.

     If there is no recorded crime, use the default color.
  */

  const highestCrimeColor = highestCrime
    ? getCrimeColor(highestCrime.id)
    : DEFAULT_CRIME_COLOR;

  /* =======================================================
     USER INTERFACE
     =======================================================

     Everything below controls what appears inside the
     Barangay Profile dialog.

     The dialog contains:

     1. Barangay header
     2. Current filter result
     3. Reported barangay profile
     4. Total reported cases
     5. Number of recorded crime types
     6. Highest recorded crime type
     7. Crime distribution
     8. Reported/Estimated explanation
  ======================================================= */

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,

            maxHeight: {
              xs: "92vh",
              sm: "88vh",
            },
          },
        },
      }}
    >
      {/* =================================================
          DIALOG HEADER

          Shows:

          Barangay Profile
          Barangay Name
          Samal, Bataan
      ================================================= */}

      <DialogTitle
        sx={{
          pr: 7,

          pb: 2,
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{
            alignItems: "center",
          }}
        >
          {/* Location icon */}

          <Box
            sx={{
              width: 44,

              height: 44,

              display: "grid",

              placeItems: "center",

              flexShrink: 0,

              borderRadius: 2.25,

              bgcolor: "rgba(15,61,86,0.08)",

              color: "primary.main",
            }}
          >
            <LocationOnOutlined />
          </Box>

          {/* Barangay information */}

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                display: "block",

                lineHeight: 1.2,

                fontWeight: 800,

                letterSpacing: 1.2,

                color: "secondary.dark",
              }}
            >
              Barangay Profile
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 0.25,

                fontWeight: 800,
              }}
            >
              {barangayName}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Samal, Bataan
            </Typography>
          </Box>
        </Stack>

        {/* Close X button */}

        <IconButton
          aria-label="Close barangay details"
          onClick={onClose}
          sx={{
            position: "absolute",

            right: 12,

            top: 12,
          }}
        >
          <CloseOutlined />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* =================================================
          DIALOG CONTENT
      ================================================= */}

      <DialogContent>
        <Stack spacing={3}>
          {/* =================================================
              CURRENT FILTER RESULT

              This section answers:

              "Under the filters I selected, how many cases
              are shown for this barangay?"

              It also clearly identifies whether the value
              is:

              REPORTED

              or

              ESTIMATED
          ================================================= */}

          <Box>
            <Stack
              direction="row"
              spacing={0.75}
              sx={{
                mb: 1.25,

                alignItems: "center",
              }}
            >
              <FilterAltOutlined
                sx={{
                  fontSize: 18,

                  color: currentFilterEstimated ? "#B45309" : activeColor,
                }}
              />

              <Typography
                variant="overline"
                sx={{
                  lineHeight: 1,

                  fontWeight: 800,

                  letterSpacing: 1,

                  color: currentFilterEstimated ? "#B45309" : activeColor,
                }}
              >
                Current Filter
              </Typography>
            </Stack>

            <Box
              sx={{
                p: {
                  xs: 2,
                  sm: 2.5,
                },

                borderRadius: 2.5,

                bgcolor: currentFilterEstimated
                  ? "rgba(180,83,9,0.05)"
                  : `${activeColor}08`,

                border: "1px solid",

                borderColor: currentFilterEstimated
                  ? "rgba(180,83,9,0.20)"
                  : `${activeColor}30`,
              }}
            >
              {/* =========================================
                  CURRENT FILTER DESCRIPTION

                  Shows:

                  Crime
                  Barangay
                  Year
                  Reported / Estimated
              ========================================= */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1}
                sx={{
                  justifyContent: "space-between",

                  alignItems: {
                    xs: "flex-start",

                    sm: "center",
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {selectedCrimeName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {barangayName}

                    {" • "}

                    {selectedYearLabel}
                  </Typography>
                </Box>

                {/* Data-status label */}

                <Chip
                  size="small"
                  label={currentFilterEstimated ? "Estimated" : "Reported"}
                  sx={{
                    fontWeight: 800,

                    bgcolor: currentFilterEstimated
                      ? "rgba(180,83,9,0.10)"
                      : "rgba(15,118,110,0.10)",

                    color: currentFilterEstimated ? "#B45309" : "#0F766E",
                  }}
                />
              </Stack>

              {/* =========================================
                  CURRENT NUMBER OF CASES
              ========================================= */}

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: 2,

                  alignItems: "baseline",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,

                    lineHeight: 1,

                    color: currentFilterEstimated ? "#B45309" : activeColor,
                  }}
                >
                  {currentFilterValue}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,

                    color: "text.secondary",
                  }}
                >
                  {currentFilterValue === 1 ? "case" : "cases"}
                </Typography>
              </Stack>

              {/* =========================================
                  EXPLAIN WHETHER THE VALUE IS ESTIMATED
                  OR REPORTED
              ========================================= */}

              {currentFilterEstimated ? (
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{
                    mt: 1.5,

                    alignItems: "flex-start",
                  }}
                >
                  <WarningAmberOutlined
                    sx={{
                      mt: "1px",

                      fontSize: 17,

                      flexShrink: 0,

                      color: "#B45309",
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      lineHeight: 1.5,

                      color: "text.secondary",
                    }}
                  >
                    This year-by-barangay value is an estimated allocation and
                    is not a directly reported year-by-barangay count.
                  </Typography>
                </Stack>
              ) : (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",

                    mt: 1.25,

                    lineHeight: 1.5,

                    color: "text.secondary",
                  }}
                >
                  This value comes from the directly reported 2024–2026 barangay
                  totals or the directly reported crime-by-barangay totals.
                </Typography>
              )}
            </Box>
          </Box>

          <Divider />

          {/* =================================================
              REPORTED BARANGAY PROFILE

              Everything in the following profile uses the
              directly reported 2024–2026 Crime × Barangay
              totals.

              This section is intentionally kept separate
              from the current-filter estimated value.
          ================================================= */}

          <Box>
            <Typography
              variant="overline"
              sx={{
                display: "block",

                fontWeight: 800,

                letterSpacing: 1,

                color: "secondary.dark",
              }}
            >
              Reported Barangay Profile
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.25,

                lineHeight: 1.6,
              }}
            >
              Directly reported statistics for {barangayName} across the
              complete 2024–2026 reporting period.
            </Typography>
          </Box>

          {/* =================================================
              PROFILE SUMMARY CARDS
          ================================================= */}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                sm: "repeat(2, 1fr)",
              },

              gap: 1.5,
            }}
          >
            {/* =============================================
                TOTAL CASES

                Complete reported total for this barangay
                during 2024–2026.
            ============================================= */}

            <Box
              sx={{
                p: 2,

                border: "1px solid",

                borderColor: "divider",

                borderRadius: 2.5,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <ShieldOutlined
                  sx={{
                    fontSize: 19,

                    color: "primary.main",
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Total Cases
                </Typography>
              </Stack>

              <Typography
                variant="h4"
                sx={{
                  mt: 1,

                  fontWeight: 800,

                  color: "primary.main",
                }}
              >
                {totalCases}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Reported • 2024–2026
              </Typography>
            </Box>

            {/* =============================================
                RECORDED CRIME TYPES

                Counts how many crime categories have at
                least one reported case in this barangay.

                Example:

                If 7 out of the 12 crime categories have
                at least one case:

                Recorded Crime Types = 7
            ============================================= */}

            <Box
              sx={{
                p: 2,

                border: "1px solid",

                borderColor: "divider",

                borderRadius: 2.5,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <AssessmentOutlined
                  sx={{
                    fontSize: 19,

                    color: "primary.main",
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Recorded Crime Types
                </Typography>
              </Stack>

              <Typography
                variant="h4"
                sx={{
                  mt: 1,

                  fontWeight: 800,

                  color: "primary.main",
                }}
              >
                {crimeDistribution.length}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                With at least one case
              </Typography>
            </Box>
          </Box>

          {/* =================================================
              HIGHEST RECORDED CRIME TYPE

              Only display this card when the barangay has
              at least one recorded crime.

              IMPORTANT:

              This is the crime category with the highest
              NUMBER OF RECORDED CASES.

              It is not a severity ranking.
          ================================================= */}

          {highestCrime && (
            <Box
              sx={{
                p: 2,

                borderRadius: 2.5,

                bgcolor: `${highestCrimeColor}08`,

                border: `1px solid ${highestCrimeColor}24`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: "block",

                  mb: 0.75,

                  fontWeight: 800,

                  color: highestCrimeColor,

                  letterSpacing: 0.5,
                }}
              >
                HIGHEST RECORDED CRIME TYPE
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1}
                sx={{
                  justifyContent: "space-between",

                  alignItems: {
                    xs: "flex-start",

                    sm: "center",
                  },
                }}
              >
                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  {/* Crime name */}

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {highestCrime.name}
                  </Typography>

                  {/* Legal basis */}

                  <Typography variant="caption" color="text.secondary">
                    {highestCrime.legalBasis}
                  </Typography>
                </Box>

                {/* Number of reported cases */}

                <Chip
                  label={`${highestCrime.value} ${
                    highestCrime.value === 1 ? "case" : "cases"
                  }`}
                  sx={{
                    flexShrink: 0,

                    fontWeight: 800,

                    color: highestCrimeColor,

                    bgcolor: `${highestCrimeColor}14`,
                  }}
                />
              </Stack>
            </Box>
          )}

          {/* =================================================
              CRIME DISTRIBUTION

              Lists every crime type with at least one
              reported case in the selected barangay.

              The crimes are arranged from the highest
              reported count to the lowest reported count.

              These are complete 2024–2026 totals.
          ================================================= */}

          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
              }}
            >
              Crime Distribution
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,

                lineHeight: 1.6,
              }}
            >
              Ranked reported crime totals for {barangayName} across the
              complete 2024–2026 reporting period.
            </Typography>

            <Stack
              spacing={2}
              sx={{
                mt: 2,
              }}
            >
              {crimeDistribution.map((crime, index) => {
                /* =======================================
                     RELATIVE BAR PERCENTAGE

                     The crime with the highest recorded
                     count receives 100%.

                     Other crimes are compared with it.


                     EXAMPLE:

                     Highest crime:
                     10 cases = 100%

                     Another crime:
                     5 cases = 50%


                     IMPORTANT:

                     This is a relative visualization.

                     It does NOT mean:

                     "This crime has a 50% chance of
                     occurring."
                  ======================================= */

                const percentage =
                  maxCrimeValue > 0 ? (crime.value / maxCrimeValue) * 100 : 0;

                /*
                     Check whether this crime is also the
                     currently selected crime filter.
                  */

                const isSelected =
                  selectedCrimeId !== "all" && selectedCrimeId === crime.id;

                return (
                  <Box
                    key={crime.id}
                    sx={{
                      p: isSelected ? 1.25 : 0,

                      borderRadius: 2,

                      bgcolor: isSelected ? `${crime.color}08` : "transparent",

                      border: isSelected
                        ? `1px solid ${crime.color}20`
                        : "1px solid transparent",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        justifyContent: "space-between",

                        alignItems: "flex-start",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        {/* =================================
                              CRIME RANK

                              #1 means the crime category
                              has the highest recorded count
                              in this barangay.

                              This is NOT a severity rank.
                          ================================= */}

                        <Box
                          sx={{
                            width: 26,

                            height: 26,

                            display: "grid",

                            placeItems: "center",

                            flexShrink: 0,

                            borderRadius: "50%",

                            bgcolor: `${crime.color}14`,

                            color: crime.color,

                            fontSize: "0.72rem",

                            fontWeight: 900,
                          }}
                        >
                          {index + 1}
                        </Box>

                        {/* =================================
                              CRIME INFORMATION
                          ================================= */}

                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={0.75}
                            sx={{
                              alignItems: "center",
                            }}
                          >
                            {/* Crime color indicator */}

                            <Box
                              sx={{
                                width: 8,

                                height: 8,

                                flexShrink: 0,

                                borderRadius: "50%",

                                bgcolor: crime.color,
                              }}
                            />

                            {/* Crime name */}

                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isSelected ? 800 : 700,
                              }}
                            >
                              {crime.name}
                            </Typography>
                          </Stack>

                          {/* Legal basis */}

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",

                              mt: 0.25,
                            }}
                          >
                            {crime.legalBasis}
                          </Typography>

                          {/* Current crime indicator */}

                          {isSelected && (
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",

                                mt: 0.35,

                                fontWeight: 800,

                                color: crime.color,
                              }}
                            >
                              Selected crime
                            </Typography>
                          )}
                        </Box>
                      </Stack>

                      {/* Number of reported cases */}

                      <Typography
                        variant="body2"
                        sx={{
                          flexShrink: 0,

                          fontWeight: 900,

                          color: crime.color,
                        }}
                      >
                        {crime.value}
                      </Typography>
                    </Stack>

                    {/* ===================================
                          RELATIVE COMPARISON BAR

                          Longest bar:
                          Highest recorded crime

                          Shorter bars:
                          Lower recorded counts

                          Again, this represents relative
                          case counts, NOT risk percentage.
                      =================================== */}

                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        mt: 0.85,

                        ml: {
                          xs: 0,
                          sm: 4.5,
                        },

                        height: 6,

                        borderRadius: 99,

                        bgcolor: `${crime.color}12`,

                        "& .MuiLinearProgress-bar": {
                          borderRadius: 99,

                          bgcolor: crime.color,
                        },
                      }}
                    />
                  </Box>
                );
              })}

              {/* =========================================
                  NO RECORDED CRIMES

                  This message appears if the barangay
                  contains no reported crime categories
                  with a value greater than zero.
              ========================================= */}

              {crimeDistribution.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No reported cases are available for this barangay.
                </Typography>
              )}
            </Stack>
          </Box>

          {/* =================================================
              DATA EXPLANATION

              This section is especially important for
              students and researchers.

              It explains the difference between:

              REPORTED

              and

              ESTIMATED

              data.
          ================================================= */}

          <Box
            sx={{
              p: 1.75,

              borderRadius: 2,

              bgcolor: "rgba(15,61,86,0.04)",

              border: "1px solid rgba(15,61,86,0.08)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",

                mb: 0.75,

                fontWeight: 800,

                color: "primary.main",
              }}
            >
              Understanding the data
            </Typography>

            <Stack spacing={0.75}>
              {/* =========================================
                  REPORTED DATA

                  Reported means the value comes from
                  statistics directly available in the
                  source dataset.
              ========================================= */}

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    width: 8,

                    height: 8,

                    mt: "5px",

                    flexShrink: 0,

                    borderRadius: "50%",

                    bgcolor: "#0F766E",
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.5,
                  }}
                >
                  <strong>Reported</strong> values come from the available
                  municipality, crime, and barangay totals.
                </Typography>
              </Stack>

              {/* =========================================
                  ESTIMATED DATA

                  Estimated means the exact combination was
                  not directly provided in the reported
                  source.

                  The system therefore uses the estimated
                  allocation dataset.

                  These values must NOT be presented as
                  directly reported incidents.
              ========================================= */}

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    width: 8,

                    height: 8,

                    mt: "5px",

                    flexShrink: 0,

                    borderRadius: "50%",

                    bgcolor: "#B45309",
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.5,
                  }}
                >
                  <strong>Estimated</strong> values are used only when a
                  specific year and barangay are combined because that
                  cross-tabulation was not directly reported in the source data.
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      {/* =================================================
          DIALOG ACTIONS

          The Close button simply closes the barangay
          profile and returns the user to the dashboard.
      ================================================= */}

      <DialogActions
        sx={{
          px: 3,

          py: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            textTransform: "none",

            fontWeight: 700,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* =========================================================
   SIMPLE EXPLANATION FOR CRIMINOLOGY STUDENTS
   =========================================================


   WHAT DOES BARANGAY DETAILS DO?


   STEP 1
   -------

   The user selects a barangay.

   Example:

   Gugo

          ↓


   STEP 2
   -------

   The component checks the selected:

   - Crime
   - Year
   - Barangay

          ↓


   STEP 3
   -------

   It determines whether the requested value is:

   REPORTED

   or

   ESTIMATED

          ↓


   STEP 4
   -------

   The current-filter case count is displayed.

          ↓


   STEP 5
   -------

   The component also shows the barangay's complete
   REPORTED 2024–2026 profile.

          ↓


   STEP 6
   -------

   Crime categories are ranked according to their
   reported case counts.

          ↓


   STEP 7
   -------

   The highest recorded crime type is identified.

          ↓


   STEP 8
   -------

   Progress bars make the differences in case counts
   easier to see.


   =========================================================
   WHEN IS THE DATA REPORTED?
   =========================================================


   ALL CRIMES
   + ALL YEARS
   + BARANGAY

   Example:

   All Crimes
   2024–2026
   Gugo

          ↓

   REPORTED


   ---------------------------------------------------------


   SPECIFIC CRIME
   + ALL YEARS
   + BARANGAY

   Example:

   Malicious Mischief
   2024–2026
   Gugo

          ↓

   REPORTED


   =========================================================
   WHEN IS THE DATA ESTIMATED?
   =========================================================


   ALL CRIMES
   + SPECIFIC YEAR
   + BARANGAY

   Example:

   All Crimes
   2025
   Gugo

          ↓

   ESTIMATED


   ---------------------------------------------------------


   SPECIFIC CRIME
   + SPECIFIC YEAR
   + BARANGAY

   Example:

   Malicious Mischief
   2025
   Gugo

          ↓

   ESTIMATED


   =========================================================
   CRIME DISTRIBUTION
   =========================================================

   The Crime Distribution section is different from the
   current-filter result.

   It always shows the directly reported Crime × Barangay
   totals for the COMPLETE 2024–2026 reporting period.


   Example:

   Gugo

   Malicious Mischief       10
   Alarm and Scandal         5
   Physical Injuries         5
   Falsification             3


   These numbers are then ranked from highest to lowest.


   =========================================================
   HOW SHOULD THE RANKING BE INTERPRETED?
   =========================================================

   Suppose the profile shows:

   #1 Malicious Mischief     10 cases
   #2 Alarm and Scandal       5 cases
   #3 Physical Injuries       5 cases


   This means:

   Malicious Mischief has the highest RECORDED CASE COUNT
   in that barangay for the 2024–2026 reporting period.


   It does NOT mean:

   Malicious Mischief is legally the most serious crime.

   It does NOT mean:

   It has the highest punishment.

   It does NOT mean:

   Residents have a specific percentage chance of becoming
   victims.


   =========================================================
   HOW SHOULD THE PROGRESS BARS BE INTERPRETED?
   =========================================================

   The highest crime is used as the reference.

   Example:

   Highest crime:
   10 cases

   Its bar:
   100%


   Another crime:
   5 cases

   Its bar:
   50%


   This means the second crime has HALF the recorded count
   of the highest crime.


   It does NOT mean:

   "There is a 50% crime risk."


   =========================================================
   WHY IS REPORTED VS ESTIMATED IMPORTANT?
   =========================================================

   In criminological research, the researcher should be
   clear about where a number came from.

   A REPORTED value is directly supported by the available
   source totals used by Bantay Samal.

   An ESTIMATED value was produced because the exact
   Year × Barangay or Crime × Year × Barangay combination
   was not directly reported in the available source data.

   Therefore, Bantay Samal clearly labels estimated values
   instead of presenting them as directly reported counts.


   =========================================================
   FINAL SIMPLE EXPLANATION
   =========================================================

   BarangayDetails is the component that gives a closer
   look at one barangay.

   It shows the current filtered number of cases and tells
   the user whether that number is reported or estimated.

   It also shows the barangay's complete reported crime
   profile for 2024–2026, including:

   - Total reported cases
   - Number of recorded crime types
   - Highest recorded crime type
   - Crime distribution
   - Legal basis of each crime

   The rankings and progress bars are intended to make the
   case counts easier to compare.

   They should not automatically be interpreted as measures
   of danger, safety, crime severity, or victimization risk.

   In short:

   BarangayDetails helps students and researchers understand
   what crimes were recorded in a barangay, how many were
   recorded, and whether the displayed information is
   reported or estimated.
========================================================= */
