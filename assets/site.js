(() => {
  const SOCIALS = Object.freeze([
    {
      name: 'Facebook',
      href: 'https://web.facebook.com/alcepereirafilhotransportes?_rdc=1&_rdr#',
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.7 22v-9h3l.5-3.5h-3.5V7.3c0-1 .3-1.8 1.8-1.8h1.9V2.4c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.4H7v3.5h2.9v9h3.8Z"/></svg>'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/alcepereirafilhotransportes',
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/alcepereirafilhotransportes/posts/?feedView=all',
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.3 3.5A2.3 2.3 0 1 1 .7 3.5a2.3 2.3 0 0 1 4.6 0ZM1.2 8h4.2v13H1.2V8Zm6.8 0h4v1.8h.1c.6-1.1 1.9-2.3 4-2.3 4.3 0 5.1 2.8 5.1 6.5v7h-4.2v-6.2c0-1.5 0-3.4-2.1-3.4s-2.5 1.6-2.5 3.3V21H8V8Z"/></svg>'
    }
  ]);

  const SAC = Object.freeze({
    name: 'SAC via WhatsApp',
    href: 'https://api.whatsapp.com/send/?phone=5511978341558&text&type=phone_number&app_absent=0',
    phone: '(11) 97834-1558',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11 11 0 0 0 3.2 16.8L2 22l5.3-1.2A11 11 0 0 0 20.5 3.5Zm-8.4 16.3c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3.1.7.7-3-.2-.3a8.8 8.8 0 1 1 7.6 4.1Zm4.8-6.6c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.9 1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.8-.1-.3 0-.4.1-.5l.4-.5.3-.5c.1-.2.1-.4 0-.5l-.8-2c-.2-.5-.5-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3Z"/></svg>'
  });

  const ensureSocialStyles = () => {
    if (document.querySelector('link[data-alc-social-styles]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/social.css';
    link.dataset.alcSocialStyles = 'true';
    document.head.appendChild(link);
  };
  ensureSocialStyles();

  const externalLink = (item, className, label = item.name) => {
    const a = document.createElement('a');
    a.href = item.href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = className;
    a.setAttribute('aria-label', `${label} — abre em nova aba`);
    a.innerHTML = `<span class="social-icon">${item.icon}</span><span>${label}</span>`;
    return a;
  };

  const injectFooterSocials = () => {
    const footer = document.querySelector('footer .c');
    const bottom = footer?.querySelector('.bottom');
    if (!footer || !bottom || footer.querySelector('.social-footer')) return;

    const block = document.createElement('section');
    block.className = 'social-footer';
    block.setAttribute('aria-label', 'Redes sociais e atendimento');

    const heading = document.createElement('div');
    heading.className = 'social-footer-copy';
    heading.innerHTML = '<small>Perfis oficiais</small><strong>Acompanhe a ALC &amp; Pereira Filho</strong>';

    const links = document.createElement('div');
    links.className = 'social-footer-links';
    SOCIALS.forEach((item) => links.appendChild(externalLink(item, 'social-btn')));
    links.appendChild(externalLink(SAC, 'social-btn social-btn-sac', 'SAC'));

    block.append(heading, links);
    footer.insertBefore(block, bottom);
  };

  const injectContactChannels = () => {
    const cards = document.querySelector('.contact-cards');
    if (!cards || cards.querySelector('[data-social-contact]')) return;

    const sac = document.createElement('article');
    sac.className = 'contact-card contact-card-action';
    sac.dataset.socialContact = 'sac';
    sac.innerHTML = `<small>SAC / WhatsApp</small><p>Atendimento ao cliente pelo WhatsApp.<br><strong>${SAC.phone}</strong></p>`;
    sac.appendChild(externalLink(SAC, 'contact-action-btn', 'Abrir SAC no WhatsApp'));

    const socials = document.createElement('article');
    socials.className = 'contact-card contact-card-action';
    socials.dataset.socialContact = 'socials';
    socials.innerHTML = '<small>Redes sociais</small><p>Acompanhe os perfis oficiais da ALC &amp; Pereira Filho Transportes.</p>';
    const row = document.createElement('div');
    row.className = 'contact-social-row';
    SOCIALS.forEach((item) => row.appendChild(externalLink(item, 'contact-social-btn')));
    socials.appendChild(row);

    cards.append(sac, socials);
  };

  const injectFloatingSac = () => {
    if (document.querySelector('.sac-floating')) return;
    const a = externalLink(SAC, 'sac-floating', 'SAC');
    a.title = 'Falar com o SAC pelo WhatsApp';
    document.body.appendChild(a);
  };

  injectFooterSocials();
  injectContactChannels();
  injectFloatingSac();

  const header = document.querySelector('header');
  const menu = document.querySelector('.menu');
  const mobile = document.querySelector('.mobile');

  const onScroll = () => {
    if (!header || header.classList.contains('sub')) return;
    header.classList.toggle('s', window.scrollY > 22);
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  if (menu && mobile) {
    menu.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      menu.textContent = open ? '×' : '☰';
      menu.setAttribute('aria-expanded', String(open));
    });
    mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      mobile.classList.remove('open');
      menu.textContent = '☰';
      menu.setAttribute('aria-expanded', 'false');
    }));
  }

  document.querySelectorAll('form[data-preview-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const status = form.querySelector('.status');
      if (status) {
        status.classList.add('show');
        status.textContent = 'Validação concluída. Esta versão de homologação ainda não envia nem armazena dados.';
      }
    });
  });

  const media = window.ALC_MEDIA;
  if (!media || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (innerWidth < (media.mobileVideoMinWidth || 768)) return;
  const hero = document.getElementById('hero-video');
  const operation = document.getElementById('operation-video');
  if (hero && media.heroVideo) {
    hero.src = media.heroVideo;
    hero.play().catch(() => {});
  }
  if (operation && media.operationVideo) {
    operation.src = media.operationVideo;
    operation.play().catch(() => {});
  }
})();
