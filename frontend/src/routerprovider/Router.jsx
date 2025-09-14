import { createBrowserRouter } from "react-router-dom";
import Root from "../root/Root";
import Home from "../components/pages/Home";
import Converter from "../components/pages/Converter";
import History from "../components/pages/History";
import Profile from "../components/pages/Profile";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { ROUTES } from "../config/config";

// Define the application's routing structure using React Router v6
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,    // Base path for the app
    element: <Root />,     // Root layout with Header/Footer wrapping child routes
    children: [
      {
        path: ROUTES.HOME, // Home page route
        element: <Home />  // Renders Home component
      },
      {
        path: ROUTES.CONVERTER, // Converter page route
        element: <Converter />   // Renders Converter component
      },
      {
        path: ROUTES.HISTORY,   // History page route
        element: <History />     // Renders History component
      },
      {
        path: ROUTES.PROFILE,   // Profile page route
        element: <Profile />     // Renders Profile component
      },
      {
        path: ROUTES.LOGIN,     // Login page route
        element: <LoginForm />  // Renders Login form component
      },
      {
        path: ROUTES.REGISTER,  // Register page route
        element: <RegisterForm /> // Renders Register form component
      }
    ]
  },
]);
// Export the configured router for use in the main app
export default router;
