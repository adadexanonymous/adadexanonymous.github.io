document.addEventListener('DOMContentLoaded', function () {
  function pausePanelVideos(panel) {
    panel.querySelectorAll('video').forEach(function (video) {
      video.pause();
      video.classList.add('hidden_videos');
    });
  }

  function wakePanelVideos(panel) {
    panel.querySelectorAll('video').forEach(function (video) {
      video.classList.remove('hidden_videos');
      if (video.muted && video.autoplay) {
        video.play().catch(function () {});
      }
    });
  }

  function activatePanel(root, targetId) {
    var panel = root.querySelector('#' + targetId);
    if (!panel) {
      return;
    }

    root.querySelectorAll('.motion-panel, .motion-card-detail').forEach(function (candidate) {
      if (candidate === panel) {
        candidate.classList.add('is-active');
        wakePanelVideos(candidate);
      } else {
        candidate.classList.remove('is-active');
        pausePanelVideos(candidate);
      }
    });

    root.querySelectorAll('[data-motion-target]').forEach(function (button) {
      button.classList.toggle('is-active', button.dataset.motionTarget === targetId);
    });

    window.dispatchEvent(new Event('resize'));
  }

  document.querySelectorAll('.motion-switcher').forEach(function (switcher) {
    switcher.querySelectorAll('[data-motion-group]').forEach(function (button) {
      button.addEventListener('click', function () {
        var group = button.dataset.motionGroup;
        switcher.querySelectorAll('[data-motion-group]').forEach(function (candidate) {
          candidate.classList.toggle('is-active', candidate === button);
        });
        switcher.querySelectorAll('[data-motion-group-panel]').forEach(function (panel) {
          panel.classList.toggle('is-hidden', panel.dataset.motionGroupPanel !== group);
        });
        var firstTarget = switcher.querySelector('[data-motion-group-panel="' + group + '"] [data-motion-target]');
        if (firstTarget) {
          activatePanel(switcher, firstTarget.dataset.motionTarget);
        }
      });
    });

    switcher.querySelectorAll('[data-motion-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        activatePanel(switcher, button.dataset.motionTarget);
      });
    });
  });

  document.querySelectorAll('.motion-card-gallery').forEach(function (gallery) {
    function selectCardFamily(family) {
      var firstVisibleCard = null;

      gallery.querySelectorAll('.motion-card-family-tabs [data-card-family]').forEach(function (tab) {
        tab.classList.toggle('is-active', tab.dataset.cardFamily === family);
      });

      gallery.querySelectorAll('.motion-card').forEach(function (card) {
        var isCurrentFamily = card.dataset.cardFamily === family;
        card.classList.toggle('is-hidden', !isCurrentFamily);

        if (isCurrentFamily && !firstVisibleCard) {
          firstVisibleCard = card;
        }

        if (isCurrentFamily) {
          wakePanelVideos(card);
        } else {
          card.classList.remove('is-active');
          pausePanelVideos(card);
        }
      });

      gallery.querySelectorAll('.motion-card-detail').forEach(function (detail) {
        var isCurrentFamily = detail.dataset.cardFamily === family;
        detail.classList.toggle('is-hidden', !isCurrentFamily);

        if (!isCurrentFamily) {
          detail.classList.remove('is-active');
          pausePanelVideos(detail);
        }
      });

      var activeVisibleCard = gallery.querySelector('.motion-card.is-active:not(.is-hidden)');
      var targetCard = activeVisibleCard || firstVisibleCard;
      if (targetCard) {
        targetCard.classList.add('is-active');
        activatePanel(gallery, targetCard.dataset.motionTarget);
      }
    }

    gallery.querySelectorAll('.motion-card-family-tabs [data-card-family]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        selectCardFamily(tab.dataset.cardFamily);
      });
    });

    gallery.querySelectorAll('.motion-card').forEach(function (card) {
      card.addEventListener('click', function () {
        if (card.classList.contains('is-hidden')) {
          return;
        }

        var targetId = card.dataset.motionTarget;
        var scope = card.closest('.motion-family-block') || gallery;
        scope.querySelectorAll('.motion-card').forEach(function (candidate) {
          candidate.classList.toggle('is-active', candidate === card);
        });
        activatePanel(scope, targetId);
      });
    });

    gallery.querySelectorAll('.motion-card-action').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        var card = button.closest('.motion-card');
        if (card) {
          card.click();
        }
      });
    });

    var activeFamilyTab = gallery.querySelector('.motion-card-family-tabs [data-card-family].is-active');
    if (activeFamilyTab) {
      selectCardFamily(activeFamilyTab.dataset.cardFamily);
    }
  });
});
