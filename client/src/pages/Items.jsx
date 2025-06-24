import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { HiPlus } from "react-icons/hi";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const Items = () => {
  const [active, setActive] = useState("Sale Bill");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showUploadChoice, setShowUploadChoice] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

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
    fetchItems();
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

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.code.trim()) return;

    const method = editMode ? "PUT" : "POST";
    const url = editMode ? `http://localhost:5000/api/items/${editItemId}` : "http://localhost:5000/api/items";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newItem,
          price1: +newItem.price1,
          price2: +newItem.price2,
          price3: +newItem.price3,
          price4: +newItem.price4,
          stock: +newItem.stock
        })
      });

      if (response.ok) {
        const updatedItems = await response.json();
        setItems(updatedItems);
        showToast(`✅ Item ${editMode ? "updated" : "added"} successfully`);
        setShowModal(false);
        setEditMode(false);
        setEditItemId(null);
        setNewItem({ code: "", name: "", category: "Fruits", price1: "", price2: "", price3: "", price4: "", stock: "" });
        fetchItems();
      } else {
        showToast(`❌ Failed to ${editMode ? "update" : "add"} item`);
      }
    } catch (error) {
      console.error("Error submitting item:", error);
      showToast("❌ Error occurred while submitting item");
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
      const response = await fetch(`http://localhost:5000/api/items/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchItems();
        showToast("🗑️ Item deleted successfully");
      } else {
        showToast("❌ Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      showToast("❌ Error occurred while deleting item");
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) return;
    const formData = new FormData();
    formData.append("file", csvFile);
    try {
      const response = await fetch("http://localhost:5000/api/items/bulk", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        fetchItems();
        showToast("✅ Items uploaded successfully");
        setShowBulkUpload(false);
        setCsvFile(null);
      } else {
        showToast("❌ Failed to upload items");
      }
    } catch (error) {
      console.error("CSV Upload Error:", error);
      showToast("❌ Error occurred while uploading CSV");
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
                className={`px-6 py-2 rounded-md ${category === cat ? "bg-red-600" : "bg-black"} text-white hover:bg-red-600`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="max-w-sm mb-4">
            <input
              type="text"
              placeholder="🔍 Search by item name or code..."
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowUploadChoice(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            <HiPlus /> Add Item
          </button>

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
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 mr-2">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Upload Options Modal */}
          {showUploadChoice && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-sm relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setShowUploadChoice(false)}><FaTimes /></button>
                <h2 className="text-xl font-semibold text-center">Choose Upload Option</h2>
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => {
                    setShowUploadChoice(false);
                    setShowModal(true);
                  }}
                >
                  Single Upload
                </button>
                <button
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => {
                    setShowUploadChoice(false);
                    setShowBulkUpload(true);
                  }}
                >
                  Bulk Upload
                </button>
              </div>
            </div>
          )}

          {/* Single Upload Form Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => {
                  setShowModal(false);
                  setEditMode(false);
                  setEditItemId(null);
                }}><FaTimes /></button>
                <h2 className="text-xl font-semibold mb-4">{editMode ? "Edit Item" : "Add New Item"}</h2>
                <div className="grid grid-cols-1 gap-3">
                  {["code", "name", "price1", "price2", "price3", "price4", "stock"].map(field => (
                    <input
                      key={field}
                      type={field.includes('price') || field === 'stock' ? 'number' : 'text'}
                      placeholder={field}
                      value={newItem[field]}
                      onChange={e => setNewItem(prev => ({ ...prev, [field]: e.target.value }))}
                      className="border px-3 py-2 rounded"
                    />
                  ))}
                  <select
                    value={newItem.category}
                    onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                    className="border px-3 py-2 rounded"
                  >
                    {categoryList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => {
                      setShowModal(false);
                      setEditMode(false);
                      setEditItemId(null);
                    }}>Cancel</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddItem}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Upload Modal */}
          {showBulkUpload && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => {
                  setShowBulkUpload(false);
                  setCsvFile(null);
                }}><FaTimes /></button>
                <h2 className="text-xl font-semibold mb-4">Bulk Upload Items</h2>
                <a
                  href="/sample.csv"
                  download
                  className="text-blue-600 underline mb-4 inline-block"
                >
                  Download Sample CSV
                </a>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  className="mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                    onClick={() => {
                      setShowBulkUpload(false);
                      setCsvFile(null);
                    }}
                  >Cancel</button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    onClick={handleCSVUpload}
                  >Upload</button>
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
