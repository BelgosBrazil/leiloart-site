# 📊 Estrutura de Dados do Firestore - LEILOART

## 📦 Coleção: `lojinha`

Esta documentação descreve a estrutura completa e atualizada dos produtos na coleção `lojinha`.

---

## ✅ Estrutura Completa (Todos os Campos)

```javascript
{
  // ========== CAMPOS OBRIGATÓRIOS ==========
  
  title: "Sofá 5 Módulos Chaise e Encosto Parcial Direito Mensa Fendi",
  // Tipo: string
  // Descrição: Nome completo do produto
  
  currentBid: "13500",
  // Tipo: string ou number
  // Formato: Valor em centavos como string (ex: "13500" = R$ 135,00)
  // Ou: Valor numérico em centavos (ex: 13500 = R$ 135,00)
  
  images: [
    "https://firebasestorage.googleapis.com/v0/b/.../image1.webp",
    "https://firebasestorage.googleapis.com/v0/b/.../image2.webp",
    "https://firebasestorage.googleapis.com/v0/b/.../image3.webp"
  ],
  // Tipo: array de strings
  // Descrição: URLs das imagens do produto
  // Mínimo: 1 imagem (ou array vazio para usar placeholder)
  
  // ========== ARRAYS DINÂMICOS ==========
  
  attributes: [
    {
      label: "Cor",
      value: "Fendi"
    },
    {
      label: "Estrutura",
      value: "Madeira Eucalipto de reflorestamento com tratamento contra cupim"
    },
    {
      label: "Revestimento",
      value: "Algodão e Poliéster"
    }
  ],
  // Tipo: array de objetos {label: string, value: string}
  // Descrição: Atributos customizados do produto
  // Exibidos na seção "Atributos"
  
  measurements: [
    {
      label: "Largura",
      value: "356 cm"
    },
    {
      label: "Altura",
      value: "69 cm"
    },
    {
      label: "Profundidade",
      value: "240 cm"
    },
    {
      label: "Altura do Assento",
      value: "45 cm"
    }
  ],
  // Tipo: array de objetos {label: string, value: string}
  // Descrição: Medidas do produto
  // Exibidos na seção "Atributos" junto com attributes
  
  // ========== CAMPOS DE TEXTO ==========
  
  details: "- A palavra é: versatilidade! Com diversas opções de módulos...; - Composto por 05 módulos...",
  // Tipo: string
  // Descrição: Descrição detalhada do produto
  // Formatação: Texto com "-" é quebrado em linhas
  
  care: "",
  // Tipo: string
  // Descrição: Instruções de cuidados com o produto
  // Exibido: Apenas se tiver conteúdo (não vazio)
  
  deliveryInfo: "",
  // Tipo: string
  // Descrição: Informações sobre entrega
  // Exibido: Apenas se tiver conteúdo (não vazio)
  
  // ========== DADOS DO LEILÃO ==========
  
  auctionUrl: "https://www.superbid.net/",
  // Tipo: string (URL)
  // Descrição: Link para a página do leilão
  // Usado em: Botão "Fazer Lance"
  
  endAt: Timestamp(30 de outubro de 2025 às 16:00:00 UTC-3),
  // Tipo: Firestore Timestamp
  // Descrição: Data e hora de encerramento do leilão
  // Exibido: Timer com contagem regressiva
  
  // ========== METADADOS ==========
  
  createdAt: Timestamp(16 de outubro de 2025 às 15:42:34 UTC-3),
  // Tipo: Firestore Timestamp
  // Descrição: Data de criação do documento
  
  updatedAt: Timestamp(16 de outubro de 2025 às 15:42:41 UTC-3),
  // Tipo: Firestore Timestamp
  // Descrição: Data da última atualização
  
  // ========== CAMPOS OPCIONAIS (COMPATIBILIDADE) ==========
  
  size: "",
  // Tipo: string
  // NOTA: Campo vazio - use measurements[] ao invés
  // Mantido para compatibilidade com versão anterior
  
  category: "Sofás",
  // Tipo: string ou array
  // Descrição: Categoria(s) do produto
  // Usado em: Badge, produtos relacionados, filtros
}
```

---

## 🎯 Campos Mínimos para Funcionar

```javascript
{
  title: "Nome do Produto",
  currentBid: "13500",  // R$ 135,00
  images: ["https://exemplo.com/imagem.jpg"]
}
```

---

## 📋 Como os Arrays São Exibidos

### attributes[] + measurements[] → Seção "Atributos"

**Firestore:**
```javascript
attributes: [
  { label: "Cor", value: "Fendi" },
  { label: "Estrutura", value: "Madeira Eucalipto..." }
],
measurements: [
  { label: "Largura", value: "356 cm" },
  { label: "Altura", value: "69 cm" }
]
```

