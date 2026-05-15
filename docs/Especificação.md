# Especificação Técnica: Notion Lyrics Widget

## 1. Visão Geral do Projeto
**Projeto:** Noteon (Widget para exibir letras de músicas no Notion)
**Descrição:** Um widget embeddável para o Notion desenvolvido em React. Ele permite que o usuário configure uma música, artista ou álbum específico para exibir trechos aleatórios de letras musicais. O visual segue uma estética Y2K Brutalista/Flat.
**Propósito:** Servir como um guia técnico para o desenvolvimento, detalhando o fluxo de dados, a stack tecnológica, regras de negócio e os desafios de integração.

## 2. Metas Técnicas e Critérios de Aceite
* **Integração Fluida:** As APIs do iTunes (busca) e Genius (letras) devem se comunicar através de um backend próprio em Node.js para evitar problemas de CORS e mascarar chaves de API.
* **Filtro de Qualidade:** O sistema não deve sortear músicas de álbuns de "REMIX" (quando na modalidade de busca por artista).
* **Extração Inteligente:** O backend deve ser capaz de processar a letra inteira vinda do Genius e retornar apenas um trecho (estrofe/bloco) para não quebrar a UI do widget.
* **Estabilidade:** Implementar tratamento de erros caso o Genius não encontre a letra da música sorteada.

## 3. UI/UX e Direção de Arte
* **Estética:** Y2K Brutalista, Flat Design.
* **Elementos Visuais:**
  * Tipografia sem serifa, ousada e de alto impacto (ex: Arial Black, Helvetica Neue, ou fontes estilo pixel/display).
  * Cores sólidas e contrastantes (preto profundo, branco puro, acentos em neon ou pastel saturado).
  * Bordas marcadas e duras (sem `border-radius` suave, sem `box-shadow` esfumado).
  * Layout focado no conteúdo em texto, parecendo um "terminal moderno" ou um "sticker digital".
* **Interação:** Transições fluídas e objetivas. 
  * Botão de "Re-roll" (Sortear Novamente) deve ser visível e deve haver opções para voltar e retroceder ao estado de busca inicial.

## 4. Lógica de Funcionamento e Fluxos

### 4.1. Configuração Inicial (Frontend)
1. O usuário abre o widget e se depara com um input de busca e um seletor de modalidade: `[ Música | Artista | Álbum ]`.
2. O usuário digita o termo e dispara a busca (chamada para o backend).

### 4.2. Fluxo de Busca (Backend -> iTunes API)
* **Se `Música`:**
  * Busca na API do iTunes pelo nome da track.
  * Retorna uma lista de resultados (Capa, Nome da Faixa, Artista).
  * *Ação:* O usuário clica na música exata. O fluxo segue para a Geração de Letras.
* **Se `Álbum`:**
  * Busca na API do iTunes pelo nome do álbum.
  * Retorna a lista de álbuns. O usuário seleciona um.
  * *Ação:* O backend busca a tracklist desse álbum, faz um `Math.random()` para escolher uma faixa, e o fluxo segue para a Geração de Letras.
* **Se `Artista`:**
  * Busca na API do iTunes pelo nome do artista.
  * Retorna os artistas. O usuário seleciona um.
  * *Ação (O Filtro Remix):* O backend busca a discografia do artista. Faz um filtro: `albums.filter(a => !a.collectionName.toLowerCase().includes('remix'))`.
  * Sorteia um álbum da lista filtrada. Busca a tracklist desse álbum. Sorteia uma música. Segue para a Geração de Letras.

### 4.3. Geração de Letras (Backend -> Genius API)
1. O backend recebe a música definida no passo anterior (Título + Artista).
2. Utiliza a camada de serviços (exclusiva para APIs) para raspar/buscar a letra completa no Genius.
3. **Camada de Limpeza (Sanitização):** O texto bruto passa por uma função de limpeza que:
   * Remove eventuais cabeçalhos ou metadados da resposta da API.
   * Remove marcações de estrutura musicais contidas em colchetes (ex: `[Chorus]`, `[Verse 1]`, `[Bridge]`).
4. **Algoritmo de Fatiamento e Pares (O Coração do Widget):**
   * O script recebe a letra limpa e a separa em **estrofes (stanzas)**.
   * Dentro de cada estrofe, o algoritmo itera pelas linhas e agrupa-as em **pares de versos consecutivos**.
   * **Filtro de Relevância:** Avalia todos os pares criados e descarta aqueles que não possuem substância. A regra é: *pelo menos uma das linhas do par deve conter mais de 10 caracteres* (evitando pares formados apenas por interjeições como "Yeah / Uh").
   * Com o array de pares válidos montado, o sistema executa um sorteio aleatório, escolhendo um único par.
