# BioUECE

Hub de estudos com o módulo BioUECE disponível e módulos ProfBio e SPAECE sinalizados como próximos passos. Feita com HTML, CSS e JavaScript puro, sem dependências nem etapa de compilação. A V1 traz 80 questões carregadas de `data/questoes.json`, filtros por edição/status e busca, correção imediata, painel de desempenho por vestibular e caderno de erros. As respostas ficam no `localStorage` do navegador e não sincronizam entre aparelhos.

## Executar localmente

Abra `INICIAR_BioUECE.bat` no Windows. Ele inicia um servidor local em `http://localhost:8765`; não abra o HTML diretamente como arquivo.

## Publicar

Envie o conteúdo desta pasta para um repositório e publique a pasta raiz pelo GitHub Pages (Settings → Pages → Deploy from a branch → branch `main` e pasta `/ (root)`). O endereço precisa usar HTTPS para permitir instalação e service worker. Em outro host, publique esses mesmos arquivos em uma subpasta mantendo suas rotas relativas.

## Instalar no iPhone

1. Abra a URL HTTPS publicada no Safari.
2. Toque em Compartilhar → **Adicionar à Tela de Início** → Adicionar.
3. Abra o BioUECE pelo novo ícone. Após o primeiro carregamento, a interface e as questões ficam disponíveis offline; novas versões atualizam o cache ao carregar online.

O progresso permanece no armazenamento local do navegador/dispositivo. O modo offline depende do primeiro carregamento completo com conexão.

