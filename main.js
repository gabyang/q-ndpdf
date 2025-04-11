const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const errorMessageEl = document.getElementById("error-message");
  const verificationForm = document.getElementById("verification-form");
  const verificationCodeInput = document.getElementById("verification-code");
  const toggleForms = document.getElementById("toggle-forms");
  
  // Clear error messages on page load
  errorMessageEl.textContent = "";
  
  // Hide verification form initially
  if (verificationForm) {
    verificationForm.style.display = "none";
  }

  // Store email for verification
  let userEmail = "";

  // Toggle between login and signup forms
  if (toggleForms) {
    toggleForms.addEventListener("click", (event) => {
      event.preventDefault();
      loginForm.style.display = loginForm.style.display === "none" ? "block" : "none";
      signupForm.style.display = signupForm.style.display === "none" ? "block" : "none";
      errorMessageEl.textContent = "";
    });
  }
  
  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      userEmail = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        errorMessageEl.textContent = "Passwords do not match";
        return;
      }

      try {
        // Create new user
        const { data, error } = await supabaseClient.auth.signUp({
          email: userEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        
        if (error) {
          errorMessageEl.textContent = error.message;
          return;
        }

        // Show verification form
        signupForm.style.display = "none";
        if (verificationForm) {
          verificationForm.style.display = "block";
        }
        
      } catch (err) {
        errorMessageEl.textContent = "Something went wrong. Please try again.";
        console.error(err);
      }
    });
  }
  
  // Login form submission
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    userEmail = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
      // First attempt sign-in with password
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: userEmail,
        password
      });
      
      if (error) {
        errorMessageEl.textContent = error.message;
        return;
      }

      // If password is correct, send verification code
      const { error: verificationError } = await supabaseClient.auth.signInWithOtp({
        email: userEmail,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (verificationError) {
        errorMessageEl.textContent = verificationError.message;
        return;
      }

      // Show verification form
      loginForm.style.display = "none";
      if (verificationForm) {
        verificationForm.style.display = "block";
      }
      
    } catch (err) {
      errorMessageEl.textContent = "Something went wrong. Please try again.";
      console.error(err);
    }
  });

  // Verification form submission
  if (verificationForm) {
    verificationForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const verificationCode = verificationCodeInput.value;
      
      try {
        // Verify the code
        const { data, error } = await supabaseClient.auth.verifyOtp({
          email: userEmail,
          token: verificationCode,
          type: 'email'
        });
        
        if (error) {
          errorMessageEl.textContent = error.message;
          return;
        }
        
        // If verification successful, redirect to PDF page
        window.location.href = "pdf.html";
      } catch (err) {
        errorMessageEl.textContent = "Verification failed. Please try again.";
        console.error(err);
      }
    });
  }
});
