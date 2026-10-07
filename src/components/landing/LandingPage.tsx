import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";

import {
  ArrowForwardOutlined,
  AssessmentOutlined,
  BarChartOutlined,
  CheckCircleOutlineOutlined,
  ExploreOutlined,
  LocationOnOutlined,
  MapOutlined,
  PublicOutlined,
  SecurityOutlined,
  ShieldOutlined,
  TimelineOutlined,
} from "@mui/icons-material";

import samalLogo from "../../assets/Municipality-of-Samal-Logo.png";

/* =========================================================
   BANTAY SAMAL - LANDING PAGE
   =========================================================

   PURPOSE

   This file creates the first page users see when they
   open the Bantay Samal website.

   Think of the Landing Page as the INTRODUCTION to the
   entire crime mapping system.

   It tells the user:

   1. What Bantay Samal is
   2. Where the project is located
   3. What information can be explored
   4. How many barangays are covered
   5. What reporting years are included
   6. How reported and estimated data are distinguished
   7. Who developed the project
   8. How to open the main crime dashboard


   SIMPLE SYSTEM FLOW

        USER OPENS BANTAY SAMAL
                 │
                 ▼
            LANDING PAGE
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
      Purpose  Coverage  Features
        │        │        │
        └────────┼────────┘
                 ▼
        EXPLORE DASHBOARD
                 │
                 ▼
          CRIME DASHBOARD
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
       Map     Filters  Analytics


   IMPORTANT FOR CRIMINOLOGY STUDENTS

   The Landing Page itself does NOT calculate crime
   statistics.

   It does NOT predict crime.

   It does NOT classify a barangay as safe or dangerous.

   Its main purpose is to introduce the system and explain
   its scope before the user enters the dashboard.
========================================================= */

/* =========================================================
   PROPS
   =========================================================

   A "prop" is information or a function passed from one
   React component to another.

   LandingPage receives:

   onOpenDashboard

   This is a function provided by App.tsx.

   When the user clicks:

   "View Dashboard"
   "Explore Dashboard"
   "Open Dashboard"

   this function is called.

   App.tsx can then switch from the Landing Page to the
   main crime dashboard.
========================================================= */

type LandingPageProps = {
  onOpenDashboard: () => void;
};

/* =========================================================
   FEATURE DATA
   =========================================================

   These are the three major features introduced on the
   Landing Page.

   Instead of manually writing three separate feature
   cards, the information is stored in an array.

   Later we use:

   features.map(...)

   to automatically create the cards.
========================================================= */

const features = [
  {
    title: "Interactive Crime Map",

    description:
      "Explore reported crime activity across the 14 barangays of Samal through an interactive geographic map.",

    icon: <MapOutlined />,
  },

  {
    title: "Crime Statistics",

    description:
      "Review crime totals, yearly patterns, categories, and barangay-level statistics from 2024 to 2026.",

    icon: <BarChartOutlined />,
  },

  {
    title: "Area Insights",

    description:
      "Compare barangays and identify areas with higher or lower case intensity under the selected filters.",

    icon: <ExploreOutlined />,
  },
];

/* =========================================================
   COVERAGE DATA
   =========================================================

   This information explains the geographic and temporal
   scope of Bantay Samal.

   GEOGRAPHIC SCOPE:

   14 Barangays


   TEMPORAL SCOPE:

   3 Reporting Years

   2024–2026


   For criminology research, this helps users understand
   WHERE and WHEN the information applies.
========================================================= */

const coverageItems = [
  {
    value: "14",
    label: "Barangays",
  },

  {
    value: "3",
    label: "Reporting Years",
  },

  {
    value: "2024–2026",
    label: "Coverage Period",
  },
];

/* =========================================================
   ANIMATIONS
   =========================================================

   These animation objects control how elements appear
   when the Landing Page loads.

   IMPORTANT:

   These animations are only VISUAL EFFECTS.

   They do not affect:

   - crime statistics
   - reported values
   - estimated values
   - barangay information
   - calculations


   fadeUp

   Element starts slightly lower and invisible.

          ↓

   Element moves upward and becomes visible.
========================================================= */

const fadeUp = {
  animation: "landingFadeUp 700ms cubic-bezier(0.22, 1, 0.36, 1) both",

  "@keyframes landingFadeUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(18px)",
    },

    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },

  /* Accessibility:
     Disable animation when the user's device requests
     reduced motion.
  */
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

/* =========================================================
   RIGHT-SIDE ANIMATION
   =========================================================

   This is mainly used for the visual map card.

   The element begins slightly to the right and then moves
   into its normal position.
========================================================= */

