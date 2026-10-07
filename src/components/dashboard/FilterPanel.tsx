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

import { FilterAltOutlined, RestartAltOutlined } from "@mui/icons-material";

import crimesData from "../../data/crimes.json";
import { getCrimeColor } from "../../utils/crimeColors";

/* =========================================================
   BANTAY SAMAL - FILTER PANEL
   =========================================================

   PURPOSE

   FilterPanel allows the user to control what information
   is displayed on the Bantay Samal dashboard.

   The user can filter the crime data using:

   1. YEAR
   2. BARANGAY
   3. CRIME


   SIMPLE EXAMPLE

   The user selects:

   Year:
   2025

   Barangay:
   Gugo

   Crime:
   Malicious Mischief


                 ↓


   FilterPanel sends these selections to App.tsx


                 ↓


   App.tsx updates the other dashboard components


                 ↓


   The map, statistics, charts, and summaries respond to
   the selected filters.


   IMPORTANT

   FilterPanel does NOT calculate the number of crimes.

   It only controls which data the other components should
   display.

   Think of this component as the dashboard's
   "data selection control."
========================================================= */

/* =========================================================
   COMPONENT INPUTS / PROPS
   =========================================================

   FilterPanel receives the current filter selections
   from its parent component.

   selectedYear

   Example:
   "all"
   "2024"
   "2025"
   "2026"


   selectedCrimeId

   Example:
   "all"
   "malicious-mischief"
   "robbery"


   selectedBarangayId

   Example:
   "all"
   "gugo"
   "san-roque"


   It also receives functions that tell the main
   application when the user changes a filter.
========================================================= */

type FilterPanelProps = {
  selectedYear: string;

  selectedCrimeId: string;

  selectedBarangayId: string;

  onYearChange: (year: string) => void;

  onCrimeChange: (crimeId: string) => void;

  onBarangayChange: (barangayId: string) => void;

  onReset: () => void;
};

/* =========================================================
   BARANGAY LIST
   =========================================================

   These are the 14 barangays included in Bantay Samal.

   Each barangay has:

   id
   → Used internally by the program.

   name
   → Displayed to the user.


   EXAMPLE

   id:
   "east-calaguiman"

   name:
   "East Calaguiman"


   The ID is useful because computer data should use
   consistent identifiers.

   The name is useful because users need readable labels.
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
   MAIN FILTER PANEL COMPONENT
========================================================= */

