(function () {
  'use strict';

  const email = 'ryq4364@gmail.com';
  let hideTimer;

  function fallbackCopy(text) {
    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, input.value.length);

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } finally {
      input.remove();
    }
    return copied;
  }

  async function copyEmail() {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        return true;
      } catch (error) {
        return fallbackCopy(email);
      }
    }
    return fallbackCopy(email);
  }

  function showCopyStatus(status, copied) {
    window.clearTimeout(hideTimer);
    status.textContent = copied
      ? '邮箱已复制到您的粘贴板'
      : `复制失败，请手动复制：${email}`;
    status.classList.toggle('is-error', !copied);
    status.classList.add('is-visible');

    hideTimer = window.setTimeout(function () {
      status.classList.remove('is-visible');
    }, 3200);
  }

  function setupEmailCopy() {
    document.querySelectorAll('#aside-content .card-info').forEach(function (card) {
      const socialIcons = card.querySelector('.card-info-social-icons');
      if (!socialIcons || socialIcons.querySelector('.ry7-email-copy')) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'social-icon ry7-email-copy';
      button.title = `复制邮箱 ${email}`;
      button.setAttribute('aria-label', `复制邮箱 ${email}`);
      button.innerHTML = '<i class="fas fa-envelope" aria-hidden="true"></i>';

      const status = document.createElement('div');
      status.className = 'ry7-email-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');

      socialIcons.appendChild(button);
      socialIcons.insertAdjacentElement('afterend', status);

    });
  }

  function setupEmailEventGuard() {
    if (window.__ry7EmailEventGuardReady) return;
    window.__ry7EmailEventGuardReady = true;

    ['pointerdown', 'mousedown', 'touchstart'].forEach(function (eventName) {
      document.addEventListener(eventName, function (event) {
        if (event.target.closest('.ry7-email-copy')) {
          event.stopImmediatePropagation();
        }
      }, true);
    });

    document.addEventListener('click', async function (event) {
      const button = event.target.closest('.ry7-email-copy');
      if (!button) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const card = button.closest('.card-info');
      const status = card && card.querySelector('.ry7-email-status');
      if (!status) return;

      const copied = await copyEmail();
      showCopyStatus(status, copied);
    }, true);
  }

  function setupWelcomeCard() {
    document.querySelectorAll('.card-announcement .item-headline').forEach(function (headline) {
      const icon = headline.querySelector('i');
      const label = headline.querySelector('span');

      if (icon) {
        icon.className = 'fas fa-satellite-dish ry7-welcome-icon';
      }
      if (label) {
        label.textContent = '欢迎您的访问';
      }
    });
  }

  function initRy7Enhancements() {
    setupEmailEventGuard();
    setupEmailCopy();
    setupWelcomeCard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRy7Enhancements);
  } else {
    initRy7Enhancements();
  }

  document.addEventListener('pjax:complete', initRy7Enhancements);
})();