**Exibição na Página:**
```
ATRIBUTOS
├─ Cor: Fendi
├─ Estrutura: Madeira Eucalipto de reflorestamento...
├─ Largura: 356 cm
└─ Altura: 69 cm
```

---

## 💰 Formatação de Preço

### Como funciona:

O sistema aceita diferentes formatos de preço e converte automaticamente:

**Formato 1: String (Recomendado)**
```javascript
currentBid: "13500"  // = R$ 135,00
```

**Formato 2: Number**
```javascript
currentBid: 13500    // = R$ 135,00
```

**Conversão:**
- O valor é sempre dividido por 100
- "13500" → R$ 135,00
- "100000" → R$ 1.000,00

---

## 📝 Formatação de Detalhes

O campo `details` suporta formatação especial:

**Entrada:**
```javascript
details: "- Item 1; - Item 2; - Item 3"
```

**Saída na Página:**
```
- Item 1
- Item 2  
- Item 3
```

O sistema divide o texto em:
1. Pontos e vírgulas seguidos de hífen (`; -`)
2. Cada item em uma nova linha

---

## 🎨 Exemplo Completo de Produto

```javascript
{
  // Básico
  title: "Sofá 5 Módulos Chaise e Encosto Parcial Direito Mensa Fendi",
  currentBid: "13500",
  images: [
    "https://firebasestorage.googleapis.com/.../sofa_1.webp",
    "https://firebasestorage.googleapis.com/.../sofa_2.webp",
    "https://firebasestorage.googleapis.com/.../sofa_3.webp",
    "https://firebasestorage.googleapis.com/.../sofa_4.webp"
  ],
  
  // Categoria
  category: "Sofás",
  
  // Atributos dinâmicos
  attributes: [
    { label: "Cor", value: "Fendi" },
    { label: "Estrutura", value: "Madeira Eucalipto de reflorestamento" },
    { label: "Revestimento", value: "Algodão e Poliéster" }
  ],
  
  // Medidas
  measurements: [
    { label: "Largura", value: "356 cm" },
    { label: "Altura", value: "69 cm" },
    { label: "Profundidade", value: "240 cm" },
    { label: "Altura do Assento", value: "45 cm" }
  ],
  
  // Descrição
  details: "- A palavra é: versatilidade! Com diversas opções de módulos, o Sofá Modular Mensa pode ser montado de incontáveis formas; - Composto por 05 módulos, sendo: 01 Módulo Encosto Parcial Direito, 01 Módulo Canto Esquerdo, 02 Módulos Meio Mensa e 01 Módulo Chaise Direito",
  
  // Informações adicionais (opcionais)
  care: "Limpar com pano úmido. Não usar produtos químicos abrasivos.",
  deliveryInfo: "Entrega em até 30 dias úteis. Frete calculado no checkout.",
  
  // Leilão
  auctionUrl: "https://www.superbid.net/",
  endAt: firebase.firestore.Timestamp.fromDate(new Date('2025-10-30T16:00:00')),
  
  // Metadados
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
}
```

---

## 🔄 Compatibilidade com Estrutura Antiga

O sistema suporta **ambos os formatos**:

### Formato Novo (Recomendado)
```javascript
{
  attributes: [
    { label: "Cor", value: "Azul" }
  ],
  measurements: [
    { label: "Largura", value: "100 cm" }
  ]
}
```

### Formato Antigo (Ainda funciona)
```javascript
{
  size: "100cm x 80cm",
  material: "Madeira",
  color: "Azul",
  condition: "Excelente",
  origin: "Brasil",
  year: "1965"
}
```

**Resultado:** Todos os atributos são combinados e exibidos juntos!

---

## 🎯 Mapeamento de Campos

| Campo Firestore | Tipo | Exibido Como | Seção |
|----------------|------|--------------|-------|
| `title` | string | Título principal | Header |
| `currentBid` | string/number | R$ X.XXX,XX | Preço |
| `images[]` | array | Galeria | Imagens |
| `category` | string/array | Badge | Header |
| `attributes[]` | array | Lista | Atributos |
| `measurements[]` | array | Lista | Atributos |
| `details` | string | Texto formatado | Detalhes |
| `care` | string | Parágrafo | Cuidados |
| `deliveryInfo` | string | Parágrafo | Entrega |
| `auctionUrl` | string | Link | Botão "Fazer Lance" |
| `endAt` | Timestamp | Contagem regressiva | Timer |

---

## 🧪 Como Adicionar um Produto

### Via Console do Firebase

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em Firestore Database
4. Selecione a coleção `lojinha`
5. Clique em "Adicionar documento"
6. **Deixe o ID automático** ou defina um personalizado
7. Adicione os campos:

