// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import App from "../App";

vi.mock("gsap", () => ({ default: { registerPlugin: vi.fn() } }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi
      .fn()
      .mockReturnValue({
        matches: true,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }),
  );
  vi.stubGlobal("crypto", { randomUUID: () => "item-1" });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("fluxo do cardápio", () => {
  it("navega por categorias e filtra produtos por busca", () => {
    render(<App />);
    const menu = document.querySelector("#cardapio") as HTMLElement;
    fireEvent.click(within(menu).getByRole("button", { name: "Doces" }));
    expect(within(menu).getByText("Pastel doce")).toBeTruthy();
    expect(within(menu).queryByText("Pastel de carne")).toBeNull();
    fireEvent.change(within(menu).getByPlaceholderText("Buscar no cardápio"), {
      target: { value: "sem resultado" },
    });
    expect(within(menu).getByText("Nenhum produto encontrado")).toBeTruthy();
    fireEvent.click(
      within(menu).getByRole("button", { name: "Limpar filtros" }),
    );
    expect(within(menu).getByText("Pastel de carne")).toBeTruthy();
  });

  it("personaliza, adiciona, altera e remove um item com total atualizado", () => {
    render(<App />);
    const menu = document.querySelector("#cardapio") as HTMLElement;
    fireEvent.click(
      within(menu).getByRole("button", {
        name: "Personalizar Pastel clássico",
      }),
    );
    const modal = screen.getByRole("dialog", { name: "Pastel clássico" });
    fireEvent.click(within(modal).getByRole("radio", { name: /Carne/ }));
    fireEvent.click(within(modal).getByRole("radio", { name: /Grande/ }));
    fireEvent.click(
      within(modal).getByRole("checkbox", { name: /Queijo extra/ }),
    );
    fireEvent.click(
      within(modal).getByRole("button", { name: "Aumentar quantidade" }),
    );
    fireEvent.change(within(modal).getByPlaceholderText("Ex.: sem cebola"), {
      target: { value: "sem cebola" },
    });
    fireEvent.click(within(modal).getByRole("button", { name: /Adicionar/ }));
    fireEvent.click(
      screen.getAllByRole("button", { name: /Abrir carrinho com 2 itens/ })[0],
    );
    const drawer = screen.getByRole("dialog", { name: /Meu carrinho/ });
    expect(within(drawer).getAllByText(/R\$\s*44,00/).length).toBeGreaterThan(
      0,
    );
    expect(within(drawer).getByText("Obs.: sem cebola")).toBeTruthy();
    fireEvent.click(
      within(drawer).getByRole("button", { name: "Diminuir Pastel clássico" }),
    );
    expect(within(drawer).getAllByText(/R\$\s*22,00/).length).toBeGreaterThan(
      0,
    );
    fireEvent.click(
      within(drawer).getByRole("button", { name: "Remover Pastel clássico" }),
    );
    expect(within(drawer).getByText("Seu carrinho está vazio")).toBeTruthy();
  });

  it("restaura o carrinho após recarregar a página", () => {
    const view = render(<App />);
    const menu = document.querySelector("#cardapio") as HTMLElement;
    fireEvent.click(
      within(menu).getByRole("button", {
        name: "Personalizar Pastel de carne",
      }),
    );
    fireEvent.click(
      screen
        .getByRole("dialog", { name: "Pastel de carne" })
        .querySelector(".add-button")!,
    );
    expect(localStorage.getItem("atelie-do-pastel-cart-v1")).toContain(
      "pastel-carne",
    );
    view.unmount();
    render(<App />);
    fireEvent.click(
      screen.getAllByRole("button", { name: /Abrir carrinho com 1 itens/ })[0],
    );
    expect(
      within(screen.getByRole("dialog", { name: /Meu carrinho/ })).getByText(
        "Pastel de carne",
      ),
    ).toBeTruthy();
  });
});
