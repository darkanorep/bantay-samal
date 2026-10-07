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

/* =========================================================
   BANTAY SAMAL - CRIME DETAILS
   =========================================================

   PURPOSE

   CrimeDetails displays detailed information about one
   selected crime.

   Example:

   The user selects:

   "Malicious Mischief"

                 ↓

   CrimeDetails finds Malicious Mischief in crimes.json

                 ↓

   A dialog opens showing:

   - Crime classification
   - Definition
   - Total reported cases
   - 2024 cases
   - 2025 cases
   - 2026 cases
   - Legal basis
   - Legal provision
   - Barangay distribution


   IMPORTANT FOR CRIMINOLOGY STUDENTS

   This component is mainly a CRIME PROFILE.

   It combines:

   1. Descriptive information about the offense
   2. Legal information
   3. Reported crime statistics

   It does NOT use the estimated Year × Barangay
   allocation used in some other parts of Bantay Samal.
========================================================= */

/* =========================================================
   COMPONENT INPUTS
   =========================================================

   CrimeDetails receives three pieces of information.


   open

   true
   → Open the crime information dialog.

   false
   → Hide the dialog.


   selectedCrimeId

   Tells the component which crime the user selected.

   Example:

   "malicious-mischief"


   onClose

   Function used when the user wants to close the dialog.
========================================================= */

type CrimeDetailsProps = {
  open: boolean;

  selectedCrimeId: string;

  onClose: () => void;
};

/* =========================================================
   BARANGAY NAMES
   =========================================================

   The JSON data uses IDs such as:

   "east-calaguiman"

   But the user should see:

   "East Calaguiman"


   This object converts the internal barangay ID into
   a readable barangay name.
========================================================= */

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

/* =========================================================
   CRIME CATEGORY LABEL
   =========================================================

   crimes.json stores categories using computer-friendly
   IDs.

   Example:

   "index-crime"

   This function changes them into readable labels.

   "index-crime"
          ↓
   "Index Crime"


   "non-index-crime"
          ↓
   "Non-Index Crime"


   "vehicular-accident"
          ↓
   "Vehicular Accident"


   This function only changes the DISPLAY NAME.

   It does not change the actual crime data.
========================================================= */

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

/* =========================================================
   MAIN CRIME DETAILS COMPONENT
========================================================= */

