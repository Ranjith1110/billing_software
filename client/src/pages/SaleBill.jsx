import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

const SaleBill = () => {
  const [active, setActive] = useState("Sale Bill");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [items, setItems] = useState([{ item: "", qty: 0, amount: 0, sgst: 0, cgst: 0 }]);
  const [form, setForm] = useState({
    date: "",
    time: "",
    salesman: "",
    customerRef: "",
    customerName: "",
    paymentMode: "",
    priceType: ""
  });
  const [totals, setTotals] = useState({ totalAmount: 0, totalGST: 0 });
  const [showNextBillBtn, setShowNextBillBtn] = useState(false);
  const [allItems, setAllItems] = useState([]);

  const fetchNextInvoice = async () => {
    const res = await axios.get("/api/sales/latest", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setInvoiceNo(res.data.nextInvoice);
  };

  const fetchItems = async () => {
    const res = await axios.get("/api/items", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setAllItems(res.data);
  };

  useEffect(() => {
    fetchNextInvoice();
    fetchItems();

    const today = new Date().toISOString().split("T")[0];
    setForm(prev => ({ ...prev, date: today }));
  }, []);

  useEffect(() => {
    const amountSum = items.reduce((sum, i) => sum + Number(i.amount), 0);
    const gstSum = items.reduce((sum, i) => Number(sum) + Number(i.sgst || 0) + Number(i.cgst || 0), 0);
    setTotals({ totalAmount: amountSum, totalGST: gstSum });
  }, [items]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "item") {
      const matched = allItems.find(i => i.name === value);
      if (matched) {
        const priceField = form.priceType.toLowerCase();
        const price = matched[priceField] || matched.price1 || 0;
        updated[index].amount = price * (updated[index].qty || 1);
      }
    }

    if (field === "qty") {
      const matched = allItems.find(i => i.name === updated[index].item);
      if (matched) {
        const priceField = form.priceType.toLowerCase();
        const price = matched[priceField] || matched.price1 || 0;
        updated[index].amount = price * value;
      }
    }

    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { item: "", qty: 0, amount: 0, sgst: 0, cgst: 0 }]);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "/api/sales",
        {
          invoiceNo,
          ...form,
          items,
          totalAmount: totals.totalAmount,
          totalGST: totals.totalGST
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      alert("Saved Successfully");
      setShowNextBillBtn(true);
    } catch (error) {
      alert("Error saving bill");
    }
  };

  const handleNextBill = async () => {
    setForm({
      date: new Date().toISOString().split("T")[0],
      time: "",
      salesman: "",
      customerRef: "",
      customerName: "",
      paymentMode: "",
      priceType: ""
    });
    setItems([{ item: "", qty: 0, amount: 0, sgst: 0, cgst: 0 }]);
    setShowNextBillBtn(false);
    await fetchNextInvoice();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <Sidebar active={active} setActive={setActive} />

      <main className="flex-1 overflow-y-auto p-6 mt-15">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sales Invoice</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <input type="text" value={invoiceNo} disabled className="input" />
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input" />
            <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="input" />
            <select value={form.salesman} onChange={e => setForm({ ...form, salesman: e.target.value })} className="input">
              <option>Select Salesman</option>
              <option>John</option>
              <option>Ravi</option>
              <option>Ayesha</option>
            </select>
            <input type="text" placeholder="Customer Ref" value={form.customerRef} onChange={e => setForm({ ...form, customerRef: e.target.value })} className="input" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <input type="text" placeholder="Customer Name" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} className="input col-span-2" />
            <div className="flex items-center gap-4">
              {["Cash", "Card", "UPI"].map(mode => (
                <label className="flex items-center gap-1 text-gray-600" key={mode}>
                  <input type="radio" name="paymentMode" value={mode} checked={form.paymentMode === mode} onChange={e => setForm({ ...form, paymentMode: e.target.value })} />
                  {mode}
                </label>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map(p => (
                <label className="flex items-center gap-1 text-gray-600" key={p}>
                  <input type="radio" name="priceType" value={`Price${p}`} checked={form.priceType === `Price${p}`} onChange={e => setForm({ ...form, priceType: e.target.value })} />
                  Price{p}
                </label>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-left">Qty</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">SGST</th>
                  <th className="px-4 py-2 text-left">CGST</th>
                  <th className="px-4 py-2 text-center">+ Add</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td>
                      <input
                        type="text"
                        list="itemList"
                        className="table-input"
                        value={item.item}
                        onChange={e => handleItemChange(i, "item", e.target.value)}
                      />
                      <datalist id="itemList">
                        {allItems.map(it => <option key={it._id} value={it.name} />)}
                      </datalist>
                    </td>
                    <td><input type="number" className="table-input" value={item.qty} onChange={e => handleItemChange(i, "qty", e.target.value)} /></td>
                    <td><input type="number" className="table-input" value={item.amount} onChange={e => handleItemChange(i, "amount", e.target.value)} /></td>
                    <td><input type="number" className="table-input" value={item.sgst} onChange={e => handleItemChange(i, "sgst", e.target.value)} /></td>
                    <td><input type="number" className="table-input" value={item.cgst} onChange={e => handleItemChange(i, "cgst", e.target.value)} /></td>
                    <td className="text-center">
                      <button onClick={addRow} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">+</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 font-semibold">Total: ₹{totals.totalAmount.toFixed(2)}</div>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 font-semibold">GST: ₹{totals.totalGST.toFixed(2)}</div>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 font-semibold">Net: ₹{(totals.totalAmount + totals.totalGST).toFixed(2)}</div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Save</button>
            {showNextBillBtn && (
              <button onClick={handleNextBill} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Next Bill</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SaleBill;