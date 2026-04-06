"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function InventoryModeToggle({ initialMode }: { initialMode: boolean }) {
  const [isInventoryMode, setIsInventoryMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleMode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventoryMode: !isInventoryMode }),
      });
      if (res.ok) {
        setIsInventoryMode(!isInventoryMode);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to toggle inventory mode:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-oliveGray/20 shadow-sm flex items-center justify-between">
      <div>
        <h3 className="font-bold text-chocolate text-lg">Inventory Mode</h3>
        <p className="text-sm text-chocolate/60">
          {isInventoryMode 
            ? "Limited to stock levels. No pre-ordering beyond availability." 
            : "Unlimited ordering. Requires 3-day notice and meeting/payment details."}
        </p>
      </div>
      <button
        onClick={toggleMode}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2 ${
          isInventoryMode ? "bg-lavender" : "bg-chocolate/20"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isInventoryMode ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
