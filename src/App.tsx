import { useMemo, useState } from "react";

import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";

import {
  InfoOutlined,
  KeyboardBackspaceOutlined,
  LocationOnOutlined,
  ShieldOutlined,
} from "@mui/icons-material";

/*
=========================================================
BANTAY SAMAL - MAIN APPLICATION
=========================================================

WHAT IS THIS FILE?

App.tsx is the MAIN CONTROLLER of the Bantay Samal system.

A simple way to understand it is:

                App.tsx
                   │
        ┌──────────┴──────────┐
        │                     │
   Landing Page          Crime Dashboard
                              │
             ┌────────────────┼────────────────┐
             │                │                │
           Filters           Map           Analytics
             │                │                │
             └─────────── Selected Data ───────┘

This file does not contain all crime calculations itself.

Instead, it connects the different components of the system and
passes the user's selected filters to them.

For a criminology student:

Think of App.tsx as the "control center" of Bantay Samal.

When a user selects:

Year = 2025
Crime = Malicious Mischief
Barangay = Gugo

App.tsx remembers those selections and sends them to the map,
analytics, area summary, and information dialogs.

IMPORTANT:

The system distinguishes between:

1. REPORTED DATA
   Values directly supported by the available crime dataset.

2. ESTIMATED DATA
   Values calculated when a specific Year × Barangay combination
   is not directly available from the reported source data.

Estimated values must never be described as directly reported
crime incidents.
=========================================================
*/

/*
=========================================================
DASHBOARD COMPONENTS
=========================================================

Each component has a specific responsibility.

SummaryCards
    → Shows general information such as total cases,
      number of barangays, crime types, and reporting period.

FilterPanel
    → Allows the user to select year, crime, and barangay.

CrimeAnalytics
    → Presents crime information using charts.

AreaSummary
    → Compares and ranks barangays according to case counts.

CrimeDetails
    → Explains the selected crime, including its definition
      and legal information.

DataMethodology
    → Explains how reported and estimated data are handled.

BarangayDetails
    → Shows a detailed profile of the selected barangay.

SamalMap
    → Displays the geographic crime visualization.

LandingPage
    → The introductory page before entering the dashboard.
=========================================================
*/

import SummaryCards from "./components/dashboard/SummaryCards";
import FilterPanel from "./components/dashboard/FilterPanel";
import CrimeAnalytics from "./components/dashboard/CrimeAnalytics";
import AreaSummary from "./components/dashboard/AreaSummary";
import CrimeDetails from "./components/dashboard/CrimeDetails";
import DataMethodology from "./components/dashboard/DataMethodology";
import BarangayDetails from "./components/dashboard/BarangayDetails";

import SamalMap from "./components/map/SamalMap";
import LandingPage from "./components/landing/LandingPage";

/*
=========================================================
DATA
=========================================================

crimes.json contains the main crime information used throughout
the dashboard.

Examples include:

- Crime ID
- Crime name
- Category
- Yearly totals
- Barangay totals
- Total cases
- Definition
- Legal basis
- Legal provision

The application uses the crime ID to connect the selected crime
to the appropriate information and visualization.
=========================================================
*/

import crimesData from "./data/crimes.json";

/*
=========================================================
CRIME COLORS
=========================================================

Each crime type has its own visualization color.

IMPORTANT FOR INTERPRETATION:

The color assigned to a crime DOES NOT indicate:

- seriousness of the offense
- legal penalty
- crime severity
- barangay safety
- level of danger

It is only a visual aid that helps users distinguish crime types.
=========================================================
*/

import { getCrimeColor } from "./utils/crimeColors";

/*
=========================================================
DASHBOARD ANIMATIONS
=========================================================

These objects only control how dashboard sections appear
on the screen.

They DO NOT change crime data.

For example:

dashboardFadeIn
    → slowly makes something visible

dashboardFadeUp
    → makes something appear while moving slightly upward

dashboardFadeDown
    → makes something appear from above

dashboardSlideLeft
    → makes something enter from the left

dashboardMapReveal
    → reveals the map smoothly

dashboardScaleIn
    → slightly enlarges an element as it appears

These are purely interface effects.
=========================================================
*/

