# Guia de Teste - Página de Detalhes do Produto

## Como Testar a Funcionalidade

### Opção 1: Através da Loja (Recomendado)

1. Abra `index.html` no navegador
2. Role até a seção "Nossos produtos" (Lojinha)
3. Clique em qualquer produto
4. Você será redirecionado para `produto-detalhes.html?id={ID_DO_PRODUTO}`

### Opção 2: Através dos Banners Interativos

1. Abra `index.html` no navegador
2. Role até a seção de galeria com banners interativos
3. Clique em um hotspot (botão + sobre os produtos)
4. Clique no botão "Ver detalhes" no modal
5. Você será redirecionado para a página de detalhes

### Opção 3: URL Direta

Acesse diretamente no navegador:
```
produto-detalhes.html?id={ID_DO_PRODUTO}
```

Onde `{ID_DO_PRODUTO}` é o ID de um documento na coleção `lojinha` do Firestore.

## Cenários de Teste

### ✅ Teste 1: Produto com Todos os Dados
**Objetivo**: Verificar se todos os componentes são exibidos corretamente

**Dados necessários no Firestore**:
```javascript
{
  title: "Cadeira Vintage Escandinava",
  currentBid: 85000, // R$ 850,00
  images: [
    "url_imagem_1.jpg",
    "url_imagem_2.jpg",
    "url_imagem_3.jpg"
  ],
  category: "Mobília",
  details: "Linda cadeira vintage em madeira maciça...",
  endAt: Timestamp(futuro),
  size: "80cm x 60cm x 90cm",
  material: "Madeira de carvalho",
  color: "Marrom escuro",
  condition: "Excelente",
  origin: "Dinamarca",
  year: "1965",
  auctionUrl: "https://exemplo.com/leilao"
}
```

**Resultados esperados**:
- ✅ Galeria com 3 imagens funcionando
- ✅ Título e categoria exibidos
- ✅ Preço formatado: R$ 850,00
- ✅ Timer mostrando tempo restante
- ✅ 6 atributos exibidos
- ✅ Descrição completa visível
- ✅ Botão "Fazer Lance" funcionando
- ✅ Produtos relacionados aparecendo

### ✅ Teste 2: Produto com Dados Mínimos
**Objetivo**: Verificar comportamento com dados parciais

**Dados necessários no Firestore**:
```javascript
{
  title: "Mesa de Centro",
  currentBid: 120000, // R$ 1.200,00
  images: ["url_imagem.jpg"]
}
```

**Resultados esperados**:
- ✅ Imagem única exibida (sem navegação)
- ✅ Título e preço exibidos
- ✅ Categoria não exibida
- ✅ Timer não exibido
- ✅ Mensagem "Nenhum atributo adicional disponível"
- ✅ Mensagem "Nenhum detalhe adicional disponível"
- ✅ Botão "Fazer Lance" desabilitado (sem auctionUrl)

### ✅ Teste 3: Produto Sem Imagens
**Objetivo**: Verificar uso de placeholder

**Dados necessários no Firestore**:
```javascript
{
  title: "Produto Sem Foto",
  currentBid: 50000,
  images: [] // ou sem campo images
}
```

**Resultados esperados**:
- ✅ Placeholder exibido: `/images/placeholder.svg`
- ✅ Demais dados funcionando normalmente

### ❌ Teste 4: Produto Inexistente
**Objetivo**: Verificar tratamento de erro

**URL**: `produto-detalhes.html?id=nao-existe-123`

**Resultados esperados**:
- ✅ Mensagem "Produto não encontrado"
- ✅ Descrição explicativa
- ✅ Botão "Voltar para a loja" funcionando

### ✅ Teste 5: Navegação da Galeria
**Objetivo**: Testar controles de galeria

**Ações**:
1. Abrir produto com múltiplas imagens
2. Clicar em thumbnails
3. Usar setas de navegação
4. Usar setas do teclado (← →)

**Resultados esperados**:
- ✅ Imagem principal muda ao clicar em thumbnail
- ✅ Thumbnail ativo destacado
- ✅ Setas funcionando (prev/next)
- ✅ Primeira seta desabilitada na primeira imagem
- ✅ Última seta desabilitada na última imagem
- ✅ Teclas do teclado funcionando

### ⏱️ Teste 6: Timer de Leilão
**Objetivo**: Verificar contagem regressiva

**Cenários**:

**A) Leilão com dias restantes**:
```javascript
endAt: Timestamp(agora + 3 dias)
```
Esperado: "3 dias e X horas"

**B) Leilão com horas restantes**:
```javascript
endAt: Timestamp(agora + 5 horas)
```
Esperado: "5 horas e X minutos"

**C) Leilão com minutos restantes**:
```javascript
endAt: Timestamp(agora + 30 minutos)
```
Esperado: "30 minutos"

**D) Leilão encerrado**:
```javascript
endAt: Timestamp(passado)
```
Esperado: "Leilão encerrado"

### 🔗 Teste 7: Produtos Relacionados
**Objetivo**: Verificar busca por categoria

**Cenário**: Ter 3+ produtos com mesma categoria

**Resultados esperados**:
- ✅ Seção "Produtos Relacionados" visível
- ✅ Máximo 4 produtos exibidos
- ✅ Produto atual não aparece na lista
- ✅ Clique redireciona para outro produto

