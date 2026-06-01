<div align="center">

# 🏆 Copa do Mundo FIFA 2026 — Simulador

**Simulador interativo não oficial da Copa do Mundo FIFA 2026**  
Simule grupos, chaveamento, artilharia e muito mais — direto no seu navegador.

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://world-cup-2026-two.vercel.app/)
[![Vue](https://img.shields.io/badge/Vue-3.5-42B883?logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## ✨ Funcionalidades

- **Fase de Grupos** — 12 grupos (A–L) com 48 seleções, placares editáveis e classificação em tempo real
- **Chaveamento completo** — 16-avos, Oitavas, Quartas, Semifinais, Final e Decisão de 3º lugar
- **Simulação automática** — simule grupos ou o torneio inteiro com algoritmo baseado no ranking FIFA
- **Artilharia** — tabela de gols com jogadores reais, editável e com busca
- **Pênaltis** — toque na bandeira para definir o vencedor em empates no mata-mata
- **Persistência local** — todos os dados salvos no `localStorage` do navegador
- **Multilíngue** — Português 🇧🇷, Inglês 🇺🇸 e Espanhol 🇪🇸
- **Responsivo** — funciona em desktop e mobile

## 🖥️ Tecnologias

| Tecnologia | Versão |
|---|---|
| Vue | 3.5 |
| TypeScript | 5.8 |
| Vite | 6 |
| Tailwind CSS | v4 |
| @lucide/vue | — |

## 📁 Estrutura do projeto

```
src/
  types/index.ts          # Interfaces TypeScript
  data/constants.ts       # Times, grupos, traduções e dados estáticos
  utils/index.ts          # Simulação, standings e bracket logic
  components/
    TeamFlag.vue           # Componente de bandeira + nome da seleção
    KnockoutMatchItem.vue  # Card de partida do mata-mata
  App.vue                 # App principal (Composition API + <script setup>)
  main.ts                 # Ponto de entrada
  index.css               # Estilos globais (Tailwind v4)
```

## 🚀 Rodar localmente

**Pré-requisitos:** Node.js 18+

```bash
# Clone o repositório
git clone https://github.com/rafaelxulipa/world-cup-2026.git
cd world-cup-2026

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

## 📦 Build para produção

```bash
npm run build
```

Os arquivos serão gerados em `dist/`.

## 🌐 Deploy na Vercel

Conecte o repositório no [dashboard da Vercel](https://vercel.com/) ou use o CLI:

```bash
npx vercel --prod
```

## ⚠️ Aviso

Este é um simulador **não oficial**, desenvolvido por fãs para fins de entretenimento. Não possui nenhuma afiliação, associação ou relação com a FIFA.

---

<div align="center">
Feito com ⚽ por <a href="https://github.com/rafaelxulipa">@rafaelxulipa</a>
</div>
