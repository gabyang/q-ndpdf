import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment variables:', {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY
});

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  throw new Error('Missing Supabase environment variables');
}

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export class Auth {
  constructor(router) {
    this.router = router;
    this.loginForm = document.getElementById("login-form-element");
    this.signupForm = document.getElementById("signup-form-element");
    this.errorMessageEl = document.getElementById("error-message");
    this.verificationForm = document.getElementById("verification-form-element");
    this.verificationCodeInput = document.getElementById("verification-code");
    this.toggleForms = document.getElementById("toggle-forms");
    this.logoutButton = document.getElementById("logout-button");
    this.signupModal = document.getElementById("signup-modal");
    this.closeModal = document.querySelector(".close-modal");
    
    this.userEmail = "";
    this.setupEventListeners();
    this.setupErrorStyles();
  }

  setupErrorStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .input-error {
        border: 2px solid #dc3545 !important;
        background-color: #fff8f8;
      }
      
      .error-message {
        color: #dc3545;
        margin-top: 10px;
        text-align: center;
        font-size: 0.9em;
      }
    `;
    document.head.appendChild(style);
  }

  clearInputErrors() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.remove('input-error');
    });
  }

  showInputError(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.classList.add('input-error');
    }
  }

  setupEventListeners() {
    // Clear error messages on page load
    this.errorMessageEl.textContent = "";
    
    // Hide verification form initially
    if (this.verificationForm) {
      this.verificationForm.style.display = "none";
    }

    // Toggle between login and signup forms
    if (this.toggleForms) {
      this.toggleForms.addEventListener("click", (event) => {
        event.preventDefault();
        this.signupModal.style.display = "block";
        this.errorMessageEl.textContent = "";
        this.clearInputErrors();
      });
    }

    // Close modal when clicking the X
    if (this.closeModal) {
      this.closeModal.addEventListener("click", () => {
        this.signupModal.style.display = "none";
        this.errorMessageEl.textContent = "";
        this.clearInputErrors();
      });
    }

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === this.signupModal) {
        this.signupModal.style.display = "none";
        this.errorMessageEl.textContent = "";
        this.clearInputErrors();
      }
    });

    // Logout functionality
    if (this.logoutButton) {
      this.logoutButton.addEventListener("click", async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (!error) {
          this.router.navigateTo('/');
        }
      });
    }

    // Signup form submission
    if (this.signupForm) {
      this.signupForm.addEventListener("submit", this.handleSignup.bind(this));
    }

    // Login form submission
    if (this.loginForm) {
      this.loginForm.addEventListener("submit", this.handleLogin.bind(this));
    }

    // Verification form submission
    if (this.verificationForm) {
      this.verificationForm.addEventListener("submit", this.handleVerification.bind(this));
    }

    // Clear errors when user starts typing
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('input-error');
        this.errorMessageEl.textContent = '';
      });
    });
  }

  async handleSignup(event) {
    event.preventDefault();
    this.clearInputErrors();

    this.userEmail = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    
    if (password !== confirmPassword) {
      this.errorMessageEl.textContent = "Passwords do not match";
      this.showInputError("signup-password");
      this.showInputError("confirm-password");
      return;
    }

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: this.userEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        this.errorMessageEl.textContent = error.message;
        this.showInputError("signup-email");
        return;
      }

      // Show verification form and hide signup form
      document.getElementById("signup-form").style.display = "none";
      if (this.verificationForm) {
        this.verificationForm.style.display = "block";
      }
      
    } catch (err) {
      this.errorMessageEl.textContent = "Something went wrong. Please try again.";
      this.showInputError("signup-email");
      console.error(err);
    }
  }

  async handleLogin(event) {
    event.preventDefault();
    this.clearInputErrors();

    this.userEmail = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: this.userEmail,
        password
      });
      
      if (error) {
        this.errorMessageEl.textContent = error.message;
        this.showInputError("email");
        this.showInputError("password");
        return;
      }

      // If login is successful, show the PDF viewer
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('pdf-section').style.display = 'block';
      
    } catch (err) {
      this.errorMessageEl.textContent = "Something went wrong. Please try again.";
      this.showInputError("email");
      this.showInputError("password");
      console.error(err);
    }
  }

  async handleVerification(event) {
    event.preventDefault();
    this.clearInputErrors();
    
    const verificationCode = this.verificationCodeInput.value;
    
    try {
      const { data, error } = await supabaseClient.auth.verifyOtp({
        email: this.userEmail,
        token: verificationCode,
        type: 'email'
      });
      
      if (error) {
        this.errorMessageEl.textContent = error.message;
        this.showInputError("verification-code");
        return;
      }
      
      // If verification is successful, close modal and show PDF viewer
      this.signupModal.style.display = "none";
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('pdf-section').style.display = 'block';
    } catch (err) {
      this.errorMessageEl.textContent = "Verification failed. Please try again.";
      this.showInputError("verification-code");
      console.error(err);
    }
  }

  showLoginForm() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('pdf-section').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('verification-form').style.display = 'none';
    this.errorMessageEl.textContent = '';
    this.clearInputErrors();
  }

  onLoginSuccess() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('pdf-section').style.display = 'block';
  }
} 