import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    this.signupModal = document.getElementById("signup-form");
    this.closeModal = document.querySelector(".close-modal");
    
    this.userEmail = "";
    this.setupEventListeners();
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
        document.getElementById("login-form").style.display = "none";
        this.errorMessageEl.textContent = "";
      });
    }

    // Close modal when clicking the X
    if (this.closeModal) {
      this.closeModal.addEventListener("click", () => {
        this.signupModal.style.display = "none";
        this.errorMessageEl.textContent = "";
      });
    }

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === this.signupModal) {
        this.signupModal.style.display = "none";
        this.errorMessageEl.textContent = "";
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
  }

  async handleSignup(event) {
    event.preventDefault();

    this.userEmail = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    
    if (password !== confirmPassword) {
      this.errorMessageEl.textContent = "Passwords do not match";
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
        return;
      }

      document.getElementById("signup-form").style.display = "none";
      if (this.verificationForm) {
        this.verificationForm.style.display = "block";
      }
      
    } catch (err) {
      this.errorMessageEl.textContent = "Something went wrong. Please try again.";
      console.error(err);
    }
  }

  async handleLogin(event) {
    event.preventDefault();

    this.userEmail = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: this.userEmail,
        password
      });
      
      if (error) {
        this.errorMessageEl.textContent = error.message;
        return;
      }

      // If password is correct, navigate to PDF view
      this.router.navigateTo('/pdf');
      
    } catch (err) {
      this.errorMessageEl.textContent = "Something went wrong. Please try again.";
      console.error(err);
    }
  }

  async handleVerification(event) {
    event.preventDefault();
    
    const verificationCode = this.verificationCodeInput.value;
    
    try {
      const { data, error } = await supabaseClient.auth.verifyOtp({
        email: this.userEmail,
        token: verificationCode,
        type: 'email'
      });
      
      if (error) {
        this.errorMessageEl.textContent = error.message;
        return;
      }
      
      this.router.navigateTo('/pdf');
    } catch (err) {
      this.errorMessageEl.textContent = "Verification failed. Please try again.";
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
  }

  onLoginSuccess() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('pdf-section').style.display = 'block';
  }
} 