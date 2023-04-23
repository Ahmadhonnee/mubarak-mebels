import { createSlice } from "@reduxjs/toolkit";

export const { actions: invoicesActions, reducer: invoicesReducer } =
  createSlice({
    name: "invoices",
    initialState: {
      invoicesList: null,
    },
    reducers: {
      setInvoices: (state, { payload }) => {
        state.invoicesList = payload;
      },
    },
  });
