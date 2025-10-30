import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import HomePage from "../pages/HomePage";
import PaymentSuccess from "../pages/PaymentSuccess";
import LoginPage from "../pages/LoginPage";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import PujaDetails from "../pages/PujaDetails";
import ForgotPassword from "../components/ForgotPassword";
import ProfilePage from "../pages/ProfilePage";
// import ProfileDetails from "../pages/ProfileDetails";
import MyBookings from "../pages/MyBookings";
import SuggestTemple from "../pages/SuggestTemple";
import EditProfile from "../pages/EditProfile";
import CartPage from "../pages/CartPage";
import PujaList from "../pages/PujaList";
import TermsAndConditions from "../pages/TermsAndConditions"; // ✅ correct path
import CancellationPolicy from "../pages/CancellationPolicy";
import RefundPolicy from "../pages/RefundPolicy";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import EventsPage from "../pages/EventsPage";
import EventDetails from "../pages/EventDetails";


// Components
import TempleDetails from "../components/TempleDetails";
import TempleList from "../components/TempleList";
import Prasadam from "../components/Prasadam";
import SubCategoryPage from "../pages/SubCategoryPage";
import SplpujaDetails from "../pages/SplpujaDetails";
// import PujaTemples from "../pages/PujaTemples";
import Chadhava from "../pages/Chadhava";
import ChadhavaDetails from "../pages/ChadhavaDetails";







const AllRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/puja/:id" element={<PujaDetails />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/puja" element={<PujaList />} />
      <Route path="/temples" element={<TempleList />} />
      <Route path="/temples/:id" element={<TempleDetails />} />
      <Route path="/prasadam" element={<Prasadam />} />
      {/* <Route path="/profile/details" element={<ProfileDetails />} /> */}
      <Route path="/bookings" element={<MyBookings />} />
      <Route path="/suggest-temple" element={<SuggestTemple />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
      <Route path="/CancellationPolicy" element={<CancellationPolicy/>} />
      <Route path="/RefundPolicy" element={<RefundPolicy/>} />
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/category/:categoryId" element={<SubCategoryPage />} />
      <Route path="/List/category/:categoryId/sub_category/:subCategoryId" element={<SplpujaDetails />} />
      <Route path="/splpujadetails/:category/:sub_category" element={<SplpujaDetails />} />
      <Route path="/splpujadetails" element={<SplpujaDetails />} />
      {/* <Route path="/puja-temples" element={<PujaTemples />} /> */}
      <Route path="/puja-details/:id" element={<PujaDetails />} />
      <Route path="/chadhava" element={<Chadhava />} />
      <Route path="/chadhava/:id" element={<ChadhavaDetails />} />
    
    </Routes>
  );
};

export default AllRouters;








