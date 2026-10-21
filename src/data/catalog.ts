export type CategoryId =
  | "tradicionais"
  | "especiais"
  | "doces"
  | "bebidas"
  | "combos";
export type Choice = { id: string; label: string; priceCents: number };
export type Product = {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  basePriceCents: number;
  imageQuadrant: "tl" | "tr" | "bl" | "br";
  featured?: boolean;
  flavors?: Choice[];
  sizes?: Choice[];
  addOns?: Choice[];
};

export const categories: { id: CategoryId; label: string }[] = [
  { id: "tradicionais", label: "Tradicionais" },
  { id: "especiais", label: "Especiais" },
  { id: "doces", label: "Doces" },
  { id: "bebidas", label: "Bebidas" },
  { id: "combos", label: "Combos" },
];

/** Produtos e preços ilustrativos. Não representam um cardápio oficial. */
export const products: Product[] = [
  {
    id: "pastel-classico",
    category: "tradicionais",
    name: "Pastel clássico",
    description: "Massa crocante com recheio escolhido por você.",
    basePriceCents: 1200,
    imageQuadrant: "tl",
    featured: true,
    flavors: [
      { id: "queijo", label: "Queijo", priceCents: 0 },
      { id: "carne", label: "Carne", priceCents: 200 },
      { id: "frango", label: "Frango", priceCents: 100 },
    ],
    sizes: [
      { id: "regular", label: "Regular", priceCents: 0 },
      { id: "grande", label: "Grande", priceCents: 500 },
    ],
    addOns: [
      { id: "queijo-extra", label: "Queijo extra", priceCents: 300 },
      { id: "catupiry", label: "Requeijão cremoso", priceCents: 350 },
    ],
  },
  {
    id: "pastel-carne",
    category: "tradicionais",
    name: "Pastel de carne",
    description: "Uma sugestão tradicional para abrir o apetite.",
    basePriceCents: 1400,
    imageQuadrant: "tr",
    sizes: [
      { id: "regular", label: "Regular", priceCents: 0 },
      { id: "grande", label: "Grande", priceCents: 500 },
    ],
    addOns: [{ id: "queijo-extra", label: "Queijo extra", priceCents: 300 }],
  },
  {
    id: "pastel-especial",
    category: "especiais",
    name: "Pastel especial",
    description: "Para quem gosta de criar sua combinação favorita.",
    basePriceCents: 1800,
    imageQuadrant: "tl",
    featured: true,
    flavors: [
      { id: "frango-cremoso", label: "Frango cremoso", priceCents: 0 },
      { id: "quatro-queijos", label: "Quatro queijos", priceCents: 300 },
    ],
    addOns: [
      { id: "azeitona", label: "Azeitonas", priceCents: 200 },
      { id: "queijo-extra", label: "Queijo extra", priceCents: 300 },
    ],
  },
  {
    id: "pastel-chocolate",
    category: "doces",
    name: "Pastel doce",
    description: "Um final crocante com recheio doce.",
    basePriceCents: 1500,
    imageQuadrant: "bl",
    featured: true,
    flavors: [
      { id: "chocolate", label: "Chocolate", priceCents: 0 },
      { id: "doce-leite", label: "Doce de leite", priceCents: 100 },
    ],
    addOns: [{ id: "acucar", label: "Açúcar e canela", priceCents: 100 }],
  },
  {
    id: "refresco",
    category: "bebidas",
    name: "Refresco da casa",
    description: "Bebida demonstrativa para acompanhar o pastel.",
    basePriceCents: 800,
    imageQuadrant: "br",
    sizes: [
      { id: "300ml", label: "300 ml", priceCents: 0 },
      { id: "500ml", label: "500 ml", priceCents: 300 },
    ],
  },
  {
    id: "combo-pastel",
    category: "combos",
    name: "Combo crocante",
    description: "Sugestão de pastel com bebida em um só pedido.",
    basePriceCents: 2100,
    imageQuadrant: "br",
    featured: true,
    flavors: [
      { id: "queijo", label: "Pastel de queijo", priceCents: 0 },
      { id: "carne", label: "Pastel de carne", priceCents: 200 },
    ],
  },
];

export const productById = Object.fromEntries(
  products.map((product) => [product.id, product]),
) as Record<string, Product>;