export default function CrimeDetails({
  open,
  selectedCrimeId,
  onClose,
}: CrimeDetailsProps) {
  /* =======================================================
     FIND THE SELECTED CRIME
     =======================================================

     The dashboard normally sends the ID of the crime.

     Example:

     selectedCrimeId =
     "malicious-mischief"

                ↓

     Search crimes.json

                ↓

     Find the Malicious Mischief record.


     If "all" is selected, there is no single crime profile
     to display.

     In that situation, selectedCrime becomes null.
  ======================================================= */

  const selectedCrime =
    selectedCrimeId === "all"
      ? null
      : (crimesData.crimes.find((crime) => crime.id === selectedCrimeId) ??
        null);

  /* =======================================================
     STOP IF THERE IS NO SELECTED CRIME
     =======================================================

     If the user selected:

     All Crimes

     there is no individual crime profile.

     Therefore, nothing should be displayed.
  ======================================================= */

  if (!selectedCrime) {
    return null;
  }

  /* =======================================================
     CRIME COLOR
     =======================================================

     Every crime category has a visual color in
     crimeColors.ts.

     Example:

     Malicious Mischief
             ↓
     Orange


     The color is used for:

     - Icons
     - Borders
     - Progress bars
     - Important values
     - Buttons


     IMPORTANT:

     The color is only for VISUAL IDENTIFICATION.

     It does NOT represent:

     - Crime seriousness
     - Criminal penalty
     - Risk level
     - Danger level
  ======================================================= */

  const crimeColor = getCrimeColor(selectedCrimeId);

  /* =======================================================
     OPTIONAL CRIME INFORMATION
     =======================================================

     Some crime records contain additional information:

     definition
     legalBasis
     legalProvision


     This safely checks whether those fields exist.


     Example:

     definition:
     Explains what the offense means.


     legalBasis:
     Identifies the law or legal article.


     legalProvision:
     Gives a short explanation of the legal provision.


     If a field does not exist, an empty string is used
     instead of causing an error.
  ======================================================= */

  const definition =
    "definition" in selectedCrime ? String(selectedCrime.definition ?? "") : "";

  const legalBasis =
    "legalBasis" in selectedCrime ? String(selectedCrime.legalBasis ?? "") : "";

  const legalProvision =
    "legalProvision" in selectedCrime
      ? String(selectedCrime.legalProvision ?? "")
      : "";

  /* =======================================================
     BARANGAY DISTRIBUTION
     =======================================================

     Each crime contains its reported total for every
     barangay.

     Example:

     Malicious Mischief:

     Gugo                = 10
     East Daang Bago     = 5
     Lalawigan           = 5
     Santa Lucia         = 5
     ...


     Object.entries() changes the barangay object into
     a list that React can display.


     Then:

     .map()

     changes:

     barangay ID + value

     into:

     readable barangay name + value


     Finally:

     .sort()

     arranges barangays from highest number of cases
     to lowest number of cases.


     IMPORTANT:

     These are reported Crime × Barangay totals covering
     the COMPLETE 2024–2026 reporting period.

     They are NOT estimated Year × Barangay values.
  ======================================================= */

  const barangayDistribution = Object.entries(selectedCrime.barangays)
    .map(([barangayId, value]) => ({
      id: barangayId,

      name: barangayNames[barangayId] ?? barangayId,

      value: Number(value),
    }))

    .sort((a, b) => b.value - a.value);

  /* =======================================================
     HIGHEST BARANGAY
     =======================================================

     Because barangayDistribution was sorted from highest
     to lowest:

     barangayDistribution[0]

     is the barangay with the highest number of reported
     cases for this crime.


     Example:

     Gugo = 10
     Sapa = 5
     Ibaba = 2

     highestBarangay = Gugo


     IMPORTANT:

     "Highest" means highest NUMBER OF REPORTED CASES for
     the selected crime.

     It does NOT automatically mean that the barangay is
     the most dangerous barangay.
  ======================================================= */

  const highestBarangay = barangayDistribution[0];

  /* =======================================================
     MAXIMUM BARANGAY VALUE
     =======================================================

     This number is used to create the comparison bars.

     Example:

     Highest barangay = 10 cases

     maxBarangayValue = 10
  ======================================================= */

  const maxBarangayValue = highestBarangay?.value ?? 1;

  /* =======================================================
     YEARLY VALUES
     =======================================================

     Get the reported number of cases for this crime in:

     2024
     2025
     2026


     Example:

     Malicious Mischief

     2024 = 12
     2025 = 13
     2026 = 12


     These values come directly from:

     selectedCrime.yearly

     Therefore these are REPORTED Crime × Year totals.
  ======================================================= */

  const year2024 =
    selectedCrime.yearly["2024" as keyof typeof selectedCrime.yearly] ?? 0;

  const year2025 =
    selectedCrime.yearly["2025" as keyof typeof selectedCrime.yearly] ?? 0;

  const year2026 =
    selectedCrime.yearly["2026" as keyof typeof selectedCrime.yearly] ?? 0;

  /* =======================================================
     USER INTERFACE
     =======================================================

     Everything below creates the crime information dialog.

     The dialog contains:

     1. Header
     2. Classification
     3. Definition
     4. Statistical Summary
     5. Legal Information
     6. Barangay Distribution
     7. Data Note
     8. Close Button
  ======================================================= */

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
      {/* =================================================
          HEADER

          Shows:

          - Crime icon
          - Crime name
          - Reporting period
          - Close button
      ================================================= */}

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
          {/* =============================================
              CRIME ICON
          ============================================= */}

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

          {/* =============================================
              CRIME TITLE
          ============================================= */}

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

        {/* =============================================
            CLOSE ICON

            Allows the user to close the crime dialog.
        ============================================= */}

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

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <DialogContent>
        <Stack spacing={3}>
          {/* =================================================
              CLASSIFICATION
              =================================================

              Shows the general crime category.

              Examples:

              Index Crime
              Non-Index Crime
              Vehicular Accident
          ================================================= */}

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

          {/* =================================================
              CRIME DETAILS / DEFINITION
          ================================================= */}

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

            {/* =============================================
                DEFINITION AVAILABLE

                Display the definition stored in crimes.json.
            ============================================= */}

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
              /* ===========================================
                 NO DEFINITION AVAILABLE

                 This prevents the application from
                 displaying an empty section.
              =========================================== */

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

          {/* =================================================
              STATISTICAL SUMMARY
              =================================================

              Shows:

              TOTAL
              2024
              2025
              2026


              All of these values are reported statistics
              from the selected crime record.
          ================================================= */}

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

            {/* =============================================
                RESPONSIVE STATISTICS GRID

                Mobile:
                2 cards per row

                Larger screen:
                4 cards per row
            ============================================= */}

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
              {/* ===========================================
                  TOTAL REPORTED CASES

                  This is the complete total for the
                  selected crime from 2024–2026.
              =========================================== */}

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

              {/* ===========================================
                  2024 REPORTED CASES
              =========================================== */}

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

              {/* ===========================================
                  2025 REPORTED CASES
              =========================================== */}

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

              {/* ===========================================
                  2026 REPORTED CASES
              =========================================== */}

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

          {/* =================================================
              LEGAL INFORMATION
              =================================================

              This section explains the legal information
              stored for the selected offense.

              It may contain:

              - Legal Basis
              - Legal Provision


              IMPORTANT:

              These values are read from crimes.json.

              The component itself does not determine what
              law applies to an offense.
          ================================================= */}

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
              {/* ===========================================
                  LEGAL BASIS

                  Example:

                  Revised Penal Code, Article 327

                  or

                  Republic Act No. 10883

                  depending on the selected crime and the
                  information stored in crimes.json.
              =========================================== */}

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

              {/* ===========================================
                  LEGAL PROVISION

                  Only display this section if the selected
                  crime contains legalProvision information.
              =========================================== */}

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

          {/* =================================================
              BARANGAY DISTRIBUTION
              =================================================

              This section answers:

              "How many reported cases of this crime were
              recorded in each barangay during 2024–2026?"


              The barangays are arranged:

              Highest count
                    ↓
              Lowest count


              IMPORTANT:

              These are reported Crime × Barangay totals.

              They are NOT estimated yearly barangay values.
          ================================================= */}

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
                /* =========================================
                     RELATIVE BAR LENGTH
                     =========================================

                     The barangay with the highest number of
                     cases receives a 100% bar.

                     Other barangays are compared with it.


                     EXAMPLE

                     Highest barangay:
                     10 cases

                     Another barangay:
                     5 cases


                     Calculation:

                     5 ÷ 10 × 100

                     = 50%


                     Therefore its progress bar is half the
                     width of the highest barangay.


                     IMPORTANT:

                     This percentage is only used for
                     VISUAL COMPARISON.

                     It is NOT:

                     - Crime rate
                     - Probability
                     - Victimization risk
                     - Safety score
                  ========================================= */

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
                        {/* =================================
                              RANK NUMBER

                              Because the list is sorted from
                              highest to lowest:

                              1 = highest reported count
                              2 = second highest
                              3 = third highest

                              etc.

                              This is a count ranking only.
                          ================================= */}

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

                        {/* =================================
                              BARANGAY NAME
                          ================================= */}

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: index < 3 ? 800 : 600,
                          }}
                        >
                          {barangay.name}
                        </Typography>
                      </Stack>

                      {/* ===================================
                            REPORTED CASE COUNT
                        =================================== */}

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

                    {/* =====================================
                          VISUAL COMPARISON BAR

                          Longer bar
                          = higher reported count

                          Shorter bar
                          = lower reported count
                      ===================================== */}

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

          {/* =================================================
              DATA TRANSPARENCY NOTE
              =================================================

              This is very important for research
              transparency.

              The statistics displayed inside CrimeDetails
              are reported totals.

              The component does NOT use:

              crime-year-barangay.json

              Therefore it does not display estimated
              Year × Barangay allocations.
          ================================================= */}

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

      {/* =================================================
          DIALOG ACTIONS
      ================================================= */}

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

