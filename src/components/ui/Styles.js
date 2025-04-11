export class Styles {
  static inject() {
    const style = document.createElement('style');
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
      }

      #app {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .auth-container {
        width: 100%;
        max-width: 400px;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .form-container {
        width: 100%;
      }

      .form-group {
        margin-bottom: 15px;
      }

      .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }

      .form-group input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .btn-primary {
        width: 100%;
        padding: 10px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .btn-primary:hover {
        background: #0056b3;
      }

      .btn-logout {
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 10px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .btn-logout:hover {
        background: #c82333;
      }

      .error-message {
        color: #dc3545;
        margin-top: 10px;
        text-align: center;
      }

      .toggle-text {
        text-align: center;
        margin-top: 15px;
      }

      .toggle-text a {
        color: #007bff;
        text-decoration: none;
      }

      .toggle-text a:hover {
        text-decoration: underline;
      }

      .pdf-container {
        width: 100%;
        height: 100vh;
        position: relative;
      }

      #pdf-frame {
        width: 100%;
        height: 100%;
        border: none;
      }
    `;
    document.head.appendChild(style);
  }
} 