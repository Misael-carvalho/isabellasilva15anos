# Isabella Silva · 15 Anos

Site da festa de 15 anos com convite, contagem regressiva, linha do tempo, galeria,
informações do evento, lista de presentes com Pix (QR Code + copia e cola),
confirmação de presença, mural de recados e dúvidas frequentes.

Tudo 100% gratuito: **GitHub Pages** (hospedagem) + **Google Sheets** (respostas).

---

## 1. Editar textos e dados

Quase tudo fica em **`assets/js/config.js`**:

| O quê | Onde |
|---|---|
| Nome, data, horário, prazo de confirmação | `nome`, `dataEvento`, `dataExtenso`, `horario`, `prazoRSVP` |
| Local e mapa | `local` (o campo `busca` é o endereço usado no mapa) |
| Traje e cores | `dressCode` |
| WhatsApp da família | `whatsapp` (só números, com 55 + DDD) |
| Chave Pix | `pix.chave`, `pix.recebedor`, `pix.cidade` |
| Lista de presentes | `presentes` (nome, descrição, valor, quantidade, link opcional) |

Textos longos (convite, frase, linha do tempo, programação da noite, dúvidas) estão
direto no **`index.html`** — basta procurar o texto e trocar.

Fotos ficam em `assets/img/`. Para trocar, mantenha o mesmo nome de arquivo
(ex.: `hero.jpg` é a foto da capa; `g01.jpg` a `g12.jpg` e `g01-t.jpg` a `g12-t.jpg` são a galeria).

> ⚠️ Teste o Pix: depois de colocar a chave real, abra um presente no site, copie o código e
> cole no app do banco (sem pagar) para conferir se o nome do recebedor aparece certo.

---

## 2. Publicar no GitHub Pages

1. Envie os arquivos para o repositório `isabellasilva15anos` (branch `main`).
2. No GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / pasta **/ (root)** → **Save**
3. Em 1–2 minutos o site estará em:
   **https://misael-carvalho.github.io/isabellasilva15anos/**

Cada novo `git push` atualiza o site automaticamente.

---

## 3. Receber confirmações, presentes e recados numa planilha (opcional, recomendado)

Sem isso o site funciona em **modo demonstração**: confirmações e presentes abrem o
WhatsApp com a mensagem pronta, e recados ficam só no navegador de quem escreveu.

1. Acesse [sheets.new](https://sheets.new) e crie uma planilha (ex.: "Isabella 15 Anos").
2. Menu **Extensões → Apps Script**.
3. Apague o conteúdo e cole o arquivo **`apps-script/Code.gs`**. Salve.
4. No seletor de funções escolha **`configurar`** e clique em **Executar**
   (autorize com sua conta Google — aparece um aviso "app não verificado":
   clique em *Avançado → Acessar*). Serão criadas as abas *Confirmações*, *Presentes* e *Recados*.
5. **Implantar → Nova implantação** → engrenagem → **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
6. Copie a **URL do app da Web** (termina em `/exec`) e cole em `assets/js/config.js`:
   ```js
   apiUrl: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ```
7. Faça commit e push.

**Moderar recados:** em `Code.gs`, troque `MODERAR_RECADOS = true` (e reimplante —
*Implantar → Gerenciar implantações → editar → Nova versão*). Os recados só aparecem
depois que você escrever `SIM` na coluna *Aprovado*. Para esconder um recado
já publicado, escreva `NÃO`.

**Presentes:** cada presente confirmado vira uma linha na aba *Presentes*. Confira no extrato
do banco e marque a coluna *Pix recebido?*. Para "liberar" um presente, apague a linha.

---

## 4. Testar no computador

Basta abrir o `index.html` no navegador, ou rodar um servidor local:

```bash
npx serve .
```

## Estrutura

```
index.html            Página
assets/css/style.css  Visual
assets/js/config.js   Dados editáveis
assets/js/main.js     Funcionalidades
assets/img/           Fotos otimizadas
apps-script/Code.gs   Backend gratuito (Google Sheets)
```
