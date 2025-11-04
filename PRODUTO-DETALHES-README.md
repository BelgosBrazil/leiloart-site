# Sistema de Página de Detalhes do Produto

## Visão Geral

Este sistema permite que os usuários visualizem informações completas sobre produtos ao clicar neles, ao invés de serem redirecionados diretamente para um link externo.

## Arquivos Criados

1. **produto-detalhes.html** - Página de detalhes do produto
2. **produto-detalhes.css** - Estilos da página de detalhes
3. **produto-detalhes.js** - Lógica para carregar e exibir os dados do produto

## Como Funciona

### 1. Clique no Produto

Quando um usuário clica em um produto, ele é redirecionado para:
```
produto-detalhes.html?id={ID_DO_PRODUTO}
```

### 2. Carregamento dos Dados

A página busca o produto no Firestore usando o ID fornecido na URL e exibe:

- **Galeria de imagens** - Com navegação entre múltiplas imagens
- **Informações básicas** - Título, categoria, preço atual
- **Temporizador** - Contagem regressiva até o fim do leilão
- **Atributos** - Tamanho, material, cor, condição, origem, ano, etc.
- **Descrição** - Detalhes completos do produto
- **Botões de ação** - Fazer lance e favoritar
- **Compartilhamento** - Links para WhatsApp, Facebook e Twitter
- **Produtos relacionados** - Outros produtos da mesma categoria

### 3. Estrutura dos Dados no Firestore

Os produtos na coleção `lojinha` devem ter a seguinte estrutura:

```javascript
{
  // Campos obrigatórios
  title: "Nome do Produto",
  currentBid: 1000, // Valor em centavos (R$ 10,00)
  images: ["url_imagem_1", "url_imagem_2", ...],
  
  // Campos opcionais
  category: "Mobília", // Usado para produtos relacionados
  details: "Descrição detalhada do produto...",
  endAt: Timestamp, // Data/hora de encerramento do leilão
  
  // Atributos opcionais (exibidos na seção de atributos)
  size: "120cm x 80cm x 75cm",
  material: "Madeira maciça",
  color: "Marrom escuro",
  condition: "Excelente",
  origin: "Brasil",
  year: "1960",
  
  // Link para página externa (usado no botão "Fazer Lance")
  auctionUrl: "https://link-para-leilao.com"
}
```

## Funcionalidades

### Galeria de Imagens
- Navegação com setas (teclado e mouse)
- Thumbnails clicáveis
- Imagem principal em destaque
- Suporte a múltiplas imagens

### Timer de Leilão
- Contagem regressiva em tempo real
- Atualização automática a cada minuto
- Exibição amigável (dias, horas, minutos)

### Produtos Relacionados
- Busca automática de produtos da mesma categoria
- Máximo de 4 produtos relacionados
- Clique para navegar para outro produto

### Compartilhamento Social
- WhatsApp
- Facebook
- Twitter
- URL da página atual incluída automaticamente

### Responsividade
- Layout adaptado para desktop, tablet e mobile
- Galeria otimizada para telas pequenas
- Navegação touch-friendly

## Modificações nos Arquivos Existentes

### lojinha.js

Modificado o método `openProductDetails()` para redirecionar para a página de detalhes:

```javascript
openProductDetails(productId) {
    window.location.href = `produto-detalhes.html?id=${productId}`;
}
```

Todos os cliques em produtos agora redirecionam para a página de detalhes, independentemente de terem ou não `auctionUrl`.

### interactive-banners-slider.js

Modificado o botão "Ver detalhes" dos hotspots para redirecionar para a página de detalhes:

```javascript
button.addEventListener('click', () => {
    if (product.id) {
        window.location.href = `produto-detalhes.html?id=${product.id}`;
    }
});
```

## Estilos

A página utiliza o mesmo sistema de estilos do site principal (`css/style.css`) e adiciona estilos específicos em `produto-detalhes.css`:

- Layout em grid de 2 colunas (desktop)
- Galeria sticky no scroll
- Animações suaves
- Estados hover interativos
- Design responsivo completo

## Estados da Página

### Loading (Carregando)
Exibe um spinner enquanto os dados são carregados do Firebase.

### Error (Erro)
Exibe uma mensagem amigável se o produto não for encontrado, com link para voltar à loja.

### Success (Sucesso)
Exibe todos os detalhes do produto com layout completo.

## Testes Recomendados

1. **Teste de produto existente**: Clique em qualquer produto da loja
2. **Teste de produto inexistente**: Acesse `produto-detalhes.html?id=nao-existe`
3. **Teste de galeria**: Produto com múltiplas imagens
4. **Teste de timer**: Produto com `endAt` definido
5. **Teste de relacionados**: Produtos com mesma categoria
6. **Teste mobile**: Acesse em dispositivos móveis

## Troubleshooting

### Produto não carrega
- Verifique se o Firebase está inicializado
- Verifique se o ID do produto existe na coleção `lojinha`
- Verifique o console do navegador para erros

### Imagens não aparecem
- Verifique se o campo `images` existe e contém URLs válidas
- Verifique se as URLs das imagens são acessíveis
- Imagem placeholder será exibida se não houver imagens

### Timer não funciona
- Verifique se o campo `endAt` é um Timestamp válido do Firestore
- Verifique se a data não está no passado

### Produtos relacionados não aparecem
- Verifique se existem outros produtos com a mesma `category`
- Mínimo de 2 produtos necessários (1 atual + 1 relacionado)

## Melhorias Futuras

- [ ] Sistema de favoritos com localStorage
- [ ] Sistema de avaliações e comentários
- [ ] Histórico de lances
- [ ] Notificações quando o leilão está prestes a encerrar
- [ ] Zoom na imagem principal
- [ ] Visualização em tela cheia da galeria
- [ ] Breadcrumb dinâmico com categoria
- [ ] SEO melhorado com meta tags dinâmicas
- [ ] Compartilhamento nativo (Web Share API)

## Suporte

Para dúvidas ou problemas, entre em contato através de contato@myne.com.br

