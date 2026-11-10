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
    prev.setAttribute('aria-label', 'Scroll to previous rollouts');
    prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 18l-6-6 6-6"></path></svg>';

    var next = document.createElement('button');
    next.className = 'deployment-thumb-scroll deployment-thumb-scroll-next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Scroll to next rollouts');
    next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6"></path></svg>';

    strip.parentNode.insertBefore(wrap, strip);
    wrap.appendChild(prev);
    wrap.appendChild(strip);
    wrap.appendChild(next);

    var thumbnailVideo = strip.querySelector('.deployment-thumb video');

    function updateScrollButtons() {
      var maxScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
      prev.disabled = strip.scrollLeft <= 1;
      next.disabled = strip.scrollLeft >= maxScroll - 1;
      wrap.classList.toggle('is-scrollable', maxScroll > 1);
      if (thumbnailVideo) {
        var thumbnailHeight = thumbnailVideo.getBoundingClientRect().height;
        if (thumbnailHeight > 0) {
          wrap.style.setProperty('--rollout-thumbnail-height', thumbnailHeight + 'px');
        }
      }
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
    if (thumbnailVideo && window.ResizeObserver) {
      var thumbnailObserver = new ResizeObserver(updateScrollButtons);
      thumbnailObserver.observe(thumbnailVideo);
    }
    updateScrollButtons();
    setTimeout(updateScrollButtons, 250);
  });
});
