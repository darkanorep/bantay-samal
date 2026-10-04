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

/* =========================================
   TYPES
========================================= */

type CrimeAnalyticsProps = {
  selectedYear: string;
  selectedCrimeId: string;
  selectedBarangayId: string;
};

type BarangayCounts = Record<string, number>;

type YearAllocations = Record<string, BarangayCounts>;

type CrimeAllocations = Record<string, YearAllocations>;

const allocations = estimatedData.allocations as CrimeAllocations;

/* =========================================
   BARANGAYS
========================================= */

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

/* =========================================
   DATA STATUS CHIP
========================================= */

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

/* =========================================
   EMPTY STATE
========================================= */

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

/* =========================================
   COMPONENT
========================================= */

export default function CrimeAnalytics({
  selectedYear,
  selectedCrimeId,
  selectedBarangayId,
}: CrimeAnalyticsProps) {
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
     SELECTED BARANGAY
  ========================================= */

  const selectedBarangay = useMemo(() => {
    return (
      barangays.find((barangay) => barangay.id === selectedBarangayId) ?? null
    );
  }, [selectedBarangayId]);

  /* =========================================
     DISPLAY LABELS
  ========================================= */

  const yearLabel = selectedYear === "all" ? "2024–2026" : selectedYear;

  const crimeLabel = selectedCrime?.name ?? "All Crimes";

  const barangayLabel = selectedBarangay?.name ?? "All Barangays";

  /* =========================================
     YEARLY TREND
  ========================================= */

  const yearlyTrend = useMemo(() => {
    const years = ["2024", "2025", "2026"];

    return years.map((year) => {
      /* MUNICIPALITY */

      if (selectedBarangayId === "all") {
        if (selectedCrimeId === "all") {
          return Number(
            crimesData.yearlyTotals[
              year as keyof typeof crimesData.yearlyTotals
            ],
          );
        }

        if (selectedCrime) {
          return Number(
            selectedCrime.yearly[year as keyof typeof selectedCrime.yearly],
          );
        }

        return 0;
      }

      /* SPECIFIC CRIME + BARANGAY */

      if (selectedCrimeId !== "all") {
        return allocations[selectedCrimeId]?.[year]?.[selectedBarangayId] ?? 0;
      }

      /* ALL CRIMES + BARANGAY */

      return Object.values(allocations).reduce((total, crimeAllocation) => {
        return total + (crimeAllocation[year]?.[selectedBarangayId] ?? 0);
      }, 0);
    });
  }, [selectedBarangayId, selectedCrimeId, selectedCrime]);

  /* =========================================
     CRIME BREAKDOWN
  ========================================= */

  const crimeBreakdown = useMemo(() => {
    return crimesData.crimes.map((crime) => {
      let value = 0;

      /* ALL BARANGAYS */

      if (selectedBarangayId === "all") {
        if (selectedYear === "all") {
          value = crime.total;
        } else {
          value = crime.yearly[selectedYear as keyof typeof crime.yearly] ?? 0;
        }
      } else if (selectedYear === "all") {
        /* SPECIFIC BARANGAY + ALL YEARS */

        const crimeBarangays = crime.barangays as Record<string, number>;

        value = crimeBarangays[selectedBarangayId] ?? 0;
      } else {
        /* BARANGAY + YEAR */

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

  /* =========================================
     TOP CRIMES

     Remove zero-value crimes before
     displaying the chart.
  ========================================= */

  const topCrimes = useMemo(() => {
    return [...crimeBreakdown]
      .filter((crime) => crime.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [crimeBreakdown]);

  /* =========================================
     DATA STATUS
  ========================================= */

  const yearlyTrendEstimated = selectedBarangayId !== "all";

  const breakdownEstimated =
    selectedBarangayId !== "all" && selectedYear !== "all";

  /* =========================================
     EMPTY STATE CHECKS
  ========================================= */

  const yearlyTrendHasData = yearlyTrend.some((value) => value > 0);

  const crimeBreakdownHasData = topCrimes.some((crime) => crime.value > 0);

  /* =========================================
     CONTEXT
  ========================================= */

  const contextLabel = useMemo(() => {
    return [yearLabel, crimeLabel, barangayLabel].join(" • ");
  }, [yearLabel, crimeLabel, barangayLabel]);

  /* =========================================
     YEARLY TREND TEXT
  ========================================= */

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

  const yearlyTrendSubtitle = selectedBarangay
    ? `Estimated yearly cases in ${selectedBarangay.name} from 2024 to 2026`
    : selectedCrime
      ? `Reported ${selectedCrime.name.toLowerCase()} cases from 2024 to 2026`
      : "Reported crime cases from 2024 to 2026";

  /* =========================================
     CRIME BREAKDOWN TEXT
  ========================================= */

  const crimeBreakdownTitle = useMemo(() => {
    if (selectedBarangay) {
      return `Crime Breakdown — ${selectedBarangay.name}`;
    }

    if (selectedYear !== "all") {
      return `Crime Breakdown — ${selectedYear}`;
    }

    return "Crime Breakdown";
  }, [selectedBarangay, selectedYear]);

  const crimeBreakdownSubtitle = selectedBarangay
    ? selectedYear === "all"
      ? `Highest reported crime categories in ${selectedBarangay.name}`
      : `Highest estimated crime categories in ${selectedBarangay.name} for ${selectedYear}`
    : selectedYear === "all"
      ? "Highest reported crime categories across Samal"
      : `Highest reported crime categories across Samal in ${selectedYear}`;

  /* =========================================
     RETURN
  ========================================= */

  return (
    <Box
      sx={{
        minWidth: 0,
      }}
    >
      {/* =================================
          SECTION HEADER
      ================================= */}

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

      {/* =================================
          ANALYTICS CARDS
      ================================= */}

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
        {/* =================================
            YEARLY TREND
        ================================= */}

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

        {/* =================================
            CRIME BREAKDOWN
        ================================= */}

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
              {/* =================================
                  MOBILE CRIME RANKING
              ================================= */}

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
                  const color = getCrimeColor(crime.id);

                  const maxValue = topCrimes[0]?.value || 1;

                  const width = Math.max(5, (crime.value / maxValue) * 100);

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

              {/* =================================
                  TABLET / DESKTOP CHART
              ================================= */}

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
