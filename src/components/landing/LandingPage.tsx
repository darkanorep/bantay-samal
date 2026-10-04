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

/* =========================================
   PROPS
========================================= */

type LandingPageProps = {
  onOpenDashboard: () => void;
};

/* =========================================
   FEATURE DATA
========================================= */

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

/* =========================================
   COVERAGE DATA
========================================= */

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

/* =========================================
   ANIMATIONS
========================================= */

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

  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
};

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

const animationDelay = (delay: number) => ({
  animationDelay: `${delay}ms`,

  "@media (prefers-reduced-motion: reduce)": {
    animationDelay: "0ms",
  },
});

/* =========================================
   LANDING PAGE
========================================= */

export default function LandingPage({ onOpenDashboard }: LandingPageProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* =====================================
          NAVIGATION
      ===================================== */}

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
            {/* BRAND */}

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

            {/* NAVIGATION BUTTON */}

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

      {/* =====================================
          HERO
      ===================================== */}

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

          /* TOP-RIGHT TEAL DECORATION */

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

          /* BOTTOM-LEFT DECORATION */

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
        {/* LARGE SAMAL MUNICIPAL SEAL */}

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

        {/* HERO CONTENT */}

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
            {/* LEFT HERO */}

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

            {/* =====================================
                RIGHT MAP VISUAL
            ===================================== */}

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
              {/* OUTER GLASS CARD */}

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

              {/* INNER WHITE CARD */}

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

                {/* ABSTRACT MAP */}

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
                  {/* ROAD 1 */}

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

                  {/* ROAD 2 */}

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

                  {/* ROAD 3 */}

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

                  {/* SAMAL ABSTRACT POLYGON */}

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

                  {/* MAP POINT */}

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

      {/* =====================================
          FEATURES
      ===================================== */}

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

          {/* FEATURE CARDS */}

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

      {/* =====================================
          COVERAGE
      ===================================== */}

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
            {/* DESCRIPTION */}

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

            {/* COVERAGE CARDS */}

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

      {/* =====================================
          DATA TRANSPARENCY
      ===================================== */}

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

      {/* =====================================
          CTA
      ===================================== */}

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

      {/* =====================================
          PROJECT RESEARCHERS
      ===================================== */}

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

          {/* RESEARCHER CARDS */}

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
            {/* JOHN CHRISTIAN R. BALUNGAY */}

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

            {/* JEROME M. AMLOG */}

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

      {/* =====================================
          FOOTER
      ===================================== */}

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
            {/* BRAND */}

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

            {/* PERIOD */}

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
