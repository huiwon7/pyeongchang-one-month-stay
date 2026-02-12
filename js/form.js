/* ============================================
   Booking Form Handling
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
});

function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  // Phone number auto-formatting
  const phoneInput = form.querySelector('#phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^0-9]/g, '');
      if (value.length > 3 && value.length <= 7) {
        value = value.slice(0, 3) + '-' + value.slice(3);
      } else if (value.length > 7) {
        value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
      }
      e.target.value = value;
    });
  }

  // Set minimum date to today
  const checkinInput = form.querySelector('#checkin');
  if (checkinInput) {
    const today = new Date().toISOString().split('T')[0];
    checkinInput.setAttribute('min', today);
  }

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Store in localStorage as backup
    storeInquiry(data);

    // Show success message
    showSuccessModal();

    // Reset form
    form.reset();
  });
}

function validateForm(form) {
  let isValid = true;

  // Clear previous errors
  form.querySelectorAll('.form-error').forEach(el => el.remove());

  // Name validation
  const name = form.querySelector('#name');
  if (!name.value.trim()) {
    showError(name, '이름을 입력해주세요.');
    isValid = false;
  }

  // Phone validation
  const phone = form.querySelector('#phone');
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  if (!phoneRegex.test(phone.value.replace(/-/g, ''))) {
    showError(phone, '올바른 연락처를 입력해주세요.');
    isValid = false;
  }

  // Email validation (optional but must be valid if provided)
  const email = form.querySelector('#email');
  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showError(email, '올바른 이메일 형식을 입력해주세요.');
    isValid = false;
  }

  // Privacy checkbox
  const privacy = form.querySelector('#privacy');
  if (!privacy.checked) {
    showError(privacy.parentElement, '개인정보 수집에 동의해주세요.');
    isValid = false;
  }

  return isValid;
}

function showError(element, message) {
  const error = document.createElement('div');
  error.className = 'form-error';
  error.textContent = message;

  const parent = element.closest('.form-group') || element.parentElement;
  parent.appendChild(error);
}

function storeInquiry(data) {
  const inquiries = JSON.parse(localStorage.getItem('pc_inquiries') || '[]');
  inquiries.push({
    ...data,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('pc_inquiries', JSON.stringify(inquiries));
}

function showSuccessModal() {
  // Create modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 12px;
      padding: 48px;
      text-align: center;
      max-width: 400px;
      margin: 0 24px;
      transform: translateY(20px);
      transition: transform 0.3s ease;
    ">
      <div style="font-size: 48px; margin-bottom: 16px;">✓</div>
      <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 24px; margin-bottom: 12px;">문의가 접수되었습니다</h3>
      <p style="color: #5a6356; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        빠른 시일 내에 담당자가 연락드리겠습니다.<br>감사합니다.
      </p>
      <button onclick="this.closest('div[style]').parentElement.remove(); document.body.style.overflow='';" style="
        padding: 12px 32px;
        background: #4a7c59;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      ">확인</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Animate in
  requestAnimationFrame(() => {
    modal.style.opacity = '1';
    modal.querySelector('div').style.transform = 'translateY(0)';
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      document.body.style.overflow = '';
    }
  });
}
