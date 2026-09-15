import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


import Home from "./pages/frontend/Home";
import About from "./pages/frontend/About";
import Contact from "./pages/frontend/Contact";
import Register from "./pages/frontend/Register";
import Login from "./pages/frontend/Login";
import RouteBus from "./pages/frontend/RouteBus";
import Search from "./pages/frontend/Search";
import ViewBusesList from "./pages/frontend/ViewBuses";
import SeatDetails from "./pages/frontend/SeatDetails";
import Payment from "./pages/frontend/Payment";
import Profile from "./pages/frontend/Profile";
import Forget from "./pages/frontend/Forget";
import VerifyOtp from "./pages/frontend/Verify";
import EditProfile from "./pages/frontend/EditProfile";
import ResetPassword from "./pages/frontend/ResetPassword";
import Ticket from "./pages/frontend/Ticket";


import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./Components/Layout";

import Dashboard from "./pages/admin/dashboard/Dashboard";

import Buses from "./pages/admin/buses/Index";
import BusAdd from "./pages/admin/buses/Add";
import BusEdit from "./pages/admin/buses/Edit";

import Bustypes from "./pages/admin/busType/Index";
import BustypeAdd from "./pages/admin/busType/Add";
import BustypeEdit from "./pages/admin/busType/Edit";

import Seats from "./pages/admin/Seat/Index";
import SeatAdd from "./pages/admin/Seat/Add";
import SeatEdit from "./pages/admin/Seat/Edit";

import BusRoutes from "./pages/admin/busRoute/Index";
import BusRouteAdd from "./pages/admin/busRoute/Add";
import BusRouteEdit from "./pages/admin/busRoute/Edit";

import Schedules from "./pages/admin/schedule/Index";
import ScheduleAdd from "./pages/admin/schedule/Add";
import ScheduleEdit from "./pages/admin/schedule/Edit";

import Staff from "./pages/admin/staff/Index";
import StaffAdd from "./pages/admin/staff/Add";
import StaffEdit from "./pages/admin/staff/Edit";

import Faqs from "./pages/admin/faq/Index";
import FaqAdd from "./pages/admin/faq/Add";
import FaqEdit from "./pages/admin/faq/Edit";

import Offers from "./pages/admin/offer/Index";
import OfferAdd from "./pages/admin/offer/Add";
import OfferEdit from "./pages/admin/offer/Edit";

import User from "./pages/admin/users/Index";

import Subscription from "./pages/admin/subscription/Index";
import ContactForm from "./pages/admin/Contact/Index";


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ================= FRONTEND ================= */}

        <Route path="/">

          <Route
            index
            element={<Home />}
          />

          <Route
            path="login"
            element={<Login />}
          />

          <Route
            path="register"
            element={<Register />}
          />

          <Route
            path="routeBus"
            element={<RouteBus />}
          />

          <Route
            path="about"
            element={<About />}
          />

          <Route
            path="contact"
            element={<Contact />}
          />

          {/* SEARCH */}

          <Route
            path="search-bus"
            element={<Search />}
          />

          {/* VIEW BUSES */}

          <Route
            path="view-buses/:id"
            element={<ViewBusesList />}
          />

          {/* VIEW SEATS */}

          <Route
            path="view-seat/:id"
            element={<SeatDetails />}
          />

          <Route
            path="payment"
            element={<Payment />}
          />

          <Route
            path="profile"
            element={<Profile />}
          />

          <Route
            path="forgot-password"
            element={<Forget />}
          />

          <Route
            path="verify-otp"
            element={<VerifyOtp />}
          />

          <Route
            path="edit-profile"
            element={<EditProfile />}
          />

          <Route
            path="reset-password"
            element={<ResetPassword />}
          />

          <Route
            path="ticket"
            element={<Ticket />}
          />

        </Route>


        {/* ================= ADMIN ================= */}

        <Route path="/admin">

          <Route
            index
            element={<AdminLogin />}
          />


          <Route element={<AdminLayout />}>

            <Route
              path="dashboard"
              element={<Dashboard />}
            />


            {/* BUS */}

            <Route
              path="bus"
              element={<Buses />}
            />

            <Route
              path="bus/add"
              element={<BusAdd />}
            />

            <Route
              path="bus/edit/:id"
              element={<BusEdit />}
            />


            {/* BUS TYPE */}

            <Route
              path="bustype"
              element={<Bustypes />}
            />

            <Route
              path="bustype/add"
              element={<BustypeAdd />}
            />

            <Route
              path="bustype/edit/:id"
              element={<BustypeEdit />}
            />


            {/* BUS ROUTE */}

            <Route
              path="bus-route"
              element={<BusRoutes />}
            />

            <Route
              path="bus-route/add"
              element={<BusRouteAdd />}
            />

            <Route
              path="bus-route/edit/:id"
              element={<BusRouteEdit />}
            />


            {/* SCHEDULE */}

            <Route
              path="schedule"
              element={<Schedules />}
            />

            <Route
              path="schedule/add"
              element={<ScheduleAdd />}
            />

            <Route
              path="schedule/edit/:id"
              element={<ScheduleEdit />}
            />


            {/* STAFF */}

            <Route
              path="staff"
              element={<Staff />}
            />

            <Route
              path="staff/add"
              element={<StaffAdd />}
            />

            <Route
              path="staff/edit/:id"
              element={<StaffEdit />}
            />


            {/* SEAT */}

            <Route
              path="seat"
              element={<Seats />}
            />

            <Route
              path="seat/add"
              element={<SeatAdd />}
            />

            <Route
              path="seat/edit/:id"
              element={<SeatEdit />}
            />


            {/* FAQ */}

            <Route
              path="faq"
              element={<Faqs />}
            />

            <Route
              path="faq/add"
              element={<FaqAdd />}
            />

            <Route
              path="faq/edit/:id"
              element={<FaqEdit />}
            />


            {/* OFFER */}

            <Route
              path="offer"
              element={<Offers />}
            />

            <Route
              path="offer/add"
              element={<OfferAdd />}
            />

            <Route
              path="offer/edit/:id"
              element={<OfferEdit />}
            />


            {/* USER */}

            <Route
              path="user"
              element={<User />}
            />


            {/* SUBSCRIPTION */}

            <Route
              path="subscription"
              element={<Subscription />}
            />


            {/* CONTACT */}

            <Route
              path="contact"
              element={<ContactForm />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>

  );
}

export default App;