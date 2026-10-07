import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  AssessmentOutlined,
  CalendarMonthOutlined,
  CloseOutlined,
  DataObjectOutlined,
  FunctionsOutlined,
  InfoOutlined,
  LocationOnOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";

/* =========================================================
   BANTAY SAMAL - DATA METHODOLOGY
   =========================================================

   PURPOSE

   DataMethodology explains how the crime statistics used
   in Bantay Samal should be understood.

   This section is important because the dashboard contains
   two different kinds of information:

   1. REPORTED DATA

      These are totals directly represented in the
      available crime dataset.


   2. ESTIMATED DATA

      These are analytical allocations used when the
      dashboard needs a more detailed combination that
      was not directly reported.


   SIMPLE EXAMPLE

   The source data may tell us:

   Malicious Mischief in 2025
   = 13 cases

   and

   Malicious Mischief in Gugo during 2024–2026
   = 10 cases


   But it may NOT directly tell us:

   Malicious Mischief
   + 2025
   + Gugo
   = ?


   That missing combination is:

   Crime × Year × Barangay


   When Bantay Samal needs this combination, it uses an
   estimated allocation.


   IMPORTANT FOR CRIMINOLOGY STUDENTS

   Estimated values must NOT be described as directly
   observed or directly reported crime incidents.

   They are analytical values used to support mapping,
   visualization, and exploratory analysis.
========================================================= */

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DataMethodology() {
  /* =======================================================
     DIALOG STATE
     =======================================================

     "open" controls whether the About the Dataset dialog
     is visible.


     false
     → Dialog is closed


     true
     → Dialog is open


     setOpen(true)
     → Open the dialog


     setOpen(false)
     → Close the dialog
  ======================================================= */

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* =================================================
          OPEN BUTTON
          =================================================

          This is the small information button displayed
          on the dashboard.

          When the user clicks it:

          setOpen(true)

          is executed.

          The methodology dialog then appears.
      ================================================= */}

      <IconButton
        aria-label="About the Dataset"
        title="About the Dataset"
        onClick={() => setOpen(true)}
        sx={{
          width: 40,

          height: 40,

          flexShrink: 0,

          color: "primary.main",

          border: "1px solid",

          borderColor: "rgba(15,61,86,0.55)",

          bgcolor: "transparent",

          "&:hover": {
            bgcolor: "rgba(15,61,86,0.06)",

            borderColor: "primary.main",
          },
        }}
      >
        <InfoOutlined
          sx={{
            fontSize: 20,
          }}
        />
      </IconButton>

      {/* =================================================
          DATA METHODOLOGY DIALOG
          =================================================

          This dialog contains the complete explanation of
          the Bantay Samal dataset.

          It explains:

          - Dataset coverage
          - Reported data
          - Estimated allocations
          - How to interpret the dashboard
          - Limitations
      ================================================= */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
            },
          },
        }}
      >
        {/* =================================================
            DIALOG TITLE
        ================================================= */}

        <DialogTitle
          sx={{
            pr: 7,
          }}
        >
          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              alignItems: "center",
            }}
          >
            {/* =============================================
                DATA ICON
            ============================================= */}

            <Box
              sx={{
                width: 42,

                height: 42,

                flexShrink: 0,

                display: "grid",

                placeItems: "center",

                borderRadius: 2.25,

                bgcolor: "rgba(15,61,86,0.08)",

                color: "primary.main",
              }}
            >
              <DataObjectOutlined />
            </Box>

            {/* =============================================
                TITLE AND PROJECT NAME
            ============================================= */}

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                }}
              >
                About the Dataset
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Bantay Samal Crime Mapping & Statistics
              </Typography>
            </Box>
          </Stack>

          {/* =============================================
              CLOSE ICON
          ============================================= */}

          <IconButton
            aria-label="Close"
            onClick={() => setOpen(false)}
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

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <DialogContent>
          <Stack spacing={3}>
            {/* =================================================
                DATASET OVERVIEW
                =================================================

                Gives the user a simple description of the
                geographic area and reporting period.

                The dashboard focuses on:

                Municipality of Samal
                Province of Bataan
                Philippines

                Reporting Period:

                2024–2026
            ================================================= */}

            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                }}
              >
                Dataset Overview
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.75,

                  lineHeight: 1.7,
                }}
              >
                Bantay Samal presents crime statistics for the Municipality of
                Samal, Bataan covering the reporting period from 2024 to 2026.
              </Typography>
            </Box>

            {/* =================================================
                DATASET COVERAGE CARDS
                =================================================

                These cards summarize the overall scope of
                the crime dataset.

                14
                → Barangays

                250
                → Total reported cases

                2024–2026
                → Reporting period
            ================================================= */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",

                  sm: "repeat(3, 1fr)",
                },

                gap: 1.5,
              }}
            >
              {/* ===========================================
                  BARANGAY COVERAGE
              =========================================== */}

              <Paper
                variant="outlined"
                sx={{
                  p: 2,

                  borderRadius: 2.5,
                }}
              >
                <LocationOnOutlined color="primary" />

                <Typography
                  variant="h5"
                  sx={{
                    mt: 1,

                    fontWeight: 800,
                  }}
                >
                  14
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Barangays
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Municipality-wide geographic coverage
                </Typography>
              </Paper>

              {/* ===========================================
                  TOTAL REPORTED CASES

                  250 represents the complete reported
                  municipality total for the 2024–2026
                  reporting period.
              =========================================== */}

              <Paper
                variant="outlined"
                sx={{
                  p: 2,

                  borderRadius: 2.5,
                }}
              >
                <AssessmentOutlined color="primary" />

                <Typography
                  variant="h5"
                  sx={{
                    mt: 1,

                    fontWeight: 800,
                  }}
                >
                  250
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Reported Cases
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Across the complete reporting period
                </Typography>
              </Paper>

              {/* ===========================================
                  REPORTING PERIOD
              =========================================== */}

              <Paper
                variant="outlined"
                sx={{
                  p: 2,

                  borderRadius: 2.5,
                }}
              >
                <CalendarMonthOutlined color="primary" />

                <Typography
                  variant="h5"
                  sx={{
                    mt: 1,

                    fontWeight: 800,
                  }}
                >
                  2024–2026
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Reporting Period
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Three calendar years
                </Typography>
              </Paper>
            </Box>

            <Divider />

            {/* =================================================
                REPORTED DATA
                =================================================

                REPORTED means that the value comes directly
                from one of the totals represented in the
                source dataset.

                These values do NOT need analytical
                allocation.

                Examples include:

                - Municipality total
                - Yearly municipality totals
                - Crime totals
                - Crime × Year totals
                - Barangay totals
                - Crime × Barangay totals
            ================================================= */}

            <Box>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <VerifiedOutlined
                  sx={{
                    color: "#0F766E",
                  }}
                />

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Reported Data
                </Typography>

                <Chip
                  label="Reported"
                  size="small"
                  sx={{
                    fontWeight: 700,

                    bgcolor: "rgba(15,118,110,0.08)",

                    color: "#0F766E",
                  }}
                />
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,

                  lineHeight: 1.7,
                }}
              >
                The dataset contains directly reported totals at several levels.
                These values are displayed as reported data throughout the
                dashboard.
              </Typography>

              {/* =============================================
                  LIST OF REPORTED DATA AVAILABLE
              ============================================= */}

              <Stack
                spacing={1}
                sx={{
                  mt: 1.5,
                }}
              >
                {[
                  "Municipality total for the complete 2024–2026 reporting period",

                  "Municipality totals for 2024, 2025, and 2026",

                  "Total cases for each crime type",

                  "Crime totals by year",

                  "Total cases for each barangay across 2024–2026",

                  "Crime totals by barangay across 2024–2026",
                ].map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Small bullet */}

                    <Box
                      sx={{
                        width: 6,

                        height: 6,

                        mt: "7px",

                        flexShrink: 0,

                        borderRadius: "50%",

                        bgcolor: "#0F766E",
                      }}
                    />

                    <Typography variant="body2" color="text.secondary">
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* =================================================
                ESTIMATED DATA
                =================================================

                WHY DO WE NEED ESTIMATES?

                The available source totals do NOT directly
                provide:

                Crime × Year × Barangay


                Example:

                Malicious Mischief
                + 2025
                + Gugo


                The system knows separate totals such as:

                Malicious Mischief in 2025

                and

                Malicious Mischief in Gugo across
                2024–2026


                But the exact intersection:

                Malicious Mischief in Gugo in 2025

                is not directly reported.


                Therefore an analytical allocation is used.
            ================================================= */}

            <Box>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <FunctionsOutlined
                  sx={{
                    color: "#B45309",
                  }}
                />

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Estimated Allocations
                </Typography>

                <Chip
                  label="Estimated"
                  size="small"
                  sx={{
                    fontWeight: 700,

                    bgcolor: "rgba(180,83,9,0.08)",

                    color: "#92400E",
                  }}
                />
              </Stack>

              {/* =============================================
                  IMPORTANT WARNING

                  This clearly tells the user what is
                  missing from the directly reported data.
              ============================================= */}

              <Alert
                severity="warning"
                sx={{
                  mt: 1.5,

                  borderRadius: 2,
                }}
              >
                The source data does not directly provide individual
                crime-by-year-by-barangay counts.
              </Alert>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1.5,

                  lineHeight: 1.7,
                }}
              >
                When a specific year and barangay are selected together, Bantay
                Samal uses an estimated allocation derived from the available
                crime-by-year totals and crime-by-barangay totals.
              </Typography>

              {/* =============================================
                  ALLOCATION CONCEPT
                  =============================================

                  This explains the basic idea behind the
                  estimated data.

                  For each crime:

                  Reported Crime × Year totals

                  +

                  Reported Crime × Barangay totals

                            ↓

                  Analytical allocation

                            ↓

                  Estimated Crime × Year × Barangay values


                  The resulting allocation is balanced so
                  that it continues to preserve the known
                  reported totals.
              ============================================= */}

              <Box
                sx={{
                  mt: 1.5,

                  p: 2,

                  borderRadius: 2,

                  bgcolor: "rgba(180,83,9,0.05)",

                  border: "1px solid rgba(180,83,9,0.12)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",

                    mb: 0.75,

                    fontWeight: 800,

                    color: "#92400E",
                  }}
                >
                  Allocation concept
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.7,

                    color: "text.secondary",
                  }}
                >
                  A crime&apos;s reported yearly total is distributed across
                  barangays using its reported barangay distribution. The
                  resulting values are then balanced so that the allocations
                  preserve the reported yearly totals and reported barangay
                  totals for that crime.
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* =================================================
                HOW TO INTERPRET THE DASHBOARD
                =================================================

                This section teaches the user how to
                distinguish:

                REPORTED

                from

                ESTIMATED
            ================================================= */}

            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                }}
              >
                How to Interpret the Dashboard
              </Typography>

              <Stack
                spacing={1.5}
                sx={{
                  mt: 1.5,
                }}
              >
                {/* ===========================================
                    REPORTED EXPLANATION
                =========================================== */}

                <Box
                  sx={{
                    p: 1.75,

                    border: "1px solid rgba(15,118,110,0.15)",

                    bgcolor: "rgba(15,118,110,0.04)",

                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,

                      color: "#0F766E",
                    }}
                  >
                    Reported
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    Indicates that the value comes directly from one of the
                    reported totals represented in the dataset.
                  </Typography>
                </Box>

                {/* ===========================================
                    ESTIMATED EXPLANATION
                =========================================== */}

                <Box
                  sx={{
                    p: 1.75,

                    border: "1px solid rgba(180,83,9,0.15)",

                    bgcolor: "rgba(180,83,9,0.04)",

                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,

                      color: "#92400E",
                    }}
                  >
                    Estimated
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    Indicates an analytical allocation used when the selected
                    view requires a year-by-barangay value that is not directly
                    reported in the source dataset.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* =================================================
                LIMITATIONS
                =================================================

                This section is extremely important for
                research interpretation.

                The dashboard is designed to DESCRIBE and
                VISUALIZE the available data.

                It should not be used to make unsupported
                conclusions about individual people or the
                overall safety of a barangay.
            ================================================= */}

            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                }}
              >
                Limitations
              </Typography>

              {/* =============================================
                  LIMITATION #1

                  Estimated values are not directly observed
                  incident counts.
              ============================================= */}

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,

                  lineHeight: 1.7,
                }}
              >
                Estimated allocations should not be interpreted as directly
                observed incident counts for a particular barangay and year.
                They are intended to support visualization and exploratory
                analysis while preserving the reported aggregate totals.
              </Typography>

              {/* =============================================
                  LIMITATION #2

                  The dashboard describes the dataset.

                  It does not directly measure:

                  - Individual victimization risk
                  - Resident behavior
                  - Overall barangay safety
              ============================================= */}

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,

                  lineHeight: 1.7,
                }}
              >
                The dashboard describes the records contained in the dataset and
                should not be interpreted as a measurement of individual risk,
                resident behavior, or the overall safety of a barangay.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <Divider />

        {/* =================================================
            CLOSE BUTTON
        ================================================= */}

        <DialogActions
          sx={{
            px: 3,

            py: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            sx={{
              textTransform: "none",

              fontWeight: 700,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/* =========================================================
   SIMPLE EXPLANATION FOR CRIMINOLOGY STUDENTS
   =========================================================


   WHAT IS DATAMETHODOLOGY?


   DataMethodology explains where the information shown
   in Bantay Samal comes from and how the student should
   interpret it.


   Think of it as the dashboard's:

   "How was this data handled?"

   section.


   =========================================================
   DATASET COVERAGE
   =========================================================


   LOCATION:

   Municipality of Samal, Bataan


   BARANGAYS:

   14


   REPORTING PERIOD:

   2024–2026


   TOTAL REPORTED CASES:

   250


   =========================================================
   TWO TYPES OF VALUES
   =========================================================


   Bantay Samal displays two important types of values:


   1. REPORTED


   2. ESTIMATED


   These should never be confused with each other.


   =========================================================
   WHAT DOES "REPORTED" MEAN?
   =========================================================


   Reported means the value comes directly from one of
   the totals represented in the available dataset.


   Bantay Samal has reported information for:


   MUNICIPALITY TOTAL
   ------------------

   Total cases across Samal during 2024–2026.


   YEAR TOTAL
   ----------

   Example:

   2024 = 80
   2025 = 108
   2026 = 62


   CRIME TOTAL
   -----------

   Example:

   Malicious Mischief = 37


   CRIME × YEAR
   ------------

   Example:

   Malicious Mischief
   in 2025
   = 13


   BARANGAY TOTAL
   --------------

   Example:

   Total recorded cases in Gugo across 2024–2026.


   CRIME × BARANGAY
   ----------------

   Example:

   Malicious Mischief
   in Gugo
   across 2024–2026
   = 10


   These are represented as:

   REPORTED


   =========================================================
   WHAT INFORMATION IS MISSING?
   =========================================================


   The source data does NOT directly provide the complete:

   Crime × Year × Barangay

   cross-tabulation.


   For example:


   MALICIOUS MISCHIEF

          +

   2025

          +

   GUGO

          ↓

   ?


   The dataset contains related totals, but not the exact
   intersection for every combination.


   =========================================================
   WHY DOES BANTAY SAMAL USE ESTIMATES?
   =========================================================


   Imagine the dashboard user selects:


   Year:

   2025


   Crime:

   Malicious Mischief


   Barangay:

   Gugo


   The dashboard now needs:


   Malicious Mischief

          ×

   2025

          ×

   Gugo


   But that exact number is not directly reported.


   Therefore:

   Reported Crime × Year information

                 +

   Reported Crime × Barangay information

                 ↓

   Estimated allocation

                 ↓

   Crime × Year × Barangay estimate


   =========================================================
   BASIC IDEA OF THE ALLOCATION
   =========================================================


   The system uses the known distribution of a crime
   across barangays together with its known yearly totals.


   In simple terms:


   KNOWN YEAR TOTALS

          +

   KNOWN BARANGAY TOTALS

          ↓

   ESTIMATE THE MISSING CROSS-TABLE

          ↓

   BALANCE THE VALUES

          ↓

   PRESERVE THE KNOWN TOTALS


   =========================================================
   SIMPLE EXAMPLE
   =========================================================


   Imagine a crime has:

   2024 = 10 cases

   2025 = 20 cases

   2026 = 10 cases


   TOTAL = 40


   And its barangay totals are:

   Barangay A = 20

   Barangay B = 12

   Barangay C = 8


   TOTAL = 40


   We know the row totals.

   We know the column totals.


   But we do not know exactly how many of the 20 cases
   in 2025 occurred in Barangay A.


   Bantay Samal can create an analytical allocation that
   distributes those yearly totals while preserving the
   known totals.


   The resulting Year × Barangay values are therefore:

   ESTIMATED


   not:

   REPORTED.


   =========================================================
   WHY IS PRESERVING TOTALS IMPORTANT?
   =========================================================


   Suppose the reported yearly totals are:


   2024 = 80

   2025 = 108

   2026 = 62


   Their total is:


   80 + 108 + 62

   = 250


   After creating the estimated allocation, the yearly
   totals must still equal:


   80
   108
   62


   The allocation should not create extra cases or remove
   cases from those known totals.


   =========================================================
   REPORTED VS ESTIMATED EXAMPLE
   =========================================================


   QUESTION:

   "How many Malicious Mischief cases were recorded across
   Samal in 2025?"


   The dataset directly contains the Crime × Year value.


   Therefore:

   REPORTED


   ---------------------------------------------------------


   QUESTION:

   "How many Malicious Mischief cases were recorded in
   Gugo across the complete 2024–2026 period?"


   The dataset directly contains the Crime × Barangay
   value.


   Therefore:

   REPORTED


   ---------------------------------------------------------


   QUESTION:

   "How many Malicious Mischief cases were in Gugo
   specifically during 2025?"


   This requires:

   Crime × Year × Barangay


   That exact combination is not directly reported.


   Therefore:

   ESTIMATED


   =========================================================
   WHAT DOES ESTIMATED NOT MEAN?
   =========================================================


   Estimated does NOT mean:

   "The police reported exactly this number."


   It does NOT mean:

   "These are exact incident records."


   It does NOT mean:

   "The system knows the exact location and year of every
   individual incident."


   It means:

   The value was analytically allocated from the known
   reported totals.


   =========================================================
   WHY DO WE LABEL ESTIMATES?
   =========================================================


   Research transparency.


   A criminology student should always distinguish between:

   OBSERVED / REPORTED INFORMATION

   and

   DERIVED / ESTIMATED INFORMATION.


   Bantay Samal therefore displays labels such as:


   REPORTED


   or


   ESTIMATED


   so that users understand what type of information they
   are viewing.


   =========================================================
   HOW SHOULD THE MAP BE INTERPRETED?
   =========================================================


   The map helps users compare the geographic distribution
   of recorded crime statistics.


   It does NOT automatically tell the user:


   "This barangay is safe."


   or


   "This barangay is dangerous."


   The map shows differences in the available crime data.


   =========================================================
   HOW SHOULD COLOR INTENSITY BE INTERPRETED?
   =========================================================


   On the crime map, stronger visual intensity means that
   a barangay has a higher case count RELATIVE to the
   highest barangay under the current filters.


   Example:


   Highest barangay:

   20 cases


   Another barangay:

   10 cases


   Relative comparison:


   10 ÷ 20 × 100

   = 50%


   This is used to determine the visual intensity.


   IMPORTANT:


   50% does NOT mean:


   "There is a 50% chance of becoming a victim."


   It is only a relative visualization of case counts.


   =========================================================
   WHAT DO THE MAP PINS MEAN?
   =========================================================


   The map pins used for a selected crime represent
   barangay reference locations.


   They do NOT represent the exact coordinates where
   individual crimes happened.


   Therefore, a student should not say:


   "The crime happened exactly at this pin."


   A better explanation is:


   "The marker represents the barangay associated with
   the displayed crime statistics."


   =========================================================
   LIMITATIONS
   =========================================================


   Bantay Samal should be understood as a:

   DESCRIPTIVE

   and

   EXPLORATORY

   crime mapping system.


   It describes patterns contained in the available
   dataset.


   It does NOT automatically measure:


   Individual victimization risk


   Resident behavior


   Exact crime incident locations


   Causes of crime


   Future crime


   Overall safety of a barangay


   =========================================================
   GOOD INTERPRETATION
   =========================================================


   GOOD:

   "Barangay Gugo recorded a higher number of Malicious
   Mischief cases than several other barangays during the
   reporting period."


   GOOD:

   "The municipality recorded more cases in 2025 than in
   2024 according to the reported totals."


   GOOD:

   "The selected year-by-barangay value is estimated
   because the exact cross-tabulation was not directly
   reported."


   =========================================================
   INTERPRETATIONS TO AVOID
   =========================================================


   AVOID:

   "Gugo is dangerous."


   WHY?

   Case counts alone are not a complete measurement of
   community safety.


   ---------------------------------------------------------


   AVOID:

   "A resident has a 50% chance of becoming a victim."


   WHY?

   Relative map intensity is not a probability or
   victimization rate.


   ---------------------------------------------------------


   AVOID:

   "There were exactly 3 incidents of this crime in this
   barangay during this year."


   WHY?

   If the value came from the estimated allocation, it
   was not directly observed in the source cross-table.


   ---------------------------------------------------------


   AVOID:

   "Crime will increase next year."


   WHY?

   Bantay Samal describes the 2024–2026 dataset.

   It is not a forecasting model.


   =========================================================
   SIMPLE DATA FLOW
   =========================================================


   REPORTED CRIME DATA

           ↓

   Municipality totals

   Year totals

   Crime totals

   Barangay totals

   Crime × Year totals

   Crime × Barangay totals

           ↓

   Display directly when available

           ↓

        REPORTED


   ---------------------------------------------------------


   If the user requests:

   Crime × Year × Barangay

           ↓

   Exact cross-table unavailable

           ↓

   Use known reported margins

           ↓

   Create balanced allocation

           ↓

        ESTIMATED

           ↓

   Clearly label it in the dashboard


   =========================================================
   FINAL SIMPLE EXPLANATION
   =========================================================


   DataMethodology is the transparency section of
   Bantay Samal.


   It tells the user:


   WHAT DATA IS AVAILABLE?


   WHICH VALUES ARE DIRECTLY REPORTED?


   WHICH VALUES ARE ESTIMATED?


   WHY ARE ESTIMATES NECESSARY?


   HOW SHOULD THE MAP AND CHARTS BE INTERPRETED?


   WHAT ARE THE LIMITATIONS OF THE SYSTEM?


   For a criminology research project, this section is
   important because a crime mapping system should not
   simply display numbers.

   It should also explain where those numbers came from
   and how they should be interpreted.


   The most important rule is:


   REPORTED DATA
   ≠
   ESTIMATED DATA


   Bantay Samal keeps that distinction visible so that
   users can interpret the crime statistics responsibly.
========================================================= */
