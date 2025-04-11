export class Popup {
  constructor() {
    this.popup = document.createElement('div');
    this.popup.className = 'error-popup';
    this.popup.style.display = 'none';
    document.body.appendChild(this.popup);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .error-popup {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
      }

      .error-popup.error {
        background-color: #dc3545;
        color: white;
      }

      .error-popup.success {
        background-color: #28a745;
        color: white;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  show(message, type = 'error') {
    this.popup.textContent = message;
    this.popup.className = `error-popup ${type}`;
    this.popup.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide() {
    this.popup.style.display = 'none';
  }
} 