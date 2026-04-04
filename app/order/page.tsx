import type { Metadata } from "next";
import { OrderForm } from "@/components/forms/order-form";

export const metadata: Metadata = {
  title: "Order Treats | The Little Sweetery",
  description: "Order puppy chow, snickerdoodles, cake pops, and caramel corn from The Little Sweetery in Evansville.",
};

export default function OrderPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-dot-texture bg-dots">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-display text-lavender drop-shadow-sm">Freshly Baked for You</h1>
          <p className="text-chocolate/70 max-w-xl mx-auto font-medium">
            Select your favorites below. Everything is $2.50 except our famous snickerdoodles which are only $1.50!
          </p>
        </div>
        
        <OrderForm />
        
        <div className="text-center text-chocolate/50 text-sm italic">
          <p>Orders are typically ready within 24 hours.</p>
          <p>We&apos;ll email you for pickup details!</p>
        </div>
      </div>
    </main>
  );
}
