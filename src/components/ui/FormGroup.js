export class FormGroup {
  constructor(id, labelText, type) {
    this.id = id;
    this.labelText = labelText;
    this.type = type;
  }

  render() {
    const group = document.createElement('div');
    group.className = 'form-group';

    const label = document.createElement('label');
    label.htmlFor = this.id;
    label.textContent = this.labelText;
    group.appendChild(label);

    const input = document.createElement('input');
    input.type = this.type;
    input.id = this.id;
    input.name = this.id;
    input.required = true;
    group.appendChild(input);

    return group;
  }
} 