# Órbita Mobile

Site demonstrativo de uma loja de celulares. A marca é provisória. O catálogo apresenta modelos para consulta, sem preços ou promessa de estoque. O WhatsApp de testes informado é (19) 98771-5865.

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

## Experiência

- A vitrine de marcas leva diretamente ao catálogo filtrado.
- A lista de modelos atualiza o aparelho em destaque e prepara uma mensagem específica para o WhatsApp.
- As imagens em `public/images/` são renders fotográficos ilustrativos das linhas Apple, Xiaomi, Samsung e Motorola. Não representam exatamente cada modelo, cor ou unidade à venda. Foram geradas para este projeto e convertidas para WebP.
- Smooth scroll, botões magnéticos e narrativa com scroll pin usam GSAP. Em telas menores, a narrativa segue o fluxo normal. A preferência por movimento reduzido desliga as animações de entrada e o pin.

Antes de publicar como loja real, confirme nome da marca, modelos comercializados, fotos oficiais dos aparelhos, preços, estoque, condições de venda e número definitivo de WhatsApp.

## Publicação

O `netlify.toml` executa `npm run build` e publica `dist`. Para publicar automaticamente, o projeto na Netlify precisa estar conectado a este repositório e à branch `main`; confira o estado da integração e dos builds no painel da Netlify.
