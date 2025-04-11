const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to show PDF viewer
async function showPDFViewer() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('pdf-section').style.display = 'block';
  
  // Get the iframe element
  const iframe = document.getElementById('pdf-frame');
  
  try {
    // Get a signed URL for the PDF
    const { data, error } = await supabaseClient
      .storage
      .from('whitepaper')
      .createSignedUrl('whitepaper-document.pdf', 3600); // URL expires in 1 hour

    if (error) {
      console.error('Error getting PDF URL:', error);
      document.getElementById('error-message').textContent = 'Error loading PDF. Please try again.';
      return;
    }

    // Add security event listeners
    iframe.addEventListener('load', () => {
      try {
        // Disable context menu
        iframe.contentDocument.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          return false;
        });

        // Disable keyboard shortcuts
        iframe.contentDocument.addEventListener('keydown', (e) => {
          // Allow only navigation keys
          const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'];
          if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            return false;
          }
        });

        // Disable text selection
        iframe.contentDocument.addEventListener('selectstart', (e) => {
          e.preventDefault();
          return false;
        });

        // Disable drag and drop
        iframe.contentDocument.addEventListener('dragstart', (e) => {
          e.preventDefault();
          return false;
        });

        // Add CSS to disable text selection
        const style = iframe.contentDocument.createElement('style');
        style.textContent = `
          * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        `;
        iframe.contentDocument.head.appendChild(style);
      } catch (error) {
        console.error('Error applying security measures:', error);
      }
    });

    // Load the PDF into the iframe with security parameters
    iframe.src = `${data.signedUrl}#toolbar=0&navpanes=0`;
  } catch (err) {
    console.error('Error loading PDF:', err);
    document.getElementById('error-message').textContent = 'Error loading PDF. Please try again.';
  }
}

// Function to show login form
function showLoginForm() {
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('pdf-section').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('verification-form').style.display = 'none';
}

window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const errorMessageEl = document.getElementById("error-message");
  const verificationForm = document.getElementById("verification-form");
  const verificationCodeInput = document.getElementById("verification-code");
  const toggleForms = document.getElementById("toggle-forms");
  const logoutButton = document.getElementById("logout-button");
  
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

  // Logout functionality
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      const { error } = await supabaseClient.auth.signOut();
      if (!error) {
        showLoginForm();
      }
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
        
        // If verification successful, show PDF viewer
        showPDFViewer();
      } catch (err) {
        errorMessageEl.textContent = "Verification failed. Please try again.";
        console.error(err);
      }
    });
  }

  // Check if user is already logged in
  supabaseClient.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      showPDFViewer();
    }
  });
});
