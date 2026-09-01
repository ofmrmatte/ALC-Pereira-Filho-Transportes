# ALC & Pereira Filho Transportes

Novo site institucional multipágina da ALC & Pereira Filho Transportes.

> Projeto em homologação. O domínio institucional atual permanece inalterado até a aprovação final.

## Preview

https://alc-pereira-filho-preview.vercel.app

## Arquitetura institucional

O projeto deixou de ser tratado como landing page. A Home funciona como porta de entrada e o conteúdo foi distribuído em áreas próprias:

- `/` — Home institucional
- `/empresa/` — história, Diretores André Costa e Paulo Filho, missão, visão e valores
- `/equipe/` — diretoria e funcionários apresentados institucionalmente pela empresa
- `/solucoes/` — serviços e frentes logísticas
- `/operacao/` — operação, tecnologia, indicadores e segurança
- `/trabalhe-conosco/` — carreiras e parceiros
- `/cotacao/` — solicitação comercial
- `/contato/` — canais e formulário institucional

## Direção visual

- off-white, grafite e vermelho institucional;
- vídeo no hero da Home como mídia de impacto, sem transformar o site em landing page;
- páginas internas com hierarquia editorial própria;
- responsividade e safe areas para dispositivos móveis;
- vídeos provisórios desacoplados do layout para troca posterior por material oficial da frota;
- preview bloqueado para indexação durante a homologação;
- assinatura de desenvolvimento preservada.

## Conteúdo institucional recuperado

A nova página Empresa reaproveita e reorganiza a história pública existente da companhia, incluindo o início da ALC Transportes em 2015, a entrada de Paulo Henrique Pereira Filho em 2019, a expansão no e-commerce e as frentes de XPT, Middle Mile, Line Haul, logística reversa e Last Mile.

A área de equipe também recupera os profissionais apresentados no site institucional atual. Antes da publicação definitiva, cargos e fotos devem ser validados pela direção/RH.

## Estrutura

```text
.
├── index.html
├── empresa/index.html
├── equipe/index.html
├── solucoes/index.html
├── operacao/index.html
├── trabalhe-conosco/index.html
├── cotacao/index.html
├── contato/index.html
├── assets/
│   ├── site.css
│   └── site.js
├── media.js
├── favicon.svg
├── vercel.json
├── docs/
├── CHANGELOG.md
└── README.md
```

## Desenvolvimento local

O projeto atual é estático e não depende de build.

```bash
python -m http.server 8080
```

## Mídia oficial

Os vídeos usados nesta fase são placeholders. A substituição deve ser feita em `media.js`. As fotografias de equipe atualmente referenciam o material público do site institucional existente e deverão ser migradas para arquivos próprios antes da troca definitiva do domínio.

## Responsável pelo desenvolvimento

**Matheus Ferreira**  
2026
