document.addEventListener('DOMContentLoaded', function () {
  var data = window.ADADEX_COMPARE || {};

  function show(group, key) {
    var clips = (data[group] || {})[key];
    if (!clips) {
      return;
    }
    document.querySelectorAll('[data-compare-group="' + group + '"].compare-chip').forEach(function (chip) {
      chip.classList.toggle('is-active', chip.dataset.key === key);
    });
    var videos = document.querySelectorAll('video[data-compare-group="' + group + '"]');
    videos.forEach(function (video) {
      var src = clips[video.dataset.compareSlot];
      if (src && video.getAttribute('src') !== src) {
        video.pause();
        video.setAttribute('src', src);
        video.load();
      }
    });
    videos.forEach(function (video) {
      video.currentTime = 0;
      video.classList.remove('hidden_videos');
      video.play().catch(function () {});
    });
  }

  document.querySelectorAll('.compare-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      show(chip.dataset.compareGroup, chip.dataset.key);
    });
  });

  document.querySelectorAll('.compare-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var picker = tab.closest('.compare-picker');
      picker.querySelectorAll('.compare-tab').forEach(function (peer) {
        peer.classList.toggle('is-active', peer === tab);
      });
      picker.querySelectorAll('[data-split-panel]').forEach(function (panel) {
        var visible = panel.dataset.splitPanel === tab.dataset.split;
        panel.classList.toggle('is-hidden', !visible);
        if (visible) {
          var first = panel.querySelector('.compare-chip');
          if (first) {
            first.click();
          }
        }
      });
    });
  });
});

// Card galleries: after "View examples", scroll to the example row that opened.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.motion-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var detail = document.getElementById(card.dataset.motionTarget);
      if (detail) {
        setTimeout(function () {
          detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  });
});

// Play all / Stop all for a comparison group. Stopped clips stay stopped when scrolled back into view.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-compare-controls]').forEach(function (controls) {
    var group = controls.dataset.compareControls;
    function videos() {
      return document.querySelectorAll('video[data-compare-group="' + group + '"]');
    }
    controls.querySelectorAll('[data-compare-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        var play = button.dataset.compareAction === 'play';
        videos().forEach(function (video) {
          video.pause();
          video.currentTime = 0;
          video.dataset.userStopped = play ? '0' : '1';
          if (play) {
            video.classList.remove('hidden_videos');
            video.play().catch(function () {});
          }
        });
      });
    });
  });

  // Choosing a new motion resumes playback for that group.
  document.querySelectorAll('.compare-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('video[data-compare-group="' + chip.dataset.compareGroup + '"]').forEach(function (video) {
        video.dataset.userStopped = '0';
      });
    });
  });
});
