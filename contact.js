/* ============================================================
   CONTACT JS — Form Validation & Submission Feedback
   ============================================================ */

(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    form.querySelector('#field-name'),
    email:   form.querySelector('#field-email'),
    subject: form.querySelector('#field-subject'),
    message: form.querySelector('#field-message'),
  };

  const submitBtn = form.querySelector('#form-submit');

  /* ── Validators ─────────────────────────────────────────── */

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function getError(name, value) {
    value = value.trim();
    switch (name) {
      case 'name':
        if (!value)            return 'Full name is required.';
        if (value.length < 2)  return 'Name must be at least 2 characters.';
        break;
      case 'email':
        if (!value)            return 'Email address is required.';
        if (!isValidEmail(value)) return 'Please enter a valid email address.';
        break;
      case 'subject':
        if (!value)            return 'Subject is required.';
        break;
      case 'message':
        if (!value)            return 'Message cannot be empty.';
        if (value.length < 20) return 'Message must be at least 20 characters.';
        break;
    }
    return '';
  }

  /* ── Error Display ──────────────────────────────────────── */

  function showError(field, msg) {
    field.classList.add('is-error');
    field.classList.remove('is-success');
    let errEl = field.parentElement.querySelector('.form-error-msg');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-error-msg';
      field.parentElement.appendChild(errEl);
    }
    errEl.textContent = msg;
    errEl.style.display = 'block';
  }

  function clearError(field) {
    field.classList.remove('is-error');
    const errEl = field.parentElement.querySelector('.form-error-msg');
    if (errEl) errEl.style.display = 'none';
  }

  /* ── Live Validation ────────────────────────────────────── */

  Object.entries(fields).forEach(([name, field]) => {
    if (!field) return;

    field.addEventListener('blur', () => {
      const err = getError(name, field.value);
      if (err) showError(field, err);
      else clearError(field);
    });

    field.addEventListener('input', () => {
      if (field.classList.contains('is-error')) {
        const err = getError(name, field.value);
        if (!err) clearError(field);
      }
    });
  });

  /* ── Submit ─────────────────────────────────────────────── */

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    Object.entries(fields).forEach(([name, field]) => {
      if (!field) return;
      const err = getError(name, field.value);
      if (err) {
        showError(field, err);
        isValid = false;
      } else {
        clearError(field);
      }
    });

    if (!isValid) return;

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      showSuccess();
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }, 1800);
  });

  function showSuccess() {
    let toast = document.getElementById('form-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'form-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(80px);
        background: #0F172A;
        color: #fff;
        padding: 16px 28px;
        border-radius: 8px;
        font-family: var(--font-primary, 'Inter', sans-serif);
        font-size: 15px;
        font-weight: 500;
        box-shadow: rgba(0,0,0,0.25) 0px 8px 24px;
        z-index: 2000;
        transition: transform 0.35s ease, opacity 0.35s ease;
        opacity: 0;
        border-left: 4px solid #EDDD5E;
        white-space: nowrap;
      `;
      toast.textContent = '✓ Message sent! I\'ll be in touch soon.';
      document.body.appendChild(toast);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
        toast.style.opacity = '1';
      });
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(80px)';
      toast.style.opacity = '0';
    }, 4000);
  }

})();
