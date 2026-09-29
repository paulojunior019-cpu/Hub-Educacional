# Hub Educacional

Hub de estudos com quatro módulos: BioUECE disponível, ProfBio e SPAECE em preparação, e Banco de Questões planejado. Feito com HTML, CSS e JavaScript puro, sem dependências nem etapa de compilação. O BioUECE mantém suas 80 questões em `data/questoes.json`, filtros por edição/status e busca, correção imediata, painel de desempenho por vestibular e caderno de erros. O progresso continua no mesmo armazenamento local do navegador (`biouece-progress-v1`) para preservar o histórico já registrado neste dispositivo.

## Executar localmente

Abra `INICIAR_BioUECE.bat` no Windows. Ele inicia um servidor local em `http://localhost:8765`; não abra o HTML diretamente como arquivo.

## Publicar

Envie o conteúdo desta pasta para um repositório e publique a pasta raiz pelo GitHub Pages (Settings → Pages → Deploy from a branch → branch `main` e pasta `/ (root)`). O endereço precisa usar HTTPS para permitir instalação e service worker. Em outro host, publique esses mesmos arquivos em uma subpasta mantendo suas rotas relativas.

## Instalar no iPhone

1. Abra a URL HTTPS publicada no Safari.
2. Toque em Compartilhar → **Adicionar à Tela de Início** → Adicionar.
3. Abra o Hub Educacional pelo novo ícone. Após o primeiro carregamento, a interface e as questões ficam disponíveis offline; novas versões atualizam o cache ao carregar online.

O progresso permanece no armazenamento local do navegador/dispositivo. O modo offline depende do primeiro carregamento completo com conexão.

