/**
 * EXEMPLOS DE PRODUTOS PARA FIRESTORE
 * 
 * Use estes exemplos para popular a coleção 'lojinha' no Firestore
 * e testar a página de detalhes do produto.
 * 
 * COMO USAR:
 * 1. Abra o Console do Firebase
 * 2. Vá para Firestore Database
 * 3. Crie a coleção 'lojinha' (se não existir)
 * 4. Adicione documentos manualmente ou use o Firebase Admin SDK
 * 5. Cole os objetos abaixo como dados dos documentos
 */

// ============================================
// EXEMPLO 1: PRODUTO COMPLETO
// ============================================
// Este exemplo inclui TODOS os campos possíveis
const produtoCompleto = {
  // Campos obrigatórios
  title: "Poltrona Egg Chair Vintage Original",
  currentBid: 350000, // R$ 3.500,00 (valor em centavos)
  images: [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
  ],
  
  // Campos recomendados
  category: "Poltronas",
  details: "Icônica Egg Chair projetada por Arne Jacobsen em 1958 para o Royal Hotel em Copenhague. Esta peça vintage está em excelente estado de conservação, com estofamento original em couro legítimo. Um clássico atemporal do design escandinavo que transformará qualquer ambiente em um espaço sofisticado e elegante. Peça rara de colecionador.",
  auctionUrl: "https://exemplo.com/leilao/egg-chair-vintage",
  
  // Data de encerramento (use firebase.firestore.Timestamp)
  // endAt: firebase.firestore.Timestamp.fromDate(new Date('2025-12-31T23:59:59')),
  
  // Atributos detalhados
  size: "107cm (altura) x 87cm (largura) x 79cm (profundidade)",
  material: "Estrutura em fibra de vidro reforçada, estofamento em couro italiano",
  color: "Marrom cognac",
  condition: "Excelente - vintage original com pátina natural",
  origin: "Dinamarca",
  year: "1965",
  
  // Metadados
  active: true,
  featured: true,
  // createdAt: firebase.firestore.FieldValue.serverTimestamp()
};

// ============================================
// EXEMPLO 2: CADEIRA VINTAGE
// ============================================
const cadeiraVintage = {
  title: "Cadeira Dinamarquesa Estilo Mid-Century",
  currentBid: 85000, // R$ 850,00
  images: [
    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800",
    "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800"
  ],
  category: "Cadeiras",
  details: "Belíssima cadeira dinamarquesa em madeira maciça de teca com design característico dos anos 60. Assento e encosto estofados recentemente com tecido de alta qualidade. Perfeita para sala de jantar ou escritório.",
  size: "82cm x 50cm x 48cm",
  material: "Madeira de teca, tecido bouclé",
  color: "Madeira natural e cinza",
  condition: "Muito bom - restaurada profissionalmente",
  origin: "Dinamarca",
  year: "1962",
  auctionUrl: "https://exemplo.com/leilao/cadeira-dinamarquesa",
  active: true
};

// ============================================
// EXEMPLO 3: MESA DE CENTRO
// ============================================
const mesaCentro = {
  title: "Mesa de Centro Retrô com Pés Palito",
  currentBid: 120000, // R$ 1.200,00
  images: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
  ],
  category: "Mesas",
  details: "Mesa de centro vintage com design atemporal. Tampo em madeira maciça com acabamento natural e pés palito característicos do estilo mid-century. Peça versátil que combina com diversos estilos de decoração.",
  size: "120cm x 60cm x 45cm",
  material: "Madeira de Imbuia",
  color: "Mel natural",
  condition: "Bom - com marcas de uso características",
  year: "1970",
  active: true
};

// ============================================
// EXEMPLO 4: SOFÁ MODERNO
// ============================================
const sofaModerno = {
  title: "Sofá de 3 Lugares Estilo Escandinavo",
  currentBid: 420000, // R$ 4.200,00
  images: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800"
  ],
  category: "Sofás",
  details: "Sofá de 3 lugares com design escandinavo contemporâneo. Estrutura robusta em madeira de eucalipto e estofamento em tecido linho importado. Almofadas soltas para maior conforto. Pés em madeira maciça torneados. Ideal para sala de estar ou living.",
  size: "210cm x 85cm x 78cm",
  material: "Estrutura em eucalipto, estofamento em linho",
  color: "Cinza claro",
  condition: "Novo - sem uso",
  origin: "Brasil",
  year: "2024",
  auctionUrl: "https://exemplo.com/leilao/sofa-escandinavo",
  active: true
};

// ============================================
// EXEMPLO 5: LUMINÁRIA VINTAGE
// ============================================
const luminariaVintage = {
  title: "Luminária de Piso Articulada Anos 70",
  currentBid: 68000, // R$ 680,00
  images: [
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800"
  ],
  category: "Iluminação",
  details: "Luminária de piso articulada original dos anos 70. Base em mármore negro e haste em metal cromado. Cúpula ajustável para direcionar a luz. Perfeita para leitura ou como peça decorativa.",
  size: "160cm altura máxima",
  material: "Metal cromado e mármore",
  color: "Cromado e preto",
  condition: "Muito bom - fiação revisada",
  year: "1975",
  active: true
};

