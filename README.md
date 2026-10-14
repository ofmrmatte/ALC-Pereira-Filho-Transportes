# ALC & Pereira Filho Transportes

Site institucional multipágina da **ALC & Pereira Filho Transportes Ltda.**

A aplicação foi reconstruída para funcionar como um portal corporativo de transporte e logística — não como landing page. O repositório `main` é a fonte oficial do projeto. O site será publicado na **Railway**, no mesmo projeto ALC dos demais sistemas, porém em serviço próprio independente.

## Arquitetura

- `/` — Home institucional
- `/empresa/` — história, diretoria, missão, visão e valores
- `/equipe/` — diretoria, gestão, coordenações, supervisão, frotas e administrativo
- `/solucoes/` — portfólio de serviços logísticos
- `/operacao/` — estrutura operacional e capilaridade
- `/cotacao/` — solicitação comercial funcional
- `/contato/` — canais oficiais, localização e formulário funcional
- `/trabalhe-conosco/` — contato para carreiras e parceiros
- `/privacidade/` — política de privacidade
- `/404.html` — rota de erro institucional

## Identidade visual

- logotipo oficial incorporado em `assets/brand/logo.svg`;
- vermelho institucional `#E30613`;
- grafite, branco e off-white como base;
- tipografia Manrope;
- componentes compactos e navegação editorial;
- redes sociais em botões minimalistas;
- layout responsivo com safe areas para dispositivos móveis.

A direção de interface foi desenvolvida com referências de composição observadas no **21st.dev** — navegação, timelines, diretórios de equipe, grids editoriais e microinterações — sem copiar um template pronto.

## Funcionalidades

Os formulários são utilizáveis sem backend próprio:

- Cotação: organiza os dados e abre o WhatsApp do SAC com a solicitação pronta; também permite envio por e-mail.
- Contato: encaminha a mensagem por WhatsApp ou e-mail.
- Trabalhe conosco: organiza o interesse profissional e abre o canal de atendimento.
- Nenhum desses formulários grava dados em banco de dados do site.

Canais configurados:

- Facebook: https://web.facebook.com/alcepereirafilhotransportes
- Instagram: https://www.instagram.com/alcepereirafilhotransportes
- LinkedIn: https://www.linkedin.com/company/alcepereirafilhotransportes/
- SAC WhatsApp: +55 11 97834-1558
- Comercial: comercial@alcepereirafilho.com.br

## Desenvolvimento

Site estático servido por Node.js 22+, com servidor de baixa dependência e healthcheck.

```bash
npm run check
npm start
```

Acesse `http://localhost:3000/` e verifique `/health`.

## Publicação

Fluxo definido:

```text
GitHub main
    ↓
Railway · serviço ALC-Site-Institucional
    ↓
Validação
    ↓
Domínio institucional
```

**Não utilizar Vercel para hospedar este site.** Manter deploy automático na Railway pela branch `main`, com serviço isolado, e preservar o DNS oficial até aprovação.

Enquanto a versão ainda estiver em validação, `robots.txt` e metatags mantêm a indexação bloqueada. Antes da publicação definitiva, remover `noindex,nofollow` e liberar o `robots.txt`.

## Mídias

O vídeo atual da Home é temporário. A etapa de mídia definitiva consiste em substituir o material de apoio por vídeos reais da frota e das operações da ALC, preferencialmente hospedados em CDN ou no próprio projeto em formatos otimizados.

## Responsável pelo desenvolvimento

**Matheus Ferreira**  
2026
