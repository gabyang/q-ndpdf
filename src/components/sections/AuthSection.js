import { Form } from '../ui/Form';

export class AuthSection {
  constructor() {
    this.loginFields = [
      { id: 'email', label: 'Email', type: 'email' },
      { id: 'password', label: 'Password', type: 'password' }
    ];
  }

  render() {
    const authSection = document.createElement('section');
    authSection.id = 'auth-section';

    const authContainer = document.createElement('div');
    authContainer.className = 'auth-container';
    authSection.appendChild(authContainer);

    // Create login form
    const loginForm = new Form('login', 'Login', this.loginFields, 'Login');
    authContainer.appendChild(loginForm.render());

    // Create toggle text
    const toggleText = document.createElement('p');
    toggleText.className = 'toggle-text';
    toggleText.innerHTML = 'Don\'t have an account? <a href="/signup" id="toggle-forms">Sign up</a>';
    authContainer.appendChild(toggleText);

    // Create error message container
    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.className = 'error-message';
    authContainer.appendChild(errorMessage);

    return authSection;
  }
} 