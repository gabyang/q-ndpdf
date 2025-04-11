import { Form } from '../ui/Form';

export class AuthSection {
  constructor() {
    this.loginFields = [
      { id: 'email', label: 'Email', type: 'email' },
      { id: 'password', label: 'Password', type: 'password' }
    ];

    this.signupFields = [
      { id: 'signup-email', label: 'Email', type: 'email' },
      { id: 'signup-password', label: 'Password', type: 'password' },
      { id: 'confirm-password', label: 'Confirm Password', type: 'password' }
    ];

    this.verificationFields = [
      { id: 'verification-code', label: 'Verification Code', type: 'text' }
    ];
  }

  render() {
    const authSection = document.createElement('div');
    authSection.id = 'auth-section';

    const authContainer = document.createElement('div');
    authContainer.className = 'auth-container';
    authSection.appendChild(authContainer);

    // Create login form
    const loginForm = new Form('login', 'Login', this.loginFields, 'Login');
    authContainer.appendChild(loginForm.render());

    // Add toggle text
    const toggleText = document.createElement('p');
    toggleText.className = 'toggle-text';
    toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-forms">Sign up</a>';
    authContainer.appendChild(toggleText);

    // Create signup form
    const signupForm = new Form('signup', 'Sign Up', this.signupFields, 'Sign Up');
    signupForm.render().style.display = 'none';
    authContainer.appendChild(signupForm.render());

    // Create verification form
    const verificationForm = new Form('verification', 'Verify Email', this.verificationFields, 'Verify');
    verificationForm.render().style.display = 'none';
    authContainer.appendChild(verificationForm.render());

    // Create error message container
    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.className = 'error-message';
    authContainer.appendChild(errorMessage);

    return authSection;
  }
} 