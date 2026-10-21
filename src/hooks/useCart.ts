import { useEffect, useState } from "react";
import type { CartItem } from "../lib/order";
import { sanitizeCart } from "../lib/order";

const storageKey = "atelie-do-pastel-cart-v1";

function loadCart(): CartItem[] {
  try {
    return sanitizeCart(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  function add(item: Omit<CartItem, "id">) {
    setItems((current) => {
      const match = current.find(
        (existing) =>
          existing.productId === item.productId &&
          existing.flavorId === item.flavorId &&
          existing.sizeId === item.sizeId &&
          existing.notes === item.notes &&
          [...existing.addOnIds].sort().join(",") ===
            [...item.addOnIds].sort().join(","),
      );
      if (match)
        return current.map((existing) =>
          existing.id === match.id
            ? {
                ...existing,
                quantity: Math.min(99, existing.quantity + item.quantity),
              }
            : existing,
        );
      return [...current, { ...item, id: crypto.randomUUID() }];
    });
  }
  function updateQuantity(id: string, quantity: number) {
    setItems((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(99, quantity) }
              : item,
          ),
    );
  }
  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }
  return { items, add, updateQuantity, remove };
}
