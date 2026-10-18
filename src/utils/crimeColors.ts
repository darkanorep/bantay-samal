/* =========================================
   CRIME COLORS

   Shared by:
   - SamalMap
   - CrimeAnalytics
   - CrimeDetails
   - BarangayDetails
   - other crime UI components

   IMPORTANT:
   Every ID below matches crimes.json exactly.
========================================= */

export const DEFAULT_CRIME_COLOR = "#420ed3";

/* =========================================
   CRIME COLOR MAP
========================================= */

export const crimeColors: Record<string, string> = {
  /* -----------------------------------------
     ALL CRIMES
  ----------------------------------------- */

  all: DEFAULT_CRIME_COLOR,

  /* -----------------------------------------
     INDEX CRIMES
  ----------------------------------------- */

  "carnapping-motorcycle": "#7C3AED",

  robbery: "#e18419",

  /* -----------------------------------------
     NON-INDEX CRIMES
  ----------------------------------------- */

  "malicious-mischief": "#F97316",

  "other-forms-of-trespass": "#8b5cf6",

  "alarm-and-scandal": "#E11D48",

  "qualified-trespass-to-dwelling": "#9333EA",

  "resistance-disobedience-authority": "#DB2777",

  "falsification-private-individual": "#c543c3",

  /* -----------------------------------------
     RECKLESS IMPRUDENCE
  ----------------------------------------- */

  "reckless-imprudence-physical-injuries": "#2563EB",

  "reckless-imprudence-damage-property": "#0891B2",

  "reckless-imprudence-slight-physical-injuries": "#16A34A",

  "reckless-imprudence-multiple-physical-injuries": "#CA8A04",
};

/* =========================================
   GET CRIME COLOR

   Returns the assigned crime color.
   Unknown IDs safely fall back to the
   default Bantay Samal teal.
========================================= */

export function getCrimeColor(crimeId: string): string {
  return crimeColors[crimeId] ?? DEFAULT_CRIME_COLOR;
}
