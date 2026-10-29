import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, Menu, Search, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brands, phones, type Brand, type Phone } from "./data/phones";

gsap.registerPlugin(ScrollTrigger);

const whatsappNumber = "5519987715865";
const brandImages: Record<Brand, string> = {
  Apple: "/images/apple-studio.webp",
  Xiaomi: "/images/xiaomi-studio.webp",
  Samsung: "/images/samsung-studio.webp",
  Motorola: "/images/motorola-studio.webp",
};
const brandNames: Record<Brand, string> = {
  Apple: "iPhone",
  Xiaomi: "Xiaomi, Redmi & POCO",
  Samsung: "Samsung Galaxy",
  Motorola: "Motorola",
};
const brandNotes: Record<Brand, string> = {
  Apple: "Um universo de possibilidades na palma da mão.",
  Xiaomi: "Mais caminhos para escolher do seu jeito.",
  Samsung: "Uma linha para cada jeito de viver.",
  Motorola: "O próximo passo está mais perto.",
};
function whatsappLink(model?: string, name?: string) {
  const opening = name?.trim() ? `Olá! Meu nome é ${name.trim()}.` : "Olá!";
  const message = model
    ? `${opening} Tenho interesse no ${model}. Poderia confirmar disponibilidade, cor, capacidade e valor?`
    : `${opening} Quero ajuda para escolher um celular. Quais modelos estão disponíveis?`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
function MagneticLink({ children, href, className = "", onClick }: { children: React.ReactNode; href: string; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  function move(event: React.MouseEvent<HTMLAnchorElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    gsap.to(ref.current, { x: (event.clientX - rect.left - rect.width / 2) * .14, y: (event.clientY - rect.top - rect.height / 2) * .18, duration: .35, ease: "power3.out" });
  }
  return <a ref={ref} href={href} className={`magnetic ${className}`} onClick={onClick} onMouseMove={move} onMouseLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: .55, ease: "elastic.out(1, .45)" })}>{children}</a>;
}
function BrandImage({ brand, className = "", eager = true }: { brand: Brand; className?: string; eager?: boolean }) {
  return <img className={className} src={brandImages[brand]} alt={`Imagem ilustrativa de celulares da linha ${brandNames[brand]}`} loading={eager ? "eager" : "lazy"} decoding="async" />;
}
export default function App() {
  const page = useRef<HTMLDivElement>(null);
  const pinned = useRef<HTMLElement>(null);
  const [brand, setBrand] = useState<Brand>("Apple");
  const [selected, setSelected] = useState<Phone>(phones.find(phone => phone.name === "iPhone 17 Pro") ?? phones[0]);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const visible = useMemo(() => phones.filter(phone => phone.brand === brand && `${phone.name} ${phone.family}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))), [brand, query]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(".hero-in", { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .1, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach(el => gsap.fromTo(el, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }));
      if (window.innerWidth >= 900 && pinned.current) {
        const panels = gsap.utils.toArray<HTMLElement>(".pin-panel");
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 50 });
        gsap.timeline({ scrollTrigger: { trigger: pinned.current, start: "top top", end: "+=140%", pin: true, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true } })
          .to(panels[0], { autoAlpha: 0, y: -50, duration: .45 })
          .to(panels[1], { autoAlpha: 1, y: 0, duration: .55 }, "<+.12");
      }
    }, page);
    return () => context.revert();
  }, []);

  function chooseBrand(next: Brand, jump = false) {
    setBrand(next);
    setSelected(phones.find(phone => phone.brand === next)!);
    setQuery("");
    if (jump) window.setTimeout(() => document.getElementById("modelos")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }), 0);
  }
  function selectModel(phone: Phone) {
    setSelected(phone);
    if (window.innerWidth < 900) document.getElementById("modelo-selecionado")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return <div ref={page}>
    <a className="skip-link" href="#principal">Pular para o conteúdo</a>
    <header className="site-header"><div className="nav-inner"><a href="#inicio" className="logo" aria-label="Órbita Mobile, voltar ao início"><span className="logo-icon">✳︎</span> órbita<span className="logo-suffix">mobile</span></a><nav className={menuOpen ? "site-nav open" : "site-nav"} aria-label="Navegação principal"><a href="#marcas" onClick={() => setMenuOpen(false)}>Marcas</a><a href="#modelos" onClick={() => setMenuOpen(false)}>Modelos</a><a href="#experiencia" onClick={() => setMenuOpen(false)}>Como funciona</a></nav><MagneticLink href={whatsappLink()} className="nav-contact">Falar no WhatsApp <ArrowUpRight size={16}/></MagneticLink><button type="button" className="menu-toggle" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div></header>
    <main id="principal">
      <section className="hero" id="inicio"><div className="hero-content"><div className="hero-copy"><div className="eyebrow hero-in"><span className="tiny-star">✳︎</span> CELULARES PARA O SEU PRÓXIMO CAPÍTULO</div><h1 className="hero-in">Seu próximo celular.<br/><em>Seu próximo passo.</em></h1><p className="hero-in">Encontre o modelo que combina com você. Explore as marcas, compare possibilidades e converse direto com a gente.</p><div className="hero-actions hero-in"><MagneticLink href="#marcas" className="button button-orange">Encontrar meu celular <ArrowUpRight size={19}/></MagneticLink><MagneticLink href={whatsappLink()} className="button button-ghost">Falar com um especialista <ArrowRight size={19}/></MagneticLink></div><div className="hero-bottom hero-in"><span>ESCOLHA COM LIBERDADE</span><a href="#marcas">DESCUBRA <ArrowDown size={15}/></a></div></div><div className="hero-visual hero-in"><div className="hero-visual-frame"><BrandImage brand="Apple" eager/><span className="visual-tag">EM DESTAQUE / iPHONE</span></div><span className="visual-edge">01 / ENCONTRE O SEU PRÓXIMO</span></div></div></section>
      <section className="brand-intro" id="marcas"><div className="container"><div className="section-heading reveal"><div><span className="kicker">01 / EXPLORE POR MARCA</span><h2>Comece por quem<br/><em>combina com você.</em></h2></div><p>Toque em uma marca para ir direto aos modelos. A escolha continua com você.</p></div><div className="brand-grid">{brands.map((item, index) => <button className="brand-card reveal" key={item} type="button" onClick={() => chooseBrand(item, true)} aria-label={`Ver modelos ${item}`}><BrandImage brand={item}/><span className="brand-card-shade"/><span className="brand-card-top">0{index + 1} / {item.toUpperCase()}</span><span className="brand-card-bottom"><strong>{brandNames[item]}</strong><span>{brandNotes[item]}</span></span><span className="brand-card-arrow"><ArrowUpRight size={23}/></span></button>)}</div><p className="image-disclaimer">Imagens ilustrativas das linhas. Aparência, cores e disponibilidade variam conforme o modelo.</p></div></section>
      <section className="pinned-story" id="experiencia" ref={pinned}><div className="pin-inner"><div className="pin-header"><span>02 / A EXPERIÊNCIA</span><span>ROLE PARA DESCOBRIR ↓</span></div><div className="pin-panel"><div className="pin-copy"><span className="kicker">01 — EXPLORE</span><h2>Escolher fica melhor quando tudo <em>faz sentido.</em></h2><p>Encontre sua marca, veja as famílias de aparelhos e chegue ao modelo que quer conhecer melhor.</p><a href="#modelos">Explorar os modelos <ArrowUpRight size={20}/></a></div><div className="pin-photo"><BrandImage brand="Xiaomi"/><span>ENCONTRE O SEU RITMO.</span></div></div><div className="pin-panel"><div className="pin-copy"><span className="kicker">02 — CONVERSE</span><h2>Do modelo escolhido à conversa, <em>sem complicação.</em></h2><p>Você escolhe o aparelho. A mensagem chega pronta no WhatsApp para confirmar preço, cor, capacidade e disponibilidade.</p><a href="#modelos">Escolher agora <ArrowUpRight size={20}/></a></div><div className="pin-photo"><BrandImage brand="Samsung"/><span>SEU PRÓXIMO PASSO COMEÇA AQUI.</span></div></div></div></section>
      <section className="catalog" id="modelos"><div className="container"><div className="section-heading reveal"><div><span className="kicker">03 / ENCONTRE O SEU</span><h2>Escolha a marca.<br/><em>Encontre o modelo.</em></h2></div><p>Selecione um aparelho para ver o destaque e iniciar uma consulta personalizada.</p></div><div className="brand-tabs reveal" role="group" aria-label="Escolher marca">{brands.map(item => <button key={item} type="button" className={brand === item ? "active" : ""} aria-pressed={brand === item} onClick={() => chooseBrand(item)}>{item}<span>{phones.filter(phone => phone.brand === item).length}</span></button>)}</div><div className="catalog-browser"><div className="model-list"><div className="model-list-head"><strong>{brandNames[brand]}</strong><span>{visible.length} modelos</span></div><label className="model-search"><Search size={17}/><span className="sr-only">Buscar modelo</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Busque um modelo..."/></label><div className="model-scroll" role="group" aria-label={`Modelos ${brand}`}>{visible.map(phone => <button type="button" key={phone.name} aria-pressed={selected.name === phone.name} className={selected.name === phone.name ? "model-row active" : "model-row"} onClick={() => selectModel(phone)}><span><small>{phone.family}</small><strong>{phone.name}</strong></span><ChevronRight size={18}/></button>)}{visible.length === 0 && <p className="no-model">Nenhum modelo encontrado. Tente outra busca.</p>}</div></div><div className="selected-product" id="modelo-selecionado"><div className="selected-photo"><BrandImage brand={selected.brand}/><span>IMAGEM ILUSTRATIVA DA LINHA</span></div><div className="selected-info"><div><span className="kicker">{selected.brand.toUpperCase()} / {selected.family.toUpperCase()}</span><h3>{selected.name}</h3><p>Gostou deste modelo? Consulte as versões, cores, valores e disponibilidade diretamente com a nossa equipe.</p></div><MagneticLink href={whatsappLink(selected.name, name)} className="button button-orange">Consultar {selected.name} <ArrowUpRight size={19}/></MagneticLink></div></div></div><p className="catalog-note"><Check size={17}/> A consulta não confirma estoque. Nossa equipe responde com as opções disponíveis.</p></div></section>
      <section className="contact" id="contato"><div className="container contact-layout"><div><span className="kicker">04 / FALTA POUCO</span><h2>O celular certo começa com uma <em>boa conversa.</em></h2><p>Já tem um modelo em mente? Conte para a gente e receba as informações que precisa para decidir.</p></div><div className="contact-card"><span className="contact-card-label">CONVERSA DIRETA NO WHATSAPP</span><label htmlFor="customer-name">Como podemos chamar você? <span>(opcional)</span></label><input id="customer-name" value={name} onChange={event => setName(event.target.value)} placeholder="Seu nome"/><label htmlFor="chosen-model">Modelo de interesse</label><select id="chosen-model" value={selected.name} onChange={event => { const phone = phones.find(item => item.name === event.target.value); if (phone) { setSelected(phone); setBrand(phone.brand); } }}>{brands.map(item => <optgroup key={item} label={item}>{phones.filter(phone => phone.brand === item).map(phone => <option key={phone.name} value={phone.name}>{phone.name}</option>)}</optgroup>)}</select><MagneticLink href={whatsappLink(selected.name, name)} className="button button-orange">Continuar no WhatsApp <ArrowUpRight size={19}/></MagneticLink><small>Disponibilidade e valores são confirmados na conversa.</small></div></div></section>
    </main><footer className="footer"><div className="container footer-inner"><a href="#inicio" className="logo"><span className="logo-icon">✳︎</span> órbita<span className="logo-suffix">mobile</span></a><p>Escolhas que acompanham você.</p><div><a href="#marcas">Marcas</a><a href="#modelos">Modelos</a><a href={whatsappLink()}>WhatsApp</a></div><small>© {new Date().getFullYear()} Órbita Mobile · Marca e imagens ilustrativas.</small></div></footer>
  </div>;
}