5. Envia o par sorteado e os metadados (Capa, Nome, Artista) de volta para o Frontend.

## 5. Arquitetura e Stack
* **Frontend:** React.js, Tailwind CSS (ideal para construir o design system brutalista rapidamente). Hospedagem sugerida: Vercel.
* **Backend (BFF - Backend for Frontend):** Node.js com Express (ou rotas de API do Next.js/Vite se preferir unificar). Hospedagem sugerida: Render, Railway ou Vercel Serverless.
* **Pacotes Principais:**
  * `axios` (para chamadas HTTP).
  * `genius-lyrics` (para a busca de letras).
* **APIs Externas:**
  * iTunes Search API: `https://itunes.apple.com/search` e `https://itunes.apple.com/lookup` (Não precisa de chave).
  * Genius API: Necessário token de acesso (armazenado em `.env` no backend).

## 6. Riscos e Soluções (Troubleshooting)
* **Genius não acha a música:** As APIs do iTunes e do Genius podem ter grafias diferentes para a mesma música (ex: "Song feat. Artist" vs "Song (feat. Artist)").
  * *Solução:* Limpar o nome da música com Regex antes de enviar para o `genius-lyrics`, removendo termos como "(Radio Edit)", "(Remastered)", etc.
* **Rate Limits:** Muitas atualizações no Notion podem estourar o limite da API do Genius.
  * *Solução:* Implementar um cache simples (em memória no Node ou Redis) mapeando `NomeDaMusica -> LetraCompleta`. Se a música já foi buscada antes, sorteie o trecho a partir do cache.

## 7. Estrutura de Diretórios e Arquivos (Arquitetura)
Para manter o projeto escalável e organizado, sugere-se a separação clara entre Frontend e Backend (mesmo que habitem o mesmo repositório no modelo *monorepo*).

### Frontend (React + Vite)
```text
/frontend
├── /src
│   ├── /assets             # Arquivos de estilos e imagens
│   ├── /components         # Componentes da UI 
│   ├── /hooks              # Regras de negócio para comunicação com backend
│   │   ├── useItunes.js    # Gerencia o estado da busca e opções
│   │   └── useLyrics.js    # Gerencia o fetch das letras e os erros
│   ├── /services           # Configuração do Axios apontando para o backend
   │   └── api.js          
│   ├── App.jsx             # Gerencia a transição entre Tela de Busca -> Tela de Letra
│   ├── main.jsx            # Ponto de entrada do React
│   └── index.css           # Configurações de estilização global.
├── tailwind.config.js      # Configuração de estilização do tailwind
└── package.json
```

### Backend (Node.js + Express)
```text
/backend
├── /src
│   ├── /routes             # Definição dos endpoints (ex: /api/search, /api/lyrics)
│   ├── /controllers        # Orquestra as requisições, unindo services e utils
│   ├── /services           # CAMADA PARA APIs EXTERNAS
│   │   ├── itunesApi.js    # Comunicação com iTunes
│   │   └── geniusApi.js    # Comunicação com Genius
│   ├── /utils              # CAMADA DE PROCESSAMENTO LÓGICO E LIMPEZA
│   │   ├── textCleaner.js  # Limpa a letra (remove headers, marcadores [Chorus], etc.)
│   │   └── stanzaParser.js # Algoritmo para separar estrofes, formar pares, filtrar e sortear versos de música.
│   └── server.js           # Inicialização do Express, middlewares (CORS)
├── .env                    # Genius API Token (NÃO COMITAR)
└── package.json
```

## 8. Checklist de Desenvolvimento
- [ ] Criar repositório e configurar ambiente Node.js.
- [ ] Testar a busca do iTunes via Postman/Insomnia (entender o payload).
- [ ] Desenvolver a camada `services/` (Isolar chamadas do iTunes e Genius).
- [ ] Escrever a função de Limpeza em `textCleaner.js` (Regex para tirar colchetes e headers).
- [ ] Desenvolver o algoritmo central em `stanzaParser.js` (Quebra de estrofes, agrupamento em pares e validação de 10 caracteres).
- [ ] Escrever a função do "Filtro de Remixes" na controladora de busca.
- [ ] Criar os endpoints do backend.
- [ ] Iniciar o projeto React + Tailwind.
- [ ] Criar a UI Brutalista Y2K (Tela de Busca/Configuração e Tela de Exibição da Letra).
- [ ] Integrar Frontend com Backend e testar transições.
- [ ] Fazer o deploy e testar o Embed no Notion.