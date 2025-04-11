import { FormGroup } from './FormGroup';
import { Button } from './Button';

export class Form {
  constructor(id, title, fields, submitText) {
    this.id = id;
    this.title = title;
    this.fields = fields;
    this.submitText = submitText;
  }

  render() {
    const form = document.createElement('form');
    form.id = `${this.id}-form-element`;
    form.className = 'form-container';

    // Add title
    const title = document.createElement('h2');
    title.textContent = this.title;
    form.appendChild(title);

    // Add fields
    this.fields.forEach(field => {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';

      const label = document.createElement('label');
      label.htmlFor = field.id;
      label.textContent = field.label;
      formGroup.appendChild(label);

      const input = document.createElement('input');
      input.type = field.type;
      input.id = field.id;
      input.name = field.id;
      input.required = true;
      formGroup.appendChild(input);

      form.appendChild(formGroup);
    });

    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn-primary';
    submitButton.textContent = this.submitText;
    form.appendChild(submitButton);

    return form;
  }
} 