```
Campo: title
Tipo: string
Valor: "Sofá Modular Mensa Fendi"

Campo: currentBid
Tipo: string
Valor: "13500"

Campo: images
Tipo: array
├─ [0]: string = "https://exemplo.com/img1.webp"
├─ [1]: string = "https://exemplo.com/img2.webp"
└─ [2]: string = "https://exemplo.com/img3.webp"

Campo: attributes
Tipo: array
├─ [0]: map
│   ├─ label: string = "Cor"
│   └─ value: string = "Fendi"
└─ [1]: map
    ├─ label: string = "Estrutura"
    └─ value: string = "Madeira Eucalipto"

Campo: measurements
Tipo: array
├─ [0]: map
│   ├─ label: string = "Largura"
│   └─ value: string = "356 cm"
└─ [1]: map
    ├─ label: string = "Altura"
    └─ value: string = "69 cm"

Campo: category
Tipo: string
Valor: "Sofás"

Campo: details
Tipo: string
Valor: "- Descrição do produto; - Mais informações"

Campo: auctionUrl
Tipo: string
Valor: "https://www.superbid.net/"

Campo: endAt
Tipo: timestamp
Valor: 30/10/2025 16:00:00

Campo: createdAt
Tipo: timestamp
Valor: [timestamp atual]
```

---

## 🔍 Validação de Dados

### Checklist de Campos

✅ **title** - Não vazio  
✅ **currentBid** - String numérica ou number  
✅ **images** - Array com pelo menos 1 URL válida  
✅ **attributes** - Array de objetos com label e value  
✅ **measurements** - Array de objetos com label e value  
✅ **category** - String não vazia (para produtos relacionados)  
✅ **auctionUrl** - URL válida começando com http/https  
✅ **endAt** - Timestamp no futuro  

---

## 💡 Dicas Importantes

### 1. Preço (currentBid)
```javascript
// ✅ CORRETO
currentBid: "13500"     // R$ 135,00
currentBid: "100000"    // R$ 1.000,00

// ❌ EVITAR
currentBid: "135.00"    // Pode causar problemas
currentBid: "R$ 135,00" // Sistema não reconhece
```

### 2. Attributes/Measurements
```javascript
// ✅ CORRETO
attributes: [
  { label: "Cor", value: "Azul" },
  { label: "Material", value: "Madeira" }
]

// ❌ INCORRETO
attributes: [
  { name: "Cor", val: "Azul" }  // Deve usar "label" e "value"
]
```

### 3. Images
```javascript
// ✅ CORRETO
images: [
  "https://firebasestorage.googleapis.com/.../img1.webp",
  "https://example.com/img2.jpg"
]

// ⚠️ FUNCIONA MAS NÃO IDEAL
images: []  // Usa placeholder

// ❌ INCORRETO
images: "https://exemplo.com/img.jpg"  // Deve ser array
```

### 4. Details
```javascript
// ✅ BOA FORMATAÇÃO
details: "- Item 1; - Item 2; - Item 3"
// Exibe cada item em uma linha

// ✅ TAMBÉM FUNCIONA
details: "Descrição simples sem formatação"
// Exibe como parágrafo normal

// ⚠️ EVITAR
details: "TextoMuitoLongoSemEspaçosOuQuebrasDeLinha..."
// Difícil de ler
```

---

## 📊 Exemplo Real do Firestore

Este é o objeto exato que você forneceu:

