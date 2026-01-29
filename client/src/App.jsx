import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// In your App component


import { Navbar } from "./components/layout/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import ProfileUpdate from "./pages/dashboard/ProfileUpdate";
import MyCourses from "./pages/dashboard/MyCourses";
import MyProducts from "./pages/dashboard/MyProducts";
import Certificates from "./pages/dashboard/Certificates";
import Home from "./pages/Home";
import ShopPage from "./pages/ShopPage";
import ProductDetails from "./pages/ProductDetails";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Profile from "./pages/Profile"
import ContactUs from "./pages/ContactPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import CourseStructure from "./pages/course/CourseStructure";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<ContactUs />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome user={{ user: "A", email: "a" }} />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profileUpdate" element={<ProfileUpdate />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="course/:courseId" element={<CourseStructure />} />
            <Route path="products" element={<MyProducts />} />
            <Route path="certificates" element={<Certificates />} />
          </Route>
        </Route>

      </Routes>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
