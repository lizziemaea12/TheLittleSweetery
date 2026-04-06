"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
};

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  pickupDate?: string;
  meetingDetails?: string;
  paymentDetails?: string;
};

const STATUS_OPTIONS = ["PENDING", "READY", "COMPLETED", "CANCELLED"];

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const filteredOrders = initialOrders.filter((o) => {
    if (activeTab === "COMPLETED") return o.status === "COMPLETED";
    return o.status !== "COMPLETED";
  });

  const updateStatus = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-oliveGray/20 overflow-hidden shadow-sm flex flex-col h-full">
      <div className="p-4 bg-cream/30 border-b border-oliveGray/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-chocolate italic">Orders</h2>
        <div className="flex bg-cream/50 p-1 rounded-xl border border-oliveGray/10">
          <button
            onClick={() => setActiveTab("ACTIVE")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "ACTIVE"
                ? "bg-white text-chocolate shadow-sm"
                : "text-chocolate/60 hover:text-chocolate"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("COMPLETED")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "COMPLETED"
                ? "bg-white text-chocolate shadow-sm"
                : "text-chocolate/60 hover:text-chocolate"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto divide-y divide-oliveGray/10">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-chocolate/40 italic font-medium">
            No {activeTab.toLowerCase()} orders found.
          </div>
        ) : (
          filteredOrders.map((o: Order) => (
            <div key={o.id} className="p-6 hover:bg-cream/5 transition-colors group">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-lavender/10 text-lavender font-bold text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                        {o.id.slice(-6).toUpperCase()}
                      </span>
                      <h3 className="font-bold text-chocolate text-lg">{o.customerName}</h3>
                    </div>
                    <p className="text-sm text-chocolate/60">{o.customerEmail}</p>
                    <div className="text-[10px] font-bold text-oliveGray/60 uppercase">
                      Ordered: {format(new Date(o.createdAt), "MMM d, h:mm a")}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-xl font-display text-caramel font-bold italic">${o.totalPrice.toFixed(2)}</span>
                    <select
                      value={o.status}
                      disabled={loadingId === o.id}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="text-[10px] uppercase font-black text-oliveGray tracking-widest bg-oliveGray/5 px-2 py-1 rounded border border-transparent hover:border-oliveGray/30 cursor-pointer focus:outline-none focus:ring-1 focus:ring-lavender"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {o.items.map((i: OrderItem) => (
                    <span key={i.id} className="inline-flex items-center gap-1 bg-cream/50 border border-oliveGray/10 px-2 py-1 rounded-lg text-xs font-semibold text-chocolate/80">
                      <span className="text-caramel font-bold">{i.quantity}x</span>
                      <span>{i.product.name}</span>
                    </span>
                  ))}
                </div>

                {(o.pickupDate || o.meetingDetails || o.paymentDetails) && (
                  <div className="bg-cream/20 rounded-xl p-3 border border-oliveGray/10 space-y-2">
                    {o.pickupDate && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-chocolate/60 uppercase text-[9px]">Pickup:</span>
                        <span className="text-chocolate font-semibold">{format(new Date(o.pickupDate), "PPPP 'at' p")}</span>
                      </div>
                    )}
                    {o.meetingDetails && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-chocolate/60 uppercase text-[9px]">Meeting:</span>
                        <span className="text-chocolate font-semibold">{o.meetingDetails}</span>
                      </div>
                    )}
                    {o.paymentDetails && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-chocolate/60 uppercase text-[9px]">Payment:</span>
                        <span className="text-chocolate font-semibold">{o.paymentDetails}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
