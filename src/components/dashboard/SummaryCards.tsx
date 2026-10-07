import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

import {
  CalendarMonthOutlined,
  CategoryOutlined,
  LocationOnOutlined,
  ShieldOutlined,
} from "@mui/icons-material";

/* =========================================================
   BANTAY SAMAL - SUMMARY CARDS
   =========================================================

   PURPOSE

   SummaryCards gives the user a quick overview of the
   Bantay Samal crime dataset.

   Instead of immediately showing detailed charts,
   statistics, and maps, these cards first answer four
   basic questions:


   1. HOW MANY REPORTED CASES ARE IN THE DATASET?

      250


   2. HOW MANY BARANGAYS ARE COVERED?

      14


   3. HOW MANY CRIME TYPES ARE INCLUDED?

      12


   4. WHAT IS THE REPORTING PERIOD?

      2024–2026


   SIMPLE IDEA


   BANTAY SAMAL DATASET

          ↓

   ┌─────────────────────┐
   │ 250 Recorded Cases  │
   └─────────────────────┘

          +

   ┌─────────────────────┐
   │    14 Barangays     │
   └─────────────────────┘

          +

   ┌─────────────────────┐
   │   12 Crime Types    │
   └─────────────────────┘

          +

   ┌─────────────────────┐
   │     2024–2026       │
   └─────────────────────┘


   IMPORTANT FOR CRIMINOLOGY STUDENTS

   These cards describe the SCOPE of the dataset.

   They do not perform crime prediction.

   They do not determine whether a barangay is safe
   or dangerous.

   They simply summarize what information is included
   in Bantay Samal.
========================================================= */

/* =========================================================
   SUMMARY DATA
   =========================================================

   summaryItems contains the information that will appear
   inside the four summary cards.

   Every item contains four properties:


   label

   → Describes what the number represents.


   value

   → The actual number or reporting period.


   helper

   → Gives the user a short explanation.


   icon

   → Provides a visual symbol for the card.


   Instead of manually creating four separate cards,
   we store their information here and later use .map()
   to automatically create them.
========================================================= */

const summaryItems = [
  /* =======================================================
     CARD 1 - RECORDED CASES
     =======================================================

     250 represents the total number of reported cases
     contained in the Bantay Samal dataset for the complete
     2024–2026 reporting period.

     IMPORTANT:

     This is the overall dataset total.

     It should not be interpreted as:

     - 250 cases per year
     - 250 cases in every barangay
     - 250 cases for every crime

     It is the complete municipality-wide total represented
     in the dataset.
  ======================================================= */

  {
    label: "Recorded Cases",

    value: "250",

    helper: "Total reported cases",

    icon: ShieldOutlined,
  },

  /* =======================================================
     CARD 2 - BARANGAYS
     =======================================================

     Bantay Samal covers all 14 barangays included in the
     project's geographic crime dataset.

     The number 14 represents geographic coverage.

     It does NOT represent the number of barangays with
     a particular crime.
  ======================================================= */

  {
    label: "Barangays",

    value: "14",

    helper: "Samal coverage",

    icon: LocationOnOutlined,
  },

  /* =======================================================
     CARD 3 - CRIME TYPES
     =======================================================

     The dataset contains 12 recorded crime types.

     These are the crime categories/offenses that can be
     examined using the crime filter and other dashboard
     components.

     IMPORTANT:

     12 means the number of crime types represented in
     the dataset.

     It does NOT mean that only 12 crime incidents
     occurred.
  ======================================================= */

  {
    label: "Crime Types",

    value: "12",

    helper: "Recorded categories",

    icon: CategoryOutlined,
  },

  /* =======================================================
     CARD 4 - REPORTING PERIOD
     =======================================================

     The crime dataset covers three calendar years:

     2024
     2025
     2026

     Therefore the complete reporting period is displayed
     as:

     2024–2026
  ======================================================= */

  {
    label: "Reporting Period",

    value: "2024–2026",

    helper: "Three-year dataset",

    icon: CalendarMonthOutlined,
  },
];

/* =========================================================
   MAIN SUMMARY CARDS COMPONENT
   =========================================================

   This component takes the information stored inside
   summaryItems and turns each item into a visual card.

   SIMPLE PROGRAM FLOW


   summaryItems

        ↓

   .map()

        ↓

   Read one summary item

        ↓

   Create one card

        ↓

   Repeat for all four items

        ↓

   Display four summary cards
========================================================= */

