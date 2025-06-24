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
    const localData = JSON.parse(localStorage.getItem("items")) || [];
    setItems(localData);
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

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.code.trim()) return;

    let updatedItems = [...items];

    if (editMode) {
      updatedItems = updatedItems.map((item) =>
        item._id === editItemId ? { ...newItem, _id: editItemId } : item
      );
      showToast("✅ Item updated successfully");
    } else {
      const newId = Date.now().toString();
      updatedItems.push({ ...newItem, _id: newId });
      showToast("✅ Item added successfully");
    }

    localStorage.setItem("items", JSON.stringify(updatedItems));
    setItems(updatedItems);
    setShowModal(false);
    setEditMode(false);
    setEditItemId(null);
    setNewItem({ code: "", name: "", category: "Fruits", price1: "", price2: "", price3: "", price4: "", stock: "" });
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setEditItemId(item._id);
    setNewItem({ ...item });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const updated = items.filter(item => item._id !== id);
    localStorage.setItem("items", JSON.stringify(updated));
    setItems(updated);
    showToast("🗑️ Item deleted successfully");
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
            onClick={() => setShowModal(true)}
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
