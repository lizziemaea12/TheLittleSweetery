"use client";

import { format } from "date-fns";

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
};

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  if (initialOrders.length === 0) return (
    <div className="bg-cream/10 rounded-2xl p-8 border border-chocolate/10 text-chocolate/50 font-bold text-center italic shadow-inner">
      No orders yet. They&apos;ll show up here!
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-oliveGray/20 overflow-hidden shadow-sm">
      <div className="p-4 bg-cream/30 border-b border-oliveGray/10">
        <h2 className="text-xl font-bold text-chocolate italic">Recent Orders</h2>
      </div>
      <div className="divide-y divide-oliveGray/10">
        {initialOrders.map((o: Order) => (
          <div key={o.id} className="p-6 hover:bg-cream/5 transition-colors group">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-lavender/10 text-lavender font-bold text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                    {o.id.slice(-6).toUpperCase()}
                  </span>
                  <h3 className="font-bold text-chocolate text-lg">{o.customerName}</h3>
                </div>
                <p className="text-sm text-chocolate/60">{o.customerEmail}</p>
                <div className="text-[10px] font-bold text-oliveGray/60 uppercase">
                  {format(new Date(o.createdAt), "MMM d, h:mm a")}
                </div>
              </div>

              <div className="flex-1 w-full md:w-auto overflow-hidden">
                <div className="flex flex-wrap gap-2">
                  {o.items.map((i: OrderItem) => (
                    <span key={i.id} className="inline-flex items-center gap-1 bg-cream/50 border border-oliveGray/10 px-2 py-1 rounded-lg text-xs font-semibold text-chocolate/80">
                      <span className="text-caramel font-bold">{i.quantity}x</span>
                      <span>{i.product.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <span className="text-xl font-display text-caramel font-bold italic">${o.totalPrice.toFixed(2)}</span>
                <span className="text-[10px] uppercase font-black text-oliveGray tracking-widest bg-oliveGray/5 px-2 py-0.5 rounded">
                  {o.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
