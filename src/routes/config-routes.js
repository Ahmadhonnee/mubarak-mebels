import { useRoutes } from "react-router-dom";
import { Invoices } from "../pages";

const routes = [
  {
    path: "/",
    element: <Invoices />,
  },
];

export const AuthRoutes = () => {
  return useRoutes(routes);
};
