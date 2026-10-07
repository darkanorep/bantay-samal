import { useMemo } from "react";

import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";

import {
  BarChartOutlined,
  QueryStatsOutlined,
  SearchOffOutlined,
} from "@mui/icons-material";

import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";

import crimesData from "../../data/crimes.json";
import estimatedData from "../../data/crime-year-barangay.json";

import { getCrimeColor } from "../../utils/crimeColors";

/* =========================================================
   BANTAY SAMAL - CRIME ANALYTICS
   =========================================================

   PURPOSE

   CrimeAnalytics is responsible for converting the crime
   data into easy-to-understand charts.

   It contains two main visualizations:

   1. YEARLY TREND
      Shows how the number of cases changes from:

      2024 → 2025 → 2026


   2. CRIME BREAKDOWN
      Shows the crime categories with the highest number
      of cases under the current filters.


   SIMPLE EXAMPLE

   User selects:

   Year: 2025
   Crime: All Crimes
   Barangay: Gugo

                 ↓

   CrimeAnalytics receives those filters

                 ↓

   It calculates the appropriate values

                 ↓

   It determines whether those values are:

   REPORTED

   or

   ESTIMATED

                 ↓

   It displays the results using charts.


   IMPORTANT

   The charts are descriptive.

   They show patterns in the available crime statistics.

   They do NOT automatically prove:

   - Why crime increased
   - Why crime decreased
   - That one barangay is dangerous
   - That one barangay is safe
   - That crime will increase in the future
   - That a person has a certain chance of becoming
     a victim
========================================================= */

/* =========================================================
   DATA SOURCES
   =========================================================

   crimes.json

   Contains directly reported information such as:

   - Municipality yearly totals
   - Crime totals
   - Crime × Year totals
   - Crime × Barangay totals


   crime-year-barangay.json

   Contains the ESTIMATED allocation used when the exact
   Year × Barangay or Crime × Year × Barangay combination
   is not directly available in the source data.


   crimeColors.ts

   Provides the display color assigned to each crime type.

   The colors help distinguish crime categories.

   They do NOT represent seriousness or legal severity.
========================================================= */

/* =========================================================
   COMPONENT INPUTS
   =========================================================

   CrimeAnalytics receives the filters currently selected
   on the Bantay Samal dashboard.

   selectedYear
   → "all", "2024", "2025", or "2026"

   selectedCrimeId
   → "all" or the ID of a specific crime

   selectedBarangayId
   → "all" or the ID of a specific barangay
========================================================= */

type CrimeAnalyticsProps = {
  selectedYear: string;

  selectedCrimeId: string;

  selectedBarangayId: string;
};

/* =========================================================
   ESTIMATED ALLOCATION TYPES
   =========================================================

   These types describe the structure of:

   crime-year-barangay.json


   BarangayCounts

   Example:

   {
     gugo: 3,
     ibaba: 2,
     sapa: 1
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
   Tell TypeScript how the estimated allocation data
   is structured.
*/

const allocations = estimatedData.allocations as CrimeAllocations;

/* =========================================================
   BARANGAY LIST
   =========================================================

   The dashboard normally works using IDs.

   Example:

   "east-calaguiman"

   But the user should see:

   "East Calaguiman"


   This list allows the program to convert internal
   barangay IDs into readable names.
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
   DATA STATUS CHIP
   =========================================================

   This small label tells the user whether the information
   displayed in a chart is:

   REPORTED

   or

   ESTIMATED


   Green/teal:
   → Reported

   Brown/orange:
   → Estimated


   This is important because estimated values should not
   be presented as if they were directly reported counts.
========================================================= */

function DataStatusChip({ estimated }: { estimated: boolean }) {
  return (
    <Chip
      size="small"
      label={estimated ? "Estimated" : "Reported"}
      sx={{
        height: {
          xs: 22,
          sm: 24,
        },

        flexShrink: 0,

        fontSize: {
          xs: "0.64rem",
          sm: "0.7rem",
        },

        fontWeight: 800,

        bgcolor: estimated ? "rgba(180,83,9,0.09)" : "rgba(15,118,110,0.09)",

        color: estimated ? "#92400E" : "#0F766E",

        border: "1px solid",

        borderColor: estimated
          ? "rgba(180,83,9,0.18)"
          : "rgba(15,118,110,0.18)",

        "& .MuiChip-label": {
          px: {
            xs: 0.9,
            sm: 1.1,
          },
        },
      }}
    />
  );
}

/* =========================================================
   EMPTY CHART STATE
   =========================================================

   Sometimes a selected filter combination has no cases.

   Example:

   A crime category may have zero cases for a particular
   barangay.

   Instead of showing a confusing empty graph, this
   component displays:

   "No cases to display"

   together with a short explanation.
========================================================= */

