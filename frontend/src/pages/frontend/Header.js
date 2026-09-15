import React from "react";
import BusLogo from "../../assets/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, LogOut } from "lucide-react";

export default function Header() {

  const token = localStorage.getItem("usertoken");
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("userdata");
    navigate("/login");
  };
  const getUserData = () => {
    try {
      const data = localStorage.getItem("userdata");

      if (!data || data === "undefined") {
        return {};
      }

      return JSON.parse(data);

    } catch (error) {

      return {};
    }

  };

  const user = getUserData();
  return (
    <div>

      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-slate-900/95 to-blue-950/95 backdrop-blur-xl border-b border-white/5">

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <Link to="/">
              <img
                src={BusLogo}
                alt="DriveBus Logo"
                className="h-20 w-auto object-contain"
              />
            </Link>

          </div>


          {/* Menu */}
          <ul className="hidden lg:flex items-center gap-8">

            {[
              { name: "Home", path: "/" },
              { name: "Search Bus", path: "/search-bus" },
              { name: "Routes", path: "/routeBus" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((item, index) => (

              <li key={index}>

                <Link
                  to={item.path}
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 font-medium relative group"
                >

                  {item.name}

                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>

                </Link>

              </li>

            ))}

          </ul>



          {/* Login/Register/Profile */}
          <div className="flex items-center gap-3">


            {!token ? (

              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all"
                >
                  Login
                </Link>


                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                >
                  Register
                </Link>

              </>


            ) : (

              <div className="relative group">


                <button className="flex items-center gap-2">

                  <img
                    src={
                      user?.image
                        ? `http://localhost:4000/uploads/${user.image}`
                        : `https://ui-avatars.com/api/?name=${user?.full_name || "User"}&background=ff6b00&color=fff`
                    }
                    alt="profile"
                    className="w-11 h-11 rounded-full border-2 border-orange-500 object-cover"
                  />

                </button>



                {/* Dropdown */}

                <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">


                  <div className="px-4 py-3 border-b">

                    <h3 className="font-semibold">
                      {user?.full_name || "User"}
                    </h3>

                    {/* <p className="text-sm text-gray-500">
                      {user?.email}
                    </p> */}

                  </div>



                  {/* Hide Profile button on profile page */}

                  {
                    location.pathname !== "/profile" && (

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-3 hover:bg-orange-50"
                      >

                        <User size={18} />
                        Profile

                      </Link>

                    )
                  }


                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 w-full"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>


                </div>


              </div>

            )}

          </div>


        </div>

      </nav>


    </div>
  );
}