document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.video-carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var items = carousel.querySelectorAll('.carousel-item');
    var basePerView = parseInt(carousel.dataset.perView) || 4;
    var prevBtn = carousel.querySelector('.carousel-prev');
    var nextBtn = carousel.querySelector('.carousel-next');
    var currentOffset = 0;

    function getPerView() {
      return window.innerWidth <= 768 ? 1 : basePerView;
    }

    function getGap() {
      return window.innerWidth <= 768 ? 0 : 12;
    }

    function updateButtons() {
      var maxOffset = Math.max(0, items.length - getPerView());
      prevBtn.classList.toggle('disabled', currentOffset <= 0);
      nextBtn.classList.toggle('disabled', currentOffset >= maxOffset);
    }

    function updatePosition() {
      var itemWidth = items[0].getBoundingClientRect().width;
      var gap = getGap();
      track.style.transform = 'translateX(-' + currentOffset * (itemWidth + gap) + 'px)';
      updateButtons();
    }

    nextBtn.addEventListener('click', function () {
      var maxOffset = Math.max(0, items.length - getPerView());
      if (currentOffset < maxOffset) {
        currentOffset++;
        updatePosition();
      }
    });

    prevBtn.addEventListener('click', function () {
      if (currentOffset > 0) {
        currentOffset--;
        updatePosition();
      }
    });

    window.addEventListener('resize', function () {
      var maxOffset = Math.max(0, items.length - getPerView());
      if (currentOffset > maxOffset) {
        currentOffset = maxOffset;
      }
      updatePosition();
    });

    updateButtons();
  });
});