// ============================================
// EXEMPLO 6: APARADOR VINTAGE
// ============================================
const aparadorVintage = {
  title: "Aparador Escandinavo em Jacarandá",
  currentBid: 280000, // R$ 2.800,00
  images: [
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
  ],
  category: "Aparadores",
  details: "Magnífico aparador escandinavo em jacarandá da Bahia. Design minimalista com linhas limpas e puxadores embutidos. Três gavetas e duas portas com prateleiras internas. Acabamento em verniz nitrocelulose fosco. Peça rara e extremamente elegante.",
  size: "150cm x 45cm x 80cm",
  material: "Jacarandá da Bahia maciço",
  color: "Marrom escuro natural",
  condition: "Excelente - peça de colecionador",
  origin: "Brasil",
  year: "1960",
  auctionUrl: "https://exemplo.com/leilao/aparador-jacaranda",
  active: true,
  featured: true
};

// ============================================
// EXEMPLO 7: ESPELHO DECORATIVO
// ============================================
const espelhoDecorativo = {
  title: "Espelho Solar em Bronze Maciço",
  currentBid: 145000, // R$ 1.450,00
  images: [
    "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?w=800"
  ],
  category: "Decoração",
  details: "Espelho decorativo em formato de sol, moldura em bronze maciço trabalhado artesanalmente. Peça única que adiciona elegância e sofisticação a qualquer ambiente. Ideal para hall de entrada ou sala de jantar.",
  size: "80cm diâmetro",
  material: "Bronze maciço e espelho bisotado",
  color: "Bronze envelhecido",
  condition: "Excelente",
  origin: "França",
  year: "1950",
  active: true
};

// ============================================
// EXEMPLO 8: PRODUTO MÍNIMO (SEM DETALHES)
// ============================================
// Este exemplo serve para testar como a página
// se comporta com dados mínimos
const produtoMinimo = {
  title: "Mesa Lateral Compacta",
  currentBid: 35000, // R$ 350,00
  images: [
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800"
  ],
  active: true
};

// ============================================
// EXEMPLO 9: PRODUTO SEM IMAGENS
// ============================================
// Para testar o placeholder
const produtoSemImagem = {
  title: "Conjunto de Cadeiras Vintage (4 unidades)",
  currentBid: 180000, // R$ 1.800,00
  images: [], // Array vazio para testar placeholder
  category: "Cadeiras",
  details: "Conjunto de 4 cadeiras vintage em madeira maciça. Assento estofado. Fotos em breve.",
  active: true
};

// ============================================
// EXEMPLO 10: LEILÃO ENCERRANDO EM BREVE
// ============================================
const leilaoUrgente = {
  title: "Banco Artesanal em Madeira de Demolição",
  currentBid: 52000, // R$ 520,00
  images: [
    "https://images.unsplash.com/photo-1503602642458-232111445657?w=800"
  ],
  category: "Bancos",
  details: "Banco artesanal feito com madeira de demolição. Peça única e rústica, perfeita para varanda ou jardim.",
  size: "120cm x 40cm x 45cm",
  material: "Madeira de demolição tratada",
  color: "Natural envelhecido",
  condition: "Novo - feito sob encomenda",
  origin: "Brasil",
  // endAt: Timestamp para daqui 2 horas (para testar urgência)
  active: true
};

// ============================================
// COMO ADICIONAR NO FIRESTORE (Console)
// ============================================

/*
PASSO A PASSO NO CONSOLE DO FIREBASE:

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em Firestore Database
4. Clique em "Iniciar coleção" ou selecione a coleção 'lojinha'
5. Clique em "Adicionar documento"
6. Deixe o ID automático ou defina um personalizado
7. Cole os campos do exemplo acima
8. Clique em "Salvar"

OBSERVAÇÕES IMPORTANTES:

- currentBid: Digite o número SEM aspas (tipo: number)
- images: Use tipo Array com strings
- endAt: Use tipo Timestamp (clique em "adicionar campo" → tipo "timestamp")
- active: Use tipo Boolean
- createdAt: Use firebase.firestore.FieldValue.serverTimestamp()

EXEMPLO DE CAMPO TIMESTAMP (endAt):
1. Clique em "adicionar campo"
2. Nome: endAt
3. Tipo: timestamp
4. Data: Escolha uma data futura (ex: 31/12/2025 23:59:59)
*/

// ============================================
// CÓDIGO PARA ADICIONAR VIA JAVASCRIPT
// ============================================

