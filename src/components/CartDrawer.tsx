import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { productById } from "../data/catalog";
import { shopConfig } from "../data/config";
import type { CartItem, Customer } from "../lib/order";
import {
  buildOrderMessage,
  checkoutError,
  itemDetails,
  money,
  subtotal,
  unitPrice,
  whatsappUrl,
} from "../lib/order";
import { ProductImage } from "./ProductImage";
import { useDialogFocus } from "../hooks/useDialogFocus";

type Props = {
  items: CartItem[];
  onClose: () => void;
  onQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export function CartDrawer({ items, onClose, onQuantity, onRemove }: Props) {
  const dialogRef = useRef<HTMLElement>(null);
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    fulfillment: shopConfig.fulfillmentModes[0] ?? "pickup",
    address: "",
    paymentMethod: "",
  });
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  useDialogFocus(dialogRef, onClose);

  function checkout() {
    const validation = checkoutError(
      items,
      customer,
      shopConfig.whatsappNumber,
    );
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    window.open(
      whatsappUrl(
        shopConfig.whatsappNumber,
        buildOrderMessage(items, customer),
      ),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div
      className="overlay drawer-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        ref={dialogRef}
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="drawer-header">
          <div>
            <span className="eyebrow">Seu pedido</span>
            <h2 id="cart-title">
              Meu carrinho{" "}
              <span>
                ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </span>
            </h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Fechar carrinho"
          >
            <X size={20} />
          </button>
        </div>
        <div className="drawer-scroll">
          {!items.length ? (
            <div className="cart-empty">
              <ShoppingBag size={36} strokeWidth={1.5} />
              <h3>Seu carrinho está vazio</h3>
              <p>Escolha algo gostoso no cardápio para começar.</p>
              <button className="button button-primary" onClick={onClose}>
                Explorar cardápio
              </button>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {items.map((item) => {
                  const product = productById[item.productId];
                  return (
                    <article className="cart-item" key={item.id}>
                      <ProductImage
                        product={product}
                        className="cart-item-image"
                      />
                      <div className="cart-item-content">
                        <div className="cart-item-top">
                          <h3>{product.name}</h3>
                          <button
                            onClick={() => onRemove(item.id)}
                            aria-label={`Remover ${product.name}`}
                            className="remove-button"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {itemDetails(item) && <p>{itemDetails(item)}</p>}
                        {item.notes && <p>Obs.: {item.notes}</p>}
                        <div className="cart-item-bottom">
                          <div className="quantity-control small">
                            <button
                              onClick={() =>
                                onQuantity(item.id, item.quantity - 1)
                              }
                              aria-label={`Diminuir ${product.name}`}
                            >
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                onQuantity(item.id, item.quantity + 1)
                              }
                              aria-label={`Aumentar ${product.name}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <strong>
                            {money(unitPrice(product, item) * item.quantity)}
                          </strong>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="checkout-fields">
                <h3>Para finalizar</h3>
                <label className="field-label" htmlFor="customer-name">
                  Seu nome <span>*</span>
                </label>
                <input
                  id="customer-name"
                  value={customer.name}
                  onChange={(event) =>
                    setCustomer({ ...customer, name: event.target.value })
                  }
                  placeholder="Como podemos chamar você?"
                  autoComplete="name"
                />
                <label className="field-label" htmlFor="fulfillment">
                  Como prefere receber? <span>*</span>
                </label>
                <select
                  id="fulfillment"
                  value={customer.fulfillment}
                  onChange={(event) =>
                    setCustomer({
                      ...customer,
                      fulfillment: event.target
                        .value as Customer["fulfillment"],
                    })
                  }
                >
                  {shopConfig.fulfillmentModes.includes("pickup") && (
                    <option value="pickup">Retirada (exemplo)</option>
                  )}
                  {shopConfig.fulfillmentModes.includes("delivery") && (
                    <option value="delivery">Entrega (exemplo)</option>
                  )}
                </select>
                {customer.fulfillment === "delivery" && (
                  <>
                    <label className="field-label" htmlFor="customer-address">
                      Endereço de entrega <span>*</span>
                    </label>
                    <textarea
                      id="customer-address"
                      rows={2}
                      value={customer.address}
                      onChange={(event) =>
                        setCustomer({
                          ...customer,
                          address: event.target.value,
                        })
                      }
                      placeholder="Rua, número, bairro e complemento"
                      autoComplete="street-address"
                    />
                  </>
                )}
                <label className="field-label" htmlFor="payment-method">
                  Forma de pagamento <span>*</span>
                </label>
                <input
                  id="payment-method"
                  value={customer.paymentMethod}
                  onChange={(event) =>
                    setCustomer({
                      ...customer,
                      paymentMethod: event.target.value,
                    })
                  }
                  placeholder="Como pretende pagar?"
                  maxLength={60}
                  autoComplete="off"
                />
                <p className="field-help">
                  Informe apenas a forma desejada. Não digite dados do cartão.
                </p>
                <p className="field-help">
                  Modalidades e valores são demonstrativos. A disponibilidade
                  deve ser confirmada pela pastelaria.
                </p>
              </div>
            </>
          )}
        </div>
        <div className="drawer-footer">
          <div className="total-line">
            <span>Subtotal</span>
            <strong>{money(subtotal(items))}</strong>
          </div>
          <div className="total-line total-emphasis">
            <span>Total</span>
            <strong>{money(subtotal(items))}</strong>
          </div>
          <p className="field-help">
            Taxas de entrega não configuradas. O valor final será confirmado
            pelo estabelecimento.
          </p>
          {!shopConfig.whatsappNumber && (
            <p className="field-help">
              O envio pelo WhatsApp ficará disponível quando o número oficial
              for cadastrado.
            </p>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="button button-primary checkout-button"
            onClick={checkout}
          >
            Finalizar pedido pelo WhatsApp <ArrowUpRight size={18} />
          </button>
          {items.length > 0 && (
            <button
              className="preview-link"
              onClick={() => setPreview((value) => !value)}
            >
              {preview ? "Ocultar mensagem" : "Pré-visualizar mensagem"}
            </button>
          )}
          {preview && items.length > 0 && (
            <pre className="message-preview">
              {buildOrderMessage(items, customer)}
            </pre>
          )}
          <p className="checkout-note">
            O pedido só será confirmado após a resposta da pastelaria.
          </p>
        </div>
      </aside>
    </div>
  );
}
