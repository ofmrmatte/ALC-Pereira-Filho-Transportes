# ALC & Pereira Filho Transportes

Site institucional da ALC & Pereira Filho Transportes.

> Projeto em homologação. O domínio institucional atual permanece inalterado até a aprovação final desta nova versão.

## Preview

https://alc-pereira-filho-preview.vercel.app

## Status

A base atual concentra a nova direção visual e a estrutura da Home. O foco desta etapa é validar identidade, hierarquia de conteúdo, responsividade e experiência antes de conectar integrações e substituir as mídias provisórias pelo material oficial da empresa.

## Direção do projeto

- identidade corporativa em off-white, grafite e vermelho;
- experiência responsiva com tratamento de safe areas em dispositivos móveis;
- comunicação voltada a transporte, logística nacional e operações dedicadas;
- estrutura preparada para conteúdo institucional, soluções, operação, segmentos e cotação;
- mídia de vídeo desacoplada do layout para troca rápida por vídeos oficiais da frota;
- preview sem indexação por mecanismos de busca durante a homologação;
- assinatura de desenvolvimento preservada no projeto e no site.

## Estrutura

```text
.
├── index.html            # Home e estilos da versão de homologação
├── media.js              # Fontes de mídia provisórias
├── favicon.svg           # Ícone temporário da marca
├── vercel.json           # Headers e configuração do deploy
├── assets/               # Ponto de entrada para mídia oficial futura
├── docs/
│   ├── MEDIA.md          # Padrão para vídeos e imagens oficiais
│   └── ROADMAP.md        # Próximas etapas da evolução do site
├── CHANGELOG.md          # Histórico de evolução
└── README.md
```

## Desenvolvimento local

O projeto atual é estático e não depende de build.

```bash
python -m http.server 8080
```

Depois, acesse `http://localhost:8080`.

## Mídia oficial

Os vídeos usados nesta fase são apenas placeholders de homologação. A substituição deve ser feita em `media.js`, sem alterar a estrutura da página. Consulte `docs/MEDIA.md` antes de adicionar os arquivos definitivos.

## Publicação

A homologação deve continuar separada do domínio `alcepereirafilho.com.br` até a aprovação do conteúdo, das mídias, dos contatos e do formulário comercial.

## Responsável pelo desenvolvimento

**Matheus Ferreira**  
2026
