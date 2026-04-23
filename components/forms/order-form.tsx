"use client";

import { useState, useEffect, FormEvent } from "react";
import { format, addDays } from "date-fns";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
};

type GlobalSettings = {
  inventoryMode: boolean;
};

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: { 
    id: string; 
    quantity: number; 
    price: number; 
    productId: string; 
  }[];
  pickupDate?: string | null;
  meetingDetails?: string | null;
  paymentDetails?: string | null;
};

export function OrderForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<GlobalSettings>({ inventoryMode: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [meetingDetails, setMeetingDetails] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [orderItems, setOrderItems] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      const [productsRes, settingsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/settings")
      ]);
      const productsData = await productsRes.json();
      const settingsData = await settingsRes.json();

      if (productsRes.ok) setProducts(productsData.products);
      if (settingsRes.ok) setSettings(settingsData);
    } catch {
      setError("Failed to fetch menu items.");
    } finally {
      setLoading(false);
    }
  }

  function handleQuantityChange(productId: string, quantity: number) {
    const p = products.find(p => p.id === productId);
    if (!p) return;

    if (quantity < 0) quantity = 0;

    // Only limit by stock if inventoryMode is ON
    if (settings.inventoryMode && quantity > p.stockQuantity) {
      quantity = p.stockQuantity;
    }

    setOrderItems(prev => ({
      ...prev,
      [productId]: quantity
    }));
  }

  const totalPrice = products.reduce((sum, p) => {
    const qty = orderItems[p.id] || 0;
    return sum + (p.price * qty);
  }, 0);

  const hasItems = Object.values(orderItems).some(qty => qty > 0);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const items = Object.entries(orderItems)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ productId: id, quantity: qty }));

    if (!customerName || !customerEmail || items.length === 0) {
      setError("Please provide your name, email, and at least one item.");
      return;
    }

    if (!settings.inventoryMode) {
      if (!pickupDate || !meetingDetails || !paymentDetails) {
        setError("Please provide pickup date, meeting details, and payment details.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items,
          pickupDate: pickupDate || undefined,
          meetingDetails: meetingDetails || undefined,
          paymentDetails: paymentDetails || undefined,
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to place order.");
        return;
      }

      setOrderDetails(data.order);
      setSuccess(true);
      setCustomerName("");
      setCustomerEmail("");
      setPickupDate("");
      setMeetingDetails("");
      setPaymentDetails("");
      setOrderItems({});
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-12 text-center text-chocolate/40 animate-pulse font-medium">Preparing our sweet menu...</div>;

  if (success && orderDetails) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-[2rem] p-8 sm:p-12 shadow-2xl border border-lavender/20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl">
          ✓
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold text-chocolate">Order Placed!</h2>
          <p className="text-chocolate/60">Thank you for your order, <span className="font-bold text-chocolate">{orderDetails.customerName}</span>!</p>
          <div className="bg-lavender/10 text-lavender font-black px-4 py-2 rounded-xl inline-block mt-4 tracking-widest text-sm uppercase">
            Order ID: {orderDetails.id.slice(-6)}
          </div>
        </div>

        <div className="bg-cream/20 rounded-[2rem] p-8 border border-chocolate/5 space-y-6">
          <h3 className="font-bold text-chocolate text-xl italic underline decoration-lavender/30 decoration-4 underline-offset-4">Payment Information</h3>
          <p className="text-sm text-chocolate/70">Please complete your payment of <span className="text-caramel font-black text-lg">${orderDetails.totalPrice.toFixed(2)}</span> using Venmo below:</p>

          <div className="aspect-square w-full max-w-[280px] mx-auto bg-white rounded-3xl border-2 border-dashed border-lavender/30 overflow-hidden group transition-all hover:border-lavender/60 relative">
            <Image 
              className="object-cover" 
              src="https://dqsuyyndpkghdgbudmmx.supabase.co/storage/v1/object/public/images/mom_venmo.png" 
              alt="Venmo QR Code" 
              fill
            />
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
               <span className="bg-white/90 text-lavender font-black px-4 py-2 rounded-full shadow-lg text-xs uppercase tracking-widest">Scan Me</span>
            </div>
          </div>
          <div className="p-4 text-center">
            <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">📱</span>
            <p className="text-xs font-bold text-chocolate/40 uppercase tracking-tighter mt-2">Venmo QR Code Space</p>
            <p className="text-[10px] text-chocolate/30 italic">@Stacy-Adamission</p>
          </div>

          <p className="text-[10px] text-chocolate/50 italic px-6">Scan the code above or search for our Venmo handle to complete your purchase. Your order will be processed once payment is confirmed!</p>
        </div>

        <button
          onClick={() => setSuccess(false)}
          className="text-lavender font-bold hover:underline underline-offset-4"
        >
          Place another order
        </button>
      </div>
    );
  }

  const minPickupDate = format(addDays(new Date(), 3), "yyyy-MM-dd");

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2rem] p-6 sm:p-10 shadow-2xl border border-lavender/20">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-4xl font-display font-bold text-chocolate italic">Treat Yourself</h2>
        <p className="text-chocolate/60 text-sm">Select your favorites and we&apos;ll have them ready for you!</p>
        {!settings.inventoryMode && (
          <div className="bg-caramel/10 text-caramel text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full inline-block mt-2 border border-caramel/20">
            Pre-ordering Active • 3 Day Notice Required
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-oliveGray/80 ml-2" htmlFor="c-name">Full Name</label>
            <input
              id="c-name"
              required
              className="w-full bg-cream/5 border border-oliveGray/20 rounded-2xl p-4 focus:ring-2 focus:ring-lavender/20 focus:border-lavender outline-none transition-all"
              placeholder="Jane Doe"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-oliveGray/80 ml-2" htmlFor="c-email">Email Address</label>
            <input
              id="c-email"
              type="email"
              required
              className="w-full bg-cream/5 border border-oliveGray/20 rounded-2xl p-4 focus:ring-2 focus:ring-lavender/20 focus:border-lavender outline-none transition-all"
              placeholder="jane@example.com"
              value={customerEmail}
              onChange={e => setCustomerEmail(e.target.value)}
            />
          </div>
        </div>

        {!settings.inventoryMode && (
          <div className="grid grid-cols-1 gap-6 bg-lavender/5 p-6 rounded-[2rem] border border-lavender/10 animate-in fade-in slide-in-from-top-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-lavender ml-2" htmlFor="pickup-date">Requested Pickup Date (3+ days notice)</label>
              <input
                id="pickup-date"
                type="date"
                min={minPickupDate}
                required
                className="w-full bg-white border border-lavender/20 rounded-2xl p-4 focus:ring-2 focus:ring-lavender/20 focus:border-lavender outline-none transition-all"
                value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-lavender ml-2" htmlFor="meeting">Meeting Details</label>
                <select
                  id="meeting"
                  required
                  className="w-full bg-white border border-lavender/20 rounded-2xl p-4 cursor-pointer outline-none transition-all"
                  value={meetingDetails}
                  onChange={e => setMeetingDetails(e.target.value)}
                >
                  <option value="">Select Option</option>
                  <option value="Pick up at address">Pick up at Adamission address</option>
                  <option value="Meet in Evansville">Meet in Evansville</option>
                  <option value="Meet in Newburgh">Meet in Newburgh</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-lavender ml-2" htmlFor="payment">Payment Choice</label>
                <select
                  id="payment"
                  required
                  className="w-full bg-white border border-lavender/20 rounded-2xl p-4 cursor-pointer outline-none transition-all"
                  value={paymentDetails}
                  onChange={e => setPaymentDetails(e.target.value)}
                >
                  <option value="">Select Option</option>
                  <option value="Venmo">Venmo</option>
                  <option value="Cash at pickup">Cash at pickup</option>
                  <option value="Check">Check</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-chocolate italic">Our Treats</h3>
            {settings.inventoryMode && <span className="text-[10px] font-bold text-chocolate/40 uppercase">Stock counts active</span>}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {products.map((product: Product) => {
              const qty = orderItems[product.id] || 0;
              const isOutOfStock = settings.inventoryMode && product.stockQuantity <= 0;

              return (
                <div key={product.id} className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all duration-300 ${qty > 0 ? 'bg-lavender/5 border-lavender/30 shadow-md' : 'bg-cream/10 border-oliveGray/10 hover:border-lavender/20'}`}>
                  <div className="flex-1">
                    <h4 className={`font-bold text-lg transition-colors ${qty > 0 ? 'text-lavender' : 'text-chocolate'}`}>{product.name}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-caramel font-bold italic">${product.price.toFixed(2)}</span>
                      {settings.inventoryMode && (
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${product.stockQuantity > 0 ? 'bg-oliveGray/10 text-oliveGray/60' : 'bg-red-100 text-red-500'}`}>
                          {product.stockQuantity > 0 ? `${product.stockQuantity} Left` : 'Sold Out'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/50 p-1 rounded-2xl border border-oliveGray/5">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.id, qty - 1)}
                      className="w-10 h-10 rounded-xl bg-white border border-oliveGray/10 flex items-center justify-center text-chocolate hover:text-lavender hover:shadow-sm active:scale-95 transition-all disabled:opacity-30"
                      disabled={qty === 0}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-black text-chocolate">{qty}</span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.id, qty + 1)}
                      className="w-10 h-10 rounded-xl bg-white border border-oliveGray/10 flex items-center justify-center text-chocolate hover:text-lavender hover:shadow-sm active:scale-95 transition-all disabled:opacity-30"
                      disabled={isOutOfStock}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-chocolate/5 p-8 rounded-[2.5rem] border border-chocolate/5 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-chocolate/40 block pb-1">Order Total</span>
              <span className="text-4xl font-display font-bold text-chocolate">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-chocolate/40 block pb-1 text-right">Items</span>
              <span className="text-2xl font-bold text-chocolate/80">{Object.values(orderItems).reduce((a, b) => a + b, 0)}</span>
            </div>
          </div>

          <div className="text-xs text-chocolate/60 space-y-3 pt-4 border-t border-chocolate/10">
            <p className="flex items-start gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-lavender shrink-0" />
              <span>We deliver locally to <strong className="text-chocolate">Newburgh or Evansville</strong> or you can pick up.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-lavender shrink-0" />
              <span>Questions? Email us at <a href="mailto:lizziemaea12@gmail.com" className="text-lavender font-bold hover:underline">lizziemaea12@gmail.com</a></span>
            </p>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-5 rounded-3xl text-sm border border-red-100 animate-in slide-in-from-top-2 italic font-medium">{error}</div>}

        <button
          type="submit"
          disabled={!hasItems || submitting}
          className="w-full bg-lavender hover:bg-lavender/90 text-white font-black text-lg py-5 rounded-[2rem] shadow-xl shadow-lavender/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
        >
          {submitting ? "Processing Pretty Treats..." : `Place Your Order • $${totalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