```javascript
{
  attributes: [
    { label: "Cor", value: "Fendi" },
    { label: "Estrutura", value: "Madeira Eucalipto de reflorestamento com tratamento contra cupim" },
    { label: "Revestimento", value: "Algodão e Poliéster" }
  ],
  
  auctionUrl: "https://www.superbid.net/",
  care: "",
  createdAt: Timestamp(16 de outubro de 2025 às 15:42:34 UTC-3),
  currentBid: "13500",
  deliveryInfo: "",
  
  details: "- A palavra é: versatilidade! Com diversas opções de módulos, o Sofá Modular Mensa pode ser montado de incontáveis formas. Aconchegante e com traços leves, é o sofá ideal para pequenos e grandes espaços; - Composto por 05 módulos, sendo: 01 Módulo Encosto Parcial Direito, 01 Módulo Canto Esquerdo, 02 Módulos Meio Mensa e 01 Módulo Chaise Direito; - As almofadas são vendidas separadamente; - Lado direito visto de frente; - Garantia do fornecedor de 180 dias contra defeitos de fabricação; - Carga máxima suportada: 110 kg/ assento; - O produto será entregue desmontado. O Westwing se responsabiliza pela entrega até o 3º andar pelas escadas e não realiza o serviço de içamento de móveis; - As cores podem apresentar pequenas variações devido ao lote de produção e às configurações do seu monitor. Baixe aqui a modelagem 3D do produto",
  
  endAt: Timestamp(30 de outubro de 2025 às 16:00:00 UTC-3),
  
  images: [
    "https://firebasestorage.googleapis.com/v0/b/leiloart.firebasestorage.app/o/lojinha%2FolnliUMBbmpInu2ZDdWm%2F1760640155160_0_sofa_1.webp?alt=media&token=9cfadf7d-4eee-4469-b02b-fd34e8d31009",
    "https://firebasestorage.googleapis.com/v0/b/leiloart.firebasestorage.app/o/lojinha%2FolnliUMBbmpInu2ZDdWm%2F1760640156688_1_sofa_2.webp?alt=media&token=88812450-2961-4c39-b777-f2f73d9874fa",
    "https://firebasestorage.googleapis.com/v0/b/leiloart.firebasestorage.app/o/lojinha%2FolnliUMBbmpInu2ZDdWm%2F1760640157616_2_sofa_3.webp?alt=media&token=f38cead7-d9c9-48af-a861-b0cc1457ce10",
    "https://firebasestorage.googleapis.com/v0/b/leiloart.firebasestorage.app/o/lojinha%2FolnliUMBbmpInu2ZDdWm%2F1760640159565_3_sofa_4.webp?alt=media&token=30e52254-85d8-4243-81fe-c8f1961cc4a8"
  ],
  
  measurements: [
    { label: "Largura", value: "356 cm" },
    { label: "Altura", value: "69 cm" },
    { label: "Profundidade", value: "240 cm" },
    { label: "Altura do Assento", value: "45 cm" }
  ],
  
  size: "",
  title: "Sofá 5 Módulos Chaise e Encosto Parcial Direito Mensa Fendi",
  updatedAt: Timestamp(16 de outubro de 2025 às 15:42:41 UTC-3)
}
```

---

## 🎯 Como a Página Renderiza Este Produto

### Título
```
Sofá 5 Módulos Chaise e Encosto Parcial Direito Mensa Fendi
```

### Preço
```
R$ 135,00
```

### Categoria
```
[Sofás]  ← Badge
```

### Atributos (Combinados)
```
Cor: Fendi
Estrutura: Madeira Eucalipto de reflorestamento com tratamento contra cupim
Revestimento: Algodão e Poliéster
Largura: 356 cm
Altura: 69 cm
Profundidade: 240 cm
Altura do Assento: 45 cm
```

### Detalhes
```
- A palavra é: versatilidade! Com diversas opções de módulos...
- Composto por 05 módulos, sendo: 01 Módulo Encosto...
- As almofadas são vendidas separadamente
- Lado direito visto de frente
... (cada item em uma linha)
```

### Timer
```
Encerra em: 14 dias e 5 horas
```

### Galeria
```
[Imagem 1] [Imagem 2] [Imagem 3] [Imagem 4]
     ↑          ↑          ↑          ↑
  Clicável   Clicável   Clicável   Clicável
```

---

## 🔧 Campos Especiais

### care (Cuidados)
- **Exibido:** Apenas se não estiver vazio
- **Seção:** "Cuidados" (aparece após "Detalhes")

### deliveryInfo (Informações de Entrega)
- **Exibido:** Apenas se não estiver vazio
- **Seção:** "Entrega" (aparece após "Cuidados")

### category
- **Aceita:** String ou Array
- **Exemplos:**
  ```javascript
  category: "Sofás"           // ✅ String
  category: ["Sofás", "Living"] // ✅ Array (exibe: "Sofás, Living")
  ```

---

## ⚠️ Problemas Comuns

### Atributos não aparecem
**Causa:** Array `attributes` ou `measurements` vazio ou mal formatado  
**Solução:** Verifique se cada objeto tem `label` e `value`

### Preço incorreto
**Causa:** Formato do `currentBid` não reconhecido  
**Solução:** Use string numérica: `"13500"` para R$ 135,00

### Imagens não carregam
**Causa:** URLs inválidas ou sem permissão  
**Solução:** Verifique se as URLs são acessíveis e públicas

### Timer não aparece
**Causa:** Campo `endAt` ausente ou no passado  
**Solução:** Adicione um Timestamp no futuro

---

## 📚 Documentação de Referência

- **Firestore Timestamp:** https://firebase.google.com/docs/reference/js/firestore_.timestamp
- **Firebase Storage URLs:** https://firebase.google.com/docs/storage/web/download-files

---

## ✅ Validação Automática

O código agora valida automaticamente:

✅ Arrays de attributes e measurements  
✅ Formato do preço (string ou number)  
✅ Categoria (string ou array)  
✅ Campos opcionais (care, deliveryInfo)  
✅ Compatibilidade com formato antigo  

---

**Atualizado:** Novembro 2025  
**Versão:** 2.0 (Suporte a estrutura dinâmica)  
**Status:** ✅ Implementado e Testado