const fadeRight = {
  animation: "landingFadeRight 850ms cubic-bezier(0.22, 1, 0.36, 1) both",

  "@keyframes landingFadeRight": {
    "0%": {
      opacity: 0,
      transform: "translateX(28px)",
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

/* =========================================================
   MUNICIPAL SEAL ANIMATION
   =========================================================

   The large Samal municipal seal appears in the hero
   background.

   It slowly becomes visible while slightly changing
   its rotation and scale.

   Again, this is only a design effect.
========================================================= */

const sealReveal = {
  animation: "landingSealReveal 1200ms cubic-bezier(0.22, 1, 0.36, 1) both",

  "@keyframes landingSealReveal": {
    "0%": {
      opacity: 0,

      transform:
        "translateY(-50%) rotate(-8deg) perspective(1100px) rotateY(12deg) scale(0.96)",
    },

    "100%": {
      opacity: 1,

      transform:
        "translateY(-50%) rotate(-5deg) perspective(1100px) rotateY(8deg) scale(1)",
    },
  },

  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

/* =========================================================
   ANIMATION DELAY
   =========================================================

   This function allows different elements to appear at
   slightly different times.

   Example:

   Location chip
        ↓
   Heading
        ↓
   Description
        ↓
   Button

   This creates a smoother entrance instead of making
   everything appear at exactly the same time.
========================================================= */

const animationDelay = (delay: number) => ({
  animationDelay: `${delay}ms`,

  "@media (prefers-reduced-motion: reduce)": {
    animationDelay: "0ms",
  },
});

/* =========================================================
   LANDING PAGE COMPONENT
   ========================================================= */

export default function LandingPage({ onOpenDashboard }: LandingPageProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "background.default",

        overflow: "hidden",
      }}
    >
      {/* ===================================================
          NAVIGATION / HEADER
          ===================================================

          This is the top part of the Landing Page.

          LEFT:
          Bantay Samal branding

          RIGHT:
          View Dashboard button
      =================================================== */}

      <Box
        component="header"
        sx={{
          position: "relative",

          zIndex: 10,

          bgcolor: "primary.main",

          color: "primary.contrastText",

          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            py: {
              xs: 1.75,
              md: 2,
            },
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",

              justifyContent: "space-between",
            }}
          >
            {/* =============================================
                BRAND
                =============================================

                Displays:

                Shield icon
                Bantay Samal
                Crime Mapping & Statistics
            ============================================= */}

            <Stack
              direction="row"
              spacing={1.4}
              sx={{
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 44,

                  height: 44,

                  display: "grid",

                  placeItems: "center",

                  flexShrink: 0,

                  borderRadius: 2.5,

                  bgcolor: "rgba(255,255,255,0.12)",

                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <ShieldOutlined />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    lineHeight: 1.1,

                    fontWeight: 800,
                  }}
                >
                  Bantay Samal
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.70)",
                  }}
                >
                  Crime Mapping & Statistics
                </Typography>
              </Box>
            </Stack>

            {/* =============================================
                VIEW DASHBOARD BUTTON

                Clicking this button calls:

                onOpenDashboard()

                which tells App.tsx to display the main
                dashboard.
            ============================================= */}

            <Button
              variant="outlined"
              endIcon={<ArrowForwardOutlined />}
              onClick={onOpenDashboard}
              sx={{
                display: {
                  xs: "none",
                  sm: "inline-flex",
                },

                px: 2,

                color: "#FFFFFF",

                borderColor: "rgba(255,255,255,0.34)",

                textTransform: "none",

                fontWeight: 800,

                "& .MuiButton-endIcon": {
                  transition: "transform 180ms ease",
                },

                "&:hover": {
                  borderColor: "#FFFFFF",

                  bgcolor: "rgba(255,255,255,0.08)",

                  "& .MuiButton-endIcon": {
                    transform: "translateX(3px)",
                  },
                },

                "@media (prefers-reduced-motion: reduce)": {
                  "& .MuiButton-endIcon": {
                    transition: "none",
                  },
                },
              }}
            >
              View Dashboard
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ===================================================
          HERO SECTION
          ===================================================

          The Hero is the large introduction section at
          the top of the website.

          It contains:

          - Samal location
          - Project title
          - Short description
          - Explore Dashboard button
          - Reporting coverage
          - Large Samal municipal seal
          - Crime map preview
      =================================================== */}

      <Box
        component="section"
        sx={{
          position: "relative",

          bgcolor: "primary.main",

          color: "#FFFFFF",

          overflow: "hidden",

          minHeight: {
            xs: "auto",
            md: 650,
            lg: 660,
          },

          display: "flex",

          alignItems: "center",

          pt: {
            xs: 6,
            md: 4,
            lg: 3,
          },

          pb: {
            xs: 7,
            md: 4,
            lg: 3,
          },

          /* ===============================================
             TOP-RIGHT DECORATION

             This creates a large transparent teal circle
             in the background.

             It is purely decorative.
          =============================================== */

          "&::before": {
            content: '""',

            position: "absolute",

            width: {
              md: 520,
              lg: 620,
              xl: 700,
            },

            height: {
              md: 520,
              lg: 620,
              xl: 700,
            },

            top: {
              md: -310,
              lg: -360,
              xl: -400,
            },

            right: {
              md: -170,
              lg: -170,
              xl: -180,
            },

            borderRadius: "50%",

            bgcolor: "rgba(20,184,166,0.10)",

            pointerEvents: "none",

            zIndex: 0,
          },

          /* ===============================================
             BOTTOM-LEFT DECORATION
          =============================================== */

          "&::after": {
            content: '""',

            position: "absolute",

            width: {
              xs: 310,
              md: 410,
              lg: 460,
            },

            height: {
              xs: 310,
              md: 410,
              lg: 460,
            },

            bottom: {
              xs: -230,
              md: -285,
              lg: -315,
            },

            left: {
              xs: -180,
              md: -190,
              lg: -205,
            },

            borderRadius: "50%",

            bgcolor: "rgba(255,255,255,0.035)",

            pointerEvents: "none",

            zIndex: 0,
          },
        }}
      >
        {/* =================================================
            LARGE SAMAL MUNICIPAL SEAL
            =================================================

            This displays the Municipality of Samal logo
            as a large background watermark.

            IMPORTANT:

            It is decorative only.

            aria-hidden="true"

            tells accessibility tools that the image does
            not contain information necessary to understand
            the page.
        ================================================= */}

        <Box
          sx={{
            position: "absolute",

            left: {
              xs: -225,
              sm: -245,
              md: -250,
              lg: -270,
              xl: -285,
            },

            top: "50%",

            width: {
              xs: 420,
              sm: 500,
              md: 570,
              lg: 630,
              xl: 690,
            },

            aspectRatio: "1 / 1",

            transform:
              "translateY(-50%) rotate(-5deg) perspective(1100px) rotateY(8deg)",

            transformOrigin: "center center",

            pointerEvents: "none",

            userSelect: "none",

            zIndex: 0,

            ...sealReveal,

            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",

              transform:
                "translateY(-50%) rotate(-5deg) perspective(1100px) rotateY(8deg)",
            },
          }}
        >
          <Box
            component="img"
            src={samalLogo}
            alt=""
            aria-hidden="true"
            sx={{
              display: "block",

              width: "100%",

              height: "100%",

              objectFit: "contain",

              opacity: {
                xs: 0.08,
                sm: 0.09,
                md: 0.1,
                lg: 0.11,
              },

              filter: "saturate(0.55) brightness(0.7) contrast(1.08)",

              mixBlendMode: "soft-light",
            }}
          />
        </Box>

        {/* =================================================
            MAIN HERO CONTENT
        ================================================= */}

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",

            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                md: "minmax(0, 1.05fr) minmax(450px, 0.95fr)",

                lg: "minmax(0, 1.03fr) minmax(520px, 0.97fr)",
              },

              alignItems: "center",

              columnGap: {
                md: 5,
                lg: 7,
                xl: 8,
              },

              rowGap: {
                xs: 5,
                md: 0,
              },

              minHeight: {
                md: 570,
                lg: 590,
              },
            }}
          >
            {/* =============================================
                LEFT SIDE OF HERO
            ============================================= */}

            <Box
              sx={{
                position: "relative",

                zIndex: 2,

                maxWidth: {
                  md: 700,
                  lg: 760,
                },

                pl: {
                  xs: 0,
                  md: 2,
                  lg: 3,
                  xl: 4,
                },
              }}
            >
              {/* LOCATION */}

              <Chip
                icon={<LocationOnOutlined />}
                label="Samal, Bataan"
                sx={{
                  mb: {
                    xs: 2.2,
                    md: 3,
                  },

                  height: 34,

                  bgcolor: "rgba(255,255,255,0.10)",

                  color: "#FFFFFF",

                  border: "1px solid rgba(255,255,255,0.18)",

                  fontWeight: 700,

                  backdropFilter: "blur(8px)",

                  ...fadeUp,

                  ...animationDelay(100),

                  "& .MuiChip-icon": {
                    color: "#5EEAD4",
                  },

                  "& .MuiChip-label": {
                    px: 1.25,
                  },
                }}
              />

              {/* ===========================================
                  PROJECT CATEGORY
              =========================================== */}

              <Typography
                variant="overline"
                sx={{
                  display: "block",

                  mb: {
                    xs: 1,
                    md: 1.4,
                  },

                  color: "#5EEAD4",

                  fontWeight: 900,

                  letterSpacing: 2.2,

                  lineHeight: 1.4,

                  ...fadeUp,

                  ...animationDelay(180),
                }}
              >
                Public Safety Data
              </Typography>

              {/* ===========================================
                  MAIN PROJECT MESSAGE
              =========================================== */}

              <Typography
                component="h1"
                sx={{
                  maxWidth: 760,

                  fontSize: {
                    xs: "2.75rem",
                    sm: "3.7rem",
                    md: "4.15rem",
                    lg: "4.55rem",
                    xl: "4.8rem",
                  },

                  lineHeight: {
                    xs: 1.06,
                    md: 1.02,
                  },

                  fontWeight: 900,

                  letterSpacing: "-0.045em",

                  ...fadeUp,

                  ...animationDelay(260),
                }}
              >
                Understand crime
                <br />
                patterns across
                <br />
                <Box
                  component="span"
                  sx={{
                    color: "#5EEAD4",
                  }}
                >
                  Samal.
                </Box>
              </Typography>

              {/* ===========================================
                  PROJECT DESCRIPTION

                  Explains what users can do inside
                  Bantay Samal.
              =========================================== */}

              <Typography
                variant="body1"
                sx={{
                  maxWidth: 690,

                  mt: {
                    xs: 2.2,
                    md: 2.7,
                  },

                  color: "rgba(255,255,255,0.78)",

                  fontSize: {
                    xs: "0.98rem",
                    md: "1.05rem",
                    lg: "1.08rem",
                  },

                  lineHeight: 1.85,

                  ...fadeUp,

                  ...animationDelay(340),
                }}
              >
                Explore crime statistics across the barangays of Samal, Bataan
                using an interactive map, crime analytics, and area-level
                insights covering 2024 to 2026.
              </Typography>

              {/* ===========================================
                  HERO ACTIONS
              =========================================== */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
                sx={{
                  mt: {
                    xs: 3,
                    md: 3.5,
                  },

                  alignItems: {
                    xs: "flex-start",
                    sm: "center",
                  },

                  ...fadeUp,

                  ...animationDelay(420),
                }}
              >
                {/* ENTER DASHBOARD */}

                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardOutlined />}
                  onClick={onOpenDashboard}
                  sx={{
                    height: 50,

                    px: 3.3,

                    flexShrink: 0,

                    bgcolor: "secondary.main",

                    color: "#062D32",

                    borderRadius: 2.2,

                    textTransform: "none",

                    fontWeight: 900,

                    boxShadow: "0 10px 28px rgba(20,184,166,0.18)",

                    "& .MuiButton-endIcon": {
                      transition: "transform 180ms ease",
                    },

                    "&:hover": {
                      bgcolor: "#2DD4BF",

                      boxShadow: "0 12px 32px rgba(20,184,166,0.22)",

                      "& .MuiButton-endIcon": {
                        transform: "translateX(3px)",
                      },
                    },

                    "@media (prefers-reduced-motion: reduce)": {
                      "& .MuiButton-endIcon": {
                        transition: "none",
                      },
                    },
                  }}
                >
                  Explore Dashboard
                </Button>

                {/* =========================================
                    QUICK DATASET COVERAGE
                ========================================= */}

                <Box
                  sx={{
                    height: {
                      xs: "auto",
                      sm: 50,
                    },

                    display: "flex",

                    alignItems: "center",

                    gap: 1,

                    color: "rgba(255,255,255,0.74)",
                  }}
                >
                  <CheckCircleOutlineOutlined
                    sx={{
                      fontSize: 19,

                      color: "#5EEAD4",

                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      m: 0,

                      fontWeight: 700,

                      lineHeight: 1,

                      whiteSpace: "nowrap",
                    }}
                  >
                    14 barangays • 2024–2026
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* =============================================
                RIGHT-SIDE MAP VISUAL
                =============================================

                IMPORTANT:

                This is NOT the actual interactive Leaflet
                crime map.

                It is a visual preview used on the Landing
                Page to represent the crime mapping feature.

                The actual interactive geographic map is
                displayed inside the dashboard.
            ============================================= */}

            <Box
              sx={{
                position: "relative",

                display: {
                  xs: "none",
                  md: "block",
                },

                width: "100%",

                maxWidth: {
                  md: 590,
                  lg: 660,
                  xl: 690,
                },

                height: {
                  md: 420,
                  lg: 440,
                  xl: 450,
                },

                ml: "auto",

                zIndex: 2,

                ...fadeRight,

                ...animationDelay(300),

                "&:hover > .map-glass": {
                  transform: "rotate(1deg) translate(4px, 1px)",
                },
              }}
            >
              {/* OUTER GLASS EFFECT */}

              <Box
                className="map-glass"
                sx={{
                  position: "absolute",

                  inset: 0,

                  borderRadius: 5,

                  bgcolor: "rgba(255,255,255,0.075)",

                  border: "1px solid rgba(255,255,255,0.14)",

                  backdropFilter: "blur(10px)",

                  transform: "rotate(1.5deg) translate(4px, 3px)",

                  transition:
                    "transform 350ms ease, background-color 350ms ease",

                  boxShadow: "0 25px 65px rgba(0,0,0,0.12)",

                  "@media (prefers-reduced-motion: reduce)": {
                    transition: "none",
                  },
                }}
              />

              {/* INNER MAP PREVIEW CARD */}

              <Box
                sx={{
                  position: "absolute",

                  inset: {
                    md: 14,
                    lg: 16,
                  },

                  p: {
                    md: 2.7,
                    lg: 3,
                  },

                  display: "flex",

                  flexDirection: "column",

                  justifyContent: "space-between",

                  borderRadius: 4,

                  bgcolor: "#F8FAFC",

                  color: "text.primary",

                  border: "1px solid rgba(255,255,255,0.24)",

                  boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
                }}
              >
                {/* MAP CARD HEADER */}

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    width: "100%",

                    alignItems: "center",

                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",

                        color: "secondary.dark",

                        fontWeight: 900,

                        letterSpacing: 0.7,

                        textTransform: "uppercase",
                      }}
                    >
                      Interactive Map
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        mt: 0.25,

                        color: "primary.main",

                        fontWeight: 900,

                        lineHeight: 1.2,
                      }}
                    >
                      Samal Municipality
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 42,

                      height: 42,

                      display: "grid",

                      placeItems: "center",

                      flexShrink: 0,

                      borderRadius: 2,

                      bgcolor: "rgba(20,184,166,0.12)",

                      color: "secondary.dark",
                    }}
                  >
                    <MapOutlined />
                  </Box>
                </Stack>

                {/* =========================================
                    ABSTRACT MAP

                    This is a decorative representation of
                    a map.

                    It does NOT represent the actual
                    barangay boundaries.

                    The real geographic boundaries are
                    displayed in SamalMap.tsx.
                ========================================= */}

                <Box
                  sx={{
                    position: "relative",

                    height: {
                      md: 220,
                      lg: 235,
                    },

                    my: 2,

                    overflow: "hidden",

                    borderRadius: 3,

                    bgcolor: "#E7EEF1",

                    border: "1px solid #D6E1E5",

                    background:
                      "linear-gradient(135deg, #E7EEF1 0%, #EEF3F5 50%, #E1EAED 100%)",
                  }}
                >
                  {/* DECORATIVE ROAD 1 */}

                  <Box
                    sx={{
                      position: "absolute",

                      width: "130%",

                      height: 2,

                      top: "40%",

                      left: "-15%",

                      bgcolor: "rgba(255,255,255,0.95)",

                      transform: "rotate(-12deg)",
                    }}
                  />

                  {/* DECORATIVE ROAD 2 */}

                  <Box
                    sx={{
                      position: "absolute",

                      width: 2,

                      height: "130%",

                      top: "-15%",

                      left: "58%",

                      bgcolor: "rgba(255,255,255,0.95)",

                      transform: "rotate(22deg)",
                    }}
                  />

                  {/* DECORATIVE ROAD 3 */}

                  <Box
                    sx={{
                      position: "absolute",

                      width: "90%",

                      height: 2,

                      right: "-18%",

                      top: "24%",

                      bgcolor: "rgba(255,255,255,0.88)",

                      transform: "rotate(-9deg)",
                    }}
                  />

                  {/* =======================================
                      ABSTRACT MUNICIPAL SHAPE

                      This is only a graphic design element.

                      It is NOT an official geographic
                      boundary of Samal.
                  ======================================= */}

                  <Box
                    sx={{
                      position: "absolute",

                      width: "58%",

                      height: "72%",

                      left: "21%",

                      top: "14%",

                      background:
                        "linear-gradient(135deg, #2DD4BF 0%, #14B8A6 55%, #0D9488 100%)",

                      opacity: 0.94,

                      clipPath:
                        "polygon(18% 0%, 67% 6%, 100% 30%, 84% 63%, 62% 100%, 24% 88%, 0% 57%, 8% 22%)",

                      filter: "drop-shadow(0 8px 14px rgba(15,118,110,0.16))",
                    }}
                  />

                  {/* DECORATIVE MAP POINT */}

                  <Box
                    sx={{
                      position: "absolute",

                      width: 13,

                      height: 13,

                      left: "53%",

                      top: "43%",

                      bgcolor: "#FACC15",

                      border: "3px solid #FFFFFF",

                      borderRadius: "50%",

                      boxShadow: "0 3px 10px rgba(0,0,0,0.22)",
                    }}
                  />

                  {/* COVERAGE LABEL */}

                  <Chip
                    size="small"
                    label="14 Barangays"
                    sx={{
                      position: "absolute",

                      left: 14,

                      bottom: 14,

                      bgcolor: "rgba(255,255,255,0.94)",

                      color: "primary.main",

                      fontWeight: 900,

                      boxShadow: "0 3px 12px rgba(15,61,86,0.10)",
                    }}
                  />
                </Box>

                {/* MAP CARD FOOTER */}

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    width: "100%",

                    alignItems: "center",

                    justifyContent: "space-between",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      minWidth: 0,

                      flex: 1,

                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 9,

                        height: 9,

                        flexShrink: 0,

                        borderRadius: "50%",

                        bgcolor: "secondary.main",
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 700,

                        lineHeight: 1.3,
                      }}
                    >
                      Geographic crime visualization
                    </Typography>
                  </Stack>

                  <Typography
                    variant="caption"
                    sx={{
                      flexShrink: 0,

                      color: "primary.main",

                      fontWeight: 900,

                      whiteSpace: "nowrap",
                    }}
                  >
                    2024–2026
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ===================================================
          FEATURES SECTION
          ===================================================

          This section introduces the three major functions
          of Bantay Samal:

          1. Interactive Crime Map
          2. Crime Statistics
          3. Area Insights
      =================================================== */}

      <Box
        component="section"
        sx={{
          py: {
            xs: 7,
            md: 10,
          },
        }}
      >
        <Container maxWidth="xl">
          {/* SECTION INTRODUCTION */}

          <Box
            sx={{
              maxWidth: 680,

              mx: "auto",

              mb: {
                xs: 4,
                md: 5,
              },

              textAlign: "center",

              ...fadeUp,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "secondary.dark",

                fontWeight: 900,

                letterSpacing: 1.6,
              }}
            >
              Explore the Data
            </Typography>

            <Typography
              variant="h3"
              sx={{
                mt: 0.7,

                fontSize: {
                  xs: "1.9rem",
                  md: "2.6rem",
                },

                color: "text.primary",

                fontWeight: 900,

                letterSpacing: "-0.025em",
              }}
            >
              Crime information made easier to understand
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1.5,

                lineHeight: 1.75,
              }}
            >
              Bantay Samal combines geographic visualization and crime
              statistics in one accessible dashboard.
            </Typography>
          </Box>

          {/* ===============================================
              FEATURE CARDS

              .map() means:

              "For every item inside features, create one
              visual feature card."
          =============================================== */}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                md: "repeat(3, 1fr)",
              },

              gap: 2.5,
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={feature.title}
                sx={{
                  p: {
                    xs: 2.5,
                    md: 3,
                  },

                  bgcolor: "background.paper",

                  border: "1px solid",

                  borderColor: "divider",

                  borderRadius: 4,

                  boxShadow: "0 5px 24px rgba(15,61,86,0.05)",

                  transition: "transform 0.2s ease, box-shadow 0.2s ease",

                  ...fadeUp,

                  ...animationDelay(100 + index * 100),

                  "&:hover": {
                    transform: "translateY(-4px)",

                    boxShadow: "0 12px 32px rgba(15,61,86,0.09)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,

                    height: 52,

                    mb: 2.2,

                    display: "grid",

                    placeItems: "center",

                    borderRadius: 2.5,

                    bgcolor: "rgba(20,184,166,0.11)",

                    color: "secondary.dark",
                  }}
                >
                  {feature.icon}
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,

                    color: "text.primary",
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,

                    lineHeight: 1.75,
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ===================================================
          GEOGRAPHIC COVERAGE
          ===================================================

          This section tells users the geographic and
          temporal scope of the study.

          WHERE?

          Samal, Bataan

          14 barangays


          WHEN?

          2024–2026

          3 reporting years


          CRIMINOLOGY IMPORTANCE

          Before interpreting crime statistics, researchers
          need to understand the geographic area and time
          period covered by the data.
      =================================================== */}

      <Box
        component="section"
        sx={{
          py: {
            xs: 7,
            md: 9,
          },

          bgcolor: "#EAF2F4",

          borderTop: "1px solid",

          borderBottom: "1px solid",

          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                md: "0.85fr 1.15fr",
              },

              gap: {
                xs: 5,
                md: 8,
              },

              alignItems: "center",
            }}
          >
            {/* COVERAGE DESCRIPTION */}

            <Box sx={{ ...fadeUp }}>
              <Box
                sx={{
                  width: 54,

                  height: 54,

                  mb: 2,

                  display: "grid",

                  placeItems: "center",

                  borderRadius: 2.5,

                  bgcolor: "primary.main",

                  color: "#FFFFFF",
                }}
              >
                <PublicOutlined />
              </Box>

              <Typography
                variant="overline"
                sx={{
                  color: "secondary.dark",

                  fontWeight: 900,

                  letterSpacing: 1.5,
                }}
              >
                Geographic Coverage
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  mt: 0.5,

                  fontSize: {
                    xs: "1.9rem",
                    md: "2.6rem",
                  },

                  fontWeight: 900,

                  color: "text.primary",
                }}
              >
                Samal, Bataan
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1.5,

                  maxWidth: 500,

                  lineHeight: 1.8,
                }}
              >
                The dashboard covers crime statistics across all 14 barangays of
                Samal for the reporting period from 2024 through 2026.
              </Typography>
            </Box>

            {/* =============================================
                COVERAGE CARDS

                These cards summarize:

                14 Barangays
                3 Reporting Years
                2024–2026 Coverage Period
            ============================================= */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",

                  sm: "repeat(3, 1fr)",
                },

                gap: 2,
              }}
            >
              {coverageItems.map((item, index) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 2.5,

                    minHeight: 150,

                    display: "flex",

                    flexDirection: "column",

                    justifyContent: "center",

                    bgcolor: "#FFFFFF",

                    border: "1px solid",

                    borderColor: "divider",

                    borderRadius: 3,

                    boxShadow: "0 4px 18px rgba(15,61,86,0.05)",

                    transition: "transform 0.2s ease, box-shadow 0.2s ease",

                    ...fadeUp,

                    ...animationDelay(100 + index * 100),

                    "&:hover": {
                      transform: "translateY(-3px)",

                      boxShadow: "0 10px 26px rgba(15,61,86,0.08)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "primary.main",

                      fontSize: {
                        xs: "1.8rem",
                        md: "2rem",
                      },

                      lineHeight: 1,

                      fontWeight: 900,
                    }}
                  >
                    {item.value}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,

                      fontWeight: 700,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ===================================================
          DATA TRANSPARENCY
          ===================================================

          THIS IS VERY IMPORTANT FOR YOUR RESEARCH.

          Bantay Samal distinguishes between:

          1. REPORTED DATA
          2. ESTIMATED ALLOCATION


          REPORTED DATA

          These are values directly represented by the
          available source dataset.

          Examples:

          - Barangay totals
          - Municipality yearly totals


          ESTIMATED ALLOCATION

          The source data does not directly provide every
          possible:

          YEAR × BARANGAY

          combination.

          Therefore, when Bantay Samal needs that combined
          view, the system identifies those values as
          ESTIMATED ALLOCATIONS.


          IMPORTANT CRIMINOLOGY PRINCIPLE

          Estimated values must not be represented as if
          they were directly reported observations.

          This is why the interface clearly distinguishes
          between reported and estimated information.
      =================================================== */}

      <Box
        component="section"
        sx={{
          py: {
            xs: 7,
            md: 10,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              p: {
                xs: 3,
                md: 5,
              },

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                md: "auto 1fr",
              },

              gap: {
                xs: 2.5,
                md: 3.5,
              },

              bgcolor: "background.paper",

              border: "1px solid",

              borderColor: "divider",

              borderRadius: 4,

              boxShadow: "0 6px 28px rgba(15,61,86,0.05)",

              ...fadeUp,
            }}
          >
            <Box
              sx={{
                width: 58,

                height: 58,

                display: "grid",

                placeItems: "center",

                borderRadius: 2.5,

                bgcolor: "rgba(20,184,166,0.11)",

                color: "secondary.dark",
              }}
            >
              <AssessmentOutlined />
            </Box>

            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "secondary.dark",

                  fontWeight: 900,

                  letterSpacing: 1.5,
                }}
              >
                Data Transparency
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 0.4,

                  fontSize: {
                    xs: "1.6rem",
                    md: "2rem",
                  },

                  color: "text.primary",

                  fontWeight: 900,
                }}
              >
                Reported and estimated values are clearly distinguished.
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1.5,

                  maxWidth: 850,

                  lineHeight: 1.8,
                }}
              >
                Barangay totals and municipality yearly totals are presented as
                reported values. Combined year-by-barangay values are identified
                separately as estimated allocations where the original dataset
                does not provide that cross-tabulation.
              </Typography>

              {/* ===========================================
                  DATA TYPE LEGEND
              =========================================== */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={{
                  xs: 1,
                  sm: 3,
                }}
                sx={{
                  mt: 2.5,
                }}
              >
                {/* REPORTED DATA */}

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 9,

                      height: 9,

                      borderRadius: "50%",

                      bgcolor: "#0F766E",
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Reported data
                  </Typography>
                </Stack>

                {/* ESTIMATED DATA */}

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 9,

                      height: 9,

                      borderRadius: "50%",

                      bgcolor: "#B45309",
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Estimated allocation
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ===================================================
          CALL TO ACTION / CTA
          ===================================================

          CTA means:

          CALL TO ACTION

          This section encourages the user to move from
          the introduction page to the actual interactive
          dashboard.

          Clicking "Open Dashboard" calls:

          onOpenDashboard()
      =================================================== */}

      <Box
        component="section"
        sx={{
          pb: {
            xs: 7,
            md: 10,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              position: "relative",

              overflow: "hidden",

              px: {
                xs: 3,
                md: 6,
              },

              py: {
                xs: 5,
                md: 6,
              },

              textAlign: "center",

              bgcolor: "primary.main",

              color: "#FFFFFF",

              borderRadius: 5,

              ...fadeUp,

              "&::after": {
                content: '""',

                position: "absolute",

                width: 300,

                height: 300,

                right: -120,

                bottom: -180,

                borderRadius: "50%",

                bgcolor: "rgba(20,184,166,0.14)",
              },
            }}
          >
            <SecurityOutlined
              sx={{
                position: "relative",

                zIndex: 1,

                mb: 1.5,

                fontSize: 38,

                color: "#5EEAD4",
              }}
            />

            <Typography
              variant="h3"
              sx={{
                position: "relative",

                zIndex: 1,

                fontSize: {
                  xs: "1.8rem",
                  md: "2.5rem",
                },

                fontWeight: 900,
              }}
            >
              Explore the crime statistics
            </Typography>

            <Typography
              sx={{
                position: "relative",

                zIndex: 1,

                maxWidth: 620,

                mx: "auto",

                mt: 1.5,

                color: "rgba(255,255,255,0.72)",

                lineHeight: 1.7,
              }}
            >
              Open the interactive dashboard to explore crime patterns by year,
              crime type, and barangay.
            </Typography>

            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardOutlined />}
              onClick={onOpenDashboard}
              sx={{
                position: "relative",

                zIndex: 1,

                mt: 3,

                px: 3.2,

                py: 1.25,

                bgcolor: "secondary.main",

                color: "#062D32",

                textTransform: "none",

                fontWeight: 900,

                boxShadow: "none",

                "& .MuiButton-endIcon": {
                  transition: "transform 180ms ease",
                },

                "&:hover": {
                  bgcolor: "#2DD4BF",

                  boxShadow: "none",

                  "& .MuiButton-endIcon": {
                    transform: "translateX(3px)",
                  },
                },
              }}
            >
              Open Dashboard
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ===================================================
          PROJECT RESEARCHERS
          ===================================================

          This section identifies the students responsible
          for the academic project.

          Researchers:

          John Christian R. Balungay
          Jerome M. Amlog

          Program:

          Bachelor of Science in Criminology

          Institution:

          Bataan Heroes College
      =================================================== */}

      <Box
        component="section"
        sx={{
          pb: {
            xs: 7,
            md: 10,
          },
        }}
      >
        <Container maxWidth="lg">
          {/* SECTION INTRODUCTION */}

          <Box
            sx={{
              maxWidth: 720,

              mx: "auto",

              mb: {
                xs: 4,
                md: 5,
              },

              textAlign: "center",

              ...fadeUp,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "secondary.dark",

                fontWeight: 900,

                letterSpacing: 1.6,
              }}
            >
              Project Researchers
            </Typography>

            <Typography
              variant="h3"
              sx={{
                mt: 0.7,

                fontSize: {
                  xs: "1.9rem",
                  md: "2.6rem",
                },

                color: "text.primary",

                fontWeight: 900,

                letterSpacing: "-0.025em",
              }}
            >
              Meet the Researchers
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1.5,

                maxWidth: 650,

                mx: "auto",

                lineHeight: 1.75,
              }}
            >
              Bantay Samal was developed as an academic project by Bachelor of
              Science in Criminology students of Bataan Heroes College.
            </Typography>
          </Box>

          {/* ===============================================
              RESEARCHER CARDS

              Desktop:
              Two researchers appear side-by-side.

              Mobile:
              They appear one above the other.
          =============================================== */}

          <Box
            sx={{
              maxWidth: 850,

              mx: "auto",

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                sm: "repeat(2, minmax(0, 1fr))",
              },

              gap: {
                xs: 2,
                md: 2.5,
              },
            }}
          >
            {/* =============================================
                RESEARCHER 1
                JOHN CHRISTIAN R. BALUNGAY
            ============================================= */}

            <Box
              sx={{
                p: {
                  xs: 3,
                  md: 3.5,
                },

                bgcolor: "background.paper",

                border: "1px solid",

                borderColor: "divider",

                borderRadius: 4,

                boxShadow: "0 5px 24px rgba(15,61,86,0.05)",

                textAlign: "center",

                transition: "transform 0.2s ease, box-shadow 0.2s ease",

                ...fadeUp,

                ...animationDelay(100),

                "&:hover": {
                  transform: "translateY(-4px)",

                  boxShadow: "0 12px 32px rgba(15,61,86,0.09)",
                },
              }}
            >
              {/* RESEARCHER INITIALS */}

              <Box
                sx={{
                  width: 58,

                  height: 58,

                  mx: "auto",

                  mb: 2,

                  display: "grid",

                  placeItems: "center",

                  borderRadius: "50%",

                  bgcolor: "rgba(20,184,166,0.11)",

                  color: "secondary.dark",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",

                    fontWeight: 900,

                    letterSpacing: 0.5,
                  }}
                >
                  JB
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: "text.primary",

                  fontWeight: 900,

                  lineHeight: 1.35,
                }}
              >
                John Christian R. Balungay
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.7,

                  color: "secondary.dark",

                  fontWeight: 800,
                }}
              >
                Researcher
              </Typography>

              <Box
                sx={{
                  width: 36,

                  height: 2,

                  mx: "auto",

                  my: 2,

                  borderRadius: 10,

                  bgcolor: "secondary.main",
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.65,

                  fontWeight: 600,
                }}
              >
                Bachelor of Science in Criminology
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",

                  mt: 0.7,

                  color: "text.secondary",

                  fontWeight: 700,
                }}
              >
                Bataan Heroes College
              </Typography>
            </Box>

            {/* =============================================
                RESEARCHER 2
                JEROME M. AMLOG
            ============================================= */}

            <Box
              sx={{
                p: {
                  xs: 3,
                  md: 3.5,
                },

                bgcolor: "background.paper",

                border: "1px solid",

                borderColor: "divider",

                borderRadius: 4,

                boxShadow: "0 5px 24px rgba(15,61,86,0.05)",

                textAlign: "center",

                transition: "transform 0.2s ease, box-shadow 0.2s ease",

                ...fadeUp,

                ...animationDelay(200),

                "&:hover": {
                  transform: "translateY(-4px)",

                  boxShadow: "0 12px 32px rgba(15,61,86,0.09)",
                },
              }}
            >
              <Box
                sx={{
                  width: 58,

                  height: 58,

                  mx: "auto",

                  mb: 2,

                  display: "grid",

                  placeItems: "center",

                  borderRadius: "50%",

                  bgcolor: "rgba(20,184,166,0.11)",

                  color: "secondary.dark",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",

                    fontWeight: 900,

                    letterSpacing: 0.5,
                  }}
                >
                  JA
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: "text.primary",

                  fontWeight: 900,

                  lineHeight: 1.35,
                }}
              >
                Jerome M. Amlog
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.7,

                  color: "secondary.dark",

                  fontWeight: 800,
                }}
              >
                Researcher
              </Typography>

              <Box
                sx={{
                  width: 36,

                  height: 2,

                  mx: "auto",

                  my: 2,

                  borderRadius: 10,

                  bgcolor: "secondary.main",
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineHeight: 1.65,

                  fontWeight: 600,
                }}
              >
                Bachelor of Science in Criminology
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",

                  mt: 0.7,

                  color: "text.secondary",

                  fontWeight: 700,
                }}
              >
                Bataan Heroes College
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ===================================================
          FOOTER
          ===================================================

          The footer appears at the bottom of the page.

          It repeats the important project identity:

          Bantay Samal
          Crime Mapping & Statistics

          and the scope:

          Samal, Bataan
          2024–2026
      =================================================== */}

      <Box
        component="footer"
        sx={{
          bgcolor: "#0A3044",

          color: "#FFFFFF",

          py: 3,
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },

              justifyContent: "space-between",
            }}
          >
            {/* FOOTER BRAND */}

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <ShieldOutlined
                sx={{
                  color: "#5EEAD4",
                }}
              />

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Bantay Samal
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.62)",
                  }}
                >
                  Crime Mapping & Statistics
                </Typography>
              </Box>
            </Stack>

            {/* FOOTER LOCATION / PERIOD */}

            <Stack
              direction="row"
              spacing={0.8}
              sx={{
                alignItems: "center",
              }}
            >
              <TimelineOutlined
                sx={{
                  fontSize: 17,

                  color: "#5EEAD4",
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.64)",
                }}
              >
                Samal, Bataan • 2024–2026
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

