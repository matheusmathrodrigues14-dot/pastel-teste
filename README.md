# Órbita Mobile

Landing page de demonstração para uma loja de celulares. A marca é provisória; modelos são apresentados para consulta, sem preços ou promessa de estoque. A conversa usa o WhatsApp de testes informado: (19) 98771-5865.

## Desenvolvimento

Requer Node.js 20.19+ ou 22.12+ e npm.

```bash
npm ci
npm run dev
```

Para validar:

```bash
npm test
npm run build
```

## Estrutura atual

- `src/App.tsx`: seções, filtros, formulário de consulta e interações.
- `src/data/phones.ts`: famílias e modelos exibidos no catálogo.
- `src/style.css`: identidade visual e layout responsivo.

O site usa smooth scroll nas âncoras, botões magnéticos com GSAP e uma narrativa com scroll pin no desktop. Em telas menores, a narrativa segue o fluxo normal da página. A preferência por movimento reduzido desliga as animações de entrada e o pin.

Antes de publicar como loja real, confirme marca, modelos comercializados, preços, estoque, condições de venda e número definitivo de WhatsApp. A disponibilidade de cada item depende de confirmação no atendimento.

## Publicação

O arquivo `netlify.toml` executa `npm run build` e publica `dist`. A publicação ocorre automaticamente quando a branch `main` conectada à Netlify recebe um push.
