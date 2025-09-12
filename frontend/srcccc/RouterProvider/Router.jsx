import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import ConversionPage from "../pages/ConversionPage";
// import HomePage from "../pages/HomePage";
// import LoginPage from "../pages/LoginPage"; 
// import RegisterPage from "../pages/RegisterPage"; 
// import ConversionsPage from "../pages/ConversionsPage";
// import ConversionForm from "../components/Conversion/ConversionForm";
// import SummerizeFrom from "../components/Conversion/SummerizeFrom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // {
      //   path: "/",
      //   element: <HomePage />,
      // },
      {
        path: "/",
        element: <ConversionPage />,
      },
      // {
      //   path: "/",
      //   element: < SummerizeFrom/>,
      // },
      // {
      //   path: "/conversions",
      //   element: <ConversionsPage />,
      // },
      // {
      //   path: "/login",
      //   element: <LoginPage />,
      // },
      // {
      //   path: "/register",
      //   element: <RegisterPage />,
      // },
    ],
  },
]);
export default router;