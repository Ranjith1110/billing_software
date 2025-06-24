import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const SaleBill = () => {
  const [active, setActive] = useState("Sale Bill");

  return (
    <>
      <div className="h-screen flex bg-gray-100">
        <Navbar />
        <Sidebar active={active} setActive={setActive} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 transition-all duration-300">
          <div className="border-dashed border-2 border-gray-200 p-4 mt-18">
            <h2 className="text-2xl font-semibold mb-6">Sales Invoice</h2>

            {/* Input Rows */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium">Invoice No</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium">Date</label>
                <input type="date" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium">Time</label>
                <input type="time" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium">Salesman</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Select Salesman</option>
                  <option>John</option>
                  <option>Ravi</option>
                  <option>Ayesha</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Customer Ref</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium">Customer Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Mode</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="paymentMode" /> Cash
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="paymentMode" /> Card
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="paymentMode" /> UPI
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price Type</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="priceType" /> Retail
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="priceType" /> Wholesale
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">D.O No</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium opacity-0">D.O No</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>

            {/* Sales Table - Redesigned */}
            <div className="overflow-x-auto bg-white shadow rounded-lg mb-6">
              <table className="min-w-full table-auto text-sm text-gray-700">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Barcode / Item Name</th>
                    <th className="px-4 py-3 text-center font-semibold">Unit</th>
                    <th className="px-4 py-3 text-center font-semibold">Qty</th>
                    <th className="px-4 py-3 text-center font-semibold">FOC</th>
                    <th className="px-4 py-3 text-center font-semibold">Rate</th>
                    <th className="px-4 py-3 text-center font-semibold">Amount</th>
                    <th className="px-4 py-3 text-center font-semibold">SGST</th>
                    <th className="px-4 py-3 text-center font-semibold">CGST</th>
                    <th className="px-4 py-3 text-center font-semibold">IGST</th>
                    <th className="px-4 py-3 text-center font-semibold">+ Add</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2">
                      <input type="text" placeholder="Item name or barcode" className="w-full border border-gray-300 rounded px-2 py-1" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input type="text" className="w-16 border border-gray-300 rounded px-2 py-1 text-center" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input type="number" className="w-16 border border-gray-300 rounded px-2 py-1 text-center" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input type="number" className="w-16 border border-gray-300 rounded px-2 py-1 text-center" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input type="number" className="w-20 border border-gray-300 rounded px-2 py-1 text-center" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input type="number" className="w-24 border border-gray-300 rounded px-2 py-1 text-center" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input type="number" className="w-16 border border-gray-300 rounded px-2 py-1 text-center" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input type="number" className="w-16 border border-gray-300 rounded px-2 py-1 text-center" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input type="number" className="w-16 border border-gray-300 rounded px-2 py-1 text-center" />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">+ Add</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>


            {/* Totals - Redesigned */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
              <div className="bg-white shadow p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="text-sm text-gray-500 mb-1">Total Rupees</h4>
                <p className="text-xl font-semibold text-gray-800">₹0.00</p>
              </div>

              <div className="bg-white shadow p-4 rounded-lg border-l-4 border-yellow-500">
                <h4 className="text-sm text-gray-500 mb-1">Total GST</h4>
                <p className="text-xl font-semibold text-gray-800">₹0.00</p>
              </div>

              <div className="bg-white shadow p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="text-sm text-gray-500 mb-1">Net Total</h4>
                <p className="text-xl font-semibold text-gray-800">₹0.00</p>
              </div>

              <div className="bg-white shadow p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="text-sm text-gray-500 mb-1">Customer Balance</h4>
                <p className="text-xl font-semibold text-gray-800">₹0.00</p>
              </div>
            </div>


            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Save</button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Print</button>
              <button className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600">Clear</button>
              <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Exit</button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SaleBill;
