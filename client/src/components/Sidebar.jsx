import React, { useState } from "react";
import {
  HiMenuAlt3,
  HiX,
  HiHome,
  HiCash,
  HiCube,
  HiUsers,
  HiClock,
  HiDocumentText,
  HiCog,
  HiLogout,
} from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/vigilixHub-logo.png";

// Map menu items to routes
const menu = [
  { name: "Dashboard", icon: <HiHome />, path: "/dashboard" },
  { name: "Sale Bill", icon: <HiCash />, path: "/sale-bill" },
  { name: "Items", icon: <HiCube />, path: "/items" },
  { name: "Customers", icon: <HiUsers />, path: "/customers" },
  { name: "History", icon: <HiClock />, path: "/history" },
  { name: "Quotation", icon: <HiDocumentText />, path: "/quotation" },
  { name: "Settings", icon: <HiCog />, path: "/settings" },
  { name: "Logout", icon: <HiLogout />, path: "/" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Toggle Button - only on mobile */}
      <button
        className={`fixed top-4 left-4 z-50 text-3xl text-black lg:hidden ${open ? "hidden" : ""}`}
        onClick={() => setOpen(true)}
      >
        <HiMenuAlt3 />
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-300 z-50 shadow-lg transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:block
      `}
      >
        {/* Close button (mobile only) */}
        <div className="flex justify-between items-center p-5 lg:hidden">
          <img className="w-50 pt-10" src={logo} alt="logo" />
          <HiX
            className="text-2xl text-white rounded-xl cursor-pointer fixed top-4 right-4 bg-red-600"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Logo (desktop only) */}
        <div className="hidden lg:flex items-center font-bold text-xl text-blue-600">
          <img className="w-60 p-5" src={logo} alt="logo" />
        </div>

        {/* Menu */}
        <ul className="p-4 space-y-2">
          {menu.map((item) => (
            <li
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setOpen(false); // Close menu on mobile
              }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                location.pathname === item.path
                  ? "bg-red-600 text-white font-semibold"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