/* =========================================================
   COMPLETE SIMPLE EXPLANATION FOR CRIMINOLOGY STUDENTS
   =========================================================


   WHAT IS LANDINGPAGE.TSX?


   LandingPage.tsx creates the introductory page of the
   Bantay Samal system.


   When somebody visits the website, this page explains
   the project before they begin analyzing the crime data.


   =========================================================
   PART 1 - NAVIGATION
   =========================================================


   The navigation identifies the system as:


   BANTAY SAMAL

   Crime Mapping & Statistics


   It also provides a:


   VIEW DASHBOARD


   button.


   When the button is clicked:


   onOpenDashboard()


   is executed.


   The application can then display the main crime
   dashboard.


   =========================================================
   PART 2 - HERO
   =========================================================


   The Hero is the large introduction at the top.


   It tells users:


   LOCATION

   Samal, Bataan


   PURPOSE

   Public Safety Data


   MAIN MESSAGE

   Understand crime patterns across Samal.


   REPORTING PERIOD

   2024–2026


   GEOGRAPHIC COVERAGE

   14 Barangays


   =========================================================
   PART 3 - MAP PREVIEW
   =========================================================


   The map displayed on the Landing Page is NOT the actual
   crime map.


   It is only a visual representation of the mapping
   feature.


   The actual interactive map is handled separately by:


   SamalMap.tsx


   Therefore, the decorative polygon on this Landing Page
   should NOT be interpreted as an official barangay or
   municipal boundary.


   =========================================================
   PART 4 - FEATURES
   =========================================================


   Bantay Samal introduces three main functions:


   1. INTERACTIVE CRIME MAP


      Allows users to geographically examine crime
      information across Samal's barangays.


   2. CRIME STATISTICS


      Allows users to review totals, yearly patterns,
      crime categories, and barangay-level statistics.


   3. AREA INSIGHTS


      Allows users to compare geographic areas under
      selected filters.


   =========================================================
   PART 5 - GEOGRAPHIC COVERAGE
   =========================================================


   The system covers:


   LOCATION

   Samal, Bataan


   BARANGAYS

   14


   REPORTING YEARS

   3


   COVERAGE PERIOD

   2024–2026


   In criminological research, this defines the:


   GEOGRAPHIC SCOPE

   and

   TEMPORAL SCOPE


   of the project.


   =========================================================
   PART 6 - DATA TRANSPARENCY
   =========================================================


   This is one of the most important parts of the project.


   Bantay Samal distinguishes:


   REPORTED DATA


   from


   ESTIMATED ALLOCATION


   Reported information comes from values represented
   directly by the available dataset.


   Estimated allocations are used when a combined
   year-by-barangay cross-tabulation is not directly
   provided by the original dataset.


   Example:


   Suppose the dataset provides:


   Barangay Gugo total

   and

   Municipality 2025 total


   but does not directly provide:


   Gugo + 2025


   The system must NOT pretend that a calculated value
   for that combination was directly reported.


   Therefore it identifies that result as:


   ESTIMATED


   rather than:


   REPORTED


   This distinction is important for research integrity.


   =========================================================
   PART 7 - CALL TO ACTION
   =========================================================


   CTA means:


   CALL TO ACTION


   Its purpose is simple:


   LANDING PAGE

        ↓

   OPEN DASHBOARD

        ↓

   INTERACTIVE CRIME ANALYSIS


   =========================================================
   PART 8 - RESEARCHERS
   =========================================================


   The page identifies the project researchers as:


   JOHN CHRISTIAN R. BALUNGAY


   and


   JEROME M. AMLOG


   Program:


   Bachelor of Science in Criminology


   Institution:


   Bataan Heroes College


   =========================================================
   PART 9 - FOOTER
   =========================================================


   The footer repeats the basic project identity:


   Bantay Samal

   Crime Mapping & Statistics


   and the project scope:


   Samal, Bataan

   2024–2026


   =========================================================
   WHAT THIS COMPONENT DOES NOT DO
   =========================================================


   LandingPage does NOT:


   - calculate crime totals

   - calculate crime rates

   - calculate crime intensity

   - estimate year-by-barangay cases

   - generate map polygons

   - determine crime causes

   - predict future crime

   - classify barangays as safe or dangerous

   - show exact crime incident locations


   Those responsibilities belong to other parts of the
   application.


   =========================================================
   SIMPLE SYSTEM ARCHITECTURE
   =========================================================


                     BANTAY SAMAL
                          │
                          ▼
                    LANDING PAGE
                          │
                          │
                    Open Dashboard
                          │
                          ▼
                       APP.TSX
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
        FilterPanel    SamalMap   SummaryCards
             │            │            │
             └────────────┼────────────┘
                          ▼
                    CrimeAnalytics
                          │
                          ▼
                     AreaSummary


   =========================================================
   DEFENSE QUESTION:
   "WHAT IS THE PURPOSE OF THE LANDING PAGE?"
   =========================================================


   You can answer:


   "The Landing Page serves as the introductory interface
   of Bantay Samal. It explains the purpose of the system,
   its geographic and temporal coverage, its main features,
   its data transparency approach, and the project
   researchers before directing users to the interactive
   crime dashboard."


   =========================================================
   DEFENSE QUESTION:
   "DOES THE LANDING PAGE ANALYZE CRIME?"
   =========================================================


   You can answer:


   "No. The Landing Page primarily introduces the system.
   The actual crime analysis and geographic visualization
   are performed by the dashboard components."


   =========================================================
   DEFENSE QUESTION:
   "WHY DO YOU SHOW REPORTED AND ESTIMATED DATA?"
   =========================================================


   You can answer:


   "The system distinguishes reported data from estimated
   allocations to maintain data transparency. Some totals
   are directly represented by the available dataset,
   while certain combined year-by-barangay values require
   allocation because that cross-tabulation was not
   directly provided. These values are therefore clearly
   identified as estimated rather than reported."


   =========================================================
   DEFENSE QUESTION:
   "IS THE MAP ON THE LANDING PAGE THE ACTUAL CRIME MAP?"
   =========================================================


   You can answer:


   "No. The map graphic on the Landing Page is only a
   visual preview representing the mapping feature. The
   actual interactive geographic crime map is provided
   inside the dashboard."


   =========================================================
   DEFENSE QUESTION:
   "WHAT IS THE SCOPE OF BANTAY SAMAL?"
   =========================================================


   You can answer:


   "Bantay Samal covers the Municipality of Samal, Bataan,
   including the 14 barangays represented in the dataset,
   for the reporting period from 2024 to 2026."


   =========================================================
   FINAL SIMPLE EXPLANATION
   =========================================================


   In simple terms:


                  LANDING PAGE

                       ↓

               INTRODUCE PROJECT

                       ↓

                EXPLAIN SCOPE

                       ↓

              EXPLAIN FEATURES

                       ↓

             EXPLAIN DATA METHOD

                       ↓

             IDENTIFY RESEARCHERS

                       ↓

                OPEN DASHBOARD


   Therefore, LandingPage.tsx acts as the INTRODUCTION and
   ENTRY POINT to the Bantay Samal crime mapping system.
========================================================= */
