import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

import {
  CalendarMonthOutlined,
  CategoryOutlined,
  LocationOnOutlined,
  ShieldOutlined,
} from "@mui/icons-material";

const summaryItems = [
  {
    label: "Recorded Cases",
    value: "250",
    helper: "Total reported cases",
    icon: ShieldOutlined,
  },
  {
    label: "Barangays",
    value: "14",
    helper: "Samal coverage",
    icon: LocationOnOutlined,
  },
  {
    label: "Crime Types",
    value: "12",
    helper: "Recorded categories",
    icon: CategoryOutlined,
  },
  {
    label: "Reporting Period",
    value: "2024–2026",
    helper: "Three-year dataset",
    icon: CalendarMonthOutlined,
  },
];

export default function SummaryCards() {
  return (
    <Grid container spacing={2}>
      {summaryItems.map((item) => {
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
            <Card
              sx={{
                height: "100%",

                transition: "transform 180ms ease, box-shadow 180ms ease",

                "&:hover": {
                  transform: "translateY(-2px)",

                  boxShadow: "0 10px 30px rgba(15, 61, 86, 0.10)",
                },
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {item.label}
                    </Typography>

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

                    <Typography variant="caption" color="text.secondary">
                      {item.helper}
                    </Typography>
                  </Box>

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
