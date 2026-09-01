# Mídia oficial

A versão atual utiliza vídeos provisórios apenas para validar composição e movimento.

## Vídeos da frota

Quando o material oficial estiver disponível, priorizar:

- caminhões e veículos reais da ALC;
- bases, pátios e operações reais;
- enquadramento horizontal para hero e seções amplas;
- movimentos estáveis, sem cortes excessivamente rápidos;
- ausência de placas, documentos ou dados operacionais sensíveis em destaque;
- material com autorização de uso institucional.

## Formato recomendado

Para web, manter uma versão principal em MP4/H.264 e, futuramente, uma alternativa WebM quando isso trouxer ganho real de peso.

Referência inicial para o hero:

- proporção: 16:9;
- resolução: 1920×1080;
- duração: 10 a 30 segundos em loop;
- áudio removido;
- compressão otimizada para carregamento web.

## Integração

A fonte das mídias fica centralizada em `media.js`. Evitar inserir URLs de vídeo diretamente no HTML.

Antes da publicação final, remover qualquer mídia provisória externa e validar o comportamento em desktop, Android e iOS.
