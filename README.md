
# Noteon 🎵

Um widget *embeddável* para o Notion que exibe trechos de letras de músicas baseado em uma playlist do Spotify.

## 📌 Sobre o Projeto

O Noteon foi criado para trazer letras de músicas para o workspace do Notion de forma simples, rápida e personalizável, atuando como uma ponte entre o Spotify; o Genius e o próprio Notion em um fluxo de etapas:

- **Recepção**: Primeiro, o widget é carregado via bloco /embed no Notion, recebendo o ID de uma playlist do Spotify através de um *query parameter* na sua URL.
- **Busca no Spotify**: A aplicação consulta a API do Spotify usando esse ID, encontra a playlist e recupera a lista de músicas contidas nela.
- **Sorteio**: Uma faixa dessa playlist é selecionada aleatoriamente.
- **Busca no Genius**: Com a faixa definida, a aplicação faz uma busca na API do Genius para recuperar a letra completa da música.
- **Exibição**: O Noteon isola um trecho específico dessa letra e o exibe com uma interface limpa diretamente na sua página do Notion.

## 🛠️ Tech Stack

O projeto é construído utilizando as tecnologias a seguir:

  <div align="center">
  
  <h4>Linguagem e Ambiente</h4>
  <div>
    <img src="https://img.shields.io/badge/javascript-%23F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="javascript" />
    <img src="https://img.shields.io/badge/react-%2361DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react" />
    <img src="https://img.shields.io/badge/nodejs-%235FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="nodejs" />
  </div>
  <br/>
  <h4>Servidor, Requisições e Ferramentas</h4>
  <div>
    <img src="https://img.shields.io/badge/express-%23000000?style=for-the-badge&logo=express&logoColor=white" alt="express" />
    <img src="https://img.shields.io/badge/axios-%235A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="axios" />
    <img src="https://img.shields.io/badge/dotenv-%23ECD53F?style=for-the-badge&logo=dotenv&logoColor=black" alt="dotenv" />
    <img src="https://img.shields.io/badge/cheerio-%23E88C1F?style=for-the-badge&logo=cheerio&logoColor=white" alt="cheerio" />
  </div>
  <br/>
  <h4>APIs Externas</h4>
  <div>
    <img src="https://img.shields.io/badge/spotify-%231ED760?style=for-the-badge&logo=spotify&logoColor=white" alt="spotifyAPI" />
    <img src="https://img.shields.io/badge/genius-%23FFFF64?style=for-the-badge&logo=genius&logoColor=black" alt="geniusAPI" />
  </div>
</div>
  
## Este projeto está em desenvolvimento! 🚧🔨
A documentação será atualizada conforme seu desenvolvimento avançar!