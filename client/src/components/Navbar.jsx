import React, { useEffect, useState } from "react";
import { HiSearch, HiBell, HiChevronDown } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify"; // Optional for logout message

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.name) {
      setUserName(userData.name);
    }
  }, []);

  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);
  const handleFocus = () => setShowDropdown(true);
  const handleBlur = () => setShowDropdown(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully"); // optional toast
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] bg-white shadow z-40 h-16 px-6 flex items-center">
      {/* Left: Title */}
      <div className="text-2xl font-bold text-black hidden lg:block md:block md:ml-8 lg:ml-0">
        Welcome Back!
      </div>
      <div className="flex-1"></div>
      {/* Right: Icons + Profile */}
      <div className="flex items-center gap-4">
        {/* <button className="text-gray-600 text-xl hover:text-blue-600">
          <HiSearch />
        </button>
        <div className="relative">
          <HiBell className="text-gray-600 text-xl hover:text-blue-600" />
          <span className="absolute -top-1 -right-1 inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </div> */}
        <div
          className="relative flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          tabIndex={0}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
          <span className="hidden sm:block font-medium text-sm text-gray-700">
            {userName}
          </span>
          <HiChevronDown className="text-gray-600 text-lg mt-1" />
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-12 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
              <ul className="py-2 text-gray-700 text-sm">
                <li>
                  <a
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
