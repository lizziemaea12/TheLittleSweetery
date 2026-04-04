"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
};

export function InventoryTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleUpdate(id: string) {
    setSaving(true);
    try {
      const response = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stockQuantity: parseInt(editValue) })
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(prev => prev.map(p => p.id === id ? data.product : p));
        setEditingId(null);
      }
    } catch (error) {
      alert("Failed to update stock");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-oliveGray/20 overflow-hidden shadow-sm">
      <div className="p-4 bg-cream/30 border-b border-oliveGray/10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-chocolate italic">Manage Inventory</h2>
      </div>
      <table className="w-full text-left">
        <thead className="bg-cream/10 text-xs font-bold uppercase text-chocolate/60">
          <tr>
            <th className="px-6 py-4">Item</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-oliveGray/10">
          {products.map(p => (
            <tr key={p.id} className="hover:bg-cream/5 transition-colors">
              <td className="px-6 py-4 font-semibold text-chocolate">{p.name}</td>
              <td className="px-6 py-4 text-caramel font-bold">${p.price.toFixed(2)}</td>
              <td className="px-6 py-4">
                {editingId === p.id ? (
                  <input 
                    type="number" 
                    className="w-20 border border-lavender rounded p-1 text-chocolate outline-none"
                    value={editValue}
                    autoFocus
                    onChange={e => setEditValue(e.target.value)}
                  />
                ) : (
                  <span className={`px-2 py-1 rounded text-xs font-bold ${p.stockQuantity > 5 ? 'bg-oliveGray/10 text-oliveGray' : 'bg-red-50 text-red-500'}`}>
                    {p.stockQuantity} in stock
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                {editingId === p.id ? (
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => handleUpdate(p.id)}
                      disabled={saving}
                      className="text-white bg-lavender px-3 py-1 rounded-full text-xs font-bold hover:bg-lavender/90 disabled:opacity-50"
                    >
                      {saving ? "..." : "Save"}
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="text-chocolate/60 hover:text-chocolate px-3 py-1 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setEditingId(p.id);
                      setEditValue(p.stockQuantity.toString());
                    }}
                    className="text-lavender hover:bg-lavender/10 px-4 py-1 rounded-full text-xs font-bold border border-lavender/20"
                  >
                    Edit Stock
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
