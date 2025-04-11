export class Button {
  constructor(text, type = 'button', className = 'btn-primary') {
    this.text = text;
    this.type = type;
    this.className = className;
  }

  render() {
    const button = document.createElement('button');
    button.type = this.type;
    button.className = this.className;
    button.textContent = this.text;
    return button;
  }
} 