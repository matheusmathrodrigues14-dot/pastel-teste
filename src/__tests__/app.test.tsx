// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import App from "../App";
import { phones } from "../data/phones";

vi.mock("gsap", () => ({ default: { registerPlugin: vi.fn(), context: () => ({ revert: vi.fn() }) } }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
beforeEach(() => { window.matchMedia = vi.fn().mockReturnValue({ matches: true, addListener: vi.fn(), removeListener: vi.fn() }); Element.prototype.scrollIntoView = vi.fn(); });
afterEach(cleanup);

it("clicar numa marca abre seus modelos e o primeiro fica selecionado", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Ver modelos Samsung" }));
  const list = screen.getByRole("group", { name: "Modelos Samsung" });
  expect(within(list).getByRole("button", { name: /Galaxy S25 FE/ })).toBeTruthy();
  expect(within(list).queryByRole("button", { name: /iPhone 17 Pro/ })).toBeNull();
  expect(screen.getByRole("heading", { name: "Galaxy S25 FE" })).toBeTruthy();
});

it("clicar num aparelho atualiza a consulta do WhatsApp", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Ver modelos Xiaomi" }));
  fireEvent.click(within(screen.getByRole("group", { name: "Modelos Xiaomi" })).getAllByRole("button").find(button => button.querySelector("strong")?.textContent === "Redmi Note 14 Pro")!);
  const link = screen.getByRole("link", { name: /Consultar Redmi Note 14 Pro/ }) as HTMLAnchorElement;
  expect(link.href).toContain("wa.me/5519987715865");
  expect(decodeURIComponent(link.href)).toContain("Redmi Note 14 Pro");
});

it("busca modelos da marca ativa e mantém imagens locais em todas as marcas", () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox", { name: "Buscar modelo" }), { target: { value: "iPhone 16 Pro" } });
  expect(within(screen.getByRole("group", { name: "Modelos Apple" })).getAllByRole("button").find(button => button.querySelector("strong")?.textContent === "iPhone 16 Pro")!).toBeTruthy();
  for (const brand of ["Apple", "Xiaomi", "Samsung", "Motorola"]) {
    const image = within(screen.getByRole("button", { name: `Ver modelos ${brand}` })).getByRole("img") as HTMLImageElement;
    expect(image.getAttribute("src")).toMatch(/^\/images\/.*\.webp$/);
  }
  expect(new Set(phones.map(phone => phone.name)).size).toBe(phones.length);
});
