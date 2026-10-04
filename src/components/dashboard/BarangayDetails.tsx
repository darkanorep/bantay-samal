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

/* =========================================
   TYPES
========================================= */

type BarangayDetailsProps = {
  open: boolean;
  barangayId: string;
  selectedYear: string;
  selectedCrimeId: string;
  onClose: () => void;
};

type BarangayCounts = Record<string, number>;

type YearAllocations = Record<string, BarangayCounts>;

type CrimeAllocations = Record<string, YearAllocations>;

/* =========================================
   ESTIMATED ALLOCATIONS
========================================= */

const allocations = estimatedData.allocations as CrimeAllocations;

/* =========================================
   BARANGAY NAMES
========================================= */

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

/* =========================================
   COMPONENT
========================================= */

export default function BarangayDetails({
  open,
  barangayId,
  selectedYear,
  selectedCrimeId,
  onClose,
}: BarangayDetailsProps) {
  /* =========================================
     VALID BARANGAY
  ========================================= */

  if (barangayId === "all" || !barangayNames[barangayId]) {
    return null;
  }

  const barangayName = barangayNames[barangayId];

  /* =========================================
     SELECTED CRIME
  ========================================= */

  const selectedCrime =
    selectedCrimeId === "all"
      ? null
      : (crimesData.crimes.find((crime) => crime.id === selectedCrimeId) ??
        null);

  const selectedCrimeName = selectedCrime?.name ?? "All Crimes";

  const selectedYearLabel = selectedYear === "all" ? "2024–2026" : selectedYear;

  /* =========================================
     ACTIVE COLOR
  ========================================= */

  const activeColor =
    selectedCrimeId === "all"
      ? DEFAULT_CRIME_COLOR
      : getCrimeColor(selectedCrimeId);

  /* =========================================
     REPORTED BARANGAY TOTAL
  ========================================= */

  const totalCases =
    crimesData.barangayTotals[
      barangayId as keyof typeof crimesData.barangayTotals
    ] ?? 0;

  /* =========================================
     CURRENT FILTER VALUE

     ALL YEARS + ALL CRIMES
     → Reported barangay total

     ALL YEARS + SPECIFIC CRIME
     → Reported crime × barangay

     SPECIFIC YEAR + ALL CRIMES
     → Estimated year × barangay

     SPECIFIC YEAR + SPECIFIC CRIME
     → Estimated crime × year × barangay
  ========================================= */

  let currentFilterValue = 0;

  let currentFilterEstimated = false;

  if (selectedYear === "all") {
    if (selectedCrimeId === "all") {
      currentFilterValue = totalCases;
    } else if (selectedCrime) {
      const barangays = selectedCrime.barangays as Record<string, number>;

      currentFilterValue = barangays[barangayId] ?? 0;
    }
  } else {
    currentFilterEstimated = true;

    if (selectedCrimeId !== "all") {
      currentFilterValue =
        allocations[selectedCrimeId]?.[selectedYear]?.[barangayId] ?? 0;
    } else {
      currentFilterValue = Object.values(allocations).reduce(
        (total, crimeAllocation) => {
          const value = crimeAllocation[selectedYear]?.[barangayId] ?? 0;

          return total + value;
        },
        0,
      );
    }
  }

  /* =========================================
     CRIME DISTRIBUTION

     Uses directly reported
     2024–2026 crime × barangay totals.
  ========================================= */

  const crimeDistribution = crimesData.crimes
    .map((crime) => {
      const barangays = crime.barangays as Record<string, number>;

      return {
        id: crime.id,
        name: crime.name,
        legalBasis: crime.legalBasis,
        value: barangays[barangayId] ?? 0,
        color: getCrimeColor(crime.id),
      };
    })
    .filter((crime) => crime.value > 0)
    .sort((a, b) => b.value - a.value);

  /* =========================================
     HIGHEST RECORDED CRIME
  ========================================= */

  const highestCrime = crimeDistribution[0];

  const maxCrimeValue = highestCrime?.value ?? 1;

  const highestCrimeColor = highestCrime
    ? getCrimeColor(highestCrime.id)
    : DEFAULT_CRIME_COLOR;

  /* =========================================
     UI
  ========================================= */

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
      {/* =================================
          HEADER
      ================================= */}

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

      {/* =================================
          CONTENT
      ================================= */}

      <DialogContent>
        <Stack spacing={3}>
          {/* =================================
              CURRENT FILTER
          ================================= */}

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
              {/* FILTER LABELS */}

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

              {/* CURRENT VALUE */}

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

              {/* DATA STATUS */}

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

          {/* =================================
              REPORTED PROFILE
          ================================= */}

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

          {/* =================================
              PROFILE SUMMARY
          ================================= */}

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
            {/* TOTAL CASES */}

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

            {/* RECORDED CRIME TYPES */}

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

          {/* =================================
              HIGHEST RECORDED CRIME
          ================================= */}

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
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {highestCrime.name}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {highestCrime.legalBasis}
                  </Typography>
                </Box>

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

          {/* =================================
              CRIME DISTRIBUTION
          ================================= */}

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
                const percentage =
                  maxCrimeValue > 0 ? (crime.value / maxCrimeValue) * 100 : 0;

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
                        {/* RANK */}

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

                        {/* CRIME */}

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
                            <Box
                              sx={{
                                width: 8,

                                height: 8,

                                flexShrink: 0,

                                borderRadius: "50%",

                                bgcolor: crime.color,
                              }}
                            />

                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isSelected ? 800 : 700,
                              }}
                            >
                              {crime.name}
                            </Typography>
                          </Stack>

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

              {crimeDistribution.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No reported cases are available for this barangay.
                </Typography>
              )}
            </Stack>
          </Box>

          {/* =================================
              DATA EXPLANATION
          ================================= */}

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
              {/* REPORTED */}

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

              {/* ESTIMATED */}

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

      {/* =================================
          ACTIONS
      ================================= */}

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
