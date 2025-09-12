import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@layouts/RootLayout';
import AuthLayout from '@layouts/AuthLayout';
import ProtectedRoute from '@components/common/ProtectedRoute';
import Home from '@pages/Home';
import Auth from '@pages/Auth';
import Converter from '@pages/Converter';
import History from '@pages/History';
import Profile from '@pages/Profile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/converter",
        element: (
          <ProtectedRoute>
            <Converter />
          </ProtectedRoute>
        )
      },
      {
        path: "/history",
        element: (
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        )
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/:mode?",
        element: <Auth />
      }
    ]
  }
]);

export default router;