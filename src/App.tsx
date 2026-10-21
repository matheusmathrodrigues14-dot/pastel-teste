import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import {
  categories,
  products,
  type CategoryId,
  type Product,
} from "./data/catalog";
import { shopConfig } from "./data/config";
import { ProductImage } from "./components/ProductImage";
import { ProductModal } from "./components/ProductModal";
import { CartDrawer } from "./components/CartDrawer";
import { useCart } from "./hooks/useCart";
import { useCinematicScroll } from "./hooks/useCinematicScroll";
import { money, subtotal } from "./lib/order";

function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  return (
    <article className="product-card">
      <div className="product-card-visual">
        <ProductImage product={product} />
        <span className="image-label">Imagem ilustrativa</span>
      </div>
      <div className="product-card-body">
        <div className="product-card-top">
          <div>
            <span className="category-kicker">
              {
                categories.find((category) => category.id === product.category)
                  ?.label
              }
            </span>
            <h3>{product.name}</h3>
          </div>
          <strong>
            {money(product.basePriceCents)} <small>desde</small>
          </strong>
        </div>
        <p>{product.description}</p>
        <button
          className="product-add"
          onClick={() => onSelect(product)}
          aria-label={`Personalizar ${product.name}`}
        >
          <span>Personalizar pedido</span>
          <span className="add-icon">
            <Plus size={19} />
          </span>
        </button>
      </div>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">
        <span className="eyebrow-line" />
        {eyebrow}
      </span>
      <div className="title-mask">
        <h2>{title}</h2>
      </div>
      {text && <p>{text}</p>}
    </div>
  );
}

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<CategoryId | "todos">("todos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const cart = useCart();
  useCinematicScroll(appRef);
  const [brandFirst, ...brandRest] = shopConfig.name.split(" ");
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const filtered = products.filter(
    (product) =>
      (category === "todos" || product.category === category) &&
      `${product.name} ${product.description} ${product.flavors?.map((flavor) => flavor.label).join(" ") ?? ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(query.toLocaleLowerCase("pt-BR").trim()),
  );

  function navTo(id: string) {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div ref={appRef}>
      <div className="top-note">
        <Sparkles size={13} /> Conceito demonstrativo de cardápio digital —
        produtos e preços ilustrativos <Sparkles size={13} />
      </div>
      <header className="site-header">
        <a
          className="brand"
          href="#inicio"
          aria-label={`${shopConfig.name}, voltar ao início`}
        >
          <span className="brand-mark">
            {brandFirst[0]?.toLowerCase()}
            <span>.</span>
          </span>
          <span className="brand-name">
            {brandFirst}
            <span>{brandRest.join(" ")}</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#destaques">Destaques</a>
          <a href="#cardapio">Cardápio</a>
          <a href="#sobre">Sobre</a>
          <a href="#como-pedir">Como pedir</a>
          <a href="#contato">Contato</a>
        </nav>
        <div className="header-actions">
          <button
            className="header-cart"
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir carrinho com ${itemCount} itens`}
          >
            <ShoppingBag size={19} />
            <span>Meu pedido</span>
            {itemCount > 0 && <b>{itemCount}</b>}
          </button>
          <button
            className="menu-toggle icon-button"
            onClick={() => setMobileMenu((value) => !value)}
            aria-label={mobileMenu ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
        {mobileMenu && (
          <nav className="mobile-nav" aria-label="Navegação para celular">
            {[
              ["inicio", "Início"],
              ["destaques", "Destaques"],
              ["cardapio", "Cardápio"],
              ["sobre", "Sobre"],
              ["como-pedir", "Como pedir"],
              ["contato", "Contato"],
            ].map(([id, label]) => (
              <button key={id} onClick={() => navTo(id)}>
                {label}
                <ArrowUpRight size={16} />
              </button>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-inner container">
            <div className="hero-copy">
              <span className="eyebrow hero-eyebrow">
                <span className="eyebrow-line" /> Uma pausa mais crocante
              </span>
              <h1>
                <span className="hero-word-mask">
                  <span className="hero-word">O</span>
                </span>{" "}
                <span className="hero-word-mask">
                  <span className="hero-word">sabor</span>
                </span>{" "}
                <span className="hero-word-mask">
                  <span className="hero-word">mora</span>
                </span>{" "}
                <em>
                  <span className="hero-word-mask">
                    <span className="hero-word">nos</span>
                  </span>{" "}
                  <span className="hero-word-mask">
                    <span className="hero-word">detalhes.</span>
                  </span>
                </em>
              </h1>
              <p>
                Uma experiência feita para despertar a vontade de dar a primeira
                mordida. Escolha, personalize e monte seu pedido em poucos
                toques.
              </p>
              <div className="hero-buttons">
                <a className="button button-primary" href="#cardapio">
                  Ver cardápio <ArrowUpRight size={19} />
                </a>
                <button
                  className="button button-outline"
                  onClick={() => setCartOpen(true)}
                >
                  Fazer pedido <ShoppingBag size={18} />
                </button>
              </div>
              <div className="hero-bottom">
                <div className="round-stamp">
                  <span>feito para</span>
                  <strong>saborear</strong>
                  <span>cada momento</span>
                </div>
                <span className="scroll-cue">
                  Role para descobrir <ArrowDown size={17} />
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <div
                className="hero-photo"
                role="img"
                aria-label="Imagem ilustrativa de um pastel artesanal crocante"
              />
              <div className="hero-next-photo" aria-hidden="true" />
              <div className="hero-immersive-shade" aria-hidden="true" />
              <div className="hero-photo-shade" />
              <div className="hero-photo-caption">
                <span className="caption-rule" /> Crocância que conta histórias
              </div>
              <div className="hero-badge">
                <Sparkles size={17} />
                <span>
                  Do seu
                  <br />
                  <strong>jeito.</strong>
                </span>
              </div>
            </div>
          </div>
          <div className="hero-side-text">PASTEL • AFETO • MOMENTO</div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div>
            {Array.from({ length: 4 }, (_, index) => (
              <span key={index}>
                FEITO PARA MOMENTOS BONS{" "}
                <span className="marquee-star">✳</span> CROCANTE POR FORA,
                ESPECIAL POR DENTRO{" "}
                <span className="marquee-star">✳</span>{" "}
              </span>
            ))}
          </div>
        </div>

        <section className="featured section-pad" id="destaques">
          <div className="container">
            <div className="section-top">
              <SectionHeading
                eyebrow="Para abrir o apetite"
                title="Uma seleção de dar água na boca."
                text="Sugestões demonstrativas para você imaginar as possibilidades do cardápio."
              />
              <a href="#cardapio" className="text-link">
                Explorar cardápio <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="featured-grid">
              {products
                .filter((product) => product.featured)
                .slice(0, 3)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={setSelected}
                  />
                ))}
            </div>
          </div>
        </section>

        <section className="story" id="sobre">
          <div className="story-image">
            <div
              className="story-photo"
              role="img"
              aria-label="Imagem ilustrativa de pastel servido à mesa"
            />
            <span className="story-image-label">Uma ideia para saborear</span>
          </div>
          <div className="story-copy">
            <span className="eyebrow">
              <span className="eyebrow-line" /> Sobre este conceito
            </span>
            <div className="story-title-mask">
              <h2>
                Mais que um pastel. <em>Um convite.</em>
              </h2>
            </div>
            <p>
              Imaginamos uma pastelaria onde escolher seu favorito é tão
              prazeroso quanto saboreá-lo. Cada detalhe deste site foi pensado
              para transformar um pedido simples em uma boa experiência.
            </p>
            <p className="story-disclaimer">
              Texto institucional demonstrativo. Substitua pela história real da
              pastelaria antes da publicação comercial.
            </p>
            <a className="text-link" href="#como-pedir">
              Veja como funciona <ArrowUpRight size={18} />
            </a>
          </div>
        </section>

        <section className="menu-section section-pad" id="cardapio">
          <div className="container">
            <div className="menu-heading">
              <SectionHeading
                eyebrow="Escolha seu momento"
                title="Nosso cardápio <em>de exemplo.</em>"
                text="Explore sabores ilustrativos. O cardápio oficial, os preços e a disponibilidade serão definidos pela pastelaria."
              />
              <span className="menu-note">
                <Sparkles size={16} /> Personalize antes de adicionar
              </span>
            </div>
            <div className="menu-toolbar">
              <div
                className="category-tabs"
                role="group"
                aria-label="Filtrar por categoria"
              >
                <button
                  className={category === "todos" ? "active" : ""}
                  onClick={() => setCategory("todos")}
                >
                  Todos
                </button>
                {categories.map((item) => (
                  <button
                    key={item.id}
                    className={category === item.id ? "active" : ""}
                    onClick={() => setCategory(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <label className="search-box">
                <Search size={18} />
                <span className="sr-only">Buscar produtos</span>
                <input
                  placeholder="Buscar no cardápio"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
            </div>
            <div className="menu-grid">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelected}
                />
              ))}
            </div>
            {!filtered.length && (
              <div className="no-results">
                <Search size={30} />
                <h3>Nenhum produto encontrado</h3>
                <p>Tente outro termo ou escolha uma categoria diferente.</p>
                <button
                  className="text-link"
                  onClick={() => {
                    setCategory("todos");
                    setQuery("");
                  }}
                >
                  Limpar filtros <ArrowRight size={17} />
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="how-section section-pad" id="como-pedir">
          <div className="container">
            <SectionHeading
              eyebrow="Simples assim"
              title="Seu pedido, do seu jeito."
              text="Tudo acontece em poucos passos, sem pressa e sem complicação."
            />
            <div className="steps">
              <div className="step reveal">
                <span>01</span>
                <div className="step-icon">
                  <Search size={25} />
                </div>
                <h3>Explore</h3>
                <p>
                  Navegue pelo cardápio e encontre o que deu vontade de comer.
                </p>
              </div>
              <div className="step reveal">
                <span>02</span>
                <div className="step-icon">
                  <Plus size={27} />
                </div>
                <h3>Personalize</h3>
                <p>
                  Escolha as opções disponíveis, adicionais e deixe sua
                  observação.
                </p>
              </div>
              <div className="step reveal">
                <span>03</span>
                <div className="step-icon">
                  <ShoppingBag size={25} />
                </div>
                <h3>Envie</h3>
                <p>
                  Revise seu carrinho e envie a mensagem para confirmar com a
                  pastelaria.
                </p>
              </div>
            </div>
            <div className="steps-cta">
              <a className="button button-dark" href="#cardapio">
                Escolher meu pastel <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contato">
          <div className="container contact-inner">
            <div className="contact-copy">
              <span className="eyebrow">
                <span className="eyebrow-line" /> Fale com a gente
              </span>
              <h2>
                Uma boa conversa começa com <em>um bom pastel.</em>
              </h2>
              <p>
                Os canais e dados oficiais da pastelaria serão adicionados aqui
                quando estiverem disponíveis.
              </p>
              <button
                className="button button-primary"
                onClick={() => setCartOpen(true)}
              >
                Montar meu pedido <ArrowUpRight size={18} />
              </button>
            </div>
            <div className="contact-card">
              <div className="contact-card-header">
                <span className="contact-card-mark">
                  {brandFirst[0]?.toLowerCase()}.
                </span>
                <span>Informações comerciais</span>
              </div>
              <div className="contact-row">
                <MapPin size={21} />
                <div>
                  <strong>Onde estamos</strong>
                  <span>{shopConfig.address || "Endereço a confirmar"}</span>
                </div>
              </div>
              <div className="contact-row">
                <Clock3 size={21} />
                <div>
                  <strong>Horários</strong>
                  <span>{shopConfig.hours || "Horários a confirmar"}</span>
                </div>
              </div>
              <div className="contact-row">
                <Instagram size={21} />
                <div>
                  <strong>Redes sociais</strong>
                  {shopConfig.instagramUrl ? (
                    <a
                      href={shopConfig.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Acompanhe no Instagram
                    </a>
                  ) : (
                    <span>Perfil a confirmar</span>
                  )}
                </div>
              </div>
              <div className="contact-card-foot">
                <Check size={16} /> Dados reais serão adicionados antes da
                publicação
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand" href="#inicio">
            <span className="brand-mark">
              {brandFirst[0]?.toLowerCase()}
              <span>.</span>
            </span>
            <span className="brand-name">
              {brandFirst}
              <span>{brandRest.join(" ")}</span>
            </span>
          </a>
          <p>
            Conceito demonstrativo. Nome, imagens, produtos e preços
            ilustrativos.
          </p>
          <a href="#inicio" className="back-top">
            Voltar ao topo <ArrowUpRight size={17} />
          </a>
        </div>
      </footer>

      {itemCount > 0 && (
        <button
          className="floating-cart"
          onClick={() => setCartOpen(true)}
          aria-label={`Abrir carrinho com ${itemCount} itens. Total ${money(subtotal(cart.items))}`}
        >
          <ShoppingBag size={19} />
          <span>
            {itemCount} {itemCount === 1 ? "item" : "itens"} ·{" "}
            {money(subtotal(cart.items))}
          </span>
          <ArrowUpRight size={17} />
        </button>
      )}
      {selected && (
        <ProductModal
          key={selected.id}
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={cart.add}
        />
      )}
      {cartOpen && (
        <CartDrawer
          items={cart.items}
          onClose={() => setCartOpen(false)}
          onQuantity={cart.updateQuantity}
          onRemove={cart.remove}
        />
      )}
    </div>
  );
}
