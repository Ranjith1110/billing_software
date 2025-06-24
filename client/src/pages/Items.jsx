import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { HiPlus, HiUpload } from "react-icons/hi";

const Items = () => {
  const [active, setActive] = useState("Sale Bill");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUploadChoice, setShowUploadChoice] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const categoryList = ["Fruits", "Vegetables", "Others"];

  const [newItem, setNewItem] = useState({
    code: "",
    name: "",
    category: "Fruits",
    price1: "",
    price2: "",
    price3: "",
    price4: "",
    stock: "",
  });

  useEffect(() => {
    const filtered = items.filter((item) => {
      const matchCategory = category === "All" || item.category === category;
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
    setFilteredItems(filtered);
  }, [searchTerm, category, items]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAddItem = () => {
    if (newItem.name.trim() === "" || newItem.code.trim() === "") return;

    const itemObj = {
      ...newItem,
      price1: +newItem.price1,
      price2: +newItem.price2,
      price3: +newItem.price3,
      price4: +newItem.price4,
      stock: +newItem.stock,
    };

    if (isEditing) {
      const updatedItems = [...items];
      updatedItems[editingIndex] = itemObj;
      setItems(updatedItems);
      showToast("✅ Item updated successfully");
    } else {
      setItems([...items, itemObj]);
      showToast("✅ Item added successfully");
    }

    setNewItem({
      code: "",
      name: "",
      category: "Fruits",
      price1: "",
      price2: "",
      price3: "",
      price4: "",
      stock: "",
    });
    setShowModal(false);
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    setNewItem(items[index]);
    setIsEditing(true);
    setEditingIndex(index);
    setShowModal(true);
  };

  const confirmDelete = () => {
    const updated = [...items];
    updated.splice(deleteIndex, 1);
    setItems(updated);
    setShowDeleteModal(false);
    setDeleteIndex(null);
    showToast("🗑️ Item deleted successfully");
  };

  const handleBulkCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      const rows = csvText.trim().split("\n");
      rows.shift(); // Remove header
      const parsed = rows.map((row) => {
        const [code, name, category, price1, price2, price3, price4, stock] =
          row.split(",");
        return {
          code,
          name,
          category,
          price1: +price1,
          price2: +price2,
          price3: +price3,
          price4: +price4,
          stock: +stock,
        };
      });
      setItems((prev) => [...prev, ...parsed]);
      setShowBulkUploadModal(false);
      showToast("✅ Bulk items added successfully");
    };
    reader.readAsText(file);
  };

  const downloadSampleCSV = () => {
    const csvContent = `Item Code,Item Name,Category,Price 1,Price 2,Price 3,Price 4,Stock\nEX001,Example Item,Fruits,10,20,30,40,100`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bulk_upload_sample.csv";
    link.click();
  };

  return (
    <div className="h-screen flex bg-gray-100 relative">
      <Navbar />
      <Sidebar active={active} setActive={setActive} />

      <main className="flex-1 overflow-y-auto p-4">
        <div className="border-dashed border-2 border-gray-200 p-4 mt-18">
          <h2 className="text-2xl font-semibold mb-6">Item List</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {["All", ...categoryList].map((cat) => (
              <button
                key={cat}
                className={`px-6 py-2 rounded-md ${category === cat ? "bg-red-600" : "bg-black"
                  } text-white hover:bg-red-600`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-7 max-w-sm">
            <input
              type="text"
              placeholder="🔍 Search by item name or code..."
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md mt-8">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Code</th>
                    <th className="px-4 py-2 text-left">Item Name</th>
                    <th className="px-4 py-2 text-left">Price 1</th>
                    <th className="px-4 py-2 text-left">Price 2</th>
                    <th className="px-4 py-2 text-left">Price 3</th>
                    <th className="px-4 py-2 text-left">Price 4</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{item.code}</td>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">₹{item.price1}</td>
                        <td className="px-4 py-2">₹{item.price2}</td>
                        <td className="px-4 py-2">₹{item.price3}</td>
                        <td className="px-4 py-2">₹{item.price4}</td>
                        <td className="px-4 py-2">{item.stock}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteIndex(index);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-red-500 py-4">
                        ❌ No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowUploadChoice(true)}
                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-md hover:bg-red-600"
              >
                <HiPlus className="text-lg" />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Upload Choice Modal */}
        {showUploadChoice && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
              <h3 className="text-xl font-semibold mb-4">Choose Upload Type</h3>
              <div className="flex flex-col gap-4">
                <button
                  className="bg-black text-white py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    setShowUploadChoice(false);
                    setShowModal(true);
                  }}
                >
                  Single Upload
                </button>
                <button
                  className="bg-gray-700 text-white py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    setShowUploadChoice(false);
                    setShowBulkUploadModal(true);
                  }}
                >
                  Bulk Upload
                </button>
                <button
                  className="text-sm text-gray-500 mt-2 hover:underline"
                  onClick={() => setShowUploadChoice(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {showBulkUploadModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
              <h3 className="text-lg font-semibold mb-4">📤 Bulk Upload CSV</h3>
              <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
                onClick={downloadSampleCSV}
              >
                📥 Download Sample CSV
              </button>
              <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-red-600">
                <HiUpload />
                Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleBulkCSV}
                />
              </label>
              <button
                className="mt-4 block text-sm text-gray-500 hover:underline"
                onClick={() => setShowBulkUploadModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Single Upload Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">📝 Add New Item</h3>
              <div className="grid grid-cols-1 gap-4">
                {["code", "name", "price1", "price2", "price3", "price4", "stock"].map((field) => (
                  <input
                    key={field}
                    type={field.includes("price") || field === "stock" ? "number" : "text"}
                    placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                    value={newItem[field]}
                    onChange={(e) =>
                      setNewItem({ ...newItem, [field]: e.target.value })
                    }
                    className="border rounded px-4 py-2"
                  />
                ))}
                <select
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="border rounded px-4 py-2"
                >
                  {categoryList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-black text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleAddItem}
                >
                  {isEditing ? "Update Item" : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
              <h3 className="text-xl font-semibold mb-4 text-red-600">⚠️ Confirm Delete</h3>
              <p className="mb-6">Are you sure you want to delete this item?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteIndex(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 bg-green-700 text-white px-4 py-2 rounded shadow-lg z-50">
            {toastMessage}
          </div>
        )}
      </main>
    </div>
  );
};

export default Items;