/*
Se você tiver acesso ao Firebase no lado do servidor
(usando Firebase Admin SDK ou no console do navegador),
pode usar este código:

// Inicializar Firebase (se ainda não estiver)
import { getFirestore, collection, addDoc } from "firebase/firestore";
const db = getFirestore();

// Adicionar um produto
async function adicionarProduto(produto) {
  try {
    const docRef = await addDoc(collection(db, "lojinha"), produto);
    console.log("Produto adicionado com ID:", docRef.id);
  } catch (e) {
    console.error("Erro ao adicionar produto:", e);
  }
}

// Adicionar todos os exemplos de uma vez
async function adicionarTodosProdutos() {
  const produtos = [
    produtoCompleto,
    cadeiraVintage,
    mesaCentro,
    sofaModerno,
    luminariaVintage,
    aparadorVintage,
    espelhoDecorativo,
    produtoMinimo,
    produtoSemImagem,
    leilaoUrgente
  ];
  
  for (const produto of produtos) {
    await adicionarProduto(produto);
  }
  
  console.log("Todos os produtos foram adicionados!");
}

// Executar
adicionarTodosProdutos();
*/

// ============================================
// ESTRUTURA RECOMENDADA NO FIRESTORE
// ============================================

/*
lojinha (coleção)
├── abc123 (documento)
│   ├── title: string
│   ├── currentBid: number (centavos)
│   ├── images: array[string]
│   ├── category: string
│   ├── details: string
│   ├── endAt: timestamp
│   ├── size: string
│   ├── material: string
│   ├── color: string
│   ├── condition: string
│   ├── origin: string
│   ├── year: string
│   ├── auctionUrl: string
│   ├── active: boolean
│   ├── featured: boolean
│   └── createdAt: timestamp
│
├── xyz789 (documento)
│   └── ... (mesma estrutura)
│
└── ... (mais documentos)
*/

// ============================================
// DICAS PARA IMAGENS
// ============================================

/*
OPÇÕES DE URLS PARA IMAGENS:

1. Firebase Storage:
   "https://firebasestorage.googleapis.com/v0/b/seu-projeto.appspot.com/..."

2. Unsplash (para testes):
   "https://images.unsplash.com/photo-XXXXX?w=800"
   
3. Cloudinary:
   "https://res.cloudinary.com/seu-usuario/image/upload/v123456/produto.jpg"

4. Seu próprio servidor:
   "https://seusite.com.br/images/produtos/produto-1.jpg"

DIMENSÕES RECOMENDADAS:
- Largura: 800px - 1200px
- Proporção: 1:1 (quadrado) ou 4:3
- Formato: JPG ou WebP
- Tamanho: Máximo 500KB por imagem
*/

// ============================================
// CATEGORIAS SUGERIDAS
// ============================================

const categoriasSugeridas = [
  "Sofás",
  "Poltronas",
  "Cadeiras",
  "Mesas",
  "Aparadores",
  "Estantes",
  "Cômodas",
  "Camas",
  "Criados-mudos",
  "Bancos",
  "Iluminação",
  "Tapetes",
  "Espelhos",
  "Decoração",
  "Arte",
  "Antiguidades"
];

// ============================================
// VALIDAÇÃO DE DADOS
// ============================================

function validarProduto(produto) {
  const erros = [];
  
  // Campos obrigatórios
  if (!produto.title || produto.title.trim() === '') {
    erros.push('Campo "title" é obrigatório');
  }
  
  if (typeof produto.currentBid !== 'number' || produto.currentBid <= 0) {
    erros.push('Campo "currentBid" deve ser um número maior que 0');
  }
  
  if (!Array.isArray(produto.images)) {
    erros.push('Campo "images" deve ser um array');
  }
  
  // Validações opcionais
  if (produto.auctionUrl && !produto.auctionUrl.startsWith('http')) {
    erros.push('Campo "auctionUrl" deve ser uma URL válida');
  }
  
  if (erros.length > 0) {
    console.error('Erros de validação:', erros);
    return false;
  }
  
  return true;
}

// ============================================
// EXPORTAR PARA USO
// ============================================

// Se você estiver usando Node.js ou módulos ES6
export {
  produtoCompleto,
  cadeiraVintage,
  mesaCentro,
  sofaModerno,
  luminariaVintage,
  aparadorVintage,
  espelhoDecorativo,
  produtoMinimo,
  produtoSemImagem,
  leilaoUrgente,
  categoriasSugeridas,
  validarProduto
};

// ============================================
// CONSOLE LOG PARA DEBUG
// ============================================

console.log('='.repeat(50));
console.log('EXEMPLOS DE PRODUTOS CARREGADOS');
console.log('='.repeat(50));
console.log('Total de exemplos:', 10);
console.log('Categorias sugeridas:', categoriasSugeridas.length);
console.log('='.repeat(50));
console.log('\nPara adicionar no Firestore:');
console.log('1. Copie um dos objetos acima');
console.log('2. Cole no Console do Firebase');
console.log('3. Ajuste os tipos de dados conforme necessário');
console.log('4. Salve o documento');
console.log('\nDocumentação completa em: PRODUTO-DETALHES-README.md');
console.log('='.repeat(50));

