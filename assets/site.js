(() => {
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
