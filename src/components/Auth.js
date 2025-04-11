import { createClient } from '@supabase/supabase-js';
import { Popup } from './ui/Popup';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export class Auth {
  constructor(router) {
    this.router = router;
    this.loginForm = document.getElementById("login-form-element");
    this.signupForm = document.getElementById("signup-form-element");
    this.verificationForm = document.getElementById("verification-form-element");
    this.verificationCodeInput = document.getElementById("verification-code");
    this.toggleForms = document.getElementById("toggle-forms");
    this.logoutButton = document.getElementById("logout-button");
    this.signupModal = document.getElementById("signup-modal");
    this.closeModal = document.querySelector(".close-modal");
    
    this.userEmail = "";
    
    this.popup = new Popup();
    this.setupEventListeners();
    this.setupErrorStyles();
    this.resendTimer = null;
    this.canResend = true;
  }

  setupErrorStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .input-error {
        border: 2px solid #dc3545 !important;
        background-color: #fff8f8;
      }
      .resend-button {
        background: #6c757d;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
      }
      .resend-button:disabled {
        background: #ccc;
        cursor: not-allowed;
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
    // Hide verification form initially
    if (this.verificationForm) {
      this.verificationForm.style.display = "none";
    }

    // Toggle between login and signup forms
    if (this.toggleForms) {
      this.toggleForms.addEventListener("click", (event) => {
        event.preventDefault();
        this.router.navigateTo('/signup');
        this.clearInputErrors();
      });
    }

    // Close modal when clicking the X
    if (this.closeModal) {
      this.closeModal.addEventListener("click", () => {
        this.signupModal.style.display = "none";
        this.clearInputErrors();
      });
    }

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === this.signupModal) {
        this.signupModal.style.display = "none";
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
      this.signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSignup(e);
      });
    }

    // Login form submission
    if (this.loginForm) {
      this.loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLogin(e);
      });
    }

    // Verification form submission
    if (this.verificationForm) {
      this.verificationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleVerification(e);
      });
    }

    // Clear errors when user starts typing
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('input-error');
      });
    });
  }

  showError(message) {
    this.popup.show(message);
  }
  

  async hashPassword(password) {
    // Convert password to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Hash the password using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert the hash to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }

  async handleSignup(event) {
    event.preventDefault();
    this.clearInputErrors();

    this.userEmail = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    
    // Validate password length
    if (password.length < 6) {
      this.showError("Password must be at least 6 characters long");
      this.showInputError("signup-password");
      this.showInputError("confirm-password");
      return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      this.showError("Passwords do not match");
      this.showInputError("signup-password");
      this.showInputError("confirm-password");
      return;
    }

    try {
      // Hash the password
      const hashedPassword = await this.hashPassword(password);

      // Insert directly into public.users table
      const { data, error } = await supabaseClient
        .from('users')
        .insert([
          {
            email: this.userEmail,
            encrypted_hash: hashedPassword,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        if (error.message.includes('duplicate key')) {
          this.showError("This email is already registered. Please try logging in instead.");
        } else {
          this.showError("Error creating user. Please try again.");
        }
        this.showInputError("signup-email");
        return;
      }

      // Show success message and redirect to login page
      this.popup.show("User registered successfully! Please login.", 'success');
      this.router.navigateTo('/');
      
    } catch (err) {
      this.showError("Error creating user. Please try again.");
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
        this.showError("Login failed. Please check your email and password.");
        this.showInputError("email");
        this.showInputError("password");
        return;
      }

      // If login is successful, show the PDF viewer
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('pdf-section').style.display = 'block';
      
    } catch (err) {
      this.showError("Login failed. Please try again.");
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
        this.showError(error.message);
        this.showInputError("verification-code");
        return;
      }
      
      // If verification is successful, show PDF viewer
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('pdf-section').style.display = 'block';
    } catch (err) {
      this.showError("Verification failed. Please try again.");
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
    this.clearInputErrors();
  }

  onLoginSuccess() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('pdf-section').style.display = 'block';
  }

  async handleLogout() {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      this.router.navigateTo('/');
    } catch (error) {
      this.showError(error.message);
    }
  }

  addResendButton() {
    const verificationForm = document.getElementById("verification-form-element");
    const existingResendButton = document.getElementById("resend-button");
    
    if (!existingResendButton) {
      const resendButton = document.createElement("button");
      resendButton.id = "resend-button";
      resendButton.className = "resend-button";
      resendButton.textContent = "Resend Code";
      resendButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleResendCode();
      });
      verificationForm.appendChild(resendButton);
    }
  }

  async handleResendCode() {
    if (!this.canResend) return;

    try {
      const { error } = await supabaseClient.auth.resend({
        type: 'signup',
        email: this.userEmail,
      });

      if (error) throw error;

      this.canResend = false;
      const resendButton = document.getElementById("resend-button");
      resendButton.disabled = true;
      
      // Start 30-second timer
      let secondsLeft = 30;
      this.resendTimer = setInterval(() => {
        secondsLeft--;
        resendButton.textContent = `Resend Code (${secondsLeft}s)`;
        
        if (secondsLeft <= 0) {
          clearInterval(this.resendTimer);
          this.canResend = true;
          resendButton.disabled = false;
          resendButton.textContent = "Resend Code";
        }
      }, 1000);
    } catch (error) {
      this.showError(error.message);
    }
  }
} 