import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { HiPlus } from "react-icons/hi";
import { FaEdit, FaTrash, FaTimes, FaFolderPlus } from "react-icons/fa";
import axios from "axios";

const Items = () => {
  const [active, setActive] = useState("Sale Bill");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState("All");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUploadChoice, setShowUploadChoice] = useState(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "Fruits",
    price1: "",
    price2: "",
    price3: "",
    price4: "",
    stock: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch items", err);
      }
    };
    fetchItems();
  }, [token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategoryList(res.data.map(cat => cat.name));
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

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

  const handleAddOrUpdate = async () => {
    if (!newItem.name.trim()) return;

    try {
      if (editMode) {
        const res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/items/${editItemId}`,
          newItem,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setItems((prev) =>
          prev.map((i) => (i._id === editItemId ? res.data : i))
        );
        showToast("✅ Item updated successfully");
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/items`,
          newItem,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // newest first
        setItems((prev) => [res.data, ...prev]);
        showToast("✅ Item added successfully");
      }
      setShowModal(false);
      setEditMode(false);
      setEditItemId(null);
      setNewItem({ name: "", category: categoryList[0], price1: "", price2: "", price3: "", price4: "", stock: "" });
    } catch (error) {
      console.error("Error saving item", error);
      showToast("❌ Failed to save item");
    }
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setEditItemId(item._id);
    setNewItem({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((i) => i._id !== id));
      showToast("🗑️ Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item", error);
      showToast("❌ Failed to delete item");
    }
  };

  const performBulkUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/items/bulk`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // newest first
      setItems((prev) => [...res.data.items, ...prev]);
      showToast("📦 Items uploaded successfully");
    } catch (error) {
      console.error("Bulk upload failed", error.response?.data || error.message);
      showToast("❌ Bulk upload failed");
    }
  };

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowUploadChoice(false);
      setShowUploadConfirm(true);
    }
  };

  const confirmUpload = () => {
    if (selectedFile) performBulkUpload(selectedFile);
    setShowUploadConfirm(false);
    setSelectedFile(null);
  };

  const cancelUpload = () => {
    setShowUploadConfirm(false);
    setSelectedFile(null);
  };

  const addNewCategory = async () => {
    if (newCategoryName.trim() && !categoryList.includes(newCategoryName.trim())) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/categories`,
          { name: newCategoryName.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategoryList(prev => [...prev, res.data.name]);
        setNewCategoryName("");
        setShowCategoryModal(false);
        showToast("✅ Category added");
      } catch (error) {
        console.error("Error adding category", error);
        showToast("❌ Failed to add category");
      }
    }
  };

  return (
    <div className="h-screen flex bg-gray-100 relative">
      <Navbar />
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="border-dashed border-2 border-gray-200 p-4 mt-18">
          <h1 className="text-2xl font-bold mb-4">Item List</h1>

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

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="🔍 Search by item name or code..."
              className="w-full max-w-sm border border-gray-300 rounded-md px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              <FaFolderPlus /> Add Category
            </button>
            <button
              onClick={() => setShowUploadChoice(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <HiPlus /> Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Code</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Price1</th>
                  <th className="border px-4 py-2">Stock</th>
                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{item.code}</td>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{item.category}</td>
                    <td className="border px-4 py-2">₹{item.price1}</td>
                    <td className="border px-4 py-2">{item.stock}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {confirmDeleteId && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center relative">
                <h3 className="text-lg font-semibold mb-4">
                  Are you sure you want to delete this item?
                </h3>
                <div className="flex justify-center gap-4">
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => {
                      handleDelete(confirmDeleteId);
                      setConfirmDeleteId(null);
                    }}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showUploadChoice && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-sm relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  onClick={() => setShowUploadChoice(false)}
                >
                  <FaTimes />
                </button>
                <h2 className="text-xl font-semibold mb-6">Add Items</h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      setShowUploadChoice(false);
                      setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add Manually
                  </button>
                  <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center">
                    Bulk Upload via Excel
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      hidden
                      onChange={handleFileSelection}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {showUploadConfirm && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  onClick={cancelUpload}
                >
                  <FaTimes />
                </button>
                <h3 className="text-lg font-semibold mb-4">
                  Confirm upload of file "{selectedFile?.name}"?
                </h3>
                <div className="flex justify-center gap-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={confirmUpload}
                  >
                    Yes, Upload
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={cancelUpload}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  onClick={() => {
                    setShowModal(false);
                    setEditMode(false);
                    setEditItemId(null);
                  }}
                >
                  <FaTimes />
                </button>
                <h2 className="text-xl font-semibold mb-4">
                  {editMode ? "Edit Item" : "Add New Item"}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {["name", "price1", "price2", "price3", "price4", "stock"].map((field) => (
                    <input
                      key={field}
                      type={field.includes("price") || field === "stock" ? "number" : "text"}
                      placeholder={field}
                      value={newItem[field]}
                      onChange={(e) =>
                        setNewItem((prev) => ({ ...prev, [field]: e.target.value }))
                      }
                      className="border px-3 py-2 rounded"
                    />
                  ))}
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="border px-3 py-2 rounded"
                  >
                    {categoryList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded"
                      onClick={() => {
                        setShowModal(false);
                        setEditMode(false);
                        setEditItemId(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                      onClick={handleAddOrUpdate}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showCategoryModal && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-sm relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  onClick={() => setShowCategoryModal(false)}
                >
                  <FaTimes />
                </button>
                <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full border px-3 py-2 rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                    onClick={addNewCategory}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {toastMessage && (
            <div className="fixed bottom-4 right-4 bg-green-700 text-white px-4 py-2 rounded shadow-lg z-50">
              {toastMessage}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Items;