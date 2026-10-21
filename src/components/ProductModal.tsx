import { useRef, useState } from "react";
import { Check, Minus, Plus, X } from "lucide-react";
import type { Product } from "../data/catalog";
import type { CartItem } from "../lib/order";
import { isValidSelection, money, unitPrice } from "../lib/order";
import { ProductImage } from "./ProductImage";
import { useDialogFocus } from "../hooks/useDialogFocus";

type Props = {
  product: Product;
  onClose: () => void;
  onAdd: (item: Omit<CartItem, "id">) => void;
};

export function ProductModal({ product, onClose, onAdd }: Props) {
  const dialogRef = useRef<HTMLElement>(null);
  const [flavorId, setFlavorId] = useState(product.flavors?.[0]?.id);
  const [sizeId, setSizeId] = useState(product.sizes?.[0]?.id);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const selection = { flavorId, sizeId, addOnIds };
  const valid = isValidSelection(product, selection);

  useDialogFocus(dialogRef, onClose);

  function toggleAddOn(id: string) {
    setAddOnIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  function submit() {
    if (!valid) return;
    onAdd({
      productId: product.id,
      flavorId,
      sizeId,
      addOnIds,
      notes: notes.trim(),
      quantity,
    });
    onClose();
  }

  return (
    <div
      className="overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
      >
        <button
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Fechar personalização"
        >
          <X size={20} />
        </button>
        <ProductImage product={product} className="modal-image" />
        <div className="modal-content">
          <span className="eyebrow">Monte do seu jeito · exemplo</span>
          <h2 id="product-title">{product.name}</h2>
          <p className="muted">{product.description}</p>
          {product.flavors?.length ? (
            <fieldset className="choice-group">
              <legend>Escolha o sabor</legend>
              {product.flavors.map((choice) => (
                <label
                  className={`choice-row ${flavorId === choice.id ? "selected" : ""}`}
                  key={choice.id}
                >
                  <input
                    type="radio"
                    name="flavor"
                    value={choice.id}
                    checked={flavorId === choice.id}
                    onChange={() => setFlavorId(choice.id)}
                  />
                  <span>{choice.label}</span>
                  <small>
                    {choice.priceCents
                      ? `+ ${money(choice.priceCents)}`
                      : "Incluso"}
                  </small>
                </label>
              ))}
            </fieldset>
          ) : null}
          {product.sizes?.length ? (
            <fieldset className="choice-group">
              <legend>Escolha o tamanho</legend>
              {product.sizes.map((choice) => (
                <label
                  className={`choice-row ${sizeId === choice.id ? "selected" : ""}`}
                  key={choice.id}
                >
                  <input
                    type="radio"
                    name="size"
                    value={choice.id}
                    checked={sizeId === choice.id}
                    onChange={() => setSizeId(choice.id)}
                  />
                  <span>{choice.label}</span>
                  <small>
                    {choice.priceCents
                      ? `+ ${money(choice.priceCents)}`
                      : "Incluso"}
                  </small>
                </label>
              ))}
            </fieldset>
          ) : null}
          {product.addOns?.length ? (
            <fieldset className="choice-group">
              <legend>Adicionais disponíveis</legend>
              {product.addOns.map((choice) => (
                <label
                  className={`choice-row ${addOnIds.includes(choice.id) ? "selected" : ""}`}
                  key={choice.id}
                >
                  <input
                    type="checkbox"
                    checked={addOnIds.includes(choice.id)}
                    onChange={() => toggleAddOn(choice.id)}
                  />
                  <span>{choice.label}</span>
                  <small>+ {money(choice.priceCents)}</small>
                </label>
              ))}
            </fieldset>
          ) : null}
          <label className="field-label" htmlFor="product-notes">
            Alguma observação?
          </label>
          <textarea
            id="product-notes"
            placeholder="Ex.: sem cebola"
            maxLength={300}
            rows={2}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <div className="modal-bottom">
            <div className="quantity-control" aria-label="Quantidade">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Diminuir quantidade"
              >
                <Minus size={16} />
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                aria-label="Aumentar quantidade"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              className="button button-primary add-button"
              onClick={submit}
              disabled={!valid}
            >
              <Check size={18} /> Adicionar{" "}
              <strong>{money(unitPrice(product, selection) * quantity)}</strong>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
