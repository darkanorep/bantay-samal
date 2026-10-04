import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import {
  FilterAltOutlined,
  RestartAltOutlined,
} from "@mui/icons-material";

import crimesData from "../../data/crimes.json";
import { getCrimeColor } from "../../utils/crimeColors";

/* =========================================
   TYPES
========================================= */

type FilterPanelProps = {
  selectedYear: string;
  selectedCrimeId: string;
  selectedBarangayId: string;

  onYearChange: (year: string) => void;
  onCrimeChange: (crimeId: string) => void;
  onBarangayChange: (barangayId: string) => void;

  onReset: () => void;
};

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

export default function FilterPanel({
  selectedYear,
  selectedCrimeId,
  selectedBarangayId,
  onYearChange,
  onCrimeChange,
  onBarangayChange,
  onReset,
}: FilterPanelProps) {
  /* =========================================
     ACTIVE FILTER STATE
  ========================================= */

  const hasActiveFilters =
    selectedYear !== "all" ||
    selectedCrimeId !== "all" ||
    selectedBarangayId !== "all";

  /* =========================================
     SELECTED CRIME
  ========================================= */

  const selectedCrime =
    selectedCrimeId === "all"
      ? null
      : (crimesData.crimes.find(
          (crime) => crime.id === selectedCrimeId,
        ) ?? null);

  const activeCrimeColor =
    getCrimeColor(selectedCrimeId);

  /* =========================================
     SELECTED BARANGAY
  ========================================= */

  const selectedBarangay =
    selectedBarangayId === "all"
      ? null
      : (barangays.find(
          (barangay) =>
            barangay.id === selectedBarangayId,
        ) ?? null);

  /* =========================================
     ACTIVE FILTER COUNT
  ========================================= */

  const activeFilterCount = [
    selectedYear !== "all",
    selectedCrimeId !== "all",
    selectedBarangayId !== "all",
  ].filter(Boolean).length;

  return (
    <Paper
      elevation={0}
      sx={{
        height: {
          xs: "auto",
          lg: "100%",
        },

        p: {
          xs: 2,
          sm: 2.25,
          lg: 2.5,
        },

        border: "1px solid",
        borderColor: "divider",

        borderRadius: 3,

        bgcolor: "background.paper",

        boxShadow:
          "0 4px 20px rgba(15,61,86,0.04)",
      }}
    >
      <Stack
        spacing={{
          xs: 2,
          sm: 2.25,
          lg: 2.5,
        }}
      >
        {/* =================================
            HEADER
        ================================= */}

        <Stack
          direction="row"
          spacing={1.25}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              minWidth: 0,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,

                flexShrink: 0,

                borderRadius: 2,

                display: "grid",
                placeItems: "center",

                bgcolor:
                  "rgba(20,184,166,0.10)",

                color: "secondary.dark",
              }}
            >
              <FilterAltOutlined fontSize="small" />
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
                  lineHeight: 1.25,
                }}
              >
                Map Filters
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.15,
                }}
              >
                Refine the displayed data
              </Typography>
            </Box>
          </Stack>

          {/* ACTIVE FILTER COUNT */}

          {hasActiveFilters && (
            <Box
              sx={{
                minWidth: 27,
                height: 27,

                px: 0.8,

                display: "grid",
                placeItems: "center",

                flexShrink: 0,

                borderRadius: 99,

                bgcolor:
                  "rgba(15,61,86,0.08)",

                color: "primary.main",

                fontSize: "0.72rem",
                fontWeight: 900,
              }}
            >
              {activeFilterCount}
            </Box>
          )}
        </Stack>

        <Divider />

        {/* =================================
            FILTER CONTROLS
        ================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "1fr",
            },

            gap: {
              xs: 1.5,
              sm: 1.5,
              lg: 2,
            },
          }}
        >
          {/* =================================
              YEAR
          ================================= */}

          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel id="year-filter-label">
              Year
            </InputLabel>

            <Select
              labelId="year-filter-label"
              label="Year"
              value={selectedYear}
              onChange={(event) =>
                onYearChange(
                  event.target.value,
                )
              }
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      maxHeight: 320,
                    },
                  },
                },
              }}
              sx={{
                bgcolor:
                  selectedYear !== "all"
                    ? "rgba(15,61,86,0.035)"
                    : "transparent",

                "& .MuiSelect-select": {
                  fontWeight:
                    selectedYear !== "all"
                      ? 700
                      : 500,
                },
              }}
            >
              <MenuItem value="all">
                2024–2026
              </MenuItem>

              <MenuItem value="2024">
                2024
              </MenuItem>

              <MenuItem value="2025">
                2025
              </MenuItem>

              <MenuItem value="2026">
                2026
              </MenuItem>
            </Select>
          </FormControl>

          {/* =================================
              BARANGAY
          ================================= */}

          <FormControl
            fullWidth
            size="small"
          >
            <InputLabel id="barangay-filter-label">
              Barangay
            </InputLabel>

            <Select
              labelId="barangay-filter-label"
              label="Barangay"
              value={selectedBarangayId}
              onChange={(event) =>
                onBarangayChange(
                  event.target.value,
                )
              }
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      maxHeight: 360,
                    },
                  },
                },
              }}
              sx={{
                bgcolor:
                  selectedBarangayId !==
                  "all"
                    ? "rgba(15,61,86,0.035)"
                    : "transparent",

                "& .MuiSelect-select": {
                  fontWeight:
                    selectedBarangayId !==
                    "all"
                      ? 700
                      : 500,
                },
              }}
            >
              <MenuItem value="all">
                All Barangays
              </MenuItem>

              {barangays.map(
                (barangay) => (
                  <MenuItem
                    key={barangay.id}
                    value={barangay.id}
                  >
                    {barangay.name}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>

          {/* =================================
              CRIME
          ================================= */}

          <FormControl
            fullWidth
            size="small"
            sx={{
              gridColumn: {
                xs: "auto",
                sm: "1 / -1",
                lg: "auto",
              },
            }}
          >
            <InputLabel id="crime-filter-label">
              Crime
            </InputLabel>

            <Select
              labelId="crime-filter-label"
              label="Crime"
              value={selectedCrimeId}
              onChange={(event) =>
                onCrimeChange(
                  event.target.value,
                )
              }
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      maxHeight: 390,

                      maxWidth: {
                        xs:
                          "calc(100vw - 32px)",
                        sm: 520,
                      },
                    },
                  },
                },
              }}
              sx={{
                bgcolor:
                  selectedCrimeId !==
                  "all"
                    ? `${activeCrimeColor}08`
                    : "transparent",

                "& .MuiSelect-select": {
                  minWidth: 0,

                  overflow: "hidden",

                  textOverflow:
                    "ellipsis",

                  whiteSpace: "nowrap",

                  fontWeight:
                    selectedCrimeId !==
                    "all"
                      ? 700
                      : 500,
                },
              }}
            >
              <MenuItem value="all">
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

                      flexShrink: 0,

                      borderRadius: "50%",

                      bgcolor: "#0F766E",
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    All Crimes
                  </Typography>
                </Stack>
              </MenuItem>

              {crimesData.crimes.map(
                (crime) => {
                  const crimeColor =
                    getCrimeColor(
                      crime.id,
                    );

                  return (
                    <MenuItem
                      key={crime.id}
                      value={crime.id}
                      sx={{
                        py: 1,

                        whiteSpace:
                          "normal",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          width: "100%",

                          minWidth: 0,

                          alignItems:
                            "flex-start",
                        }}
                      >
                        {/* CRIME COLOR */}

                        <Box
                          sx={{
                            width: 9,
                            height: 9,

                            mt: "5px",

                            flexShrink: 0,

                            borderRadius:
                              "50%",

                            bgcolor:
                              crimeColor,
                          }}
                        />

                        {/* CRIME NAME */}

                        <Typography
                          variant="body2"
                          sx={{
                            minWidth: 0,

                            lineHeight: 1.4,

                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {crime.name}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  );
                },
              )}
            </Select>
          </FormControl>
        </Box>

        {/* =================================
            ACTIVE FILTER SUMMARY
        ================================= */}

        {hasActiveFilters && (
          <Box
            sx={{
              p: 1.4,

              borderRadius: 2,

              bgcolor:
                "rgba(15,61,86,0.035)",

              border:
                "1px solid rgba(15,61,86,0.08)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",

                mb: 0.8,

                fontSize: "0.67rem",

                fontWeight: 800,

                color: "primary.main",

                letterSpacing: 0.4,
              }}
            >
              ACTIVE FILTERS
            </Typography>

            <Stack spacing={0.55}>
              {/* YEAR */}

              {selectedYear !== "all" && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent:
                      "space-between",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Year
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,

                      color:
                        "text.primary",
                    }}
                  >
                    {selectedYear}
                  </Typography>
                </Stack>
              )}

              {/* BARANGAY */}

              {selectedBarangay && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent:
                      "space-between",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Barangay
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,

                      color:
                        "text.primary",

                      textAlign: "right",
                    }}
                  >
                    {
                      selectedBarangay.name
                    }
                  </Typography>
                </Stack>
              )}

              {/* CRIME */}

              {selectedCrime && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent:
                      "space-between",

                    alignItems:
                      "flex-start",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      flexShrink: 0,
                    }}
                  >
                    Crime
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={0.6}
                    sx={{
                      minWidth: 0,

                      alignItems:
                        "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        width: 7,
                        height: 7,

                        mt: "4px",

                        flexShrink: 0,

                        borderRadius:
                          "50%",

                        bgcolor:
                          activeCrimeColor,
                      }}
                    />

                    <Typography
                      variant="caption"
                      sx={{
                        minWidth: 0,

                        fontWeight: 800,

                        color:
                          activeCrimeColor,

                        textAlign: "right",

                        lineHeight: 1.35,

                        overflowWrap:
                          "anywhere",
                      }}
                    >
                      {selectedCrime.name}
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Box>
        )}

        {/* =================================
            RESET
        ================================= */}

        <Button
          variant={
            hasActiveFilters
              ? "outlined"
              : "text"
          }
          startIcon={
            <RestartAltOutlined />
          }
          fullWidth
          disabled={!hasActiveFilters}
          onClick={onReset}
          sx={{
            minHeight: 40,

            textTransform: "none",

            fontWeight: 800,

            borderRadius: 2,

            "&.Mui-disabled": {
              color: "text.disabled",

              borderColor: "divider",
            },
          }}
        >
          Reset Filters
        </Button>

        <Divider />

        {/* =================================
            DATA NOTICE
        ================================= */}

        <Box
          sx={{
            p: {
              xs: 1.25,
              sm: 1.5,
            },

            borderRadius: 2,

            bgcolor: "#F4F8FA",

            border: "1px solid",

            borderColor: "divider",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",

              fontWeight: 800,

              color: "primary.main",
            }}
          >
            Data Notice
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",

              mt: 0.5,

              fontSize: {
                xs: "0.7rem",
                sm: "0.75rem",
              },

              lineHeight: 1.55,
            }}
          >
            Barangay totals and municipality
            yearly totals are reported values.
            Combined year-by-barangay values
            are identified separately as
            estimated allocations.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}