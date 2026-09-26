document.addEventListener('DOMContentLoaded', function () {
  function activateThumb(button) {
    var target = document.querySelector(button.dataset.featureTarget);
    var src = button.dataset.videoSrc;
    var group = button.closest('[data-feature-group]');

    if (group) {
      group.querySelectorAll('[data-feature-target]').forEach(function (peer) {
        peer.classList.toggle('is-active', peer === button);
      });
    }

    if (!target || target.tagName !== 'VIDEO' || !src || target.getAttribute('src') === src) {
      return;
    }

    target.pause();
    target.setAttribute('src', src);
    target.load();
    target.play().catch(function () {});
  }

  document.querySelectorAll('[data-feature-target]').forEach(function (button) {
    button.addEventListener('click', function () {
      activateThumb(button);
    });

  });

  document.querySelectorAll('.deployment-thumb-strip').forEach(function (strip) {
    if (strip.closest('.deployment-thumb-strip-wrap')) {
      return;
    }

    var wrap = document.createElement('div');
    wrap.className = 'deployment-thumb-strip-wrap';

    var prev = document.createElement('button');
    prev.className = 'deployment-thumb-scroll deployment-thumb-scroll-prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous trials');
    prev.innerHTML = '<i class="fas fa-chevron-left" aria-hidden="true"></i>';

    var next = document.createElement('button');
    next.className = 'deployment-thumb-scroll deployment-thumb-scroll-next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next trials');
    next.innerHTML = '<i class="fas fa-chevron-right" aria-hidden="true"></i>';

    strip.parentNode.insertBefore(wrap, strip);
    wrap.appendChild(prev);
    wrap.appendChild(strip);
    wrap.appendChild(next);

    function updateScrollButtons() {
      var maxScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
      prev.disabled = strip.scrollLeft <= 1;
      next.disabled = strip.scrollLeft >= maxScroll - 1;
      wrap.classList.toggle('is-scrollable', maxScroll > 1);
    }

    function scrollByPage(direction) {
      strip.scrollBy({
        left: direction * Math.max(220, strip.clientWidth * 0.82),
        behavior: 'smooth'
      });
    }

    prev.addEventListener('click', function () {
      scrollByPage(-1);
    });

    next.addEventListener('click', function () {
      scrollByPage(1);
    });

    strip.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    updateScrollButtons();
    setTimeout(updateScrollButtons, 250);
  });
});