### 📱 Teste 8: Responsividade
**Objetivo**: Verificar em diferentes tamanhos de tela

**Dispositivos para testar**:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

**Resultados esperados**:
- ✅ Layout ajustado para cada tamanho
- ✅ Galeria funcional em mobile
- ✅ Navegação touch-friendly
- ✅ Botões acessíveis
- ✅ Texto legível

### 🔄 Teste 9: Compartilhamento
**Objetivo**: Verificar links sociais

**Ações**:
1. Clicar em cada botão de compartilhamento

**Resultados esperados**:
- ✅ WhatsApp: Abre com título e URL
- ✅ Facebook: Abre diálogo de compartilhamento
- ✅ Twitter: Abre com texto e URL
- ✅ Nova janela/aba aberta

### 💝 Teste 10: Botão Favoritar
**Objetivo**: Verificar interação visual

**Ações**:
1. Clicar no botão "Favoritar"
2. Clicar novamente

**Resultados esperados**:
- ✅ Ícone de coração alterna entre vazio/preenchido
- ✅ Texto alterna entre "Favoritar"/"Favoritado"
- ✅ Classe CSS "favorited" alternada

## Checklist de Testes

Use este checklist para verificar todos os aspectos:

### Funcionalidades Básicas
- [ ] Produto carrega corretamente
- [ ] Título exibido
- [ ] Preço formatado corretamente
- [ ] Imagens exibidas
- [ ] Botões funcionam

### Galeria
- [ ] Múltiplas imagens funcionam
- [ ] Thumbnails clicáveis
- [ ] Navegação com setas
- [ ] Teclado funciona
- [ ] Placeholder quando sem imagem

### Informações
- [ ] Categoria exibida (se existe)
- [ ] Atributos listados
- [ ] Descrição exibida
- [ ] Timer funciona (se tem endAt)

### Navegação
- [ ] Breadcrumb correto
- [ ] Link "voltar" funciona
- [ ] Produtos relacionados clicáveis
- [ ] Header e footer presentes

### Interações
- [ ] Favoritar funciona
- [ ] Fazer lance funciona/desabilitado
- [ ] Compartilhamento funciona
- [ ] Modal fecha com ESC

### Responsividade
- [ ] Desktop funcional
- [ ] Tablet funcional
- [ ] Mobile funcional
- [ ] Touch gestures funcionam

### Erros
- [ ] Produto inexistente tratado
- [ ] Firebase offline tratado
- [ ] Imagem quebrada tratada
- [ ] Dados faltantes tratados

## Comandos Úteis para Debug

Abra o console do navegador (F12) e use:

```javascript
// Verificar dados do produto
console.log(window.produtoDetalhes.product);

// Forçar mudança de imagem
window.produtoDetalhes.changeImage(1);

// Verificar produtos relacionados
console.log(document.querySelectorAll('.related-product-item').length);

// Testar compartilhamento
window.produtoDetalhes.share('whatsapp');
```

## Problemas Comuns e Soluções

### Problema: "Firebase não inicializado"
**Solução**: Aguarde alguns segundos após carregar a página

### Problema: Imagens não carregam
**Solução**: Verifique as URLs no Firestore, devem ser acessíveis

### Problema: Timer não aparece
**Solução**: Verifique se `endAt` é um Timestamp válido do Firestore

### Problema: Produto não encontrado
**Solução**: Verifique se o ID na URL corresponde a um documento real

### Problema: Página em branco
**Solução**: 
1. Verifique o console para erros
2. Verifique se Firebase está configurado
3. Verifique se os arquivos CSS/JS estão carregados

## Dados de Exemplo para Teste

Se precisar criar produtos de teste no Firestore, use este template:

```javascript
// Produto completo para teste
{
  title: "Poltrona Egg Chair Vintage",
  currentBid: 350000, // R$ 3.500,00
  images: [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
  ],
  category: "Poltronas",
  details: "Icônica Egg Chair projetada por Arne Jacobsen em 1958. Esta peça vintage está em excelente estado de conservação, com estofamento original em couro legítimo. Um clássico do design escandinavo que transformará qualquer ambiente.",
  endAt: firebase.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 dias
  size: "107cm x 87cm x 79cm",
  material: "Estrutura em fibra de vidro, estofamento em couro",
  color: "Marrom cognac",
  condition: "Excelente - vintage original",
  origin: "Dinamarca",
  year: "1965",
  auctionUrl: "https://exemplo.com/leilao/egg-chair-123",
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
}
```

## Próximos Passos

Após validar todos os testes:

1. ✅ Testar com produtos reais do Firestore
2. ✅ Ajustar estilos conforme necessário
3. ✅ Adicionar mais atributos personalizados
4. ✅ Implementar sistema de favoritos persistente
5. ✅ Adicionar mais produtos relacionados (scroll horizontal)
6. ✅ Otimizar carregamento de imagens
7. ✅ Implementar cache para melhor performance

## Suporte

Problemas ou dúvidas? Verifique:
- PRODUTO-DETALHES-README.md (documentação completa)
- Console do navegador (F12)
- Firestore Rules (permissões de leitura)

