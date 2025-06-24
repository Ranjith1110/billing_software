import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaFilter } from 'react-icons/fa';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, Legend
} from 'recharts';


const App = () => {
  const [active, setActive] = useState("Dashboard");

  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 7000 },
    { name: 'May', revenue: 6000 },
  ];

  const salesData = [
    { name: 'Electronics', value: 400 },
    { name: 'Fashion', value: 300 },
    { name: 'Grocery', value: 300 },
    { name: 'Books', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <>
      <div className="h-screen flex bg-gray-100">
        <Navbar />
        <Sidebar active={active} setActive={setActive} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 transition-all duration-300">
          <div className="border-dashed border-2 border-gray-200 p-4 mt-18">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label htmlFor="from-date" className="block text-sm font-medium text-gray-700">
                  From Date
                </label>
                <input
                  type="date"
                  id="from-date"
                  className="mt-1 block lg:w-58 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 p-3"
                />
              </div>
              <div>
                <label htmlFor="to-date" className="block text-sm font-medium text-gray-700">
                  To Date
                </label>
                <input
                  type="date"
                  id="to-date"
                  className="mt-1 block lg:w-58 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 p-3"
                />
              </div>
              <div className="lg:mt-7">
                <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-red-600 transition flex items-center gap-1">
                  <FaFilter />
                  Filter
                </button>
              </div>
            </div>

            {/* Cards Section */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-green-100 rounded-lg shadow-md p-5">
                <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
                <h2 className="text-5xl font-semibold mb-2">999</h2>
                <div className="">
                  <span className="text-green-800 me-5">+18%</span>
                  <span>+4k this week</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-red-100 rounded-lg shadow-md p-5">
                <h3 className="text-lg font-semibold mb-2">Profit</h3>
                <h2 className="text-5xl font-semibold mb-2">1.234</h2>
                <div className="">
                  <span className="text-green-800 me-5">+18%</span>
                  <span>+4k this week</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-green-100 rounded-lg shadow-md p-5">
                <h3 className="text-lg font-semibold mb-2">Loss</h3>
                <h2 className="text-5xl font-semibold mb-2">567</h2>
                <div className="">
                  <span className="text-green-800 me-5">+18%</span>
                  <span>+4k this week</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-red-100 rounded-lg shadow-md p-5">
                <h3 className="text-lg font-semibold mb-2">Out Standing</h3>
                <h2 className="text-5xl font-semibold mb-2">766</h2>
                <div className="">
                  <span className="text-red-600 me-5">+18%</span>
                  <span>+4k this week</span>
                </div>
              </div>

            </div>

            {/* Revenue and Sales Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

              <div className="bg-white p-5 rounded-lg shadow-md">
                {/* Header with Title Link and Dropdown */}
                <div className="flex justify-between items-center mb-4">
                  {/* Title with link */}
                  <h2 className="text-lg font-semibold text-gray-800">
                    <a href="#trading-graph" className="text-blue-600 hover:underline">
                      📈 Revenue Status (View Trading Graph)
                    </a>
                  </h2>

                  {/* Dropdown */}
                  <select
                    className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="2025"
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>

                {/* Line Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>


              {/* Sales by Category (Pie Chart) */}
              <div className="bg-white p-5 rounded-lg shadow-md">

                <div className="flex justify-between items-center mb-4">
                  {/* Left: Title with link */}
                  <h2 className="text-lg font-semibold text-gray-800">
                    <a href="#trading-graph" className="text-blue-600 hover:underline">
                      📈 Sales by Category
                    </a>
                  </h2>

                  {/* Right: Dropdown */}
                  <select
                    className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    defaultValue="2025"
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                      dataKey="value"
                    >
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>


        </main>

      </div>
    </>
  );
}

export default App;