export default function SummaryCards() {
  return (
    /* =====================================================
       RESPONSIVE GRID
       =====================================================

       Grid controls how the summary cards are arranged
       depending on screen size.


       MOBILE

       xs: 12

       Each card uses the full row.

       Example:

       [ Recorded Cases ]

       [ Barangays ]

       [ Crime Types ]

       [ Reporting Period ]


       TABLET

       sm: 6

       Two cards can appear per row.

       Example:

       [ Recorded Cases ] [ Barangays ]

       [ Crime Types    ] [ Period    ]


       LARGE SCREEN

       lg: 3

       All four cards can appear in one row.

       Example:

       [ Cases ] [ Barangays ] [ Crimes ] [ Period ]


       This makes the dashboard responsive.
    ===================================================== */

    <Grid container spacing={2}>
      {/* ===================================================
          CREATE THE SUMMARY CARDS

          .map() goes through every object stored inside:

          summaryItems

          For each item, React creates one card.
      =================================================== */}

      {summaryItems.map((item) => {
        /* =================================================
           GET THE CORRECT ICON

           Every summary item contains an icon.

           Example:

           Recorded Cases
                ↓
           ShieldOutlined


           Barangays
                ↓
           LocationOnOutlined


           This line stores the selected icon as:

           Icon

           so we can later display it using:

           <Icon />
        ================================================= */

        const Icon = item.icon;

        return (
          <Grid
            key={item.label}
            size={{
              xs: 12,

              sm: 6,

              lg: 3,
            }}
          >
            {/* =============================================
                SUMMARY CARD

                One Card represents one important piece
                of information about the dataset.
            ============================================= */}

            <Card
              sx={{
                height: "100%",

                /* =========================================
                   HOVER ANIMATION

                   When the mouse moves over the card,
                   the card slightly moves upward.

                   This is only a visual interface effect.

                   It does not change the data.
                ========================================= */

                transition: "transform 180ms ease, box-shadow 180ms ease",

                "&:hover": {
                  transform: "translateY(-2px)",

                  boxShadow: "0 10px 30px rgba(15, 61, 86, 0.10)",
                },
              }}
            >
              {/* ===========================================
                  CARD CONTENT

                  Everything visible inside the card goes
                  inside CardContent.
              =========================================== */}

              <CardContent>
                {/* =========================================
                    CARD LAYOUT

                    The information appears on the left.

                    The icon appears on the right.

                    Example:

                    Recorded Cases       [Shield]

                    250

                    Total reported cases
                ========================================= */}

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "space-between",

                    alignItems: "flex-start",
                  }}
                >
                  {/* =======================================
                      TEXT INFORMATION
                  ======================================= */}

                  <Box>
                    {/* =====================================
                        LABEL

                        Example:

                        Recorded Cases

                        Barangays

                        Crime Types

                        Reporting Period
                    ===================================== */}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {item.label}
                    </Typography>

                    {/* =====================================
                        MAIN VALUE

                        This is the most important piece
                        of information in the card.

                        Examples:

                        250

                        14

                        12

                        2024–2026
                    ===================================== */}

                    <Typography
                      variant="h4"
                      sx={{
                        mt: 0.5,

                        fontWeight: 800,

                        color: "text.primary",
                      }}
                    >
                      {item.value}
                    </Typography>

                    {/* =====================================
                        HELPER TEXT

                        Gives a short explanation of what
                        the value means.

                        Examples:

                        "Total reported cases"

                        "Samal coverage"

                        "Recorded categories"

                        "Three-year dataset"
                    ===================================== */}

                    <Typography variant="caption" color="text.secondary">
                      {item.helper}
                    </Typography>
                  </Box>

                  {/* =======================================
                      ICON CONTAINER

                      Creates the small colored box on the
                      right side of the card.

                      The icon changes depending on which
                      summary card is being displayed.
                  ======================================= */}

                  <Box
                    sx={{
                      width: 44,

                      height: 44,

                      flexShrink: 0,

                      borderRadius: 2.5,

                      display: "grid",

                      placeItems: "center",

                      bgcolor: "rgba(20, 184, 166, 0.10)",

                      color: "secondary.dark",
                    }}
                  >
                    {/* =====================================
                        DISPLAY THE ICON

                        Because Icon was assigned earlier:

                        const Icon = item.icon;

                        this automatically displays the
                        correct icon for each card.
                    ===================================== */}

                    <Icon />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

/* =========================================================
   SIMPLE EXPLANATION FOR CRIMINOLOGY STUDENTS
   =========================================================


   WHAT IS SUMMARYCARDS?


   SummaryCards is the quick overview section of
   Bantay Samal.


   When a user opens the crime dashboard, they should
   immediately understand the basic scope of the dataset.


   Instead of requiring the user to study the map or
   charts first, SummaryCards answers four simple
   questions.


   =========================================================
   QUESTION 1:
   HOW MANY REPORTED CASES ARE IN THE DATASET?
   =========================================================


   ANSWER:

   250


   This means the Bantay Samal dataset contains a total
   of 250 reported cases across the complete reporting
   period.


   The reporting period is:


   2024

   +

   2025

   +

   2026


   =========================================================
   IMPORTANT:
   WHAT DOES 250 MEAN?
   =========================================================


   250 means:


   TOTAL REPORTED CASES

   across

   SAMAL, BATAAN

   during

   2024–2026


   It does NOT mean:


   250 cases every year


   It does NOT mean:


   250 cases in every barangay


   It does NOT mean:


   250 cases for every crime type


   It is the complete municipality-wide dataset total.


   =========================================================
   QUESTION 2:
   HOW MANY BARANGAYS ARE INCLUDED?
   =========================================================


   ANSWER:

   14


   Bantay Samal covers the 14 barangays represented in
   the project's geographic and crime datasets.


   The barangay information is important because the
   crime map allows users to compare the geographic
   distribution of recorded crime statistics.


   =========================================================
   QUESTION 3:
   HOW MANY CRIME TYPES ARE INCLUDED?
   =========================================================


   ANSWER:

   12


   The dataset contains 12 recorded crime types.


   Examples include offenses such as:


   Carnapping – Motorcycle


   Robbery


   Malicious Mischief


   Alarm and Scandal


   Reckless Imprudence offenses


   and the other crime types represented in crimes.json.


   IMPORTANT:


   "12 Crime Types"


   is different from:


   "12 Crime Cases"


   Crime type means the category or kind of offense.


   Crime case means an occurrence counted in the
   statistics.


   =========================================================
   QUESTION 4:
   WHAT IS THE REPORTING PERIOD?
   =========================================================


   ANSWER:

   2024–2026


   This means Bantay Samal examines crime statistics
   covering three calendar years:


   2024


   2025


   2026


   =========================================================
   WHY ARE SUMMARY CARDS USEFUL?
   =========================================================


   Imagine a criminology student opens Bantay Samal.


   Before analyzing anything, the student should first
   understand:


   HOW LARGE IS THE DATASET?


   WHERE DOES THE DATA APPLY?


   WHAT TYPES OF CRIME ARE INCLUDED?


   WHAT TIME PERIOD IS BEING STUDIED?


   SummaryCards answers those questions immediately.


   =========================================================
   WHAT SUMMARYCARDS DOES NOT DO
   =========================================================


   SummaryCards does NOT:


   calculate crime trends


   compare barangays


   calculate crime rates


   predict future crimes


   identify crime causes


   determine whether a barangay is safe


   determine whether a barangay is dangerous


   display exact crime locations


   Instead, it only summarizes the overall scope of the
   dataset.


   =========================================================
   STATIC VALUES
   =========================================================


   One important programming detail is that the values:


   250


   14


   12


   2024–2026


   are currently written directly inside this component.


   This is called:


   STATIC DATA


   or


   HARDCODED DATA


   Example:


   value: "250"


   The component is not currently calculating 250 from
   crimes.json.


   This is acceptable if the dataset is fixed.


   However, if the dataset changes in the future, these
   values would also need to be updated.


   For example:


   If total cases become:

   275


   but this file still contains:

   value: "250"


   then the card would still display 250.


   =========================================================
   HOW DOES THE CODE CREATE FOUR CARDS?
   =========================================================


   First, the information is stored inside:


   summaryItems


   It contains four objects.


   Then the program uses:


   summaryItems.map()


   Think of .map() as saying:


   "For every summary item, create one card."


   Therefore:


   Item 1
      ↓
   Recorded Cases card


   Item 2
      ↓
   Barangays card


   Item 3
      ↓
   Crime Types card


   Item 4
      ↓
   Reporting Period card


   =========================================================
   WHAT IS THE PURPOSE OF key={item.label}?
   =========================================================


   React creates several cards from the same .map()
   function.


   React needs a way to identify each card.


   Therefore:


   key={item.label}


   gives each card a unique identifier based on its
   label.


   Examples:


   "Recorded Cases"


   "Barangays"


   "Crime Types"


   "Reporting Period"


   =========================================================
   WHAT DOES RESPONSIVE DESIGN MEAN HERE?
   =========================================================


   Bantay Samal may be opened using different devices.


   For example:


   Smartphone


   Tablet


   Laptop


   Desktop computer


   The Grid changes the arrangement automatically.


   MOBILE


   One card per row:


   ┌───────────────────┐
   │ Recorded Cases    │
   │ 250               │
   └───────────────────┘

   ┌───────────────────┐
   │ Barangays         │
   │ 14                │
   └───────────────────┘

   ┌───────────────────┐
   │ Crime Types       │
   │ 12                │
   └───────────────────┘

   ┌───────────────────┐
   │ Reporting Period  │
   │ 2024–2026         │
   └───────────────────┘


   TABLET


   Two cards per row:


   ┌──────────────┐ ┌──────────────┐
   │ Cases        │ │ Barangays    │
   │ 250          │ │ 14           │
   └──────────────┘ └──────────────┘

   ┌──────────────┐ ┌──────────────┐
   │ Crime Types  │ │ Period       │
   │ 12           │ │ 2024–2026    │
   └──────────────┘ └──────────────┘


   LARGE SCREEN


   Four cards in one row:


   [ 250 ] [ 14 ] [ 12 ] [ 2024–2026 ]


   =========================================================
   WHAT DOES THE HOVER EFFECT DO?
   =========================================================


   When the user moves the mouse over a card:


   transform: "translateY(-2px)"


   moves the card slightly upward.


   The shadow also becomes stronger.


   This makes the interface feel interactive.


   IMPORTANT:


   This animation does not change the statistics.


   It is only a visual interface effect.


   =========================================================
   RELATIONSHIP WITH THE REST OF BANTAY SAMAL
   =========================================================


                  BANTAY SAMAL
                       │
                       ▼
                SUMMARY CARDS
                       │
        ┌──────────────┼───────────────┐
        ▼              ▼               ▼
      Cases        Barangays       Crime Types
      250             14               12
                       │
                       ▼
                  2024–2026


   SummaryCards provides the overview.


   Other components provide deeper analysis:


   FilterPanel

   → Controls what data the user wants to examine.


   SamalMap

   → Shows the geographic distribution.


   CrimeAnalytics

   → Shows statistical patterns and comparisons.


   AreaSummary

   → Summarizes the currently selected area.


   CrimeDetails

   → Explains an individual crime.


   DataMethodology

   → Explains how reported and estimated data are handled.


   =========================================================
   SIMPLE DEFENSE EXPLANATION
   =========================================================


   If your panel asks:


   "What is the purpose of SummaryCards?"


   You can answer:


   "The SummaryCards component provides a quick overview
   of the scope of the Bantay Samal dataset. It shows the
   total number of reported cases, the number of barangays
   covered, the number of crime types represented, and the
   reporting period. This allows users to understand the
   basic coverage of the dataset before proceeding to the
   detailed map and statistical analysis."


   =========================================================
   IF THEY ASK:
   "WHAT DOES THE 250 REPRESENT?"
   =========================================================


   You can answer:


   "The 250 represents the total reported cases contained
   in the dataset for the Municipality of Samal across the
   complete 2024 to 2026 reporting period."


   =========================================================
   IF THEY ASK:
   "DOES 14 MEAN 14 CRIME-AFFECTED BARANGAYS?"
   =========================================================


   You can answer:


   "The number 14 represents the barangay coverage of the
   dataset. It identifies how many barangays are included
   in the Bantay Samal geographic scope."


   =========================================================
   IF THEY ASK:
   "WHAT IS THE DIFFERENCE BETWEEN CRIME TYPE AND CASE?"
   =========================================================


   You can answer:


   "A crime type refers to the category or kind of offense,
   while a case refers to an occurrence counted in the
   crime statistics. Bantay Samal contains 12 crime types
   and a total of 250 reported cases in the dataset."


   =========================================================
   IF THEY ASK:
   "DO THESE CARDS CHANGE WHEN I USE THE FILTERS?"
   =========================================================


   You can answer:


   "No. These summary cards currently describe the overall
   scope of the complete dataset. They are not connected to
   the active filters. The values are currently defined
   directly in the SummaryCards component."


   =========================================================
   SIMPLE PROGRAM FLOW
   =========================================================


   START


     ↓


   Load SummaryCards


     ↓


   Read summaryItems


     ↓


   First item

   Recorded Cases = 250


     ↓


   Create card


     ↓


   Second item

   Barangays = 14


     ↓


   Create card


     ↓


   Third item

   Crime Types = 12


     ↓


   Create card


     ↓


   Fourth item

   Reporting Period = 2024–2026


     ↓


   Create card


     ↓


   Arrange cards using responsive Grid


     ↓


   Display overview on dashboard


   =========================================================
   FINAL SIMPLE EXPLANATION
   =========================================================


   SummaryCards is the overview section of Bantay Samal.


   It tells the user:


   HOW MANY CASES?

   → 250 reported cases


   HOW MANY BARANGAYS?

   → 14 barangays


   HOW MANY CRIME TYPES?

   → 12 crime types


   WHAT PERIOD?

   → 2024–2026


   In simple terms:


   SummaryCards does not analyze crime.


   It tells the user what the dataset contains before
   they begin analyzing the crime map, filters, charts,
   and other statistics.
========================================================= */
