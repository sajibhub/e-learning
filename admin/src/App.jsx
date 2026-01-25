import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MercentServiceLogin from "./page/loginPage";
import Dashboard from "./page/dashboard";
import NotFound from "./page/NotFound";
import Layout from "./Layout ";
import OrderPage from "./page/orderPage.jsx";
import MerchantSettlementPage from "./page/courses.jsx";
import ProductManagementPage from "./page/product.jsx";
import UsersPage from "./page/usersPage.jsx";
import SettingsPage from "./page/setting.jsx";
import ModuleManagementPage from "./page/modulePage.jsx";
import VideoManagementPage from "./page/videoPage.jsx";


// Router setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/users/:page/:limit", element: <UsersPage /> },
      { path: "/courses/:page/:limit", element: <MerchantSettlementPage /> },
      { path: "/products/:page/:limit", element: <ProductManagementPage /> },
      { path: "/modules/:page/:limit", element: <ModuleManagementPage /> },
      { path: "/videos/:page/:limit", element: <VideoManagementPage /> },
      { path: "/orders/:page/:limit", element: <OrderPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
  { path: "/login", element: <MercentServiceLogin /> },
  { path: "*", element: <NotFound /> },
]);

const App = () => {
  return (
    <div className="min-h-screen">
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;