export default function FilterPanel({
  selectedYear,

  selectedCrimeId,

  selectedBarangayId,

  onYearChange,

  onCrimeChange,

  onBarangayChange,

  onReset,
}: FilterPanelProps) {
  /* =======================================================
     CHECK IF A FILTER IS ACTIVE
     =======================================================

     "all" means that the filter is NOT restricting the
     dataset.

     Example:

     selectedYear = "all"

     means:

     Show the complete 2024–2026 reporting period.


     But:

     selectedYear = "2025"

     means:

     Only show information related to 2025.


     Therefore:

     hasActiveFilters = true

     if Year, Crime, or Barangay is not "all".
  ======================================================= */

  const hasActiveFilters =
    selectedYear !== "all" ||
    selectedCrimeId !== "all" ||
    selectedBarangayId !== "all";

  /* =======================================================
     FIND THE SELECTED CRIME
     =======================================================

     crimes.json contains all crime records.

     If the user selects a specific crime, this searches
     crimes.json for the matching crime.


     EXAMPLE

     selectedCrimeId:

     "malicious-mischief"


              ↓


     Search crimes.json


              ↓


     Find:

     {
       id: "malicious-mischief",
       name: "Malicious Mischief",
       ...
     }


     If "All Crimes" is selected, there is no single crime
     record to display, so selectedCrime becomes null.
  ======================================================= */

  const selectedCrime =
    selectedCrimeId === "all"
      ? null
      : (crimesData.crimes.find((crime) => crime.id === selectedCrimeId) ??
        null);

  /* =======================================================
     SELECTED CRIME COLOR
     =======================================================

     Every crime has a visual color assigned in:

     crimeColors.ts


     Example:

     Malicious Mischief
             ↓
     Orange


     Robbery
             ↓
     Red


     The color helps users visually identify which crime
     is currently selected.


     IMPORTANT

     Crime color does NOT represent:

     - Crime severity
     - Legal seriousness
     - Danger
     - Risk

     It is only a visual identifier.
  ======================================================= */

  const activeCrimeColor = getCrimeColor(selectedCrimeId);

  /* =======================================================
     FIND THE SELECTED BARANGAY
     =======================================================

     The filter stores the barangay ID.

     Example:

     "gugo"


     This searches the barangay list and finds:

     {
       id: "gugo",
       name: "Gugo"
     }


     This allows the dashboard to display the readable
     barangay name instead of only the internal ID.
  ======================================================= */

  const selectedBarangay =
    selectedBarangayId === "all"
      ? null
      : (barangays.find((barangay) => barangay.id === selectedBarangayId) ??
        null);

  /* =======================================================
     COUNT ACTIVE FILTERS
     =======================================================

     This tells the user how many filters are currently
     active.


     EXAMPLE 1

     Year:
     All

     Barangay:
     All

     Crime:
     All

     Active filters = 0


     EXAMPLE 2

     Year:
     2025

     Barangay:
     All

     Crime:
     Malicious Mischief

     Active filters = 2


     EXAMPLE 3

     Year:
     2025

     Barangay:
     Gugo

     Crime:
     Malicious Mischief

     Active filters = 3
  ======================================================= */

  const activeFilterCount = [
    selectedYear !== "all",

    selectedCrimeId !== "all",

    selectedBarangayId !== "all",
  ].filter(Boolean).length;

  /* =======================================================
     USER INTERFACE
  ======================================================= */

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

        boxShadow: "0 4px 20px rgba(15,61,86,0.04)",
      }}
    >
      <Stack
        spacing={{
          xs: 2,

          sm: 2.25,

          lg: 2.5,
        }}
      >
        {/* =================================================
            FILTER PANEL HEADER
            =================================================

            Displays:

            - Filter icon
            - "Map Filters"
            - Short explanation
            - Number of active filters
        ================================================= */}

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

                bgcolor: "rgba(20,184,166,0.10)",

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

          {/* =============================================
              ACTIVE FILTER COUNT

              This small number only appears when at least
              one filter is active.

              Example:

              2

              means two filters are currently restricting
              the dashboard.
          ============================================= */}

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

                bgcolor: "rgba(15,61,86,0.08)",

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

        {/* =================================================
            FILTER CONTROLS
            =================================================

            Contains three filters:

            YEAR
            BARANGAY
            CRIME


            The layout changes depending on screen size.

            Mobile:
            One column

            Tablet:
            Two columns

            Desktop sidebar:
            One column
        ================================================= */}

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
          {/* =================================================
              YEAR FILTER
              =================================================

              Options:

              2024–2026
              2024
              2025
              2026


              "2024–2026" uses the value "all".

              This means the complete reporting period.
          ================================================= */}

          <FormControl fullWidth size="small">
            <InputLabel id="year-filter-label">Year</InputLabel>

            <Select
              labelId="year-filter-label"
              label="Year"
              value={selectedYear}
              /* ===========================================
                 WHEN YEAR CHANGES

                 Send the selected year back to App.tsx.

                 Example:

                 User selects 2025

                        ↓

                 onYearChange("2025")
              =========================================== */

              onChange={(event) => onYearChange(event.target.value)}
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
                  fontWeight: selectedYear !== "all" ? 700 : 500,
                },
              }}
            >
              <MenuItem value="all">2024–2026</MenuItem>

              <MenuItem value="2024">2024</MenuItem>

              <MenuItem value="2025">2025</MenuItem>

              <MenuItem value="2026">2026</MenuItem>
            </Select>
          </FormControl>

          {/* =================================================
              BARANGAY FILTER
              =================================================

              The user can select:

              All Barangays

              or

              one of the 14 barangays of Samal.


              Selecting a barangay does NOT change the
              source data.

              It tells the dashboard to focus its display
              on that barangay.
          ================================================= */}

          <FormControl fullWidth size="small">
            <InputLabel id="barangay-filter-label">Barangay</InputLabel>

            <Select
              labelId="barangay-filter-label"
              label="Barangay"
              value={selectedBarangayId}
              /* ===========================================
                 WHEN BARANGAY CHANGES

                 Example:

                 User selects Gugo

                       ↓

                 onBarangayChange("gugo")
              =========================================== */

              onChange={(event) => onBarangayChange(event.target.value)}
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
                  selectedBarangayId !== "all"
                    ? "rgba(15,61,86,0.035)"
                    : "transparent",

                "& .MuiSelect-select": {
                  fontWeight: selectedBarangayId !== "all" ? 700 : 500,
                },
              }}
            >
              <MenuItem value="all">All Barangays</MenuItem>

              {/* =========================================
                  CREATE THE 14 BARANGAY OPTIONS

                  Instead of manually writing 14 separate
                  MenuItem components, .map() creates one
                  option for every barangay.
              ========================================= */}

              {barangays.map((barangay) => (
                <MenuItem key={barangay.id} value={barangay.id}>
                  {barangay.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* =================================================
              CRIME FILTER
              =================================================

              The user can select:

              All Crimes

              or

              one specific crime from crimes.json.


              Unlike the barangay list, crime options are
              read directly from crimes.json.

              This means the filter automatically uses the
              crime records already stored in the dataset.
          ================================================= */}

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
            <InputLabel id="crime-filter-label">Crime</InputLabel>

            <Select
              labelId="crime-filter-label"
              label="Crime"
              value={selectedCrimeId}
              /* ===========================================
                 WHEN CRIME CHANGES

                 Example:

                 User selects:

                 Malicious Mischief

                       ↓

                 onCrimeChange(
                   "malicious-mischief"
                 )
              =========================================== */

              onChange={(event) => onCrimeChange(event.target.value)}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      maxHeight: 390,

                      maxWidth: {
                        xs: "calc(100vw - 32px)",

                        sm: 520,
                      },
                    },
                  },
                },
              }}
              sx={{
                /* =======================================
                   Give the field a very light version of
                   the selected crime color.
                ======================================= */

                bgcolor:
                  selectedCrimeId !== "all"
                    ? `${activeCrimeColor}08`
                    : "transparent",

                "& .MuiSelect-select": {
                  minWidth: 0,

                  overflow: "hidden",

                  textOverflow: "ellipsis",

                  whiteSpace: "nowrap",

                  fontWeight: selectedCrimeId !== "all" ? 700 : 500,
                },
              }}
            >
              {/* =========================================
                  ALL CRIMES OPTION

                  Selecting this removes the specific
                  crime restriction.
              ========================================= */}

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

              {/* =========================================
                  CREATE CRIME OPTIONS FROM crimes.json

                  For every crime:

                  1. Read crime ID
                  2. Get crime color
                  3. Create menu option
                  4. Show colored dot
                  5. Show crime name
              ========================================= */}

              {crimesData.crimes.map((crime) => {
                const crimeColor = getCrimeColor(crime.id);

                return (
                  <MenuItem
                    key={crime.id}
                    value={crime.id}
                    sx={{
                      py: 1,

                      whiteSpace: "normal",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        width: "100%",

                        minWidth: 0,

                        alignItems: "flex-start",
                      }}
                    >
                      {/* ===============================
                            CRIME COLOR INDICATOR

                            This colored circle helps users
                            connect the selected crime with
                            its map color.

                            It does NOT represent severity.
                        =============================== */}

                      <Box
                        sx={{
                          width: 9,

                          height: 9,

                          mt: "5px",

                          flexShrink: 0,

                          borderRadius: "50%",

                          bgcolor: crimeColor,
                        }}
                      />

                      {/* ===============================
                            CRIME NAME
                        =============================== */}

                      <Typography
                        variant="body2"
                        sx={{
                          minWidth: 0,

                          lineHeight: 1.4,

                          overflowWrap: "anywhere",
                        }}
                      >
                        {crime.name}
                      </Typography>
                    </Stack>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>

        {/* =================================================
            ACTIVE FILTER SUMMARY
            =================================================

            This section appears only when at least one
            filter is active.

            It helps the user understand exactly what the
            dashboard is currently displaying.


            EXAMPLE

            ACTIVE FILTERS

            Year       2025
            Barangay   Gugo
            Crime      Malicious Mischief
        ================================================= */}

        {hasActiveFilters && (
          <Box
            sx={{
              p: 1.4,

              borderRadius: 2,

              bgcolor: "rgba(15,61,86,0.035)",

              border: "1px solid rgba(15,61,86,0.08)",
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
              {/* =========================================
                  ACTIVE YEAR

                  Only shown if a specific year is
                  selected.
              ========================================= */}

              {selectedYear !== "all" && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Year
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,

                      color: "text.primary",
                    }}
                  >
                    {selectedYear}
                  </Typography>
                </Stack>
              )}

              {/* =========================================
                  ACTIVE BARANGAY

                  Only shown when the user selects a
                  specific barangay.
              ========================================= */}

              {selectedBarangay && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Barangay
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,

                      color: "text.primary",

                      textAlign: "right",
                    }}
                  >
                    {selectedBarangay.name}
                  </Typography>
                </Stack>
              )}

              {/* =========================================
                  ACTIVE CRIME

                  Only shown when one specific crime is
                  selected.
              ========================================= */}

              {selectedCrime && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent: "space-between",

                    alignItems: "flex-start",
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

                      alignItems: "flex-start",
                    }}
                  >
                    {/* Selected crime color */}

                    <Box
                      sx={{
                        width: 7,

                        height: 7,

                        mt: "4px",

                        flexShrink: 0,

                        borderRadius: "50%",

                        bgcolor: activeCrimeColor,
                      }}
                    />

                    <Typography
                      variant="caption"
                      sx={{
                        minWidth: 0,

                        fontWeight: 800,

                        color: activeCrimeColor,

                        textAlign: "right",

                        lineHeight: 1.35,

                        overflowWrap: "anywhere",
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

        {/* =================================================
            RESET FILTERS
            =================================================

            This button returns the filters to their
            default state.

            DEFAULT STATE:

            Year:
            2024–2026

            Barangay:
            All Barangays

            Crime:
            All Crimes


            If no filters are active, the button is
            disabled because there is nothing to reset.
        ================================================= */}

        <Button
          variant={hasActiveFilters ? "outlined" : "text"}
          startIcon={<RestartAltOutlined />}
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

        {/* =================================================
            DATA NOTICE
            =================================================

            This is an important research transparency
            reminder.

            It explains that some filter combinations use
            reported data while more detailed combinations
            may require estimated allocations.

            This helps prevent users from assuming that
            every displayed number came directly from an
            individual incident record.
        ================================================= */}

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
            Barangay totals and municipality yearly totals are reported values.
            Combined year-by-barangay values are identified separately as
            estimated allocations.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

/* =========================================================
   SIMPLE EXPLANATION FOR CRIMINOLOGY STUDENTS
   =========================================================


   WHAT DOES FILTERPANEL DO?


   FilterPanel lets the user decide what crime information
   they want to examine.


   The three main questions are:


   1. WHEN?

      Year


   2. WHERE?

      Barangay


   3. WHAT CRIME?

      Crime


   Therefore:


   YEAR
      ↓
   WHEN?


   BARANGAY
      ↓
   WHERE?


   CRIME
      ↓
   WHAT?


   =========================================================
   EXAMPLE
   =========================================================


   Suppose a criminology student wants to examine:


   Malicious Mischief

   in

   Gugo

   during

   2025


   The student selects:


   YEAR

   2025


   BARANGAY

   Gugo


   CRIME

   Malicious Mischief


              ↓


   FilterPanel sends the selections to the main dashboard.


              ↓


   Other components respond to those filters.


              ↓


   The dashboard displays the appropriate information.


   =========================================================
   IMPORTANT: FILTERING DOES NOT CREATE NEW DATA
   =========================================================


   FilterPanel does not calculate crime statistics.


   It does not decide how many cases exist.


   It simply tells the other components:


   "Show me this part of the dataset."


   =========================================================
   YEAR FILTER
   =========================================================


   The available options are:


   2024–2026

   2024

   2025

   2026


   If the user selects:


   2024–2026


   the internal value is:


   "all"


   This means the user wants to examine the complete
   reporting period.


   =========================================================
   BARANGAY FILTER
   =========================================================


   The user can select:


   All Barangays


   or one of the 14 barangays:


   East Calaguiman

   East Daang Bago

   Gugo

   Ibaba

   Imelda

   Lalawigan

   Palili

   San Juan

   Santa Lucia

   Sapa

   Tabing Ilog

   West Calaguiman

   West Daang Bago

   San Roque


   =========================================================
   CRIME FILTER
   =========================================================


   The crime options come from:


   crimes.json


   This means FilterPanel does not manually create the
   list of crimes.


   Instead:


   crimes.json

        ↓

   crimesData.crimes

        ↓

   .map()

        ↓

   Create one menu option for every crime


   =========================================================
   WHY DOES EVERY CRIME HAVE A COLOR?
   =========================================================


   The colors help the user visually identify the selected
   crime across the interface.


   For example:


   Crime filter

       ↓

   Malicious Mischief

       ↓

   Orange indicator


   The same visual identity can then be used elsewhere in
   the dashboard.


   IMPORTANT:


   The crime color does NOT mean:


   Red = most dangerous


   Green = safe


   Orange = medium danger


   The colors are simply identifiers.


   =========================================================
   WHAT ARE ACTIVE FILTERS?
   =========================================================


   A filter becomes active when the user chooses something
   more specific than "all."


   EXAMPLE:


   Year:

   2025


   Barangay:

   All Barangays


   Crime:

   Malicious Mischief


   Active filters:


   Year = active

   Barangay = not active

   Crime = active


   TOTAL ACTIVE FILTERS:

   2


   =========================================================
   WHY SHOW ACTIVE FILTERS?
   =========================================================


   Imagine a user sees:


   3 cases


   Without knowing the filters, the number has little
   context.


   But if the interface shows:


   Year:
   2025


   Barangay:
   Gugo


   Crime:
   Malicious Mischief


   the user understands exactly what they are currently
   examining.


   =========================================================
   WHAT DOES RESET FILTERS DO?
   =========================================================


   Reset Filters returns the dashboard to:


   YEAR

   2024–2026


   BARANGAY

   All Barangays


   CRIME

   All Crimes


   This returns the user to the broad municipality-wide
   view.


   =========================================================
   FILTERS AND REPORTED DATA
   =========================================================


   Not every filter combination has the same type of
   source information.


   EXAMPLE 1


   YEAR:

   2025


   BARANGAY:

   All Barangays


   CRIME:

   Malicious Mischief


   The dashboard needs:


   Malicious Mischief × 2025


   The Crime × Year total is available.


   Therefore:

   REPORTED


   =========================================================
   EXAMPLE 2
   =========================================================


   YEAR:

   2024–2026


   BARANGAY:

   Gugo


   CRIME:

   Malicious Mischief


   The dashboard needs:


   Malicious Mischief × Gugo


   The Crime × Barangay total is available.


   Therefore:

   REPORTED


   =========================================================
   EXAMPLE 3
   =========================================================


   YEAR:

   2025


   BARANGAY:

   Gugo


   CRIME:

   Malicious Mischief


   The dashboard now needs:


   Crime

      ×

   Year

      ×

   Barangay


   Specifically:


   Malicious Mischief

      ×

   2025

      ×

   Gugo


   The exact Crime × Year × Barangay value is not directly
   reported in the source dataset.


   Therefore the dashboard can use the estimated
   allocation.


   This should be identified as:


   ESTIMATED


   =========================================================
   IMPORTANT CRIMINOLOGY INTERPRETATION
   =========================================================


   Filters help answer descriptive questions such as:


   "How many cases were recorded?"


   "Which barangay recorded more cases?"


   "How did the number of cases differ by year?"


   "Where were cases more concentrated in the available
   dataset?"


   But filtering alone does NOT answer:


   "Why did the crime happen?"


   "Who caused the crime?"


   "Is this barangay dangerous?"


   "Will crime happen here again?"


   "What is a person's probability of becoming a victim?"


   Those questions require additional data and different
   forms of criminological analysis.


   =========================================================
   FILTERPANEL PROGRAM FLOW
   =========================================================


   USER OPENS DASHBOARD

          ↓

   Default filters:


   2024–2026

   All Barangays

   All Crimes


          ↓


   USER CHANGES FILTER


          ↓


   FilterPanel detects selection


          ↓


   Calls:

   onYearChange()

   or

   onBarangayChange()

   or

   onCrimeChange()


          ↓


   App.tsx receives new selection


          ↓


   Dashboard state changes


          ↓


   Map updates

   Charts update

   Summary updates

   Analytics update


   =========================================================
   FILTER RELATIONSHIP
   =========================================================


               YEAR
                 │
                 │
                 ▼
            ┌─────────┐
            │         │
   CRIME ──►│ FILTERS │◄── BARANGAY
            │         │
            └────┬────┘
                 │
                 ▼
             App.tsx
                 │
                 ▼
          Dashboard Data
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
       Map     Charts   Summary


   =========================================================
   SIMPLE DEFENSE EXPLANATION
   =========================================================


   If your panel asks:


   "What is the purpose of your FilterPanel?"


   You can answer:


   "The FilterPanel allows users to refine the crime data
   displayed by the Bantay Samal dashboard according to
   year, barangay, and crime type. It does not modify the
   source data. Instead, it passes the selected conditions
   to the other dashboard components so that the map,
   statistics, and analytical displays can respond to the
   user's selected scope."


   =========================================================
   IF THEY ASK:
   "WHY DO YOU HAVE THREE FILTERS?"
   =========================================================


   You can answer:


   "The three filters represent three important dimensions
   of the crime data. The year represents when the cases
   were reported, the barangay represents the geographic
   area being examined, and the crime filter identifies
   the type of offense being analyzed."


   =========================================================
   IF THEY ASK:
   "WHY DO SOME FILTER COMBINATIONS SAY ESTIMATED?"
   =========================================================


   You can answer:


   "The source dataset provides reported crime-by-year and
   crime-by-barangay totals, but it does not directly
   provide every crime-by-year-by-barangay combination.
   When the user selects a combination that requires that
   missing cross-tabulation, Bantay Samal uses an
   analytical allocation and identifies the resulting
   value as estimated."


   =========================================================
   IF THEY ASK:
   "DO THE CRIME COLORS REPRESENT DANGER?"
   =========================================================


   You can answer:


   "No. The crime colors are used only to visually
   distinguish one crime type from another. They are not
   classifications of danger, severity, or community
   safety."


   =========================================================
   FINAL SIMPLE EXPLANATION
   =========================================================


   FilterPanel is the control center for selecting what
   part of the crime dataset the user wants to examine.


   It answers:


   WHEN?

   → Year


   WHERE?

   → Barangay


   WHAT?

   → Crime


   The selections are then sent to the main dashboard,
   which determines what information should be displayed.


   FilterPanel itself does not change the crime records,
   create statistics, or determine whether a barangay is
   safe or dangerous.


   Its main job is simply:


   SELECT

      ↓

   SEND FILTERS

      ↓

   UPDATE DASHBOARD
========================================================= */
