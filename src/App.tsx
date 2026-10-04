import { useMemo, useState } from "react";

import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";

import {
  InfoOutlined,
  KeyboardBackspaceOutlined,
  LocationOnOutlined,
  ShieldOutlined,
} from "@mui/icons-material";

import SummaryCards from "./components/dashboard/SummaryCards";
import FilterPanel from "./components/dashboard/FilterPanel";
import CrimeAnalytics from "./components/dashboard/CrimeAnalytics";
import AreaSummary from "./components/dashboard/AreaSummary";
import CrimeDetails from "./components/dashboard/CrimeDetails";
import DataMethodology from "./components/dashboard/DataMethodology";
import BarangayDetails from "./components/dashboard/BarangayDetails";

import SamalMap from "./components/map/SamalMap";
import LandingPage from "./components/landing/LandingPage";

import crimesData from "./data/crimes.json";
import { getCrimeColor } from "./utils/crimeColors";

/* =========================================
   DASHBOARD ANIMATIONS
========================================= */

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

const dashboardAnimationDelay = (delay: number) => ({
  animationDelay: `${delay}ms`,

  "@media (prefers-reduced-motion: reduce)": {
    animationDelay: "0ms",
  },
});

/* =========================================
   APP
========================================= */

function App() {
  /* =========================================
     PAGE STATE
  ========================================= */

  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard">(
    "landing",
  );

  /* =========================================
     FILTER STATE
  ========================================= */

  const [selectedYear, setSelectedYear] = useState("all");

  const [selectedCrimeId, setSelectedCrimeId] = useState("all");

  const [selectedBarangayId, setSelectedBarangayId] = useState("all");

  /* =========================================
     BARANGAY DETAILS MODAL
  ========================================= */

  const [barangayDetailsOpen, setBarangayDetailsOpen] = useState(false);

  /* =========================================
     CRIME DETAILS MODAL
  ========================================= */

  const [crimeDetailsOpen, setCrimeDetailsOpen] = useState(false);

  /* =========================================
     MAP LEGEND
  ========================================= */

  const [legendOpen, setLegendOpen] = useState(true);

  /* =========================================
     PAGE NAVIGATION
  ========================================= */

  const openDashboard = () => {
    setCurrentPage("dashboard");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openLandingPage = () => {
    setCurrentPage("landing");

    setBarangayDetailsOpen(false);
    setCrimeDetailsOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     RESET FILTERS
  ========================================= */

  const handleResetFilters = () => {
    setSelectedYear("all");
    setSelectedCrimeId("all");
    setSelectedBarangayId("all");

    setBarangayDetailsOpen(false);
    setCrimeDetailsOpen(false);
  };

  /* =========================================
     MAP BARANGAY CLICK

     Map click:
     → select barangay
     → open Barangay Details

     Filter/ranking selection:
     → select barangay only
  ========================================= */

  const handleMapBarangayChange = (barangayId: string) => {
    setSelectedBarangayId(barangayId);

    if (barangayId !== "all") {
      setBarangayDetailsOpen(true);
    }
  };

  /* =========================================
     OPEN CRIME DETAILS
  ========================================= */

  const handleOpenCrimeDetails = () => {
    if (selectedCrimeId !== "all") {
      setCrimeDetailsOpen(true);
    }
  };

  /* =========================================
     CRIME FILTER CHANGE
  ========================================= */

  const handleCrimeChange = (crimeId: string) => {
    setSelectedCrimeId(crimeId);
    setCrimeDetailsOpen(false);
  };

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
     ACTIVE CRIME COLOR
  ========================================= */

  const activeCrimeColor = getCrimeColor(selectedCrimeId);

  /* =========================================
     DYNAMIC LEGEND ITEMS
  ========================================= */

  const legendItems = useMemo(() => {
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

  /* =========================================
     LANDING PAGE
  ========================================= */

  if (currentPage === "landing") {
    return <LandingPage onOpenDashboard={openDashboard} />;
  }

  /* =========================================
     DASHBOARD
  ========================================= */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* =================================
          HEADER
      ================================= */}

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
            {/* =================================
                BRAND + LOCATION
            ================================= */}

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
              {/* LOGO */}

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

              {/* BRAND TEXT */}

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

              {/* LOCATION */}

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

      {/* =================================
          MAIN CONTENT
      ================================= */}

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
        {/* =================================
            BACK + ABOUT ACTION ROW
        ================================= */}

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
          {/* BACK BUTTON */}

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

          {/* INFO BUTTON */}

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

        {/* =================================
            SUMMARY CARDS
        ================================= */}

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

        {/* =================================
            MAIN MAP WORKSPACE
        ================================= */}

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
          {/* FILTER PANEL */}

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

          {/* =================================
              MAP CONTAINER
          ================================= */}

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
            {/* MAP */}

            <SamalMap
              selectedBarangayId={selectedBarangayId}
              selectedCrimeId={selectedCrimeId}
              selectedYear={selectedYear}
              onBarangayChange={handleMapBarangayChange}
            />

            {/* =================================
                MUNICIPALITY INFORMATION
            ================================= */}

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

            {/* =================================
                MAP LEGEND
            ================================= */}

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
              {/* SHOW / HIDE */}

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

              {/* =================================
                  LEGEND CONTENT
              ================================= */}

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
                  {/* TITLE */}

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

                  {/* =================================
                      SELECTED CRIME COLOR
                  ================================= */}

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

                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >
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

                  {/* =================================
                      INTENSITY LEVELS
                  ================================= */}

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

                  {/* =================================
                      SELECTED BARANGAY
                  ================================= */}

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

                  {/* =================================
                      DATA STATUS
                  ================================= */}

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

        {/* =================================
            SELECTED CRIME CARD
        ================================= */}

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
              {/* CRIME COLOR INDICATOR */}

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

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
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

        {/* =================================
            CRIME ANALYTICS
        ================================= */}

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

          {/* =================================
              AREA SUMMARY
          ================================= */}

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

      {/* =================================
          DASHBOARD FOOTER
      ================================= */}

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

      {/* =================================
          BARANGAY DETAILS MODAL
      ================================= */}

      <BarangayDetails
        open={barangayDetailsOpen}
        barangayId={selectedBarangayId}
        selectedYear={selectedYear}
        selectedCrimeId={selectedCrimeId}
        onClose={() => setBarangayDetailsOpen(false)}
      />

      {/* =================================
          CRIME DETAILS MODAL
      ================================= */}

      <CrimeDetails
        open={crimeDetailsOpen}
        selectedCrimeId={selectedCrimeId}
        onClose={() => setCrimeDetailsOpen(false)}
      />
    </Box>
  );
}

export default App;
