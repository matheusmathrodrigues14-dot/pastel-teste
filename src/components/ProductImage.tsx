import type { Product } from "../data/catalog";

const positions = {
  tl: "left top",
  tr: "right top",
  bl: "left bottom",
  br: "right bottom",
};

export function ProductImage({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div
      className={`product-image ${className}`}
      role="img"
      aria-label={`Imagem ilustrativa de ${product.name}`}
      style={{ backgroundPosition: positions[product.imageQuadrant] }}
    />
  );
}
