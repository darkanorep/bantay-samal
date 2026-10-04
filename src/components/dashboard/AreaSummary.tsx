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

/* =========================================
   TYPES
========================================= */

type AreaSummaryProps = {
  selectedYear: string;
  selectedCrimeId: string;
  selectedBarangayId: string;

  onBarangayChange: (barangayId: string) => void;
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
   COMPONENT
========================================= */

export default function AreaSummary({
  selectedYear,
  selectedCrimeId,
  selectedBarangayId,
  onBarangayChange,
}: AreaSummaryProps) {
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

  const activeColor =
    selectedCrimeId === "all"
      ? DEFAULT_CRIME_COLOR
      : getCrimeColor(selectedCrimeId);

  /* =========================================
     SELECTED BARANGAY
  ========================================= */

  const selectedBarangay = useMemo(() => {
    return (
      barangays.find((barangay) => barangay.id === selectedBarangayId) ?? null
    );
  }, [selectedBarangayId]);

  /* =========================================
     BARANGAY VALUES

     ALL YEARS:
     Reported barangay values.

     SPECIFIC YEAR:
     Estimated barangay allocations.
  ========================================= */

  const barangayValues = useMemo(() => {
    return barangays.map((barangay) => {
      let value = 0;

      /* ===============================
           ALL YEARS
      =============================== */

      if (selectedYear === "all") {
        /* ALL CRIMES */

        if (selectedCrimeId === "all") {
          value =
            crimesData.barangayTotals[
              barangay.id as keyof typeof crimesData.barangayTotals
            ] ?? 0;
        } else if (selectedCrime) {
          /* SPECIFIC CRIME */

          const crimeBarangays = selectedCrime.barangays as Record<
            string,
            number
          >;

          value = crimeBarangays[barangay.id] ?? 0;
        }
      } else {
        /* ===============================
             SPECIFIC YEAR
        =============================== */

        /* SPECIFIC CRIME */

        if (selectedCrimeId !== "all") {
          value =
            allocations[selectedCrimeId]?.[selectedYear]?.[barangay.id] ?? 0;
        } else {
          /* ALL CRIMES */

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

      return {
        ...barangay,
        value,
      };
    });
  }, [selectedYear, selectedCrimeId, selectedCrime]);

  /* =========================================
     RANKING
  ========================================= */

  const rankedBarangays = useMemo(() => {
    return [...barangayValues].sort((a, b) => {
      if (b.value !== a.value) {
        return b.value - a.value;
      }

      return a.name.localeCompare(b.name);
    });
  }, [barangayValues]);

  /* =========================================
     SELECTED VALUE
  ========================================= */

  const selectedValue = useMemo(() => {
    if (!selectedBarangay) {
      return null;
    }

    return (
      barangayValues.find((barangay) => barangay.id === selectedBarangay.id)
        ?.value ?? 0
    );
  }, [barangayValues, selectedBarangay]);

  /* =========================================
     SELECTED RANK
  ========================================= */

  const selectedRank = useMemo(() => {
    if (!selectedBarangay) {
      return null;
    }

    const index = rankedBarangays.findIndex(
      (barangay) => barangay.id === selectedBarangay.id,
    );

    if (index === -1) {
      return null;
    }

    return index + 1;
  }, [rankedBarangays, selectedBarangay]);

  /* =========================================
     HIGHEST BARANGAY
  ========================================= */

  const highestBarangay = rankedBarangays[0];

  /* =========================================
     MAX VALUE FOR PROGRESS BARS
  ========================================= */

  const maxBarangayValue = Math.max(highestBarangay?.value ?? 0, 1);

  /* =========================================
     MUNICIPALITY TOTAL

     Municipality totals remain reported
     because the source provides:

     - overall total
     - yearly totals
     - crime totals
     - crime × year totals
  ========================================= */

  const municipalityTotal = useMemo(() => {
    /* ALL CRIMES + ALL YEARS */

    if (selectedCrimeId === "all" && selectedYear === "all") {
      return crimesData.meta.totalReportedCases;
    }

    /* ALL CRIMES + YEAR */

    if (selectedCrimeId === "all" && selectedYear !== "all") {
      return (
        crimesData.yearlyTotals[
          selectedYear as keyof typeof crimesData.yearlyTotals
        ] ?? 0
      );
    }

    /* CRIME + ALL YEARS */

    if (selectedCrime && selectedYear === "all") {
      return selectedCrime.total;
    }

    /* CRIME + YEAR */

    if (selectedCrime && selectedYear !== "all") {
      return (
        selectedCrime.yearly[
          selectedYear as keyof typeof selectedCrime.yearly
        ] ?? 0
      );
    }

    return 0;
  }, [selectedYear, selectedCrimeId, selectedCrime]);

  /* =========================================
     DISPLAY LABELS
  ========================================= */

  const yearLabel = selectedYear === "all" ? "2024–2026" : selectedYear;

  const crimeLabel = selectedCrime?.name ?? "All Crimes";

  const isBarangayDataEstimated = selectedYear !== "all";

  /* =========================================
     HANDLE BARANGAY SELECTION
  ========================================= */

  const handleBarangaySelect = (barangayId: string) => {
    onBarangayChange(barangayId);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     RETURN
  ========================================= */

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
      {/* =================================
          HEADER
      ================================= */}

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

      <Divider
        sx={{
          my: {
            xs: 1.5,
            sm: 2,
          },
        }}
      />

      {/* =================================
          SUMMARY CARDS
      ================================= */}

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
        {/* MUNICIPALITY TOTAL */}

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

        {/* HIGHEST BARANGAY */}

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

        {/* SELECTED BARANGAY */}

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

        {/* RANK */}

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

      {/* =================================
          BARANGAY RANKING
      ================================= */}

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
            const isSelected = barangay.id === selectedBarangayId;

            const progress =
              barangay.value === 0
                ? 0
                : Math.max(4, (barangay.value / maxBarangayValue) * 100);

            return (
              <Box
                key={barangay.id}
                role="button"
                tabIndex={0}
                aria-label={`Select ${barangay.name}, ${barangay.value} ${
                  barangay.value === 1 ? "case" : "cases"
                }`}
                onClick={() => handleBarangaySelect(barangay.id)}
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

                  "&:hover": {
                    borderColor: activeColor,

                    bgcolor: `${activeColor}08`,

                    boxShadow: "0 3px 10px rgba(15,61,86,0.07)",
                  },

                  "&:focus-visible": {
                    outline: `2px solid ${activeColor}`,

                    outlineOffset: "2px",
                  },
                }}
              >
                {/* RANK */}

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

                {/* BARANGAY */}

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

                  {/* PROGRESS */}

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

                {/* VALUE */}

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

      {/* =================================
          METHODOLOGY NOTICE
      ================================= */}

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
