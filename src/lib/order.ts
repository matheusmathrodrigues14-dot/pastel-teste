import { productById, type Product } from "../data/catalog";

export type CartItem = {
  id: string;
  productId: string;
  flavorId?: string;
  sizeId?: string;
  addOnIds: string[];
  notes: string;
  quantity: number;
};

export type Customer = {
  name: string;
  fulfillment: "pickup" | "delivery";
  address: string;
};

export const money = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    cents / 100,
  );

export function choiceLabel(choices: Product["flavors"], id?: string) {
  return choices?.find((choice) => choice.id === id)?.label;
}

export function unitPrice(
  product: Product,
  selection: Pick<CartItem, "flavorId" | "sizeId" | "addOnIds">,
) {
  const flavor = product.flavors?.find(
    (choice) => choice.id === selection.flavorId,
  );
  const size = product.sizes?.find((choice) => choice.id === selection.sizeId);
  return (
    product.basePriceCents +
    (flavor?.priceCents ?? 0) +
    (size?.priceCents ?? 0) +
    selection.addOnIds.reduce(
      (sum, id) =>
        sum +
        (product.addOns?.find((choice) => choice.id === id)?.priceCents ?? 0),
      0,
    )
  );
}

export function isValidSelection(
  product: Product,
  selection: Pick<CartItem, "flavorId" | "sizeId" | "addOnIds">,
) {
  if (
    product.flavors?.length &&
    !product.flavors.some((choice) => choice.id === selection.flavorId)
  )
    return false;
  if (!product.flavors?.length && selection.flavorId) return false;
  if (
    product.sizes?.length &&
    !product.sizes.some((choice) => choice.id === selection.sizeId)
  )
    return false;
  if (!product.sizes?.length && selection.sizeId) return false;
  return (
    new Set(selection.addOnIds).size === selection.addOnIds.length &&
    selection.addOnIds.every((id) =>
      product.addOns?.some((choice) => choice.id === id),
    )
  );
}

export function sanitizeCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is CartItem => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Partial<CartItem>;
    const product = productById[candidate.productId ?? ""];
    return Boolean(
      product &&
        typeof candidate.id === "string" &&
        typeof candidate.notes === "string" &&
        candidate.notes.length <= 300 &&
        Number.isInteger(candidate.quantity) &&
        candidate.quantity! > 0 &&
        candidate.quantity! <= 99 &&
        Array.isArray(candidate.addOnIds) &&
        candidate.addOnIds.every((id) => typeof id === "string") &&
        isValidSelection(product, {
          flavorId: candidate.flavorId,
          sizeId: candidate.sizeId,
          addOnIds: candidate.addOnIds,
        }),
    );
  });
}

export function subtotal(items: CartItem[]) {
  return items.reduce(
    (sum, item) =>
      sum + unitPrice(productById[item.productId], item) * item.quantity,
    0,
  );
}

export function itemDetails(item: CartItem) {
  const product = productById[item.productId];
  return [
    choiceLabel(product.flavors, item.flavorId),
    choiceLabel(product.sizes, item.sizeId),
    ...item.addOnIds.map((id) => choiceLabel(product.addOns, id)),
  ]
    .filter(Boolean)
    .join(" · ");
}

export function buildOrderMessage(items: CartItem[], customer: Customer) {
  const lines = ["Olá! Gostaria de fazer um pedido:", ""];
  for (const item of items) {
    const product = productById[item.productId];
    lines.push(
      `${item.quantity}x ${product.name} — ${money(unitPrice(product, item) * item.quantity)}`,
    );
    const details = itemDetails(item);
    if (details) lines.push(`   ${details}`);
    if (item.notes.trim()) lines.push(`   Observação: ${item.notes.trim()}`);
  }
  lines.push("", `Subtotal: ${money(subtotal(items))}`);
  if (customer.fulfillment === "delivery")
    lines.push("Taxa de entrega: a confirmar com a pastelaria");
  lines.push(
    `Total dos itens: ${money(subtotal(items))}`,
    "",
    `Nome: ${customer.name.trim()}`,
    `Modalidade: ${customer.fulfillment === "delivery" ? "Entrega" : "Retirada"}`,
  );
  if (customer.fulfillment === "delivery")
    lines.push(`Endereço: ${customer.address.trim()}`);
  lines.push("", "Gostaria de confirmar meu pedido.");
  return lines.join("\n");
}

export function checkoutError(
  items: CartItem[],
  customer: Customer,
  whatsappNumber: string,
) {
  if (!items.length) return "Adicione um produto antes de finalizar.";
  if (!customer.name.trim()) return "Informe seu nome para continuar.";
  if (customer.fulfillment === "delivery" && !customer.address.trim())
    return "Informe o endereço para entrega.";
  if (!/^\d{12,15}$/.test(whatsappNumber))
    return "O WhatsApp da pastelaria ainda não foi configurado.";
  return null;
}

export function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
