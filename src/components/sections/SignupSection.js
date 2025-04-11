import { Form } from '../ui/Form';

export class SignupSection {
  constructor() {
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
    const signupSection = document.createElement('section');
    signupSection.id = 'signup-section';

    const signupContainer = document.createElement('div');
    signupContainer.className = 'auth-container';
    signupSection.appendChild(signupContainer);

    // Create back link
    const backLink = document.createElement('a');
    backLink.href = '/';
    backLink.className = 'back-link';
    backLink.textContent = '← Back to Login';
    signupContainer.appendChild(backLink);

    // Create signup form
    const signupForm = new Form('signup', 'Sign Up', this.signupFields, 'Sign Up');
    signupContainer.appendChild(signupForm.render());

    // Create verification form
    const verificationForm = new Form('verification', 'Verify Email', this.verificationFields, 'Verify');
    verificationForm.render().style.display = 'none';
    signupContainer.appendChild(verificationForm.render());

    // Create error message container
    const errorMessage = document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.className = 'error-message';
    signupContainer.appendChild(errorMessage);

    return signupSection;
  }
} 