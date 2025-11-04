# Configuração da Coleção Lojinha no Firestore

## Problema Identificado
A seção lojinha está tentando carregar dados da coleção `lojinha` no Firestore, mas esta coleção não existe ou está vazia.

**Erro:** `Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore`

## Solução

### 1. Acesse o Firebase Console
1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `leiloart`
3. No menu lateral, clique em **Firestore Database**

### 2. Crie a Coleção `lojinha`
1. Clique em **"Iniciar coleção"** ou **"+ Adicionar coleção"**
2. Digite `lojinha` como ID da coleção
3. Clique em **"Próximo"**

### 3. Adicione Documentos de Exemplo
Use os dados do arquivo `lojinha-data-example.json` para criar documentos de teste.

#### Estrutura Obrigatória de Cada Documento:

```javascript
{
  // Campos obrigatórios
  "title": "string",           // Título do produto
  "currentBid": "number",      // Lance atual em centavos (ex: 39500 = R$ 395,00)
  "endAt": "timestamp",        // Data/hora de fim do leilão
  "images": ["array"],         // Array de URLs das imagens
  "createdAt": "timestamp",    // Data de criação
  
  // Campos opcionais mas recomendados
  "attributes": {              // Atributos do produto
    "marca": "string",
    "categoria": "string",
    "subcategoria": "string"
  },
  "auctionUrl": "string",      // URL do leilão
  "care": "string",            // Instruções de cuidado
  "deliveryInfo": {            // Informações de entrega
    "frete": "string",
    "prazo": "string",
    "observacoes": "string"
  },
  "details": "string",         // Descrição detalhada
  "measurements": "string",    // Medidas do produto
  "size": "string",           // Tamanho
  "updatedAt": "timestamp"    // Data de atualização
}
```

### 4. Exemplo de Documento

**ID do Documento:** `produto_001`

**Dados:**
```javascript
{
  "title": "Jardim de Fé Difusor para Ambiente 200ml",
  "attributes": {
    "marca": "Leiloart",
    "categoria": "Casa e Decoração",
    "subcategoria": "Aromatizadores"
  },
  "auctionUrl": "https://leiloart.com/leilao/produto_001",
  "care": "Manter em local seco e arejado. Evitar exposição direta ao sol.",
  "createdAt": "2024-01-01T00:00:00Z",  // Use o tipo Timestamp do Firestore
  "currentBid": 39500,  // R$ 395,00 em centavos
  "deliveryInfo": {
    "frete": "Grátis para todo o Brasil",
    "prazo": "5-10 dias úteis",
    "observacoes": "Produto frágil, embalagem especial"
  },
  "details": "Difusor de ambiente com fragrância exclusiva Jardim de Fé...",
  "endAt": "2024-01-03T12:00:00Z",  // Use o tipo Timestamp do Firestore
  "images": [
    "https://via.placeholder.com/400x400/f8f9fa/6c757d?text=Difusor+Jardim+de+Fé",
    "https://via.placeholder.com/400x400/e9ecef/495057?text=Detalhe+1"
  ],
  "measurements": "Altura: 25cm, Largura: 8cm, Profundidade: 8cm",
  "size": "200ml",
  "updatedAt": "2024-01-01T00:00:00Z"  // Use o tipo Timestamp do Firestore
}
```

### 5. Configuração de Timestamps
No Firebase Console, ao adicionar campos de data:
1. Selecione o tipo **"timestamp"** 
2. Use o formato: `2024-01-01T00:00:00Z`
3. Ou use a data/hora atual clicando em "Usar timestamp atual"

### 6. Configuração de Arrays
Para o campo `images`:
1. Selecione o tipo **"array"**
2. Adicione cada URL como um item string separado

### 7. Teste a Configuração
1. Abra o arquivo `test-firebase.html` no navegador
2. Ou acesse a página principal e verifique se a seção lojinha carrega
3. Verifique o console do navegador para logs de debug

### 8. Verificação
Após adicionar os documentos, você deve ver:
- ✅ Produtos carregados na seção lojinha
- ✅ Imagens dos produtos exibidas
- ✅ Preços formatados corretamente
- ✅ Timers de leilão funcionando
- ✅ Botão "Ver mais produtos" (se houver mais de 8 produtos)

## Estrutura de Preços
- Armazene preços em **centavos** (número inteiro)
- Exemplo: R$ 395,00 = 39500
- O JavaScript formatará automaticamente para exibição

## Estrutura de Imagens
- Use URLs completas e válidas
- Primeira imagem será a principal
- Suporte a múltiplas imagens por produto
- Fallback automático para imagem placeholder em caso de erro

## Debug
Se ainda houver problemas:
1. Abra o Console do navegador (F12)
2. Procure por logs que começam com 🏪, 🔍, ✅ ou ❌
3. Verifique se o Firebase está inicializado corretamente
4. Confirme que a coleção `lojinha` existe e tem documentos

## Regras de Segurança do Firestore
Certifique-se de que as regras do Firestore permitem leitura da coleção `lojinha`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /lojinha/{document} {
      allow read: if true;  // Permite leitura pública
    }
  }
}
```