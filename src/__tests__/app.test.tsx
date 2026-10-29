// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "../App";
import { phones } from "../data/phones";

vi.mock("gsap", () => ({ default: { registerPlugin: vi.fn(), context: () => ({ revert: vi.fn() }) } }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
beforeEach(() => { window.matchMedia = vi.fn().mockReturnValue({ matches: true, addListener: vi.fn(), removeListener: vi.fn() }); Element.prototype.scrollIntoView = vi.fn(); });
afterEach(cleanup);

it("oferece as quatro marcas e consulta de modelos no WhatsApp", () => {
  render(<App />);
  for (const brand of ["Apple", "Xiaomi", "Motorola", "Samsung"]) expect(screen.getByRole("button", { name: brand })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Samsung" }));
  expect(screen.getAllByText("Galaxy S21 FE")[0]).toBeTruthy();
  expect(screen.getAllByText("Galaxy S25 FE")[0]).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Consultar Galaxy S25 FE" }));
  const link = screen.getByRole("link", { name: /Continuar no WhatsApp/ }) as HTMLAnchorElement;
  expect(link.href).toContain("wa.me/5519987715865");
  expect(decodeURIComponent(link.href)).toContain("Galaxy S25 FE");
});

it("filtra modelos e preserva uma opção para consulta sem seleção", () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox", { name: "Buscar modelo" }), { target: { value: "inexistente" } });
  expect(screen.getByText(/Nenhum modelo encontrado/)).toBeTruthy();
  expect((screen.getByRole("link", { name: /Continuar no WhatsApp/ }) as HTMLAnchorElement).href).toContain("wa.me/5519987715865");
});

it("lista famílias de todas as marcas sem nomes duplicados", () => {
  expect(new Set(phones.map(phone => phone.name)).size).toBe(phones.length);
  for (const brand of ["Apple", "Xiaomi", "Motorola", "Samsung"]) expect(phones.some(phone => phone.brand === brand)).toBe(true);
});
