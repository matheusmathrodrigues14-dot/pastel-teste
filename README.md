# Ateliê do Pastel — conceito demonstrativo

Site demonstrativo de pastelaria, desenvolvido com React, TypeScript, Tailwind CSS, Vite e GSAP. Inclui cardápio filtrável, personalização por produto, carrinho salvo no navegador e montagem de pedido para WhatsApp. **Nome, história, fotos, produtos, preços e modalidades de atendimento são exemplos**, não informações oficiais de uma pastelaria.

## Desenvolvimento

Requer Node.js 20.19+ ou 22.12+ e npm.

```bash
npm ci
npm run dev
```

Abra o endereço local mostrado pelo Vite. Para validar:

```bash
npm run test
npm run build
npm run preview
```

## Dados reais antes da publicação comercial

- Edite `src/data/catalog.ts` para cadastrar categorias, produtos, sabores, tamanhos, adicionais, preços em centavos e imagens correspondentes. Cada produto só oferece as opções ali cadastradas.
- Edite `src/data/config.ts` para colocar o nome oficial, número de WhatsApp **com código do país e DDD, apenas dígitos**, endereço, horários, rede social e modalidades realmente oferecidas. O número está vazio nesta versão; o botão de finalização informa que falta configurá-lo e não abre um destino fictício.
- Substitua os textos institucionais demonstrativos em `src/App.tsx` e confirme fotos e direitos de uso. As imagens atuais ficam em `public/images/` e foram geradas para este conceito.
- Revise custos de entrega e disponibilidade. A versão demonstrativa exibe subtotal e total dos itens, sem adicionar taxa de entrega. A mensagem deixa a confirmação final para o estabelecimento.
- Atualize título e descrição em `index.html` com a identidade definitiva.

O carrinho usa `localStorage`, sem banco de dados ou pagamento online. Os preços do carrinho são calculados a partir do catálogo atual. Alterar ou remover produtos pode invalidar itens guardados no navegador; itens inválidos são descartados ao recarregar.

## Publicação na Netlify

O arquivo `netlify.toml` já define `npm run build`, a pasta `dist` e o redirecionamento para a aplicação. Conecte este repositório na Netlify depois de preencher os dados reais. Não há variáveis de ambiente obrigatórias nesta demonstração.
