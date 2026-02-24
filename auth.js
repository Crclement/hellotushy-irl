(function() {
  const PASS = 'smile';
  const KEY = 'tushy_auth';

  if (sessionStorage.getItem(KEY) === 'true') return;

  const overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.innerHTML = `
    <style>
      #auth-overlay {
        position: fixed;
        inset: 0;
        background: #fff;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Inter', -apple-system, sans-serif;
      }
      #auth-box {
        text-align: center;
        padding: 40px;
      }
      #auth-box h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: #000;
      }
      #auth-box p {
        color: #999;
        font-size: 0.85rem;
        margin-bottom: 24px;
      }
      #auth-input {
        font-family: inherit;
        font-size: 1rem;
        padding: 12px 16px;
        border: 2px solid #ddd;
        border-radius: 8px;
        width: 220px;
        text-align: center;
        outline: none;
        transition: border-color 0.2s;
      }
      #auth-input:focus {
        border-color: #111;
      }
      #auth-input.error {
        border-color: #e53935;
        animation: shake 0.4s;
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-8px); }
        40%, 80% { transform: translateX(8px); }
      }
      #auth-btn {
        display: block;
        margin: 16px auto 0;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        padding: 12px 32px;
        background: #111;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }
      #auth-btn:hover {
        background: #333;
      }
    </style>
    <div id="auth-box">
      <h2>TUSHY</h2>
      <p>Enter password to continue</p>
      <input type="password" id="auth-input" placeholder="Password" autocomplete="off">
      <button id="auth-btn">Enter</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const input = document.getElementById('auth-input');
  const btn = document.getElementById('auth-btn');

  function tryAuth() {
    if (input.value === PASS) {
      sessionStorage.setItem(KEY, 'true');
      overlay.remove();
      document.body.style.overflow = '';
    } else {
      input.classList.add('error');
      input.value = '';
      setTimeout(() => input.classList.remove('error'), 400);
    }
  }

  btn.addEventListener('click', tryAuth);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryAuth(); });
  input.focus();
})();
