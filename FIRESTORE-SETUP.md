# Configuração do Firestore para Interactive Banners

## Problema Identificado

O slider de banners interativos está configurado para carregar dados da coleção `interactiveBanners` do Firestore, mas atualmente não há dados nesta coleção ou ela não existe.

## Solução

### 1. Acessar o Console do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto `leiloart`
3. Vá para **Firestore Database**

### 2. Criar a Coleção `interactiveBanners`

1. Clique em **"Iniciar coleção"** ou **"+ Adicionar coleção"**
2. Nome da coleção: `interactiveBanners`
3. Adicione os documentos conforme o exemplo abaixo

### 3. Estrutura dos Documentos

Cada documento na coleção `interactiveBanners` deve ter a seguinte estrutura:

```json
{
  "title": "Título do Banner",
  "imageUrl": "URL da imagem do banner",
  "aspectRatio": 1.7777777777777777,
  "focalPoint": {
    "x": 0.5,
    "y": 0.4
  },
  "active": true,
  "order": 1,
  "hotspots": [
    {
      "id": "hotspot1",
      "position": {
        "x": 0.3,
        "y": 0.6
      },
      "zIndex": 10,
      "product": {
        "id": "product1",
        "title": "Nome do Produto",
        "imageUrl": "URL da imagem do produto",
        "currentBid": "R$ 850,00",
        "details": "Descrição detalhada do produto"
      }
    }
  ]
}
```

### 4. Campos Obrigatórios

- **title**: Título do banner (string)
- **imageUrl**: URL da imagem principal (string)
- **aspectRatio**: Proporção da imagem, ex: 16/9 = 1.777... (number)
- **focalPoint**: Ponto focal da imagem (object)
  - **x**: Posição horizontal 0-1 (number)
  - **y**: Posição vertical 0-1 (number)
- **active**: Se o banner está ativo (boolean)
- **order**: Ordem de exibição (number)
- **hotspots**: Array de pontos interativos (array)

### 5. Estrutura dos Hotspots

Cada hotspot deve ter:
- **id**: ID único do hotspot (string)
- **position**: Posição no banner (object)
  - **x**: Posição horizontal 0-1 (number)
  - **y**: Posição vertical 0-1 (number)
- **zIndex**: Camada do hotspot (number)
- **product**: Dados do produto (object)
  - **id**: ID do produto (string)
  - **title**: Nome do produto (string)
  - **imageUrl**: URL da imagem do produto (string)
  - **currentBid**: Lance atual formatado (string)
  - **details**: Descrição do produto (string)

### 6. Exemplo de Dados

Consulte o arquivo `firestore-data-example.json` para ver exemplos completos de documentos.

### 7. Teste da Configuração

1. Abra o arquivo `test-firebase.html` no navegador
2. Verifique se os dados estão sendo carregados corretamente
3. Se houver erros, verifique o console do navegador

### 8. Verificação no Site

Após adicionar os dados no Firestore:

1. Abra o `index.html` no navegador
2. Verifique o console do navegador para logs de debug
3. O slider deve carregar os dados reais em vez dos exemplos

## Logs de Debug

O código foi modificado para incluir logs detalhados. No console do navegador você verá:

- 🚀 Inicialização do slider
- ✅ Status da conexão com Firebase
- 🔍 Execução das queries
- 📊 Quantidade de documentos encontrados
- 📄 Dados de cada documento carregado
- ⚠️ Avisos se não houver dados

## Fallback

Se não houver dados no Firestore ou houver erro na conexão, o slider automaticamente usará os banners de exemplo definidos no código.