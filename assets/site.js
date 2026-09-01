(() => {
  const CONFIG = Object.freeze({
    whatsapp: '5511978341558',
    email: 'comercial@alcepereirafilho.com.br',
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
    whatsapp: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.5 3.5A11.8 11.8 0 0 0 1.9 17.8L.3 23.6l5.9-1.5A11.8 11.8 0 0 0 20.5 3.5Zm-8.3 17a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.5.9.9-3.4-.2-.4A9.8 9.8 0 1 1 12.2 20.5Zm5.4-7.3c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2l-1 1.2c-.2.3-.4.3-.7.1a8 8 0 0 1-2.3-1.4 8.5 8.5 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.1.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z"/></svg>'
  };

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

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? '×' : '☰';
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
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
    if (!a.innerHTML.trim() && icons[network]) a.innerHTML = icons[network];
  });

  document.querySelectorAll('[data-whatsapp]').forEach(a => {
    const text = a.dataset.whatsapp || 'Olá, gostaria de falar com a ALC & Pereira Filho Transportes.';
    a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
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
