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
        setProducts(prev => prev.map((p: Product) => p.id === id ? data.product : p));
        setEditingId(null);
      }
    } catch {
      alert("Failed to update stock");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-oliveGray/20 overflow-hidden shadow-sm flex flex-col h-full">
      <div className="p-5 bg-cream/30 border-b border-oliveGray/10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-chocolate italic">Manage Inventory</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-cream/10 text-[10px] font-black uppercase tracking-widest text-chocolate/50">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oliveGray/10">
            {products.map((p: Product) => (
              <tr key={p.id} className="hover:bg-cream/5 transition-all group">
                <td className="px-6 py-4">
                  <span className="font-bold text-chocolate group-hover:text-lavender transition-colors">{p.name}</span>
                </td>
                <td className="px-6 py-4">
                   <span className="text-caramel font-bold italic">${p.price.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4">
                  {editingId === p.id ? (
                    <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                      <input 
                        type="number" 
                        min="0"
                        className="w-20 border-2 border-lavender/30 rounded-xl px-3 py-1.5 text-chocolate outline-none focus:ring-2 focus:ring-lavender/20 focus:border-lavender bg-white"
                        value={editValue}
                        autoFocus
                        onChange={e => setEditValue(e.target.value)}
                      />
                    </div>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-tight ${p.stockQuantity > 5 ? 'bg-oliveGray/10 text-oliveGray' : 'bg-red-50 text-red-500'}`}>
                      {p.stockQuantity} Left
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === p.id ? (
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => handleUpdate(p.id)}
                        disabled={saving}
                        className="bg-lavender text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lavender/90 disabled:opacity-50 transition-all shadow-md shadow-lavender/10"
                      >
                        {saving ? "..." : "Save"}
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="text-chocolate/60 hover:text-chocolate font-bold px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors"
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
                      className="text-lavender hover:bg-lavender/10 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-lavender/20 transition-all active:scale-95 group-hover:bg-lavender/5"
                    >
                      Update
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
