const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessageEl = document.getElementById("error-message");
  
  // Clear error messages on page load
  errorMessageEl.textContent = "";
  
  // 3) Form submission logic
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from reloading page

    // Grab user input
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
      // 4) Attempt sign-in with Supabase
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      
      // 5) Handle errors
      if (error) {
        // Show the error message from Supabase
        errorMessageEl.textContent = error.message;
        return;
      }
      
      // 6) If no error, redirect user or show PDF
      // Example: redirect them to a "pdf.html" page
      window.location.href = "pdf.html";
    } catch (err) {
      // Catch any unexpected errors (e.g., network issues)
      errorMessageEl.textContent = "Something went wrong. Please try again.";
      console.error(err);
    }
  });
});
