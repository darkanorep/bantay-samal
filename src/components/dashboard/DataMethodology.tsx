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

/* =========================================
   COMPONENT
========================================= */

export default function DataMethodology() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* =================================
          OPEN BUTTON
      ================================= */}

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

      {/* =================================
          DIALOG
      ================================= */}

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
        {/* =================================
            TITLE
        ================================= */}

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

        {/* =================================
            CONTENT
        ================================= */}

        <DialogContent>
          <Stack spacing={3}>
            {/* =================================
                OVERVIEW
            ================================= */}

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

            {/* =================================
                COVERAGE CARDS
            ================================= */}

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
              {/* BARANGAYS */}

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

              {/* REPORTED CASES */}

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

              {/* REPORTING PERIOD */}

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

            {/* =================================
                REPORTED DATA
            ================================= */}

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

            {/* =================================
                ESTIMATED DATA
            ================================= */}

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

            {/* =================================
                INTERPRETATION
            ================================= */}

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
                {/* REPORTED */}

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

                {/* ESTIMATED */}

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

            {/* =================================
                LIMITATIONS
            ================================= */}

            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                }}
              >
                Limitations
              </Typography>

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
