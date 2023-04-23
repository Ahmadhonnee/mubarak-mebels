import { configureStore } from "@reduxjs/toolkit";
import { invoicesReducer } from "./invoices";
import { userReducer } from "./user";

export const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
    user: userReducer,
  },
});
