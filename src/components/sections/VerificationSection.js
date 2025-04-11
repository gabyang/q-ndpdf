import { Form } from '../ui/Form';

export class VerificationSection {
  constructor() {
    this.verificationFields = [
      { id: 'verification-code', label: 'Verification Code', type: 'text' }
    ];
  }

  render() {
    const verificationSection = document.createElement('section');
    verificationSection.id = 'verification-section';
    verificationSection.style.display = 'none';

    const verificationContainer = document.createElement('div');
    verificationContainer.className = 'auth-container';
    verificationSection.appendChild(verificationContainer);

    // Create verification form
    const verificationForm = new Form('verification', 'Enter Verification Code', this.verificationFields, 'Verify');
    verificationContainer.appendChild(verificationForm.render());

    // Create back link
    const backLink = document.createElement('a');
    backLink.href = '/';
    backLink.className = 'back-link';
    backLink.textContent = '← Back to Login';
    verificationContainer.appendChild(backLink);

    // Create error message container
    const errorMessage = document.createElement('div');
    errorMessage.id = 'verification-error-message';
    errorMessage.className = 'error-message';
    verificationContainer.appendChild(errorMessage);

    return verificationSection;
  }
} 