function EmptyChartState({ message }: { message: string }) {
  return (
    <Box
      sx={{
        width: "100%",

        minHeight: {
          xs: 220,
          sm: 280,
        },

        display: "flex",

        flexDirection: "column",

        alignItems: "center",

        justifyContent: "center",

        px: {
          xs: 2,
          sm: 3,
        },

        textAlign: "center",

        borderRadius: 2.5,

        bgcolor: "rgba(15,61,86,0.025)",
      }}
    >
      <Box
        sx={{
          width: {
            xs: 42,
            sm: 48,
          },

          height: {
            xs: 42,
            sm: 48,
          },

          mb: 1.25,

          display: "grid",

          placeItems: "center",

          borderRadius: "50%",

          bgcolor: "rgba(15,61,86,0.07)",

          color: "text.secondary",
        }}
      >
        <SearchOffOutlined />
      </Box>

      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 800,

          color: "text.primary",
        }}
      >
        No cases to display
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          maxWidth: 340,

          mt: 0.5,

          lineHeight: 1.6,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}

/* =========================================================
   MAIN CRIME ANALYTICS COMPONENT
========================================================= */

export default function CrimeAnalytics({
  selectedYear,
  selectedCrimeId,
  selectedBarangayId,
}: CrimeAnalyticsProps) {
  /* =======================================================
     FIND THE SELECTED CRIME
     =======================================================

     If the user selects a specific crime, find that
     crime inside crimes.json.

     Example:

     selectedCrimeId:
     "malicious-mischief"

                 ↓

     Search crimes.json

                 ↓

     Malicious Mischief record


     If the user selected "All Crimes", there is no
     single crime record, so this returns null.


     useMemo is used so React does not repeat this search
     unless selectedCrimeId changes.
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

     Get the visual color assigned to the selected crime.

     The Line Chart uses this color.

     Again:

     Color = visualization

     Color ≠ crime severity
  ======================================================= */

  const activeCrimeColor = getCrimeColor(selectedCrimeId);

  /* =======================================================
     FIND THE SELECTED BARANGAY
     =======================================================

     Example:

     selectedBarangayId:
     "gugo"

               ↓

     Find Gugo in the barangay list.

     If "All Barangays" is selected, no individual
     barangay is returned.
  ======================================================= */

  const selectedBarangay = useMemo(() => {
    return (
      barangays.find((barangay) => barangay.id === selectedBarangayId) ?? null
    );
  }, [selectedBarangayId]);

  /* =======================================================
     DISPLAY LABELS
     =======================================================

     These labels are shown above the charts so the user
     can easily understand the current filters.
  ======================================================= */

  const yearLabel = selectedYear === "all" ? "2024–2026" : selectedYear;

  const crimeLabel = selectedCrime?.name ?? "All Crimes";

  const barangayLabel = selectedBarangay?.name ?? "All Barangays";

  /* =======================================================
     YEARLY TREND
     =======================================================

     This creates the three values used by the Line Chart:

     [
       2024 value,
       2025 value,
       2026 value
     ]


     The source of those values depends on the filters.


     -------------------------------------------------------
     CASE 1

     ALL BARANGAYS + ALL CRIMES

     Example:

     All Barangays
     All Crimes

     RESULT:

     Use the reported municipality yearly totals.

     2024 = 80
     2025 = 108
     2026 = 62


     -------------------------------------------------------
     CASE 2

     ALL BARANGAYS + SPECIFIC CRIME

     Example:

     All Barangays
     Malicious Mischief

     RESULT:

     Use the reported yearly totals for that crime.


     -------------------------------------------------------
     CASE 3

     SPECIFIC BARANGAY + SPECIFIC CRIME

     Example:

     Gugo
     Malicious Mischief

     RESULT:

     Use estimated:

     Crime × Year × Barangay


     -------------------------------------------------------
     CASE 4

     SPECIFIC BARANGAY + ALL CRIMES

     Example:

     Gugo
     All Crimes

     RESULT:

     Add together the estimated yearly allocation of
     every crime category for Gugo.


     IMPORTANT:

     A barangay-specific YEARLY trend is estimated because
     the exact year-by-barangay cross-tabulation was not
     directly reported in the source data.
  ======================================================= */

  const yearlyTrend = useMemo(() => {
    const years = ["2024", "2025", "2026"];

    /*
         Calculate one value for each year.
      */

    return years.map((year) => {
      /* ===============================================
           MUNICIPALITY LEVEL

           No specific barangay selected.
        =============================================== */

      if (selectedBarangayId === "all") {
        /*
             ALL CRIMES

             Use directly reported municipality
             yearly totals.
          */

        if (selectedCrimeId === "all") {
          return Number(
            crimesData.yearlyTotals[
              year as keyof typeof crimesData.yearlyTotals
            ],
          );
        }

        /*
             SPECIFIC CRIME

             Use directly reported yearly totals
             for that crime.
          */

        if (selectedCrime) {
          return Number(
            selectedCrime.yearly[year as keyof typeof selectedCrime.yearly],
          );
        }

        return 0;
      }

      /* ===============================================
           SPECIFIC CRIME + SPECIFIC BARANGAY

           Use estimated Crime × Year × Barangay data.
        =============================================== */

      if (selectedCrimeId !== "all") {
        return allocations[selectedCrimeId]?.[year]?.[selectedBarangayId] ?? 0;
      }

      /* ===============================================
           ALL CRIMES + SPECIFIC BARANGAY

           Add the estimated value of every crime
           category for this:

           Year + Barangay
        =============================================== */

      return Object.values(allocations).reduce((total, crimeAllocation) => {
        return total + (crimeAllocation[year]?.[selectedBarangayId] ?? 0);
      }, 0);
    });
  }, [selectedBarangayId, selectedCrimeId, selectedCrime]);

  /* =======================================================
     CRIME BREAKDOWN
     =======================================================

     Crime Breakdown answers:

     "Which crime categories have the highest number of
     cases under the current Year and Barangay filters?"


     The calculation changes depending on the filters.


     -------------------------------------------------------
     ALL BARANGAYS + ALL YEARS

     Use:

     crime.total

     REPORTED


     -------------------------------------------------------
     ALL BARANGAYS + SPECIFIC YEAR

     Use:

     crime.yearly[selectedYear]

     REPORTED


     -------------------------------------------------------
     SPECIFIC BARANGAY + ALL YEARS

     Use:

     crime.barangays[selectedBarangayId]

     REPORTED


     -------------------------------------------------------
     SPECIFIC BARANGAY + SPECIFIC YEAR

     Use:

     estimated allocation

     ESTIMATED
  ======================================================= */

  const crimeBreakdown = useMemo(() => {
    return crimesData.crimes.map((crime) => {
      let value = 0;

      /* =============================================
             ALL BARANGAYS
          ============================================= */

      if (selectedBarangayId === "all") {
        /*
               ALL YEARS

               Use complete reported crime total.
            */

        if (selectedYear === "all") {
          value = crime.total;
        } else {

        /*
               SPECIFIC YEAR

               Use reported Crime × Year value.
            */
          value = crime.yearly[selectedYear as keyof typeof crime.yearly] ?? 0;
        }
      } else if (selectedYear === "all") {

      /* =============================================
             SPECIFIC BARANGAY + ALL YEARS

             Use reported Crime × Barangay total.
          ============================================= */
        const crimeBarangays = crime.barangays as Record<string, number>;

        value = crimeBarangays[selectedBarangayId] ?? 0;
      } else {

      /* =============================================
             SPECIFIC BARANGAY + SPECIFIC YEAR

             The exact cross-tabulation is not directly
             reported.

             Use the estimated allocation.
          ============================================= */
        value =
          allocations[crime.id]?.[selectedYear]?.[selectedBarangayId] ?? 0;
      }

      return {
        id: crime.id,

        name: crime.name,

        value,
      };
    });
  }, [selectedYear, selectedBarangayId]);

  /* =======================================================
     TOP CRIMES
     =======================================================

     The Crime Breakdown chart does not need to display
     all crime categories.

     This section:

     1. Copies the calculated crime breakdown.

     2. Removes crime categories with zero cases.

     3. Sorts the remaining categories from highest
        count to lowest count.

     4. Keeps only the top six.


     IMPORTANT:

     "Top Crimes" here means:

     Highest NUMBER OF CASES.

     It does NOT mean:

     - Most dangerous crimes
     - Most serious crimes
     - Crimes with the strongest legal penalty
  ======================================================= */

  const topCrimes = useMemo(() => {
    return [...crimeBreakdown]
      .filter((crime) => crime.value > 0)

      .sort((a, b) => b.value - a.value)

      .slice(0, 6);
  }, [crimeBreakdown]);

  /* =======================================================
     DATA STATUS
     =======================================================

     These two variables tell the interface whether the
     chart should display:

     REPORTED

     or

     ESTIMATED.


     -------------------------------------------------------
     YEARLY TREND

     If a specific barangay is selected, the yearly trend
     uses estimated year-by-barangay allocations.

     Therefore:

     Specific Barangay
           ↓
     Estimated


     -------------------------------------------------------
     CRIME BREAKDOWN

     Crime Breakdown only becomes estimated when BOTH:

     1. A specific barangay is selected

     AND

     2. A specific year is selected.


     Example:

     Gugo + All Years
     → Reported Crime × Barangay


     Gugo + 2025
     → Estimated Crime × Year × Barangay
  ======================================================= */

  const yearlyTrendEstimated = selectedBarangayId !== "all";

  const breakdownEstimated =
    selectedBarangayId !== "all" && selectedYear !== "all";

  /* =======================================================
     CHECK IF THE CHARTS HAVE DATA
     =======================================================

     If every value is zero, there is no useful chart
     to display.

     In that situation, the EmptyChartState component
     appears instead.
  ======================================================= */

  const yearlyTrendHasData = yearlyTrend.some((value) => value > 0);

  const crimeBreakdownHasData = topCrimes.some((crime) => crime.value > 0);

  /* =======================================================
     FILTER CONTEXT LABEL
     =======================================================

     This creates the small description shown above
     the analytics.

     Example:

     2025 • Malicious Mischief • Gugo
  ======================================================= */

  const contextLabel = useMemo(() => {
    return [yearLabel, crimeLabel, barangayLabel].join(" • ");
  }, [yearLabel, crimeLabel, barangayLabel]);

  /* =======================================================
     YEARLY TREND TITLE
     =======================================================

     The chart title changes automatically according to
     the selected filters.


     EXAMPLES:

     All Crimes + All Barangays

     → Municipality Yearly Trend


     Malicious Mischief + All Barangays

     → Malicious Mischief Yearly Trend


     All Crimes + Gugo

     → Crime Trend — Gugo


     Malicious Mischief + Gugo

     → Malicious Mischief Trend — Gugo
  ======================================================= */

  const yearlyTrendTitle = useMemo(() => {
    if (selectedBarangay) {
      if (selectedCrime) {
        return `${selectedCrime.name} Trend — ${selectedBarangay.name}`;
      }

      return `Crime Trend — ${selectedBarangay.name}`;
    }

    if (selectedCrime) {
      return `${selectedCrime.name} Yearly Trend`;
    }

    return "Municipality Yearly Trend";
  }, [selectedBarangay, selectedCrime]);

  /* =======================================================
     YEARLY TREND DESCRIPTION
     =======================================================

     The description also tells the user whether the chart
     is showing reported municipality information or an
     estimated barangay trend.
  ======================================================= */

  const yearlyTrendSubtitle = selectedBarangay
    ? `Estimated yearly cases in ${selectedBarangay.name} from 2024 to 2026`
    : selectedCrime
      ? `Reported ${selectedCrime.name.toLowerCase()} cases from 2024 to 2026`
      : "Reported crime cases from 2024 to 2026";

  /* =======================================================
     CRIME BREAKDOWN TITLE
     ======================================================= */

  const crimeBreakdownTitle = useMemo(() => {
    if (selectedBarangay) {
      return `Crime Breakdown — ${selectedBarangay.name}`;
    }

    if (selectedYear !== "all") {
      return `Crime Breakdown — ${selectedYear}`;
    }

    return "Crime Breakdown";
  }, [selectedBarangay, selectedYear]);

  /* =======================================================
     CRIME BREAKDOWN DESCRIPTION
     =======================================================

     The description changes according to the filters
     and tells the user whether the values are reported
     or estimated.
  ======================================================= */

  const crimeBreakdownSubtitle = selectedBarangay
    ? selectedYear === "all"
      ? `Highest reported crime categories in ${selectedBarangay.name}`
      : `Highest estimated crime categories in ${selectedBarangay.name} for ${selectedYear}`
    : selectedYear === "all"
      ? "Highest reported crime categories across Samal"
      : `Highest reported crime categories across Samal in ${selectedYear}`;

  /* =======================================================
     USER INTERFACE
     =======================================================

     Everything below displays the calculated data.

     The analytics section contains:

     1. Analytics heading
     2. Current filter context
     3. Yearly Trend chart
     4. Crime Breakdown chart
     5. Reported / Estimated labels
     6. Empty-state messages
  ======================================================= */

  return (
    <Box
      sx={{
        minWidth: 0,
      }}
    >
      {/* =================================================
          ANALYTICS SECTION HEADER
      ================================================= */}

      <Box
        sx={{
          mb: {
            xs: 2,
            sm: 2.5,
          },
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: "secondary.dark",

            fontWeight: 800,

            letterSpacing: 1.4,

            fontSize: {
              xs: "0.68rem",
              sm: "0.75rem",
            },
          }}
        >
          Data Analysis
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mt: 0.25,

            fontWeight: 800,

            color: "text.primary",

            fontSize: {
              xs: "1.35rem",
              sm: "1.5rem",
            },
          }}
        >
          Crime Analytics
        </Typography>

        {/* Current filters */}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,

            fontSize: {
              xs: "0.78rem",
              sm: "0.875rem",
            },

            lineHeight: 1.5,

            overflowWrap: "anywhere",
          }}
        >
          {contextLabel}
        </Typography>
      </Box>

      {/* =================================================
          ANALYTICS CARD LAYOUT

          Mobile:
          Charts appear one after another.

          Large desktop:
          Two charts appear side-by-side.
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",

            lg: "repeat(2, minmax(0, 1fr))",
          },

          gap: {
            xs: 2,
            sm: 2.5,
          },

          minWidth: 0,
        }}
      >
        {/* =================================================
            YEARLY TREND CARD
        ================================================= */}

        <Paper
          variant="outlined"
          sx={{
            minWidth: 0,

            p: {
              xs: 1.5,
              sm: 2.5,
            },

            borderRadius: 3,

            overflow: "hidden",
          }}
        >
          {/* =============================================
              YEARLY TREND HEADER
          ============================================= */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={{
              xs: 1,
              sm: 2,
            }}
            sx={{
              justifyContent: "space-between",

              alignItems: {
                xs: "stretch",
                sm: "flex-start",
              },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                minWidth: 0,

                flex: 1,

                alignItems: "flex-start",
              }}
            >
              <QueryStatsOutlined
                color="primary"
                sx={{
                  mt: 0.25,

                  flexShrink: 0,

                  fontSize: {
                    xs: 21,
                    sm: 24,
                  },
                }}
              />

              <Box
                sx={{
                  minWidth: 0,

                  flex: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,

                    color: "text.primary",

                    fontSize: {
                      xs: "0.9rem",
                      sm: "1rem",
                    },

                    lineHeight: 1.35,

                    overflowWrap: "anywhere",
                  }}
                >
                  {yearlyTrendTitle}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",

                    mt: 0.3,

                    lineHeight: 1.45,
                  }}
                >
                  {yearlyTrendSubtitle}
                </Typography>
              </Box>
            </Stack>

            {/* Reported / Estimated indicator */}

            <Box
              sx={{
                flexShrink: 0,

                alignSelf: {
                  xs: "flex-start",
                  sm: "auto",
                },
              }}
            >
              <DataStatusChip estimated={yearlyTrendEstimated} />
            </Box>
          </Stack>

          <Divider
            sx={{
              my: {
                xs: 1.5,
                sm: 2,
              },
            }}
          />

          {/* =============================================
              YEARLY TREND LINE CHART

              X-axis:
              2024, 2025, 2026

              Y-axis:
              Number of cases

              The line allows the user to visually compare
              whether the case count increased or decreased
              across the three reporting years.

              IMPORTANT:

              The chart describes past recorded/estimated
              values.

              It does NOT predict future crime.
          ============================================= */}

          {yearlyTrendHasData ? (
            <>
              <Box
                sx={{
                  width: "100%",

                  height: {
                    xs: 245,
                    sm: 300,
                  },

                  minWidth: 0,

                  overflow: "hidden",
                }}
              >
                <LineChart
                  xAxis={[
                    {
                      scaleType: "point",

                      data: ["2024", "2025", "2026"],
                    },
                  ]}
                  series={[
                    {
                      data: yearlyTrend,

                      label: selectedCrime?.name ?? "All Crimes",

                      color: activeCrimeColor,

                      curve: "linear",

                      showMark: true,
                    },
                  ]}
                  height={245}
                  margin={{
                    left: 40,
                    right: 12,
                    top: 25,
                    bottom: 25,
                  }}
                  hideLegend
                />
              </Box>

              {/* Explain chart data source */}

              <Typography
                variant="caption"
                sx={{
                  display: "block",

                  mt: 1,

                  color: yearlyTrendEstimated ? "#B45309" : "#0F766E",

                  fontWeight: 600,

                  lineHeight: 1.4,
                }}
              >
                {yearlyTrendEstimated
                  ? "Estimated yearly barangay allocation"
                  : "Reported municipality yearly totals"}
              </Typography>
            </>
          ) : (
            <EmptyChartState
              message={`No cases were found for ${crimeLabel} in ${barangayLabel} across the 2024–2026 period.`}
            />
          )}
        </Paper>

        {/* =================================================
            CRIME BREAKDOWN CARD

            This chart compares crime categories under the
            current Year and Barangay filters.
        ================================================= */}

        <Paper
          variant="outlined"
          sx={{
            minWidth: 0,

            p: {
              xs: 1.5,
              sm: 2.5,
            },

            borderRadius: 3,

            overflow: "hidden",
          }}
        >
          {/* =============================================
              CRIME BREAKDOWN HEADER
          ============================================= */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={{
              xs: 1,
              sm: 2,
            }}
            sx={{
              justifyContent: "space-between",

              alignItems: {
                xs: "stretch",
                sm: "flex-start",
              },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                minWidth: 0,

                flex: 1,

                alignItems: "flex-start",
              }}
            >
              <BarChartOutlined
                color="primary"
                sx={{
                  mt: 0.25,

                  flexShrink: 0,

                  fontSize: {
                    xs: 21,
                    sm: 24,
                  },
                }}
              />

              <Box
                sx={{
                  minWidth: 0,

                  flex: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,

                    color: "text.primary",

                    fontSize: {
                      xs: "0.9rem",
                      sm: "1rem",
                    },

                    lineHeight: 1.35,
                  }}
                >
                  {crimeBreakdownTitle}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",

                    mt: 0.3,

                    lineHeight: 1.45,
                  }}
                >
                  {crimeBreakdownSubtitle}
                </Typography>
              </Box>
            </Stack>

            {/* Reported / Estimated indicator */}

            <Box
              sx={{
                flexShrink: 0,

                alignSelf: {
                  xs: "flex-start",
                  sm: "auto",
                },
              }}
            >
              <DataStatusChip estimated={breakdownEstimated} />
            </Box>
          </Stack>

          <Divider
            sx={{
              my: {
                xs: 1.5,
                sm: 2,
              },
            }}
          />

          {crimeBreakdownHasData ? (
            <>
              {/* ===========================================
                  MOBILE CRIME RANKING

                  On small mobile screens, a full bar chart
                  may be difficult to read.

                  Therefore the component uses a simpler
                  ranked list.

                  Example:

                  1. Malicious Mischief       10
                  2. Alarm and Scandal         5
                  3. Physical Injuries         5


                  IMPORTANT:

                  Rank #1 means highest number of cases.

                  It does NOT mean most dangerous or most
                  serious crime.
              =========================================== */}

              <Stack
                spacing={1}
                sx={{
                  display: {
                    xs: "flex",
                    sm: "none",
                  },
                }}
              >
                {topCrimes.map((crime, index) => {
                  /*
                       Get this crime's assigned visual
                       color.
                    */

                  const color = getCrimeColor(crime.id);

                  /*
                       The highest crime is the reference
                       for the comparison bar.
                    */

                  const maxValue = topCrimes[0]?.value || 1;

                  /*
                       Calculate the relative width of
                       the bar.

                       Example:

                       Highest crime = 10
                       Current crime = 5

                       5 / 10 × 100 = 50%


                       Minimum width is 5% so very small
                       values remain visible.


                       IMPORTANT:

                       This is NOT a crime-risk percentage.

                       It only compares case counts.
                    */

                  const width = Math.max(
                    5,

                    (crime.value / maxValue) * 100,
                  );

                  return (
                    <Box
                      key={crime.id}
                      sx={{
                        p: 1.15,

                        border: "1px solid",

                        borderColor: "divider",

                        borderRadius: 2,

                        bgcolor: "rgba(15,61,86,0.018)",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: "flex-start",
                        }}
                      >
                        {/* Crime ranking number */}

                        <Typography
                          variant="caption"
                          sx={{
                            width: 20,

                            flexShrink: 0,

                            pt: "1px",

                            fontWeight: 900,

                            color: "text.secondary",
                          }}
                        >
                          {index + 1}
                        </Typography>

                        <Box
                          sx={{
                            minWidth: 0,

                            flex: 1,
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                              justifyContent: "space-between",

                              alignItems: "flex-start",
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={0.7}
                              sx={{
                                minWidth: 0,

                                alignItems: "flex-start",
                              }}
                            >
                              {/* Crime color */}

                              <Box
                                sx={{
                                  width: 8,

                                  height: 8,

                                  mt: "4px",

                                  flexShrink: 0,

                                  borderRadius: "50%",

                                  bgcolor: color,
                                }}
                              />

                              {/* Crime name */}

                              <Typography
                                variant="caption"
                                sx={{
                                  minWidth: 0,

                                  fontWeight: 700,

                                  color: "text.primary",

                                  lineHeight: 1.35,

                                  overflowWrap: "anywhere",
                                }}
                              >
                                {crime.name}
                              </Typography>
                            </Stack>

                            {/* Number of cases */}

                            <Typography
                              variant="caption"
                              sx={{
                                flexShrink: 0,

                                fontWeight: 900,

                                color,
                              }}
                            >
                              {crime.value}
                            </Typography>
                          </Stack>

                          {/* Relative comparison bar */}

                          <Box
                            sx={{
                              mt: 0.8,

                              height: 5,

                              overflow: "hidden",

                              borderRadius: 99,

                              bgcolor: "rgba(15,61,86,0.07)",
                            }}
                          >
                            <Box
                              sx={{
                                width: `${width}%`,

                                height: "100%",

                                borderRadius: 99,

                                bgcolor: color,
                              }}
                            />
                          </Box>
                        </Box>
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>

              {/* ===========================================
                  TABLET / DESKTOP CRIME BREAKDOWN

                  On larger screens, use a horizontal
                  bar chart.

                  Y-axis:
                  Crime categories

                  X-axis:
                  Number of cases


                  Only the six crime categories with the
                  highest counts are displayed.
              =========================================== */}

              <Box
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },

                  width: "100%",

                  height: 320,

                  minWidth: 0,

                  overflow: "hidden",
                }}
              >
                <BarChart
                  yAxis={[
                    {
                      scaleType: "band",

                      data: topCrimes.map((crime) => crime.name),

                      width: 160,
                    },
                  ]}
                  xAxis={[
                    {
                      min: 0,
                    },
                  ]}
                  series={topCrimes.map((crime, crimeIndex) => ({
                    label: crime.name,

                    /*
                         Each crime receives its own
                         colored series.

                         Only the matching row receives
                         the crime's value.
                      */

                    data: topCrimes.map((_, index) =>
                      index === crimeIndex ? crime.value : null,
                    ),

                    color: getCrimeColor(crime.id),

                    stack: "crime-breakdown",
                  }))}
                  layout="horizontal"
                  height={320}
                  margin={{
                    left: 10,
                    right: 20,
                    top: 20,
                    bottom: 25,
                  }}
                  hideLegend
                />
              </Box>

              {/* ===========================================
                  CRIME BREAKDOWN DATA SOURCE
              =========================================== */}

              <Typography
                variant="caption"
                sx={{
                  display: "block",

                  mt: 1,

                  color: breakdownEstimated ? "#B45309" : "#0F766E",

                  fontWeight: 600,

                  lineHeight: 1.4,
                }}
              >
                {breakdownEstimated
                  ? "Estimated crime allocation for the selected year and barangay"
                  : "Based on reported crime totals"}
              </Typography>
            </>
          ) : (
            <EmptyChartState
              message={`No crime cases were found for ${barangayLabel} during ${yearLabel}.`}
            />
          )}
        </Paper>
      </Box>
    </Box>
  );
}

/* =========================================================
   SIMPLE EXPLANATION FOR CRIMINOLOGY STUDENTS
   =========================================================


   WHAT IS CRIME ANALYTICS?


   CrimeAnalytics is the part of Bantay Samal that turns
   crime statistics into charts.


   Instead of only reading numbers such as:

   2024 = 80
   2025 = 108
   2026 = 62


   the student can see those numbers visually using a
   line chart.


   =========================================================
   CHART 1 — YEARLY TREND
   =========================================================


   The Yearly Trend compares crime cases across:

   2024
     ↓
   2025
     ↓
   2026


   Example:

   2024 = 80
   2025 = 108
   2026 = 62


   The line will:

   Rise from 2024 to 2025

   and then

   Fall from 2025 to 2026.


   This allows the researcher to describe the pattern as:

   "Recorded cases increased from 2024 to 2025 and
   decreased in 2026."


   But the chart alone cannot explain WHY the change
   happened.


   =========================================================
   REPORTED YEARLY TREND
   =========================================================


   ALL BARANGAYS
   + ALL CRIMES

          ↓

   Reported municipality yearly totals


   ---------------------------------------------------------


   ALL BARANGAYS
   + SPECIFIC CRIME

          ↓

   Reported Crime × Year totals


   =========================================================
   ESTIMATED YEARLY TREND
   =========================================================


   Once a SPECIFIC BARANGAY is selected:

          ↓

   The system needs Year × Barangay information

          ↓

   The exact cross-tabulation was not directly reported

          ↓

   Bantay Samal uses the estimated allocation

          ↓

   The chart is marked:

   ESTIMATED


   =========================================================
   CHART 2 — CRIME BREAKDOWN
   =========================================================


   Crime Breakdown answers:

   "Which crime categories have the highest number of
   cases?"


   Example:

   Malicious Mischief       37
   Alarm and Scandal        38
   Physical Injuries        30


   The component sorts these values from highest to
   lowest and displays up to six categories.


   =========================================================
   WHEN IS CRIME BREAKDOWN REPORTED?
   =========================================================


   ALL BARANGAYS
   + ALL YEARS

          ↓

   Reported Crime totals


   ---------------------------------------------------------


   ALL BARANGAYS
   + SPECIFIC YEAR

          ↓

   Reported Crime × Year totals


   ---------------------------------------------------------


   SPECIFIC BARANGAY
   + ALL YEARS

          ↓

   Reported Crime × Barangay totals


   =========================================================
   WHEN IS CRIME BREAKDOWN ESTIMATED?
   =========================================================


   SPECIFIC BARANGAY
   + SPECIFIC YEAR

          ↓

   Crime × Year × Barangay is needed

          ↓

   Exact cross-tabulation was not directly reported

          ↓

   Estimated allocation is used


   =========================================================
   EXAMPLE
   =========================================================


   Suppose the user selects:

   Barangay:
   Gugo

   Year:
   2025

   Crime:
   All Crimes


   YEARLY TREND
   ------------

   Because a specific barangay is selected, the yearly
   trend uses estimated year-by-barangay values.


   CRIME BREAKDOWN
   ---------------

   Because BOTH a specific barangay and a specific year
   are selected, the crime breakdown uses estimated
   Crime × Year × Barangay values.


   Therefore both charts should be clearly marked:

   ESTIMATED


   =========================================================
   WHAT DOES "TOP CRIMES" MEAN?
   =========================================================


   Suppose the chart shows:

   #1 Alarm and Scandal          20
   #2 Malicious Mischief         13
   #3 Resistance                 10


   This only means that Alarm and Scandal has the highest
   number of cases under the selected filters.


   It does NOT mean:

   Alarm and Scandal is the most dangerous crime.

   It does NOT mean:

   It is legally the most serious offense.

   It does NOT mean:

   It carries the highest criminal penalty.


   =========================================================
   WHAT DO THE MOBILE BARS MEAN?
   =========================================================


   Suppose:

   Highest crime = 20 cases

   Another crime = 10 cases


   The highest crime receives:

   100% bar width


   The other crime receives:

   50% bar width


   This means:

   10 is half of 20.


   It does NOT mean:

   "There is a 50% chance of this crime happening."


   =========================================================
   REPORTED VS ESTIMATED
   =========================================================


   REPORTED
   --------

   The value comes directly from one of the available
   source totals used by Bantay Samal.


   ESTIMATED
   ---------

   The exact combination needed by the dashboard was not
   directly available in the source cross-tabulations.

   Therefore, an allocation was calculated while
   preserving the known totals.


   Estimated values should always remain clearly labeled
   as estimated.


   =========================================================
   HOW A CRIMINOLOGY STUDENT CAN INTERPRET THE CHARTS
   =========================================================


   GOOD INTERPRETATION:

   "The recorded number of cases increased from 2024 to
   2025 and decreased in 2026."


   GOOD INTERPRETATION:

   "Alarm and Scandal had the highest recorded case count
   among the displayed crime categories."


   GOOD INTERPRETATION:

   "The barangay-level yearly values are estimated because
   the source data did not directly provide the complete
   year-by-barangay cross-tabulation."


   AVOID:

   "Crime increased because police were ineffective."


   Why?

   The chart does not contain evidence proving that cause.


   AVOID:

   "This barangay is dangerous."


   Why?

   Case counts alone are not enough to establish overall
   danger or victimization risk.


   AVOID:

   "Crime will decrease next year."


   Why?

   The chart describes 2024–2026 data.

   It is not a forecasting model.


   =========================================================
   SIMPLE PROGRAM FLOW
   =========================================================


   DASHBOARD FILTERS

   Year
   Crime
   Barangay

          ↓

   CrimeAnalytics receives the selected filters

          ↓

   Find the selected crime and barangay

          ↓

   Calculate YEARLY TREND

          ↓

   Determine:

   Reported or Estimated?

          ↓

   Calculate CRIME BREAKDOWN

          ↓

   Determine:

   Reported or Estimated?

          ↓

   Remove crimes with zero cases

          ↓

   Sort crimes from highest to lowest

          ↓

   Keep the top six

          ↓

   Display the charts


   =========================================================
   FINAL SIMPLE EXPLANATION
   =========================================================


   CrimeAnalytics is the data-analysis section of
   Bantay Samal.

   It helps criminology students and researchers see:

   - How crime counts changed from 2024 to 2026

   - Which crime categories have the highest counts

   - Whether the displayed statistics are reported or
     estimated

   - How the results change when Year, Crime, and Barangay
     filters are changed


   The charts make crime statistics easier to compare and
   understand.

   However, they should be interpreted as descriptive
   statistics only.

   They describe the available crime data.

   They do not automatically explain the causes of crime,
   measure the overall safety of a barangay, or predict
   future criminal activity.
========================================================= */
