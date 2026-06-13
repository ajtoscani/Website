// Interactive video scrubber. Pairs a <video> with a <input type="range"> so
// users can scrub through the video by dragging. Wire-up is automatic — any
// .scrub-demo element on the page gets initialized.
//
// Per-instance options via data attributes on the .scrub-demo element:
//   data-usable-end="0.87"   Crop the effective end of the video (slider max
//                            maps to this fraction of duration). Defaults to 1.
(function () {
  function init() {
    document.querySelectorAll('.scrub-demo').forEach(function (fig) {
      const video = fig.querySelector('.scrub-demo-video');
      const slider = fig.querySelector('.scrub-demo-slider');
      const readout = fig.querySelector('.scrub-demo-value');
      if (!video || !slider) return;

      const usableEnd = parseFloat(fig.dataset.usableEnd || '1');

      function update() {
        const t = slider.value / slider.max;
        if (video.duration && isFinite(video.duration)) {
          video.currentTime = t * video.duration * usableEnd;
        }
        if (readout) readout.textContent = Math.round(t * 100);
      }

      slider.addEventListener('input', update);
      video.addEventListener('loadedmetadata', update);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();