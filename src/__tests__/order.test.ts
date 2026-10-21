import { describe, expect, it } from "vitest";
import { productById } from "../data/catalog";
import {
  buildOrderMessage,
  checkoutError,
  isValidSelection,
  money,
  sanitizeCart,
  subtotal,
  unitPrice,
  whatsappUrl,
  type CartItem,
} from "../lib/order";

const example: CartItem = {
  id: "a",
  productId: "pastel-classico",
  flavorId: "carne",
  sizeId: "grande",
  addOnIds: ["queijo-extra"],
  notes: "sem cebola",
  quantity: 2,
};

describe("pedido", () => {
  it("calcula adicionais, opções, quantidade e total em centavos", () => {
    expect(unitPrice(productById[example.productId], example)).toBe(2200);
    expect(subtotal([example])).toBe(4400);
    expect(money(4400)).toBe("R$ 44,00");
  });

  it("rejeita combinações não cadastradas e carrinho inválido", () => {
    expect(
      isValidSelection(productById["pastel-classico"], {
        flavorId: "inexistente",
        sizeId: "regular",
        addOnIds: [],
      }),
    ).toBe(false);
    expect(
      isValidSelection(productById["pastel-classico"], {
        flavorId: "carne",
        sizeId: "regular",
        addOnIds: ["banana"],
      }),
    ).toBe(false);
    expect(
      sanitizeCart([example, { ...example, id: "b", addOnIds: ["banana"] }]),
    ).toEqual([example]);
  });

  it("monta mensagem completa, codifica URL e exige os dados necessários", () => {
    const customer = {
      name: "Ana",
      fulfillment: "delivery" as const,
      address: "Rua Exemplo, 10",
    };
    const message = buildOrderMessage([example], customer);
    expect(message).toContain("2x Pastel clássico — R$ 44,00");
    expect(message).toContain("Carne · Grande · Queijo extra");
    expect(message).toContain("Observação: sem cebola");
    expect(message).toContain("Endereço: Rua Exemplo, 10");
    expect(message).toContain("Taxa de entrega: a confirmar com a pastelaria");
    expect(message).toContain("Total dos itens: R$ 44,00");
    expect(
      decodeURIComponent(
        whatsappUrl("5511999999999", message).split("text=")[1],
      ),
    ).toBe(message);
    expect(checkoutError([example], customer, "")).toMatch(
      /ainda não foi configurado/,
    );
    expect(
      checkoutError([example], { ...customer, address: "" }, "5511999999999"),
    ).toMatch(/endereço/);
    expect(checkoutError([], customer, "5511999999999")).toMatch(/Adicione/);
  });
});
