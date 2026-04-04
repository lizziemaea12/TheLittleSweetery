"use client";

import { useState, useEffect, FormEvent } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
};

type OrderItem = {
  productId: string;
  quantity: number;
};

export function OrderForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [orderItems, setOrderItems] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products);
      } else {
        setError(data.error);
      }
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
    if (quantity > p.stockQuantity) quantity = p.stockQuantity;

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
    setSuccess(null);

    const items = Object.entries(orderItems)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({ productId: id, quantity: qty }));

    if (!customerName || !customerEmail || items.length === 0) {
      setError("Please provide your name, email, and at least one item.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          items
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to place order.");
        return;
      }

      setSuccess(`Success! Your order ID is ${data.order.id.slice(-6).toUpperCase()}.`);
      setCustomerName("");
      setCustomerEmail("");
      setOrderItems({});
      fetchProducts(); // Refresh stock
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-oliveGray animate-pulse">Loading menu...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-lavender/20">
      <h2 className="text-3xl font-display text-chocolate mb-6 text-center italic">Treat Yourself</h2>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-chocolate font-semibold text-sm ml-1" htmlFor="c-name">Full Name</label>
            <input
              id="c-name"
              required
              className="w-full bg-cream/30 border border-lavender/20 rounded-xl p-3 focus:ring-2 focus:ring-lavender/50 focus:border-lavender outline-none transition-all"
              placeholder="Your name"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-chocolate font-semibold text-sm ml-1" htmlFor="c-email">Email Address</label>
            <input
              id="c-email"
              type="email"
              required
              className="w-full bg-cream/30 border border-lavender/20 rounded-xl p-3 focus:ring-2 focus:ring-lavender/50 focus:border-lavender outline-none transition-all"
              placeholder="hello@example.com"
              value={customerEmail}
              onChange={e => setCustomerEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-oliveGray border-b border-oliveGray/10 pb-2">Our Treats</h3>
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between p-4 rounded-2xl bg-cream/20 border border-cream/50 hover:border-lavender/30 transition-all group">
              <div className="flex-1">
                <h4 className="font-bold text-chocolate text-lg group-hover:text-lavender transition-colors">{product.name}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-caramel font-bold">${product.price.toFixed(2)}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${product.stockQuantity > 0 ? 'bg-oliveGray/10 text-oliveGray' : 'bg-red-100 text-red-500'}`}>
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product.id, (orderItems[product.id] || 0) - 1)}
                  className="w-8 h-8 rounded-full bg-white border border-lavender/20 flex items-center justify-center text-lavender hover:bg-lavender hover:text-white transition-all disabled:opacity-30"
                  disabled={!orderItems[product.id]}
                >
                  -
                </button>
                <input
                  type="number"
                  min={0}
                  max={product.stockQuantity}
                  className="w-12 text-center bg-transparent font-bold text-chocolate outline-none"
                  value={orderItems[product.id] || 0}
                  onChange={e => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(product.id, (orderItems[product.id] || 0) + 1)}
                  className="w-8 h-8 rounded-full bg-white border border-lavender/20 flex items-center justify-center text-lavender hover:bg-lavender hover:text-white transition-all disabled:opacity-30"
                  disabled={(orderItems[product.id] || 0) >= product.stockQuantity}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-chocolate/5 p-6 rounded-2xl space-y-4 border border-chocolate/5">
          <div className="flex justify-between items-center text-xl font-bold text-chocolate">
            <span>Total</span>
            <span className="text-caramel">${totalPrice.toFixed(2)}</span>
          </div>

          <div className="text-sm text-chocolate/70 space-y-2">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lavender" />
              We can deliver locally <strong className="text-chocolate">within Newburgh or Evansville</strong> or you can pick up at our address.
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lavender" />
              For meeting locations, email <a href="mailto:lizziemaea12@gmail.com" className="text-lavender font-bold hover:underline">lizziemaea12@gmail.com</a>
            </p>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>}
        {success && <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-100">{success}</div>}

        <button
          type="submit"
          disabled={!hasItems || submitting}
          className="w-full bg-lavender hover:bg-lavender/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-lavender/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0"
        >
          {submitting ? "Placing Order..." : `Place Order • $${totalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
