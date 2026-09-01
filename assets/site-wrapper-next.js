(() => {
  const path = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
  const backgrounds = Object.freeze({
    '/empresa': {
      src: '/assets/images/frota/alc-frota-entardecer.jpg',
      position: 'center 55%'
    },
    '/operacao': {
      src: '/assets/images/frota/alc-frota-patio.jpg',
      position: 'center 52%'
    },
    '/solucoes': {
      src: '/assets/images/frota/alc-frota-operacao.jpg',
      position: 'center 50%'
    }
  });

  const style = document.createElement('style');
  style.dataset.companyHero = '20260901-1';
  style.textContent = `
    .page-media{display:none!important}
    .page-hero.has-company-background{
      position:relative;
      isolation:isolate;
      overflow:hidden;
      background-color:var(--paper);
      background-image:
        linear-gradient(90deg,
          rgba(244,244,241,.99) 0%,
          rgba(244,244,241,.96) 34%,
          rgba(244,244,241,.82) 54%,
          rgba(244,244,241,.52) 72%,
          rgba(244,244,241,.28) 100%),
        var(--company-hero-photo);
      background-size:cover;
      background-repeat:no-repeat;
      background-position:var(--company-hero-position,center);
    }
    .page-hero.has-company-background>.container{
      position:relative;
      z-index:1;
    }
    .page-hero.has-company-background .page-index{
      color:#454950;
      border-left-color:rgba(17,18,20,.18);
    }
    @media(max-width:920px){
      .page-hero.has-company-background{
        background-image:
          linear-gradient(90deg,
            rgba(244,244,241,.97) 0%,
            rgba(244,244,241,.90) 55%,
            rgba(244,244,241,.66) 100%),
          var(--company-hero-photo);
        background-position:center;
      }
    }
    @media(max-width:640px){
      .page-hero.has-company-background{
        background-image:
          linear-gradient(rgba(244,244,241,.86),rgba(244,244,241,.90)),
          var(--company-hero-photo);
        background-position:center;
      }
    }
  `;
  document.head.appendChild(style);

  const config = backgrounds[path];
  const hero = document.querySelector('.page-hero');
  if (config && hero) {
    hero.style.setProperty('--company-hero-photo', `url("${config.src}")`);
    hero.style.setProperty('--company-hero-position', config.position);
    hero.classList.add('has-company-background');

    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'image';
    preload.href = config.src;
    document.head.appendChild(preload);
  }

  const core = document.createElement('script');
  core.src = '/assets/site-core.js?v=20260901-1';
  core.async = false;
  document.body.appendChild(core);
})();
