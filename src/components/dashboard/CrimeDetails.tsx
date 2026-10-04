import {
  Box,
  Button,
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
  CloseOutlined,
  DescriptionOutlined,
  GavelOutlined,
  InfoOutlined,
  LocationOnOutlined,
  ShieldOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";

import crimesData from "../../data/crimes.json";
import { getCrimeColor } from "../../utils/crimeColors";

/* =========================================
   TYPES
========================================= */

type CrimeDetailsProps = {
  open: boolean;
  selectedCrimeId: string;
  onClose: () => void;
};

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
   CATEGORY LABEL
========================================= */

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "index-crime":
      return "Index Crime";

    case "non-index-crime":
      return "Non-Index Crime";

    case "vehicular-accident":
      return "Vehicular Accident";

    default:
      return category;
  }
};

/* =========================================
   COMPONENT
========================================= */

export default function CrimeDetails({
  open,
  selectedCrimeId,
  onClose,
}: CrimeDetailsProps) {
  /* =========================================
     SELECTED CRIME
  ========================================= */

  const selectedCrime =
    selectedCrimeId === "all"
      ? null
      : (crimesData.crimes.find((crime) => crime.id === selectedCrimeId) ??
        null);

  if (!selectedCrime) {
    return null;
  }

  /* =========================================
     CRIME COLOR
  ========================================= */

  const crimeColor = getCrimeColor(selectedCrimeId);

  /* =========================================
     OPTIONAL CRIME INFORMATION
  ========================================= */

  const definition =
    "definition" in selectedCrime ? String(selectedCrime.definition ?? "") : "";

  const legalBasis =
    "legalBasis" in selectedCrime ? String(selectedCrime.legalBasis ?? "") : "";

  const legalProvision =
    "legalProvision" in selectedCrime
      ? String(selectedCrime.legalProvision ?? "")
      : "";

  /* =========================================
     BARANGAY DISTRIBUTION
  ========================================= */

  const barangayDistribution = Object.entries(selectedCrime.barangays)
    .map(([barangayId, value]) => ({
      id: barangayId,

      name: barangayNames[barangayId] ?? barangayId,

      value: Number(value),
    }))
    .sort((a, b) => b.value - a.value);

  const highestBarangay = barangayDistribution[0];

  const maxBarangayValue = highestBarangay?.value ?? 1;

  /* =========================================
     YEAR VALUES
  ========================================= */

  const year2024 =
    selectedCrime.yearly["2024" as keyof typeof selectedCrime.yearly] ?? 0;

  const year2025 =
    selectedCrime.yearly["2025" as keyof typeof selectedCrime.yearly] ?? 0;

  const year2026 =
    selectedCrime.yearly["2026" as keyof typeof selectedCrime.yearly] ?? 0;

  /* =========================================
     UI
  ========================================= */

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,

            maxHeight: {
              xs: "92vh",
              sm: "90vh",
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
          {/* CRIME ICON */}

          <Box
            sx={{
              width: 44,
              height: 44,

              display: "grid",
              placeItems: "center",

              flexShrink: 0,

              borderRadius: 2.25,

              bgcolor: `${crimeColor}14`,
              color: crimeColor,

              border: `1px solid ${crimeColor}24`,
            }}
          >
            <ShieldOutlined />
          </Box>

          {/* TITLE */}

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

                color: crimeColor,
              }}
            >
              Crime Information
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mt: 0.25,

                fontWeight: 800,

                lineHeight: 1.25,
              }}
            >
              {selectedCrime.name}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Samal, Bataan • 2024–2026
            </Typography>
          </Box>
        </Stack>

        {/* CLOSE ICON */}

        <IconButton
          aria-label="Close crime details"
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
              CLASSIFICATION
          ================================= */}

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 700,
              }}
            >
              Classification
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                mt: 0.25,

                fontWeight: 800,

                color: "text.primary",
              }}
            >
              {getCategoryLabel(selectedCrime.category)}
            </Typography>
          </Box>

          {/* =================================
              CRIME DETAILS
          ================================= */}

          <Box>
            <Stack
              direction="row"
              spacing={0.75}
              sx={{
                mb: 1.5,
                alignItems: "center",
              }}
            >
              <DescriptionOutlined
                sx={{
                  fontSize: 19,
                  color: crimeColor,
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                }}
              >
                Crime Details
              </Typography>
            </Stack>

            {definition ? (
              <Box
                sx={{
                  p: {
                    xs: 1.75,
                    sm: 2,
                  },

                  bgcolor: `${crimeColor}08`,

                  border: `1px solid ${crimeColor}18`,

                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",

                    mb: 0.6,

                    fontWeight: 800,

                    color: crimeColor,
                  }}
                >
                  Definition
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.7,
                  }}
                >
                  {definition}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  p: {
                    xs: 1.75,
                    sm: 2,
                  },

                  bgcolor: "rgba(15,61,86,0.035)",

                  border: "1px solid",
                  borderColor: "divider",

                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",

                    mb: 0.5,

                    fontWeight: 800,

                    color: "text.primary",
                  }}
                >
                  Definition
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.7,
                  }}
                >
                  No definition is currently available in the dataset for this
                  crime.
                </Typography>
              </Box>
            )}
          </Box>

          <Divider />

          {/* =================================
              STATISTICAL SUMMARY
          ================================= */}

          <Box>
            <Stack
              direction="row"
              spacing={0.75}
              sx={{
                mb: 1.5,
                alignItems: "center",
              }}
            >
              <TrendingUpOutlined
                sx={{
                  fontSize: 19,
                  color: crimeColor,
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                }}
              >
                Statistical Summary
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(4, minmax(0, 1fr))",
                },

                gap: 1.25,
              }}
            >
              {/* TOTAL */}

              <Box
                sx={{
                  p: 1.75,

                  border: `1px solid ${crimeColor}28`,

                  bgcolor: `${crimeColor}06`,

                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Total
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    mt: 0.5,

                    fontWeight: 900,

                    color: crimeColor,
                  }}
                >
                  {selectedCrime.total}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  2024–2026
                </Typography>
              </Box>

              {/* 2024 */}

              <Box
                sx={{
                  p: 1.75,

                  border: "1px solid",
                  borderColor: "divider",

                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  2024
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    mt: 0.5,

                    fontWeight: 900,
                  }}
                >
                  {year2024}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Reported
                </Typography>
              </Box>

              {/* 2025 */}

              <Box
                sx={{
                  p: 1.75,

                  border: "1px solid",
                  borderColor: "divider",

                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  2025
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    mt: 0.5,

                    fontWeight: 900,
                  }}
                >
                  {year2025}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Reported
                </Typography>
              </Box>

              {/* 2026 */}

              <Box
                sx={{
                  p: 1.75,

                  border: "1px solid",
                  borderColor: "divider",

                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  2026
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    mt: 0.5,

                    fontWeight: 900,
                  }}
                >
                  {year2026}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Reported
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* =================================
              LEGAL INFORMATION
          ================================= */}

          <Box>
            <Stack
              direction="row"
              spacing={0.75}
              sx={{
                mb: 1.5,
                alignItems: "center",
              }}
            >
              <GavelOutlined
                sx={{
                  fontSize: 19,
                  color: crimeColor,
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                }}
              >
                Legal Information
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              {/* LEGAL BASIS */}

              {legalBasis ? (
                <Box
                  sx={{
                    p: 2,

                    border: "1px solid",
                    borderColor: "divider",

                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",

                      mb: 0.5,

                      fontWeight: 800,

                      color: crimeColor,
                    }}
                  >
                    Legal Basis
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.7,
                    }}
                  >
                    {legalBasis}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 2,

                    border: "1px solid",
                    borderColor: "divider",

                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",

                      mb: 0.5,

                      fontWeight: 800,

                      color: "text.primary",
                    }}
                  >
                    Legal Basis
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    No legal basis is currently available in the dataset.
                  </Typography>
                </Box>
              )}

              {/* LEGAL PROVISION */}

              {legalProvision && (
                <Box
                  sx={{
                    p: 2,

                    border: "1px solid",
                    borderColor: "divider",

                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",

                      mb: 0.5,

                      fontWeight: 800,

                      color: crimeColor,
                    }}
                  >
                    Legal Provision
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                    }}
                  >
                    {legalProvision}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          <Divider />

          {/* =================================
              BARANGAY DISTRIBUTION
          ================================= */}

          <Box>
            <Stack
              direction="row"
              spacing={0.75}
              sx={{
                alignItems: "center",
              }}
            >
              <LocationOnOutlined
                sx={{
                  fontSize: 19,
                  color: crimeColor,
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                }}
              >
                Barangay Distribution
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                lineHeight: 1.6,
              }}
            >
              Reported distribution of {selectedCrime.name} across the barangays
              of Samal for the complete 2024–2026 reporting period.
            </Typography>

            <Stack
              spacing={1.75}
              sx={{
                mt: 2,
              }}
            >
              {barangayDistribution.map((barangay, index) => {
                const percentage =
                  maxBarangayValue > 0
                    ? (barangay.value / maxBarangayValue) * 100
                    : 0;

                return (
                  <Box key={barangay.id}>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        justifyContent: "space-between",

                        alignItems: "center",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          minWidth: 0,
                          alignItems: "center",
                        }}
                      >
                        {/* RANK */}

                        <Box
                          sx={{
                            width: 25,
                            height: 25,

                            display: "grid",

                            placeItems: "center",

                            flexShrink: 0,

                            borderRadius: "50%",

                            bgcolor:
                              index < 3
                                ? `${crimeColor}14`
                                : "rgba(15,61,86,0.06)",

                            color: index < 3 ? crimeColor : "text.secondary",

                            fontSize: "0.72rem",

                            fontWeight: 900,
                          }}
                        >
                          {index + 1}
                        </Box>

                        {/* BARANGAY */}

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: index < 3 ? 800 : 600,
                          }}
                        >
                          {barangay.name}
                        </Typography>
                      </Stack>

                      {/* COUNT */}

                      <Typography
                        variant="body2"
                        sx={{
                          flexShrink: 0,

                          fontWeight: 800,
                        }}
                      >
                        {barangay.value}
                      </Typography>
                    </Stack>

                    {/* PROGRESS */}

                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        mt: 0.75,

                        height: 6,

                        borderRadius: 99,

                        bgcolor: `${crimeColor}12`,

                        "& .MuiLinearProgress-bar": {
                          borderRadius: 99,

                          bgcolor: crimeColor,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* =================================
              DATA NOTE
          ================================= */}

          <Box
            sx={{
              p: 1.75,

              borderRadius: 2,

              bgcolor: "rgba(15,118,110,0.05)",

              border: "1px solid rgba(15,118,110,0.10)",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "flex-start",
              }}
            >
              <InfoOutlined
                sx={{
                  mt: "1px",

                  fontSize: 18,

                  flexShrink: 0,

                  color: "#0F766E",
                }}
              />

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",

                    fontWeight: 800,

                    color: "#0F766E",
                  }}
                >
                  Reported Data
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
                  The yearly and barangay values shown in this crime profile use
                  the reported 2024–2026 statistics. Estimated year-by-barangay
                  allocations are not used in this section.
                </Typography>
              </Box>
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

            bgcolor: crimeColor,

            "&:hover": {
              bgcolor: crimeColor,

              filter: "brightness(0.92)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
