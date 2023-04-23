import { Box, Grid } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import {
  Budget,
  TotalCustomers,
  TasksProgress,
  TotalProfit,
  Invoices,
  DashboardLayout,
} from "../../components";

export const InvoicesPage = () => {
  return (
    <DashboardLayout>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={2}>
            <Grid className="wrapper_item" item lg={6} sm={12} xl={16} xs={24}>
              <Budget />
            </Grid>
            <Grid className="wrapper_item" item lg={6} sm={12} xl={6} xs={24}>
              <TotalCustomers />
            </Grid>
            <Grid className="wrapper_item" item lg={6} sm={12} xl={6} xs={24}>
              <TasksProgress />
            </Grid>
            <Grid className="wrapper_item" item lg={6} sm={12} xl={6} xs={24}>
              <TotalProfit sx={{ height: "100%" }} />
            </Grid>
            <Grid className="wrapper_item" item lg={12} md={16} xl={13} xs={16}>
              <Invoices />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </DashboardLayout>
  );
};
