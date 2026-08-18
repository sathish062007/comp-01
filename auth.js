/* ==========================================================================
   Codenexa Client Portal - Authentication Handler (js/auth.js)
   Structure prepared for Firebase Auth integration:
   - import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
   ========================================================================== */

class AuthService {
  constructor() {
    this.sessionKey = 'codenexa_user_session';
  }

  // Get currently active user
  getCurrentUser() {
    const data = localStorage.getItem(this.sessionKey);
    return data ? JSON.parse(data) : null;
  }

  // Set user session
  setSession(user) {
    localStorage.setItem(this.sessionKey, JSON.stringify(user));
    this.updateHeaderAuthUI();
  }

  // Login with Email & Password
  async loginWithEmail(email, password) {
    // Structural placeholder for Firebase Auth:
    // const auth = getAuth();
    // const userCredential = await signInWithEmailAndPassword(auth, email, password);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error('Please fill in both email and password.'));
          return;
        }

        const user = {
          uid: 'usr_' + Math.random().toString(36).substr(2, 9),
          displayName: email.split('@')[0].replace('.', ' '),
          email: email,
          provider: 'password',
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=6366f1&color=fff`,
          createdAt: new Date().toISOString()
        };

        this.setSession(user);
        resolve(user);
      }, 600);
    });
  }

  // Register New Client Account
  async registerWithEmail(name, email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password) {
          reject(new Error('All fields are required for registration.'));
          return;
        }

        const user = {
          uid: 'usr_' + Math.random().toString(36).substr(2, 9),
          displayName: name,
          email: email,
          provider: 'password',
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff`,
          createdAt: new Date().toISOString()
        };

        this.setSession(user);
        resolve(user);
      }, 600);
    });
  }

  // Login with Google OAuth (Mock structured for Firebase GoogleAuthProvider)
  async loginWithGoogle() {
    // Structural placeholder for Firebase Auth:
    // const auth = getAuth();
    // const provider = new GoogleAuthProvider();
    // const result = await signInWithPopup(auth, provider);

    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          uid: 'goog_' + Math.random().toString(36).substr(2, 9),
          displayName: 'Demo Google User',
          email: 'codenexa11@gmail.com',
          provider: 'google.com',
          photoURL: 'https://ui-avatars.com/api/?name=Google+User&background=06b6d4&color=fff',
          createdAt: new Date().toISOString()
        };

        this.setSession(user);
        resolve(user);
      }, 700);
    });
  }

  // Logout current user
  logout() {
    localStorage.removeItem(this.sessionKey);
    window.showToast('Successfully logged out.', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 500);
  }

  // Update navbar dynamic user profile / buttons
  updateHeaderAuthUI() {
    const user = this.getCurrentUser();
    const navActions = document.getElementById('navAuthActions');
    
    if (!navActions) return;

    if (user) {
      navActions.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${user.photoURL}" alt="${user.displayName}" style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--primary);">
          <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);" class="mobile-hide">${user.displayName}</span>
          <a href="dashboard.html" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">Dashboard</a>
          <button id="logoutBtn" class="btn btn-outline" style="padding: 0.5rem 0.85rem; font-size: 0.85rem;" title="Logout">🚪</button>
        </div>
      `;

      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => this.logout());
      }
    } else {
      navActions.innerHTML = `
        <a href="login.html" class="btn btn-secondary">Sign In</a>
        <a href="requirement.html" class="btn btn-primary">Submit Spec</a>
      `;
    }
  }
}

window.CodenexaAuth = new AuthService();

document.addEventListener('DOMContentLoaded', () => {
  window.CodenexaAuth.updateHeaderAuthUI();

  // Attach login/register form listeners if on login.html
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const googleBtn = document.getElementById('googleAuthBtn');

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        await window.CodenexaAuth.loginWithGoogle();
        window.showToast('Google Sign In successful!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 700);
      } catch (err) {
        window.showToast(err.message, 'error');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
        await window.CodenexaAuth.loginWithEmail(email, password);
        window.showToast('Welcome back! Logging in...', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 700);
      } catch (err) {
        window.showToast(err.message, 'error');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;

      try {
        await window.CodenexaAuth.registerWithEmail(name, email, password);
        window.showToast('Account created successfully!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 700);
      } catch (err) {
        window.showToast(err.message, 'error');
      }
    });
  }
});
