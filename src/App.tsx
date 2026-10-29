import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Search, Smartphone, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brands, phones, type Brand, type Phone } from "./data/phones";

gsap.registerPlugin(ScrollTrigger);
const WHATSAPP = "5519987715865";
const whatsappLink = (phone?: string, name?: string) => {
  const intro = name?.trim() ? `Olá! Meu nome é ${name.trim()}.` : "Olá!";
  const interest = phone ? ` Tenho interesse no ${phone}. Gostaria de consultar disponibilidade, cores, capacidade e valor.` : " Gostaria de saber mais sobre os celulares disponíveis.";
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(intro + interest)}`;
};

function MagneticLink({ children, href, className = "", onClick }: { children: React.ReactNode; href: string; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    gsap.to(ref.current, { x: (event.clientX - rect.left - rect.width / 2) * .16, y: (event.clientY - rect.top - rect.height / 2) * .2, duration: .35, ease: "power3.out" });
  };
  return <a ref={ref} href={href} className={`magnetic ${className}`} onMouseMove={move} onMouseLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: .55, ease: "elastic.out(1, .45)" })} onClick={onClick}>{children}</a>;
}

function PhoneVisual({ tone = "orange", small = false }: { tone?: "orange" | "silver" | "blue"; small?: boolean }) {
  return <div className={`phone-visual ${tone} ${small ? "small" : ""}`} aria-hidden="true"><div className="phone-camera"><i/><i/><i/></div><div className="phone-mark">◌</div></div>;
}

function App() {
  const root = useRef<HTMLDivElement>(null);
  const pinSection = useRef<HTMLElement>(null);
  const [brand, setBrand] = useState<Brand | "Todos">("Todos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Phone | null>(null);
  const [visitor, setVisitor] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const filtered = useMemo(() => phones.filter(phone => (brand === "Todos" || phone.brand === brand) && `${phone.name} ${phone.family}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))), [brand, query]);
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      gsap.fromTo(".hero-enter", { y: 35, opacity: 0 }, { y: 0, opacity: 1, stagger: .12, duration: 1, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach(el => gsap.fromTo(el, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 87%", once: true } }));
      if (window.innerWidth >= 800 && pinSection.current) {
        const cards = gsap.utils.toArray<HTMLElement>(".story-panel");
        gsap.set(cards.slice(1), { autoAlpha: 0, y: 40 });
        const timeline = gsap.timeline({ scrollTrigger: { trigger: pinSection.current, start: "top top", end: "+=170%", pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true } });
        timeline.to(cards[0], { autoAlpha: 0, y: -40, duration: .5 }).to(cards[1], { autoAlpha: 1, y: 0, duration: .5 }, "<+.15");
      }
    }, root);
    return () => context.revert();
  }, []);
  const pick = (phone: Phone) => { setSelected(phone); document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" }); };
  return <div ref={root}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header"><a className="logo" href="#inicio" aria-label="Órbita Mobile, início"><span className="logo-symbol">◉</span> ÓRBITA<span className="logo-light">/mobile</span></a><nav className={menuOpen ? "nav open" : "nav"} aria-label="Navegação principal"><a href="#colecao" onClick={() => setMenuOpen(false)}>Coleção</a><a href="#experiencia" onClick={() => setMenuOpen(false)}>Experiência</a><a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a></nav><MagneticLink className="nav-cta" href={whatsappLink()} >Falar no WhatsApp <ArrowUpRight size={16}/></MagneticLink><button className="menu-toggle" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></header>
    <main id="conteudo">
      <section className="hero" id="inicio"><div className="hero-grid"><div className="hero-copy"><div className="eyebrow hero-enter"><span className="pulse"/> UMA NOVA FORMA DE ESCOLHER</div><h1 className="hero-enter">O próximo capítulo está <em>na sua mão.</em></h1><p className="hero-enter">Encontre o celular que acompanha seu ritmo. iPhone, Xiaomi, Motorola e Samsung em uma experiência de escolha simples, direta e sem pressa.</p><div className="hero-actions hero-enter"><MagneticLink href="#colecao" className="button primary">Explorar modelos <ArrowUpRight size={18}/></MagneticLink><MagneticLink href={whatsappLink()} className="button outline">Conversar com a gente <ArrowRight size={18}/></MagneticLink></div><div className="hero-foot hero-enter"><span>01 / 04</span><span>Role para descobrir <ArrowDown size={16}/></span></div></div><div className="hero-art hero-enter"><div className="orbit orbit-outer"/><div className="orbit orbit-inner"/><div className="phone-stack phone-back"><PhoneVisual tone="silver"/></div><div className="phone-stack phone-front"><PhoneVisual/></div><div className="hero-art-label">ESCOLHAS QUE MOVEM VOCÊ <span>↗</span></div></div></div></section>
      <section className="brand-strip" aria-label="Marcas disponíveis"><span>UM UNIVERSO DE POSSIBILIDADES</span><div>Apple <b>✳</b> Xiaomi <b>✳</b> Motorola <b>✳</b> Samsung</div></section>
      <section className="intro section-wrap" id="experiencia"><div className="section-kicker reveal">01 — A EXPERIÊNCIA</div><div className="intro-content reveal"><h2>Tecnologia boa é aquela que <em>faz sentido para você.</em></h2><p>Sem excesso de informação. Explore as linhas, escolha um modelo e fale diretamente com a gente para confirmar cores, capacidade, preço e disponibilidade.</p></div></section>
      <section className="pinned-story" ref={pinSection} aria-label="Como funciona"><div className="story-shell"><div className="story-top"><span>02 — SUA ESCOLHA</span><span>DESLIZE PARA EXPLORAR ↓</span></div><div className="story-panel"><div className="story-copy"><span className="eyebrow orange">01 / DESCUBRA</span><h2>O modelo certo para o seu <em>momento.</em></h2><p>Do essencial ao extraordinário, navegue por famílias de celulares pensadas para diferentes rotinas.</p><a href="#colecao" className="text-link">Ver a coleção <ArrowUpRight size={20}/></a></div><div className="story-visual"><PhoneVisual tone="blue"/><div className="story-number">01</div></div></div><div className="story-panel"><div className="story-copy"><span className="eyebrow orange">02 / CONVERSE</span><h2>Decida com <em>clareza.</em> Finalize com facilidade.</h2><p>Escolheu um modelo? Sua conversa já começa com ele no WhatsApp. Você recebe os detalhes antes de decidir.</p><a href="#contato" className="text-link">Começar conversa <ArrowUpRight size={20}/></a></div><div className="story-visual visual-orange"><Smartphone size={140} strokeWidth={.6}/><div className="story-number">02</div></div></div></div></section>
      <section className="catalog section-wrap" id="colecao"><div className="catalog-heading reveal"><div><div className="section-kicker">03 — COLEÇÃO</div><h2>Encontre o seu <em>próximo.</em></h2><p>Explore modelos e consulte as opções disponíveis em uma conversa.</p></div><span className="catalog-count">{phones.length} modelos para explorar</span></div><div className="catalog-tools reveal"><div className="tabs" role="group" aria-label="Filtrar por marca">{(["Todos", ...brands] as const).map(item => <button key={item} className={brand === item ? "active" : ""} onClick={() => setBrand(item)} aria-pressed={brand === item}>{item}</button>)}</div><label className="search"><Search size={18}/><span className="sr-only">Buscar modelo</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar modelo..."/></label></div><div className="product-grid">{filtered.slice(0, brand === "Todos" && !query ? 12 : undefined).map((phone, index) => <article className="phone-card" key={phone.name}><div className="card-art" style={{ "--device-color": phone.accent } as React.CSSProperties}><div className="mini-device"><i/><i/><i/></div><span className="card-index">{String(index + 1).padStart(2,"0")}</span></div><div className="card-meta"><span>{phone.brand} / {phone.family}</span><h3>{phone.name}</h3><button onClick={() => pick(phone)} aria-label={`Consultar ${phone.name}`}>Consultar disponibilidade <ArrowUpRight size={17}/></button></div></article>)}</div>{filtered.length === 0 && <p className="empty">Nenhum modelo encontrado. Tente outra busca ou pergunte pelo WhatsApp.</p>}{brand === "Todos" && !query && <p className="catalog-hint">Selecione uma marca para explorar mais modelos. Não encontrou o que procura? Consulte nossa equipe.</p>}</section>
      <section className="contact" id="contato"><div className="contact-inner"><div className="section-kicker reveal">04 — VAMOS CONVERSAR</div><h2 className="reveal">Seu próximo celular começa com uma <em>boa conversa.</em></h2><p className="reveal">Conte o que você procura. Confirmamos as opções e os detalhes diretamente pelo WhatsApp.</p><div className="contact-form reveal"><label htmlFor="model-select">Modelo de interesse</label><div className="select-wrap"><select id="model-select" value={selected?.name || ""} onChange={event => setSelected(phones.find(phone => phone.name === event.target.value) || null)}><option value="">Ainda estou escolhendo</option>{brands.map(item => <optgroup key={item} label={item}>{phones.filter(phone => phone.brand === item).map(phone => <option key={phone.name} value={phone.name}>{phone.name}</option>)}</optgroup>)}</select><ChevronDown size={19}/></div><label htmlFor="visitor-name">Seu nome <span>(opcional)</span></label><input id="visitor-name" value={visitor} onChange={event => setVisitor(event.target.value)} placeholder="Como podemos chamar você?"/><MagneticLink href={whatsappLink(selected?.name, visitor)} className="button primary contact-button">Continuar no WhatsApp <ArrowUpRight size={19}/></MagneticLink><small><Check size={15}/> A conversa abre no WhatsApp. Disponibilidade e valores são confirmados por lá.</small></div></div></section>
    </main><footer className="footer"><a className="logo" href="#inicio"><span className="logo-symbol">◉</span> ÓRBITA<span className="logo-light">/mobile</span></a><p>Um jeito mais simples de encontrar seu próximo celular.</p><div><a href="#colecao">Modelos</a><a href="#experiencia">Experiência</a><a href={whatsappLink()}>WhatsApp</a></div><span>© {new Date().getFullYear()} Órbita Mobile. Identidade provisória.</span></footer>
  </div>;
}
export default App;