const dashboardFadeIn = {
  animation: "dashboardFadeIn 500ms cubic-bezier(0.22, 1, 0.36, 1) both",

  "@keyframes dashboardFadeIn": {
    "0%": {
      opacity: 0,
    },

    "100%": {
      opacity: 1,
    },
  },

  /*
  Accessibility:

  Some users prefer reduced animation because motion can cause
  discomfort. If the device requests reduced motion, animations
  are disabled.
  */
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

const dashboardFadeUp = {
  animation: "dashboardFadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both",

  "@keyframes dashboardFadeUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(14px)",
    },

    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

const dashboardFadeDown = {
  animation: "dashboardFadeDown 500ms cubic-bezier(0.22, 1, 0.36, 1) both",

  "@keyframes dashboardFadeDown": {
    "0%": {
      opacity: 0,
      transform: "translateY(-10px)",
    },

    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

const dashboardSlideLeft = {
  animation: "dashboardSlideLeft 650ms cubic-bezier(0.22, 1, 0.36, 1) both",

  "@keyframes dashboardSlideLeft": {
    "0%": {
      opacity: 0,
      transform: "translateX(-16px)",
    },

    "100%": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

const dashboardMapReveal = {
  animation: "dashboardMapReveal 700ms cubic-bezier(0.22, 1, 0.36, 1) both",

  "@keyframes dashboardMapReveal": {
    "0%": {
      opacity: 0,
      transform: "translateY(10px) scale(0.992)",
    },

    "100%": {
      opacity: 1,
      transform: "translateY(0) scale(1)",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

const dashboardScaleIn = {
  animation: "dashboardScaleIn 380ms cubic-bezier(0.22, 1, 0.36, 1) both",

  "@keyframes dashboardScaleIn": {
    "0%": {
      opacity: 0,
      transform: "scale(0.97)",
    },

    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

/*
This function allows sections to appear one after another instead
of all appearing at exactly the same time.

Example:

Summary Cards → 140 ms
Filter Panel  → 210 ms
Map           → 260 ms

Again, this is only a visual effect.
*/

const dashboardAnimationDelay = (delay: number) => ({
  animationDelay: `${delay}ms`,

  "@media (prefers-reduced-motion: reduce)": {
    animationDelay: "0ms",
  },
});

/*
=========================================================
MAIN APPLICATION
=========================================================
*/

function App() {
  /*
  =======================================================
  PAGE STATE
  =======================================================

  Bantay Samal currently has two main pages:

  landing
      → introductory page

  dashboard
      → interactive crime mapping system

  The system starts on the landing page.
  =======================================================
  */

  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard">(
    "landing",
  );

  /*
  =======================================================
  FILTER STATE
  =======================================================

  These three variables remember what the user selected.

  Example:

  selectedYear       = "2025"
  selectedCrimeId    = "malicious-mischief"
  selectedBarangayId = "gugo"

  "all" means that no specific item has been selected.

  These selections are passed to other components so the entire
  dashboard stays synchronized.
  =======================================================
  */

  const [selectedYear, setSelectedYear] = useState("all");

  const [selectedCrimeId, setSelectedCrimeId] = useState("all");

  const [selectedBarangayId, setSelectedBarangayId] = useState("all");

  /*
  =======================================================
  BARANGAY DETAILS MODAL
  =======================================================

  This controls whether the Barangay Details window is open.

  false = closed
  true  = open
  =======================================================
  */

  const [barangayDetailsOpen, setBarangayDetailsOpen] = useState(false);

  /*
  =======================================================
  CRIME DETAILS MODAL
  =======================================================

  Controls the Crime Information dialog.

  This dialog contains explanatory/legal information about the
  selected crime.
  =======================================================
  */

  const [crimeDetailsOpen, setCrimeDetailsOpen] = useState(false);

  /*
  =======================================================
  MAP LEGEND
  =======================================================

  Controls whether the Case Intensity legend is visible.
  =======================================================
  */

  const [legendOpen, setLegendOpen] = useState(true);

  /*
  =======================================================
  PAGE NAVIGATION
  =======================================================
  */

  const openDashboard = () => {
    setCurrentPage("dashboard");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openLandingPage = () => {
    setCurrentPage("landing");

    /*
    Close dialogs before returning home so they are not left open
    when the user later returns to the dashboard.
    */

    setBarangayDetailsOpen(false);
    setCrimeDetailsOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  =======================================================
  RESET FILTERS
  =======================================================

  Restores the dashboard to its general municipality view.

  Year     → All Years
  Crime    → All Crimes
  Barangay → All Barangays
  =======================================================
  */

  const handleResetFilters = () => {
    setSelectedYear("all");
    setSelectedCrimeId("all");
    setSelectedBarangayId("all");

    setBarangayDetailsOpen(false);
    setCrimeDetailsOpen(false);
  };

  /*
  =======================================================
  MAP BARANGAY CLICK
  =======================================================

  When the user clicks a barangay directly on the map:

  1. That barangay becomes selected.
  2. The Barangay Details dialog opens.

  Example:

  User clicks Gugo
        ↓
  selectedBarangayId = "gugo"
        ↓
  Barangay Details opens

  This is different from simply choosing a barangay through some
  other dashboard controls.
  =======================================================
  */

  const handleMapBarangayChange = (barangayId: string) => {
    setSelectedBarangayId(barangayId);

    if (barangayId !== "all") {
      setBarangayDetailsOpen(true);
    }
  };

  /*
  =======================================================
  OPEN CRIME DETAILS
  =======================================================

  Crime information can only be opened when an individual crime
  has been selected.

  "All Crimes" does not represent one specific criminal offense,
  so there is no single legal definition to display.
  =======================================================
  */

  const handleOpenCrimeDetails = () => {
    if (selectedCrimeId !== "all") {
      setCrimeDetailsOpen(true);
    }
  };

  /*
  =======================================================
  CRIME FILTER CHANGE
  =======================================================
  */

  const handleCrimeChange = (crimeId: string) => {
    setSelectedCrimeId(crimeId);

    /*
    Close an existing Crime Details window because its information
    may belong to the previously selected crime.
    */

    setCrimeDetailsOpen(false);
  };

  /*
  =======================================================
  SELECTED CRIME
  =======================================================

  Find the complete record belonging to the selected crime ID.

  Example:

  selectedCrimeId
        ↓
  "malicious-mischief"
        ↓
  Search crimes.json
        ↓
  Return the Malicious Mischief object

  useMemo prevents React from searching again unless the selected
  crime changes.
  =======================================================
  */

  const selectedCrime = useMemo(() => {
    if (selectedCrimeId === "all") {
      return null;
    }

    return (
      crimesData.crimes.find((crime) => crime.id === selectedCrimeId) ?? null
    );
  }, [selectedCrimeId]);

  /*
  =======================================================
  ACTIVE CRIME COLOR
  =======================================================

  Retrieves the visualization color assigned to the selected crime.

  IMPORTANT:

  Crime color is NOT a measurement of crime seriousness.

  For example, red does not automatically mean that one crime is
  legally more serious than a crime shown in blue.

  Colors only distinguish categories visually.
  =======================================================
  */

  const activeCrimeColor = getCrimeColor(selectedCrimeId);

  /*
  =======================================================
  MAP CASE INTENSITY LEGEND
  =======================================================

  The map compares each barangay with the barangay having the
  highest case count under the CURRENT FILTERS.

  Conceptually:

       Barangay case count
  ----------------------------- × 100
    Highest barangay case count

  Example:

  Highest barangay = 20 cases
  Another barangay = 10 cases

  Relative intensity:

  10 ÷ 20 × 100 = 50%

  Therefore, that barangay falls within the Moderate category.

  IMPORTANT CRIMINOLOGY INTERPRETATION:

  Low, Moderate, High, and Very High are RELATIVE VISUAL
  CLASSIFICATIONS.

  They are NOT formal crime-risk or public-safety classifications.

  "Very High" does NOT automatically mean:
      "very dangerous"

  "Low" does NOT automatically mean:
      "safe"

  The classifications only help compare case concentration under
  the current dashboard filters.
  =======================================================
  */

  const legendItems = useMemo(() => {
    /*
    ALL CRIMES

    When all crimes are displayed, the system uses different teal
    shades for the intensity categories.
    */

    if (selectedCrimeId === "all") {
      return [
        {
          label: "Very High",
          range: "76–100%",
          color: "#134E4A",
          opacity: 1,
        },
        {
          label: "High",
          range: "51–75%",
          color: "#0F766E",
          opacity: 1,
        },
        {
          label: "Moderate",
          range: "26–50%",
          color: "#2DD4BF",
          opacity: 1,
        },
        {
          label: "Low",
          range: "1–25%",
          color: "#99F6E4",
          opacity: 1,
        },
        {
          label: "No cases",
          range: "0",
          color: "#CBD5E1",
          opacity: 1,
        },
      ];
    }

    /*
    SPECIFIC CRIME

    When one crime is selected, every positive barangay keeps the
    SAME crime color.

    Only transparency changes.

    This is important because we do not want different shades to
    look like different crimes.

    Same hue = same selected crime
    Different opacity = different relative concentration
    */

    return [
      {
        label: "Very High",
        range: "76–100%",
        color: activeCrimeColor,
        opacity: 0.88,
      },
      {
        label: "High",
        range: "51–75%",
        color: activeCrimeColor,
        opacity: 0.68,
      },
      {
        label: "Moderate",
        range: "26–50%",
        color: activeCrimeColor,
        opacity: 0.48,
      },
      {
        label: "Low",
        range: "1–25%",
        color: activeCrimeColor,
        opacity: 0.3,
      },
      {
        label: "No cases",
        range: "0",
        color: "#CBD5E1",
        opacity: 1,
      },
    ];
  }, [selectedCrimeId, activeCrimeColor]);

  /*
  =======================================================
  LANDING PAGE
  =======================================================

  Before entering the dashboard, show the project's introductory
  page.

  When the user presses the dashboard button, openDashboard()
  changes currentPage from:

  landing → dashboard
  =======================================================
  */

  if (currentPage === "landing") {
    return <LandingPage onOpenDashboard={openDashboard} />;
  }

  /*
  =======================================================
  DASHBOARD
  =======================================================

  From this point onward, the user is inside the interactive
  crime mapping dashboard.
  =======================================================
  */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* =====================================================
          HEADER

          Displays:
          - Bantay Samal identity
          - Crime Mapping & Statistics
          - Samal, Bataan

          Clicking the shield or Bantay Samal title returns the
          user to the landing page.
      ===================================================== */}

      <Box
        component="header"
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",

          py: {
            xs: 1.25,
            sm: 1.75,
            md: 2.25,
          },

          ...dashboardFadeIn,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack
              direction="row"
              spacing={{
                xs: 1,
                sm: 1.5,
              }}
              sx={{
                minWidth: 0,
                alignItems: "center",
              }}
            >
              {/* PROJECT LOGO */}

              <Box
                component="button"
                type="button"
                onClick={openLandingPage}
                aria-label="Return to Bantay Samal home"
                sx={{
                  width: {
                    xs: 40,
                    sm: 44,
                  },

                  height: {
                    xs: 40,
                    sm: 44,
                  },

                  p: 0,

                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,

                  borderRadius: 2.5,

                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "#FFFFFF",

                  border: "1px solid rgba(255,255,255,0.18)",

                  cursor: "pointer",

                  transition: "all 0.18s ease",

                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.20)",
                  },
                }}
              >
                <ShieldOutlined
                  sx={{
                    fontSize: {
                      xs: 21,
                      sm: 24,
                    },
                  }}
                />
              </Box>

              {/* PROJECT NAME */}

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="button"
                  type="button"
                  onClick={openLandingPage}
                  variant="h6"
                  sx={{
                    p: 0,
                    display: "block",

                    border: "none",
                    bgcolor: "transparent",

                    color: "inherit",
                    fontFamily: "inherit",

                    lineHeight: 1.1,

                    fontSize: {
                      xs: "1rem",
                      sm: "1.25rem",
                    },

                    fontWeight: 800,
                    cursor: "pointer",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  Bantay Samal
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },

                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  Crime Mapping & Statistics
                </Typography>
              </Box>

              {/* STUDY LOCATION */}

              <Chip
                icon={<LocationOnOutlined />}
                label="Samal, Bataan"
                sx={{
                  display: {
                    xs: "none",
                    sm: "flex",
                  },

                  ml: {
                    sm: 0.5,
                  },

                  bgcolor: "rgba(255,255,255,0.10)",
                  color: "#FFFFFF",

                  border: "1px solid rgba(255,255,255,0.16)",

                  "& .MuiChip-icon": {
                    color: "#5EEAD4",
                  },
                }}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* =====================================================
          MAIN DASHBOARD CONTENT
      ===================================================== */}

      <Container
        component="main"
        maxWidth="xl"
        sx={{
          py: {
            xs: 2.5,
            sm: 3.5,
            md: 5,
          },

          px: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        {/* ===================================================
            NAVIGATION + METHODOLOGY

            Left:
            Back arrow → returns to landing page

            Right:
            Information button → explains data methodology
        =================================================== */}

        <Box
          sx={{
            width: "100%",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            mb: {
              xs: 1.5,
              sm: 2,
            },

            ...dashboardFadeDown,
            ...dashboardAnimationDelay(80),
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={openLandingPage}
            aria-label="Back to home"
            title="Back to home"
            sx={{
              p: 0,

              width: 48,
              height: 40,

              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",

              border: "none",
              outline: "none",
              bgcolor: "transparent",

              color: "primary.main",
              cursor: "pointer",

              transition: "transform 0.18s ease, opacity 0.18s ease",

              "&:hover": {
                transform: "translateX(-3px)",
                opacity: 0.75,
                bgcolor: "transparent",
              },

              "&:active": {
                transform: "translateX(-5px)",
              },

              "&:focus-visible": {
                outline: "2px solid",
                outlineColor: "secondary.main",
                outlineOffset: "4px",
                borderRadius: 1,
              },
            }}
          >
            <KeyboardBackspaceOutlined
              sx={{
                fontSize: 32,
              }}
            />
          </Box>

          <Box
            sx={{
              ml: "auto",
              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DataMethodology />
          </Box>
        </Box>

        {/* ===================================================
            SUMMARY CARDS

            Provides a quick overview of the dataset.

            These cards should be interpreted as descriptive
            statistics about the dataset—not conclusions about
            public safety.
        =================================================== */}

        <Box
          sx={{
            mb: {
              xs: 2,
              md: 3,
            },

            ...dashboardFadeUp,
            ...dashboardAnimationDelay(140),
          }}
        >
          <SummaryCards />
        </Box>

        {/* ===================================================
            MAIN MAP WORKSPACE

            Desktop:
            Filter Panel | Map

            Mobile:
            Filter Panel
            Map
        =================================================== */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              lg: "280px minmax(0, 1fr)",
            },

            gap: {
              xs: 2,
              md: 2.5,
            },

            alignItems: "stretch",

            width: "100%",
            minWidth: 0,
          }}
        >
          {/* FILTER PANEL

              The filters determine what part of the crime
              dataset the user wants to examine.
          */}

          <Box
            sx={{
              minWidth: 0,

              ...dashboardSlideLeft,
              ...dashboardAnimationDelay(210),
            }}
          >
            <FilterPanel
              selectedYear={selectedYear}
              selectedCrimeId={selectedCrimeId}
              selectedBarangayId={selectedBarangayId}
              onYearChange={setSelectedYear}
              onCrimeChange={handleCrimeChange}
              onBarangayChange={setSelectedBarangayId}
              onReset={handleResetFilters}
            />
          </Box>

          {/* =================================================
              INTERACTIVE CRIME MAP

              The current filter selections are passed to
              SamalMap.

              Therefore, the map always knows:

              - selected year
              - selected crime
              - selected barangay

              When a barangay polygon is clicked,
              handleMapBarangayChange() is called.

              IMPORTANT:

              Map colors represent relative case concentration.

              They do NOT automatically represent:
              - danger
              - crime risk
              - probability of victimization
              - barangay safety
          ================================================= */}

          <Box
            sx={{
              minWidth: 0,
              width: "100%",

              height: {
                xs: 520,
                sm: 540,
                md: 580,
                lg: 600,
              },

              minHeight: 0,

              position: "relative",

              display: "grid",
              placeItems: "center",

              bgcolor: "background.paper",

              border: "1px solid",
              borderColor: "divider",

              borderRadius: {
                xs: 2.5,
                sm: 3,
              },

              overflow: "hidden",

              boxShadow: "0 4px 20px rgba(15,61,86,0.05)",

              ...dashboardMapReveal,
              ...dashboardAnimationDelay(260),
            }}
          >
            <SamalMap
              selectedBarangayId={selectedBarangayId}
              selectedCrimeId={selectedCrimeId}
              selectedYear={selectedYear}
              onBarangayChange={handleMapBarangayChange}
            />

            {/* ===============================================
                MUNICIPALITY INFORMATION

                This small map overlay identifies the geographic
                area being visualized.

                Clicking a barangay boundary opens its statistics.
            =============================================== */}

            <Box
              sx={{
                position: "absolute",

                bottom: {
                  xs: 10,
                  sm: 16,
                },

                left: {
                  xs: 10,
                  sm: 16,
                },

                right: "auto",

                zIndex: 1000,

                width: {
                  xs: 150,
                  sm: "auto",
                },

                px: {
                  xs: 1.25,
                  sm: 1.5,
                },

                py: {
                  xs: 0.8,
                  sm: 1,
                },

                maxWidth: {
                  xs: 150,
                  sm: 300,
                },

                bgcolor: "rgba(255,255,255,0.94)",

                border: "1px solid",
                borderColor: "divider",

                borderRadius: 2,

                boxShadow: "0 4px 14px rgba(15,61,86,0.08)",

                backdropFilter: "blur(6px)",

                ...dashboardFadeUp,
                ...dashboardAnimationDelay(650),
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontWeight: 800,
                  color: "text.primary",
                  lineHeight: 1.3,
                }}
              >
                Municipality of Samal
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.25,
                  lineHeight: 1.35,
                }}
              >
                Bataan, Philippines
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },

                  mt: 0.35,

                  fontSize: "0.68rem",
                  lineHeight: 1.35,
                }}
              >
                Click a barangay boundary to view detailed statistics.
              </Typography>
            </Box>

            {/* ===============================================
                CASE INTENSITY LEGEND

                This explains how to read the colors shown on
                the map.

                IMPORTANT:

                "Very High", "High", "Moderate", and "Low"
                are relative comparisons against the highest
                barangay under the current filters.

                They are NOT official criminological risk levels.
            =============================================== */}

            <Box
              sx={{
                position: "absolute",

                bottom: {
                  xs: 76,
                  sm: 16,
                },

                right: {
                  xs: 10,
                  sm: 16,
                },

                zIndex: 1000,

                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",

                gap: 0.75,

                ...dashboardFadeIn,
                ...dashboardAnimationDelay(700),
              }}
            >
              {/* SHOW / HIDE LEGEND */}

              <Button
                size="small"
                variant="contained"
                onClick={() => setLegendOpen((current) => !current)}
                sx={{
                  minWidth: 0,

                  px: 1.5,
                  py: 0.7,

                  borderRadius: 2,

                  textTransform: "none",

                  fontSize: "0.7rem",
                  fontWeight: 800,

                  bgcolor: "rgba(255,255,255,0.96)",
                  color: "primary.main",

                  border: "1px solid",
                  borderColor: "divider",

                  boxShadow: "0 4px 14px rgba(15,61,86,0.12)",

                  backdropFilter: "blur(6px)",

                  "&:hover": {
                    bgcolor: "#FFFFFF",
                    boxShadow: "0 5px 16px rgba(15,61,86,0.16)",
                  },
                }}
              >
                {legendOpen ? "Hide Legend" : "Show Legend"}
              </Button>

              {legendOpen && (
                <Box
                  sx={{
                    width: {
                      xs: 160,
                      sm: 205,
                    },

                    maxHeight: {
                      xs: 250,
                      sm: "none",
                    },

                    overflowY: {
                      xs: "auto",
                      sm: "visible",
                    },

                    p: {
                      xs: 1.15,
                      sm: 1.5,
                    },

                    bgcolor: "rgba(255,255,255,0.96)",

                    border: "1px solid",
                    borderColor: "divider",

                    borderRadius: 2,

                    boxShadow: "0 4px 14px rgba(15,61,86,0.12)",

                    backdropFilter: "blur(6px)",

                    ...dashboardScaleIn,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      fontWeight: 800,
                      color: "text.primary",
                    }}
                  >
                    Case Intensity
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",

                      mt: 0.25,
                      mb: 1.25,

                      fontSize: "0.67rem",
                      lineHeight: 1.35,
                    }}
                  >
                    Relative to the highest barangay under the current filters
                  </Typography>

                  {/* =========================================
                      SELECTED CRIME COLOR

                      Only displayed when an individual crime
                      has been selected.
                  ========================================= */}

                  {selectedCrime && (
                    <Box
                      sx={{
                        mb: 1.15,
                        pb: 1,

                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.8}
                        sx={{
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,

                            flexShrink: 0,

                            borderRadius: "50%",

                            bgcolor: activeCrimeColor,

                            border: "2px solid #FFFFFF",

                            boxShadow: `0 0 0 1px ${activeCrimeColor}`,
                          }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",

                              fontSize: "0.64rem",
                              fontWeight: 800,

                              color: "text.primary",

                              lineHeight: 1.25,

                              overflowWrap: "anywhere",
                            }}
                          >
                            {selectedCrime.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",

                              mt: 0.15,

                              fontSize: "0.59rem",
                              lineHeight: 1.25,
                            }}
                          >
                            Crime color
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}

                  {/* =========================================
                      INTENSITY LEVELS
                  ========================================= */}

                  <Stack spacing={0.8}>
                    {legendItems.map((item) => (
                      <Stack
                        key={item.label}
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.8}
                          sx={{
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: 18,
                              height: 12,

                              flexShrink: 0,

                              bgcolor: item.color,
                              opacity: item.opacity,

                              borderRadius: 0.6,

                              border: "1px solid rgba(15,61,86,0.22)",
                            }}
                          />

                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.66rem",
                              fontWeight: 700,
                              color: "text.primary",
                            }}
                          >
                            {item.label}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.61rem",
                          }}
                        >
                          {item.range}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {/* =========================================
                      SELECTED BARANGAY

                      Yellow outline identifies the barangay the
                      user has currently selected.

                      Yellow does NOT indicate crime severity.
                  ========================================= */}

                  <Box
                    sx={{
                      mt: 1.15,
                      pt: 1,

                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={0.8}
                      sx={{
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 18,
                          height: 12,

                          flexShrink: 0,

                          bgcolor: "rgba(250,204,21,0.18)",

                          border: "2px solid #FACC15",

                          borderRadius: 0.6,
                        }}
                      />

                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "text.primary",
                        }}
                      >
                        Selected barangay
                      </Typography>
                    </Stack>
                  </Box>

                  {/* =========================================
                      DATA STATUS

                      This is one of the most important parts for
                      the research methodology.

                      REPORTED:
                      Complete 2024–2026 barangay totals are
                      supported by the reported data.

                      ESTIMATED:
                      Specific-year barangay values require the
                      estimated Crime × Year × Barangay allocation.

                      Therefore, estimated values should NEVER be
                      described as directly reported incidents.
                  ========================================= */}

                  <Box
                    sx={{
                      display: {
                        xs: "none",
                        sm: "block",
                      },

                      mt: 1,
                      pt: 1,

                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",

                        mb: 0.7,

                        fontSize: "0.61rem",
                        fontWeight: 800,

                        color: "text.primary",

                        letterSpacing: 0.4,
                      }}
                    >
                      DATA STATUS
                    </Typography>

                    <Stack spacing={0.6}>
                      {/* REPORTED */}

                      <Stack
                        direction="row"
                        spacing={0.7}
                        sx={{
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            width: 7,
                            height: 7,

                            mt: "3px",

                            flexShrink: 0,

                            borderRadius: "50%",
                            bgcolor: "#0F766E",
                          }}
                        />

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.62rem",
                            lineHeight: 1.3,
                          }}
                        >
                          2024–2026 barangay totals are reported
                        </Typography>
                      </Stack>

                      {/* ESTIMATED */}

                      <Stack
                        direction="row"
                        spacing={0.7}
                        sx={{
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            width: 7,
                            height: 7,

                            mt: "3px",

                            flexShrink: 0,

                            borderRadius: "50%",
                            bgcolor: "#B45309",
                          }}
                        />

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.62rem",
                            lineHeight: 1.3,
                          }}
                        >
                          Specific-year barangay values are estimated
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* ===================================================
            SELECTED CRIME INFORMATION

            Appears only when one crime has been selected.

            Shows:
            - crime name
            - total recorded cases for 2024–2026
            - crime visualization color
            - button for definition/legal information

            IMPORTANT:

            The color indicator is only an interface identifier.
            It does not indicate legal seriousness or severity.
        =================================================== */}

        {selectedCrime && (
          <Box
            sx={{
              mt: {
                xs: 2.5,
                md: 3,
              },

              p: {
                xs: 1.75,
                sm: 2.5,
              },

              display: "flex",

              flexDirection: {
                xs: "column",
                sm: "row",
              },

              alignItems: {
                xs: "stretch",
                sm: "center",
              },

              justifyContent: "space-between",

              gap: {
                xs: 1.5,
                sm: 2,
              },

              bgcolor: "background.paper",

              border: "1px solid",
              borderColor: "divider",

              borderRadius: 3,

              boxShadow: "0 4px 20px rgba(15,61,86,0.04)",

              ...dashboardFadeUp,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,

                  display: "grid",
                  placeItems: "center",

                  flexShrink: 0,

                  borderRadius: 2.25,

                  bgcolor: `${activeCrimeColor}18`,
                  color: activeCrimeColor,

                  border: `1px solid ${activeCrimeColor}30`,
                }}
              >
                <InfoOutlined />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    fontWeight: 700,
                  }}
                >
                  Selected Crime
                </Typography>

                <Stack
                  direction="row"
                  spacing={0.8}
                  sx={{
                    mt: 0.1,
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 9,
                      height: 9,

                      flexShrink: 0,

                      borderRadius: "50%",

                      bgcolor: activeCrimeColor,
                    }}
                  />

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {selectedCrime.name}
                  </Typography>
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  {selectedCrime.total}{" "}
                  {selectedCrime.total === 1 ? "case" : "cases"}
                  {" • "}
                  2024–2026
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              onClick={handleOpenCrimeDetails}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },

                flexShrink: 0,

                textTransform: "none",
                fontWeight: 800,

                px: 2.25,
                py: 1,

                color: activeCrimeColor,
                borderColor: activeCrimeColor,

                "&:hover": {
                  borderColor: activeCrimeColor,
                  bgcolor: `${activeCrimeColor}0D`,
                },
              }}
            >
              View Crime Information
            </Button>
          </Box>
        )}

        {/* ===================================================
            CRIME ANALYTICS

            Displays charts based on the current filters.

            The component receives the SAME selections as the map,
            keeping the dashboard synchronized.

            Charts describe the available data.

            They should not independently be interpreted as proof
            of causation, dangerousness, or crime risk.
        =================================================== */}

        <Box
          sx={{
            mt: {
              xs: 3,
              md: 4,
            },
          }}
        >
          <Box
            sx={{
              ...dashboardFadeUp,
              ...dashboardAnimationDelay(340),
            }}
          >
            <CrimeAnalytics
              selectedYear={selectedYear}
              selectedCrimeId={selectedCrimeId}
              selectedBarangayId={selectedBarangayId}
            />
          </Box>

          {/* =================================================
              AREA SUMMARY

              Compares barangays according to the number of cases
              produced by the current filters.

              IMPORTANT:

              A barangay being ranked #1 only means that it has
              the highest CASE COUNT in that comparison.

              It does NOT automatically mean:

              - most dangerous barangay
              - highest crime risk
              - worst barangay
              - least safe barangay

              Additional variables such as population, exposure,
              reporting practices, and time at risk would be
              required for broader criminological conclusions.
          ================================================= */}

          <Box
            sx={{
              ...dashboardFadeUp,
              ...dashboardAnimationDelay(420),
            }}
          >
            <AreaSummary
              selectedYear={selectedYear}
              selectedCrimeId={selectedCrimeId}
              selectedBarangayId={selectedBarangayId}
              onBarangayChange={setSelectedBarangayId}
            />
          </Box>
        </Box>
      </Container>

      {/* =====================================================
          DASHBOARD FOOTER
      ===================================================== */}

      <Box
        component="footer"
        sx={{
          mt: {
            xs: 3,
            md: 4,
          },

          py: {
            xs: 2.5,
            md: 3,
          },

          bgcolor: "#0A3044",
          color: "#FFFFFF",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={{
              xs: 1,
              sm: 1.5,
            }}
            sx={{
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },

              justifyContent: "space-between",
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
                  fontSize: 20,
                  color: "#5EEAD4",
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 800,
                }}
              >
                Bantay Samal
              </Typography>
            </Stack>

            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.62)",
                lineHeight: 1.5,
              }}
            >
              Crime Mapping & Statistics
              {" • "}
              Samal, Bataan
              {" • "}
              2024–2026
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* =====================================================
          BARANGAY DETAILS DIALOG

          Opens after the user clicks a barangay on the map.

          It receives:

          barangayId
              → which barangay to describe

          selectedYear
              → current year filter

          selectedCrimeId
              → current crime filter

          This allows the dialog to remain synchronized with the
          rest of the dashboard.
      ===================================================== */}

      <BarangayDetails
        open={barangayDetailsOpen}
        barangayId={selectedBarangayId}
        selectedYear={selectedYear}
        selectedCrimeId={selectedCrimeId}
        onClose={() => setBarangayDetailsOpen(false)}
      />

      {/* =====================================================
          CRIME DETAILS DIALOG

          Provides descriptive and legal information for the
          currently selected crime.

          This should be understood as informational context
          accompanying the statistical visualization.
      ===================================================== */}

      <CrimeDetails
        open={crimeDetailsOpen}
        selectedCrimeId={selectedCrimeId}
        onClose={() => setCrimeDetailsOpen(false)}
      />
    </Box>
  );
}

export default App;
