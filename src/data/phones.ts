export type Brand = "Apple" | "Xiaomi" | "Motorola" | "Samsung";
export type Phone = { name: string; brand: Brand; family: string; accent: string };
const entries: Record<Brand, Record<string, string[]>> = {
  Apple: {
    "iPhone 17": ["iPhone 17", "iPhone Air", "iPhone 17 Pro", "iPhone 17 Pro Max"],
    "iPhone 16": ["iPhone 16e", "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max"],
    "iPhone 15": ["iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max"],
  },
  Xiaomi: {
    Xiaomi: ["Xiaomi 15 Ultra", "Xiaomi 15 Pro", "Xiaomi 15", "Xiaomi 14 Ultra", "Xiaomi 14", "Xiaomi 14T Pro", "Xiaomi 14T", "Xiaomi 13T Pro", "Xiaomi 13T"],
    "Redmi Note": ["Redmi Note 15 Pro+", "Redmi Note 15 Pro", "Redmi Note 15", "Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 14", "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13"],
    Redmi: ["Redmi 15", "Redmi 14C", "Redmi 13", "Redmi A5"],
    POCO: ["POCO F7 Ultra", "POCO F7 Pro", "POCO F7", "POCO X7 Pro", "POCO X7", "POCO M7 Pro", "POCO C75"],
  },
  Motorola: {
    Razr: ["Motorola Razr 60 Ultra", "Motorola Razr 60", "Motorola Razr 50 Ultra", "Motorola Razr 50"],
    Edge: ["Motorola Edge 60 Pro", "Motorola Edge 60 Fusion", "Motorola Edge 60", "Motorola Edge 50 Ultra", "Motorola Edge 50 Pro", "Motorola Edge 50 Fusion"],
    "Moto G": ["Moto G86", "Moto G75", "Moto G56", "Moto G55", "Moto G35", "Moto G24"],
  },
  Samsung: {
    "Galaxy S FE": ["Galaxy S25 FE", "Galaxy S24 FE", "Galaxy S23 FE", "Galaxy S21 FE"],
    "Galaxy S": ["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25", "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24"],
    "Galaxy A": ["Galaxy A56", "Galaxy A36", "Galaxy A26", "Galaxy A16"],
    "Galaxy Z": ["Galaxy Z Fold7", "Galaxy Z Flip7", "Galaxy Z Fold6", "Galaxy Z Flip6"],
  },
};
const accents: Record<Brand, string> = { Apple: "#d7dbdf", Xiaomi: "#ff9a50", Motorola: "#96a8bd", Samsung: "#b5bce1" };
export const brands = Object.keys(entries) as Brand[];
export const phones: Phone[] = brands.flatMap(brand => Object.entries(entries[brand]).flatMap(([family, names]) => names.map(name => ({ name, brand, family, accent: accents[brand] }))));
