/**
 * Diagram Viewer -- fullscreen modal with pan/zoom for SVG hero images
 * Activates on any <figure> containing an SVG image
 */
(function () {
  'use strict';

  // State
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let modal = null;
  let viewer = null;
  let img = null;

  function createModal() {
    modal = document.createElement('div');
    modal.className = 'diagram-modal';
    modal.innerHTML = `
      <div class="diagram-modal__toolbar">
        <span class="diagram-modal__title"></span>
        <div class="diagram-modal__controls">
          <button class="diagram-modal__btn" data-action="zoom-in" title="Zoom in">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
          <button class="diagram-modal__btn" data-action="zoom-out" title="Zoom out">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
          <button class="diagram-modal__btn" data-action="reset" title="Reset view">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <span class="diagram-modal__zoom-level">100%</span>
          <button class="diagram-modal__btn diagram-modal__close" data-action="close" title="Close (Esc)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="diagram-modal__viewer">
        <img class="diagram-modal__img" draggable="false" />
      </div>
    `;
    document.body.appendChild(modal);

    viewer = modal.querySelector('.diagram-modal__viewer');
    img = modal.querySelector('.diagram-modal__img');

    // Button actions
    modal.querySelectorAll('[data-action]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var action = this.getAttribute('data-action');
        if (action === 'zoom-in') zoom(0.25);
        else if (action === 'zoom-out') zoom(-0.25);
        else if (action === 'reset') resetView();
        else if (action === 'close') closeModal();
      });
    });

    // Mouse wheel zoom
    viewer.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY > 0 ? -0.15 : 0.15;
      zoom(delta);
    }, { passive: false });

    // Pan with mouse drag
    viewer.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      viewer.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      applyTransform();
    });

    document.addEventListener('mouseup', function () {
      if (!isDragging) return;
      isDragging = false;
      if (viewer) viewer.style.cursor = 'grab';
    });

    // Touch support
    var lastTouchDist = 0;
    viewer.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
      } else if (e.touches.length === 2) {
        isDragging = false;
        lastTouchDist = getTouchDist(e.touches);
      }
    }, { passive: true });

    viewer.addEventListener('touchmove', function (e) {
      if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        applyTransform();
      } else if (e.touches.length === 2) {
        e.preventDefault();
        var dist = getTouchDist(e.touches);
        var delta = (dist - lastTouchDist) * 0.005;
        lastTouchDist = dist;
        zoom(delta);
      }
    }, { passive: false });

    viewer.addEventListener('touchend', function () {
      isDragging = false;
    });

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (!modal || !modal.classList.contains('diagram-modal--open')) return;
      if (e.key === 'Escape') closeModal();
      else if (e.key === '+' || e.key === '=') zoom(0.25);
      else if (e.key === '-') zoom(-0.25);
      else if (e.key === '0') resetView();
    });

    // Click backdrop to close
    viewer.addEventListener('click', function (e) {
      if (e.target === viewer) closeModal();
    });
  }

  function getTouchDist(touches) {
    var dx = touches[0].clientX - touches[1].clientX;
    var dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function zoom(delta) {
    scale = Math.max(0.25, Math.min(5, scale + delta));
    applyTransform();
    updateZoomLabel();
  }

  function resetView() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
    updateZoomLabel();
  }

  function applyTransform() {
    if (img) {
      img.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scale + ')';
    }
  }

  function updateZoomLabel() {
    var label = modal.querySelector('.diagram-modal__zoom-level');
    if (label) label.textContent = Math.round(scale * 100) + '%';
  }

  function openModal(src, title) {
    if (!modal) createModal();
    resetView();
    img.src = src;
    modal.querySelector('.diagram-modal__title').textContent = title || 'Architecture Diagram';
    modal.classList.add('diagram-modal--open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('diagram-modal--open');
    document.body.style.overflow = '';
  }

  // Attach to all figures with SVG images
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.md-typeset figure').forEach(function (figure) {
      var figImg = figure.querySelector('img[src$=".svg"]');
      if (!figImg) return;

      // Add click hint
      figure.style.cursor = 'pointer';
      figure.setAttribute('title', 'Click to view fullscreen (zoom + pan)');

      // Add expand icon overlay
      var expandIcon = document.createElement('div');
      expandIcon.className = 'diagram-expand-hint';
      expandIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg> Click to expand';
      figure.style.position = 'relative';
      figure.appendChild(expandIcon);

      figure.addEventListener('click', function (e) {
        e.preventDefault();
        var caption = figure.querySelector('figcaption');
        openModal(figImg.src, caption ? caption.textContent : '');
      });
    });
  });
})();