/* =========================================================
   SIMPLE EXPLANATION FOR CRIMINOLOGY STUDENTS
   =========================================================


   WHAT DOES CRIMEDETAILS DO?


   CrimeDetails acts like an information profile for each
   crime recorded in Bantay Samal.


   When a student selects a crime:

   SELECT CRIME

        ↓

   Find crime in crimes.json

        ↓

   Open CrimeDetails

        ↓

   Show:

   Classification
        ↓
   Definition
        ↓
   Reported Statistics
        ↓
   Legal Information
        ↓
   Barangay Distribution


   =========================================================
   1. CLASSIFICATION
   =========================================================


   This tells the student what general category the
   selected offense belongs to according to the
   classification stored in the dataset.


   Examples:

   Index Crime

   Non-Index Crime

   Vehicular Accident


   =========================================================
   2. DEFINITION
   =========================================================


   The Definition section gives the description stored
   in the crime dataset.

   Its purpose is to help the user understand what the
   selected offense means.


   =========================================================
   3. STATISTICAL SUMMARY
   =========================================================


   This section displays:

   TOTAL
   2024
   2025
   2026


   Example:

   Malicious Mischief

   2024 = 12
   2025 = 13
   2026 = 12

   Total = 37


   These values are reported Crime × Year statistics.


   =========================================================
   4. LEGAL INFORMATION
   =========================================================


   The Legal Information section displays the legal
   information stored in crimes.json.


   LEGAL BASIS

   Identifies the law or legal article associated with
   the crime in the dataset.


   LEGAL PROVISION

   Gives the corresponding explanatory information stored
   for that offense.


   The component only DISPLAYS this information.

   It does not determine which law applies.


   =========================================================
   5. BARANGAY DISTRIBUTION
   =========================================================


   This section compares how many cases of the selected
   crime were reported in each barangay.


   Example:

   Gugo                  10
   East Daang Bago        5
   Lalawigan              5
   Santa Lucia            5


   The program sorts the barangays from:

   Highest number of cases

          ↓

   Lowest number of cases


   =========================================================
   WHAT DOES RANK #1 MEAN?
   =========================================================


   Rank #1 means:

   The barangay has the highest number of reported cases
   for that selected crime during the complete 2024–2026
   period.


   It does NOT mean:

   "This is the most dangerous barangay."


   Why?


   Raw case counts alone do not consider other factors
   such as:

   - Population
   - Exposure
   - Reporting behavior
   - Geographic size
   - Other socioeconomic or environmental factors


   =========================================================
   WHAT DOES THE PROGRESS BAR MEAN?
   =========================================================


   Suppose:

   Gugo = 10 cases

   Sapa = 5 cases


   If Gugo is the highest:

   Gugo:

   10 ÷ 10 × 100 = 100%


   Sapa:

   5 ÷ 10 × 100 = 50%


   Therefore:

   Gugo receives a full bar.

   Sapa receives a half-length bar.


   The 50% does NOT mean:

   "There is a 50% crime rate in Sapa."


   It only means:

   Sapa's case count is half of the highest displayed
   barangay count.


   =========================================================
   REPORTED OR ESTIMATED?
   =========================================================


   CrimeDetails uses:

   Crime × Year totals

   and

   Crime × Barangay totals


   These are available as reported statistics in
   crimes.json.


   Therefore this component does NOT need the estimated:

   Crime × Year × Barangay

   allocation.


   This is why the bottom of the dialog clearly states:

   REPORTED DATA


   =========================================================
   IMPORTANT DIFFERENCE FROM CRIME ANALYTICS
   =========================================================


   CRIME DETAILS
   -------------

   Shows the selected crime's reported profile.

   Uses:

   Crime totals
   Crime × Year
   Crime × Barangay


   No estimated year-by-barangay allocation is needed.


   CRIME ANALYTICS
   ---------------

   Responds to more detailed combinations of filters.

   Example:

   Malicious Mischief
   + 2025
   + Gugo


   This requires:

   Crime × Year × Barangay


   Because that exact cross-tabulation was not directly
   reported, CrimeAnalytics can use the estimated
   allocation and clearly label it as estimated.


   =========================================================
   HOW TO INTERPRET THIS AS A CRIMINOLOGY STUDENT
   =========================================================


   GOOD:

   "Gugo recorded the highest number of Malicious Mischief
   cases among the barangays during the complete 2024–2026
   reporting period."


   AVOID:

   "Gugo is the most dangerous barangay."


   GOOD:

   "The number of reported Malicious Mischief cases was
   12 in 2024, 13 in 2025, and 12 in 2026."


   AVOID:

   "Malicious Mischief will increase next year."


   The statistics describe the available reporting period.

   They are not a prediction.


   =========================================================
   SIMPLE PROGRAM FLOW
   =========================================================


   User selects crime

          ↓

   selectedCrimeId

          ↓

   Find matching crime in crimes.json

          ↓

   Get crime color

          ↓

   Read definition

          ↓

   Read legal information

          ↓

   Read 2024 / 2025 / 2026 statistics

          ↓

   Read Crime × Barangay totals

          ↓

   Sort barangays highest → lowest

          ↓

   Calculate relative comparison bars

          ↓

   Display Crime Details dialog


   =========================================================
   FINAL SIMPLE EXPLANATION
   =========================================================


   CrimeDetails helps a criminology student understand one
   crime at a time.

   It answers basic questions such as:


   "What crime is this?"

   "What classification does it belong to?"

   "What does the offense mean?"

   "What law is associated with it in the dataset?"

   "How many cases were reported?"

   "How did the reported count differ between 2024,
   2025, and 2026?"

   "Which barangays recorded more cases of this crime?"


   The component therefore combines:

   CRIMINOLOGICAL INFORMATION

   +

   LEGAL INFORMATION

   +

   DESCRIPTIVE STATISTICS


   into one crime profile.


   Most importantly, the statistics shown here remain
   REPORT-BASED totals.

   The estimated Year × Barangay allocation used elsewhere
   in Bantay Samal is not used inside this component.
========================================================= */
