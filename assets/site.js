(() => {
  const CONFIG = Object.freeze({
    whatsapp: '5511978341558',
    email: 'comercial@alcepereirafilho.com.br',
    portfolio: 'https://ofmrmatte.vercel.app/',
    socials: {
      facebook: 'https://web.facebook.com/alcepereirafilhotransportes?_rdc=1&_rdr#',
      instagram: 'https://www.instagram.com/alcepereirafilhotransportes',
      linkedin: 'https://www.linkedin.com/company/alcepereirafilhotransportes/posts/?feedView=all'
    }
  });

  const icons = {
    facebook: '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V4a23 23 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.4Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Z"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.5" cy="6.6" r="1" fill="currentColor"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M6.4 8.2H3.2V21h3.2V8.2ZM4.8 3A1.9 1.9 0 1 0 4.8 6.8 1.9 1.9 0 0 0 4.8 3ZM21 13.7c0-3.8-2-5.7-4.8-5.7-2.2 0-3.2 1.2-3.8 2v-1.8H9.2V21h3.2v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2 1.9 2 3.4V21H20v-7.3Z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12.04 2A9.84 9.84 0 0 0 3.6 16.9L2 22l5.24-1.54A9.96 9.96 0 1 0 12.04 2Zm0 17.95a8.03 8.03 0 0 1-4.1-1.12l-.3-.18-3.11.92.94-3.02-.2-.31a7.9 7.9 0 1 1 6.77 3.71Zm4.4-5.93c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19a7.18 7.18 0 0 1-1.34-1.66c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/></svg>'
  };

  // Mantém as páginas internas visualmente sincronizadas mesmo após atualizações
  // consecutivas do preview. A URL versionada força a revalidação do stylesheet.
  const stylesheet = document.querySelector('link[rel="stylesheet"][href^="/assets/site.css"]');
  if (stylesheet && !stylesheet.href.includes('v=20260901-3')) {
    stylesheet.href = '/assets/site.css?v=20260901-3';
  }

  // Ajustes globais que devem ser idênticos em todas as páginas institucionais.
  const globalFixes = document.createElement('style');
  globalFixes.dataset.siteFixes = '20260901-3';
  globalFixes.textContent = `
    .page-index{line-height:1.85}
    .page-index>strong{display:block;margin:0 0 12px;color:var(--ink);font-size:.68rem;font-weight:800;letter-spacing:.14em;line-height:1.35}
    .icon-btn[data-whatsapp] svg,.social-link[data-whatsapp] svg,.sac-float[data-whatsapp] svg{width:18px;height:18px;display:block}
    .sac-float[data-whatsapp]{font-size:0}
    .site-header .mobile-nav:not(.open){display:none!important}
    .footer-bottom .signature a{color:var(--ink);font-weight:800;text-decoration:none;transition:color .18s ease}
    .footer-bottom .signature a:hover{color:var(--brand)}
    @media(max-width:920px){.site-header .mobile-nav.open{display:flex!important}}
  `;
  document.head.appendChild(globalFixes);

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const pathname = location.pathname.replace(/index\.html$/, '') || '/';

  if (header && !header.classList.contains('is-solid')) {
    const updateHeader = () => header.classList.toggle('scrolled', scrollY > 28);
    updateHeader();
    addEventListener('scroll', updateHeader, { passive: true });
  }

  document.querySelectorAll('[data-nav]').forEach(a => {
    const href = new URL(a.href, location.origin).pathname.replace(/index\.html$/, '');
    const match = href === '/' ? pathname === '/' : pathname.startsWith(href);
    a.classList.toggle('active', match);
  });

  // Garante que o menu móvel nunca apareça duplicado em desktop ou antes de abrir.
  if (mobileNav) mobileNav.hidden = true;
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const open = mobileNav.hidden;
      mobileNav.hidden = !open;
      mobileNav.classList.toggle('open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? '×' : '☰';
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.hidden = true;
      mobileNav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    }));
  }

  document.querySelectorAll('[data-social]').forEach(a => {
    const network = a.dataset.social;
    if (CONFIG.socials[network]) a.href = CONFIG.socials[network];
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (icons[network]) a.innerHTML = icons[network];
  });

  document.querySelectorAll('[data-whatsapp]').forEach(a => {
    const text = a.dataset.whatsapp || 'Olá, gostaria de falar com a ALC & Pereira Filho Transportes.';
    a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (a.matches('.icon-btn,.social-link,.sac-float')) a.innerHTML = icons.whatsapp;
  });

  // Assinatura institucional única em todo o site.
  document.querySelectorAll('.signature').forEach(signature => {
    signature.innerHTML = `Desenvolvido por <a href="${CONFIG.portfolio}" target="_blank" rel="noopener noreferrer" aria-label="Portfólio ofmrmatte">ofmrmatte</a> • 2026`;
  });

  document.querySelectorAll('[data-email]').forEach(a => {
    const subject = a.dataset.subject || 'Contato pelo site - ALC & Pereira Filho Transportes';
    a.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}`;
  });

  const encodeForm = form => Object.fromEntries(new FormData(form).entries());
  const clean = value => String(value || '').trim();
  const lines = (...items) => items.filter(Boolean).join('\n');

  document.querySelectorAll('form[data-live-form]').forEach(form => {
    const type = form.dataset.liveForm;
    const feedback = form.querySelector('.form-feedback');

    const buildMessage = data => {
      if (type === 'quote') {
        return lines(
          '*SOLICITAÇÃO DE COTAÇÃO — SITE ALC*', '',
          `Empresa: ${clean(data.empresa)}`,
          `Responsável: ${clean(data.nome)}`,
          `Telefone: ${clean(data.telefone)}`,
          `E-mail: ${clean(data.email)}`,
          `Serviço: ${clean(data.servico)}`,
          `Origem: ${clean(data.origem)}`,
          `Destino: ${clean(data.destino)}`,
          `Perfil da carga/operação: ${clean(data.carga)}`,
          `Frequência/volume: ${clean(data.volume)}`,
          data.mensagem ? `Observações: ${clean(data.mensagem)}` : ''
        );
      }
      if (type === 'career') {
        return lines(
          '*TRABALHE CONOSCO — SITE ALC*', '',
          `Nome: ${clean(data.nome)}`,
          `Cidade/UF: ${clean(data.cidade)}`,
          `Telefone: ${clean(data.telefone)}`,
          `Área de interesse: ${clean(data.area)}`,
          data.experiencia ? `Experiência: ${clean(data.experiencia)}` : '', '',
          'Gostaria de receber orientação sobre oportunidades e o canal correto para envio do currículo.'
        );
      }
      return lines(
        '*CONTATO — SITE ALC*', '',
        `Nome: ${clean(data.nome)}`,
        `Telefone: ${clean(data.telefone)}`,
        `E-mail: ${clean(data.email)}`,
        `Assunto: ${clean(data.assunto)}`, '',
        clean(data.mensagem)
      );
    };

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = encodeForm(form);
      const message = buildMessage(data);
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      if (feedback) {
        feedback.textContent = 'O WhatsApp foi aberto com as informações preenchidas. Revise a mensagem e confirme o envio.';
        feedback.classList.add('show');
      }
    });

    const emailButton = form.querySelector('[data-form-email]');
    if (emailButton) {
      emailButton.addEventListener('click', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const data = encodeForm(form);
        const body = buildMessage(data).replace(/\*/g, '');
        const subject = type === 'quote' ? 'Solicitação de cotação - Site ALC' : type === 'career' ? 'Trabalhe conosco - Site ALC' : 'Contato - Site ALC';
        location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    }
  });

  document.querySelectorAll('.solution-item').forEach((item, index) => {
    const trigger = item.querySelector('.solution-trigger');
    const content = item.querySelector('.solution-content');
    if (!trigger || !content) return;
    const openItem = () => {
      const open = item.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(open));
      content.style.maxHeight = open ? `${content.scrollHeight + 30}px` : '0px';
    };
    trigger.addEventListener('click', openItem);
    if (index === 0 && item.dataset.defaultOpen === 'true') openItem();
  });

  const filterButtons = document.querySelectorAll('[data-team-filter]');
  const people = document.querySelectorAll('[data-team-area]');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.teamFilter;
    filterButtons.forEach(b => b.classList.toggle('active', b === button));
    people.forEach(person => {
      person.hidden = filter !== 'todos' && person.dataset.teamArea !== filter;
    });
  }));

  const reveal = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    reveal.forEach(el => io.observe(el));
  } else {
    reveal.forEach(el => el.classList.add('visible'));
  }
})();
