import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { HiPlus } from "react-icons/hi";

const Items = () => {
  const [active, setActive] = useState("Sale Bill");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const [newItem, setNewItem] = useState({
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
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
    setFilteredItems(filtered);
  }, [searchTerm, category, items]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAddItem = () => {
    if (newItem.name.trim() === "") return;

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

    setNewItem({ name: "", category: "Fruits", price1: "", price2: "", price3: "", price4: "", stock: "" });
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

  return (
    <div className="h-screen flex bg-gray-100 relative">
      <Navbar />
      <Sidebar active={active} setActive={setActive} />

      <main className="flex-1 overflow-y-auto p-4">
        <div className="border-dashed border-2 border-gray-200 p-4">
          <h2 className="text-2xl font-semibold mb-6">Item List</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {["All", "Fruits", "Vegetables", "Others"].map((cat) => (
              <button
                key={cat}
                className={`px-6 py-2 rounded-md ${category === cat ? "bg-red-600" : "bg-black"} text-white hover:bg-red-600`}
                onClick={() => setCategory(cat)}
              >
                {cat === "All" ? "All" : cat === "Fruits" ? "Category 1" : cat === "Vegetables" ? "Category 2" : "Category 3"}
              </button>
            ))}
          </div>

          <div className="mt-7 max-w-sm">
            <input
              type="text"
              placeholder="🔍 Search items..."
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
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">₹{item.price1}</td>
                        <td className="px-4 py-2">₹{item.price2}</td>
                        <td className="px-4 py-2">₹{item.price3}</td>
                        <td className="px-4 py-2">₹{item.price4}</td>
                        <td className="px-4 py-2">{item.stock}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button onClick={() => handleEdit(index)} className="text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => {
                            setDeleteIndex(index);
                            setShowDeleteModal(true);
                          }} className="text-red-600 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-red-500 py-4">❌ No Data Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-md hover:bg-red-600"
                onClick={() => setShowModal(true)}
              >
                <HiPlus className="text-lg" />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">{isEditing ? "Edit Item" : "Add New Item"}</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Item Name" className="w-full p-2 border rounded" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                <select className="w-full p-2 border rounded" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Others">Others</option>
                </select>
                <input type="number" placeholder="Price 1" className="w-full p-2 border rounded" value={newItem.price1} onChange={(e) => setNewItem({ ...newItem, price1: e.target.value })} />
                <input type="number" placeholder="Price 2" className="w-full p-2 border rounded" value={newItem.price2} onChange={(e) => setNewItem({ ...newItem, price2: e.target.value })} />
                <input type="number" placeholder="Price 3" className="w-full p-2 border rounded" value={newItem.price3} onChange={(e) => setNewItem({ ...newItem, price3: e.target.value })} />
                <input type="number" placeholder="Price 4" className="w-full p-2 border rounded" value={newItem.price4} onChange={(e) => setNewItem({ ...newItem, price4: e.target.value })} />
                <input type="number" placeholder="Stock" className="w-full p-2 border rounded" value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                  setNewItem({ name: "", category: "Fruits", price1: "", price2: "", price3: "", price4: "", stock: "" });
                }}>Cancel</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleAddItem}>{isEditing ? "Update Item" : "Add Item"}</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
              <h2 className="text-lg font-bold mb-4 text-center text-red-600">Confirm Deletion</h2>
              <p className="text-center text-gray-700 mb-6">Are you sure you want to delete this item?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
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
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 bg-green-700 text-white px-4 py-2 rounded shadow-lg z-50 animate-slide-in">
            {toastMessage}
          </div>
        )}
      </main>
    </div>
  );
};

export default Items;
