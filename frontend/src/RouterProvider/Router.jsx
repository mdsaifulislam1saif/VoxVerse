import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import Home from "../components/pages/Home";
import Converter from "../components/pages/Converter";
import History from "../components/pages/History";
import Profile from "../components/pages/Profile";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/converter",
        element: (
            <Converter />
        )
      },
      {
        path: "/history",
        element: (
            <History />
        )
      },
      {
        path: "/profile",
        element: (
            <Profile />
        )
      },
      {
        path: "/login",
        element: (
            <LoginForm />
        )
      },{
        path: "/register",
        element: (
            <RegisterForm />
        )
      }

    ]
  },
]);
export default router;